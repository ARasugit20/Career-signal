import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import companies from "../data/companies.json" with { type: "json" };

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const REPORT_JSON_SCHEMA = {
  type: "object",
  required: [
    "company",
    "role",
    "headline",
    "signal_summary",
    "top_projects",
    "skill_keywords",
    "dataset_rec",
    "course_rec",
    "framing_tip"
  ]
};

function parseClaudeJson(text) {
  const trimmed = text.trim();
  return JSON.parse(trimmed);
}

function validateReportShape(report) {
  if (!report || typeof report !== "object") return false;
  return REPORT_JSON_SCHEMA.required.every((key) =>
    Object.prototype.hasOwnProperty.call(report, key)
  );
}

router.get("/companies", (_req, res) => {
  const payload = companies.map((company) => ({
    id: company.id,
    name: company.name,
    roles: Object.entries(company.roles).map(([roleId, role]) => ({
      id: roleId,
      title: role.title
    }))
  }));
  res.json(payload);
});

router.post("/signal", async (req, res) => {
  try {
    const { company, role } = req.body ?? {};

    if (!company || !role) {
      return res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Both company and role are required."
      });
    }

    const companyData = companies.find((item) => item.id === company);
    if (!companyData) {
      return res.status(404).json({
        error: "COMPANY_NOT_FOUND",
        message: "Selected company was not found."
      });
    }

    const roleData = companyData.roles?.[role];
    if (!roleData) {
      return res.status(404).json({
        error: "ROLE_NOT_FOUND",
        message: "Selected role was not found for this company."
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: "MISSING_API_KEY",
        message: "Server is missing ANTHROPIC_API_KEY."
      });
    }

    const systemPrompt = `You are Career Signal, a hiring intelligence engine for CS students. 
You analyze what specific companies look for in candidates and return precise, actionable project recommendations.

You always respond with ONLY valid JSON. No markdown. No explanation. No preamble. Just the JSON object.

Your output must match this exact schema:
{
  "company": string,
  "role": string,
  "headline": string (one sentence: what this company actually hires for),
  "signal_summary": string (2-3 sentences: the profile of the person they call first),
  "top_projects": [
    {
      "title": string,
      "why": string,
      "tech_stack": string[],
      "interview_angle": string
    }
  ],
  "skill_keywords": string[] (exact words from real JDs — these should appear verbatim on the resume),
  "dataset_rec": { "name": string, "url": string, "project_angle": string } | null,
  "course_rec": { "title": string, "url": string, "why": string } | null,
  "framing_tip": string (one specific insight about how to talk about projects in interviews at this company)
}`;

    const userPrompt = `Generate a Signal Report for:
Company: ${companyData.name}
Role: ${roleData.title}
Industry: ${companyData.industry}

Use this curated company data to ground your response:
${JSON.stringify(roleData, null, 2)}

Return ONLY the JSON object. No other text.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      temperature: 0.2,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const firstBlock = response.content?.[0];
    const text = firstBlock?.type === "text" ? firstBlock.text : "";
    const report = parseClaudeJson(text);

    if (!validateReportShape(report)) {
      return res.status(502).json({
        error: "INVALID_MODEL_RESPONSE",
        message: "Model returned malformed report JSON."
      });
    }

    return res.json({
      company: companyData.name,
      role: roleData.title,
      source: "claude-sonnet-4-20250514",
      report
    });
  } catch (error) {
    const isParseFailure =
      error instanceof SyntaxError ||
      String(error?.message || "").toLowerCase().includes("json");

    if (isParseFailure) {
      return res.status(502).json({
        error: "MODEL_JSON_PARSE_ERROR",
        message: "Could not parse model output as valid JSON."
      });
    }

    return res.status(500).json({
      error: "SIGNAL_GENERATION_FAILED",
      message: "Unable to generate Signal Report right now."
    });
  }
});

export default router;
