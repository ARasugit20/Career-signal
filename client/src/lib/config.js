export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
export const REPORT_MODE = import.meta.env.VITE_REPORT_MODE || "static";
export const IS_STATIC_MODE = REPORT_MODE === "static";
