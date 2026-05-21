const SKILL_ALIASES = {
  javascript: ["javascript", "js", "node", "nodejs", "node.js", "express"],
  typescript: ["typescript", "ts"],
  python: ["python", "py", "fastapi", "flask", "django"],
  java: ["java", "spring", "spring boot"],
  cplusplus: ["c++", "cpp"],
  csharp: ["c#", ".net", "dotnet"],
  go: ["go", "golang"],
  react: ["react", "next.js", "nextjs"],
  vite: ["vite"],
  tailwind: ["tailwind", "tailwindcss"],
  redis: ["redis"],
  postgresql: ["postgres", "postgresql"],
  sql: ["sql", "mysql"],
  mongodb: ["mongodb", "mongo"],
  aws: ["aws", "amazon web services"],
  docker: ["docker", "container"],
  kubernetes: ["kubernetes", "k8s"],
  kafka: ["kafka"],
  graphql: ["graphql"],
  pytorch: ["pytorch"],
  tensorflow: ["tensorflow"],
  scikitlearn: ["scikit-learn", "sklearn"],
  pandas: ["pandas"],
  numpy: ["numpy"],
  machinelearning: ["machine learning", "ml", "xgboost", "lightgbm"],
  git: ["git", "github"],
  twilio: ["twilio"],
  supabase: ["supabase"],
  aiapis: ["claude", "gemini", "anthropic", "openai", "llm", "ai api"],
  restapi: ["rest", "rest api", "restful", "api design"]
};

const SKILL_LABELS = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cplusplus: "C++",
  csharp: "C#",
  go: "Go",
  react: "React",
  vite: "Vite",
  tailwind: "TailwindCSS",
  redis: "Redis",
  postgresql: "PostgreSQL",
  sql: "SQL",
  mongodb: "MongoDB",
  aws: "AWS",
  docker: "Docker",
  kubernetes: "Kubernetes",
  kafka: "Kafka",
  graphql: "GraphQL",
  pytorch: "PyTorch",
  tensorflow: "TensorFlow",
  scikitlearn: "scikit-learn",
  pandas: "Pandas",
  numpy: "NumPy",
  machinelearning: "Machine Learning",
  git: "Git/GitHub",
  twilio: "Twilio",
  supabase: "Supabase",
  aiapis: "AI APIs",
  restapi: "REST APIs"
};

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ");
}

function findMatchedSkills(text) {
  const normalized = normalizeText(text);
  const found = new Set();

  Object.entries(SKILL_ALIASES).forEach(([skill, aliases]) => {
    if (aliases.some((alias) => normalized.includes(alias))) {
      found.add(skill);
    }
  });

  return found;
}

function labelsFromSkillSet(skillSet) {
  return Array.from(skillSet)
    .map((skill) => SKILL_LABELS[skill] || skill)
    .sort((a, b) => a.localeCompare(b));
}

export function parseSkillsFromText(text) {
  return labelsFromSkillSet(findMatchedSkills(text));
}

export function compareSkillBands({ resumeSkills, repoSkills, jdSkills }) {
  const resumeSet = new Set(resumeSkills);
  const repoSet = new Set(repoSkills);
  const jdSet = new Set(jdSkills);

  const strong = Array.from(resumeSet).filter((skill) => repoSet.has(skill));
  const developing = Array.from(resumeSet).filter((skill) => !repoSet.has(skill));
  const gap = Array.from(jdSet).filter(
    (skill) => !resumeSet.has(skill) && !repoSet.has(skill)
  );

  return {
    strong: strong.sort((a, b) => a.localeCompare(b)),
    developing: developing.sort((a, b) => a.localeCompare(b)),
    gap: gap.sort((a, b) => a.localeCompare(b))
  };
}

async function fetchRepoReadme(owner, repoName) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
    headers: {
      Accept: "application/vnd.github.raw+json"
    }
  });

  if (!response.ok) return "";
  return response.text();
}

export async function analyzeGitHubGap({ username, resumeText, jdKeywords = [] }) {
  const repoResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
  );

  if (!repoResponse.ok) {
    if (repoResponse.status === 404) {
      throw new Error("GitHub user not found. Check username and try again.");
    }
    if (repoResponse.status === 403) {
      throw new Error("GitHub API rate limit reached. Please try again later.");
    }
    throw new Error("Could not load GitHub repositories right now.");
  }

  const repos = await repoResponse.json();
  const owner = username;
  const sampleRepos = repos.filter((repo) => !repo.fork).slice(0, 8);

  const readmes = await Promise.all(
    sampleRepos.map((repo) =>
      fetchRepoReadme(owner, repo.name).catch(() => "")
    )
  );

  const repoMetaText = repos
    .map((repo) => `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`)
    .join(" ");

  const repoLanguageText = repos.map((repo) => repo.language || "").join(" ");
  const repoReadmeText = readmes.join(" ");

  const repoSkills = parseSkillsFromText(
    `${repoMetaText} ${repoLanguageText} ${repoReadmeText}`
  );
  const resumeSkills = parseSkillsFromText(resumeText);
  const jdSkills = parseSkillsFromText(jdKeywords.join(" "));

  const bands = compareSkillBands({
    resumeSkills,
    repoSkills,
    jdSkills
  });

  return {
    resumeSkills,
    repoSkills,
    jdSkills,
    bands,
    repoCount: repos.length
  };
}
