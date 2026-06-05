const VALID_TABS = new Set(["signal", "gap", "outreach"]);

export function getTabFromUrl(search = window.location.search) {
  const tab = new URLSearchParams(search).get("tab");
  return VALID_TABS.has(tab) ? tab : "signal";
}

export function buildAppUrl({ tab, company, role } = {}) {
  const params = new URLSearchParams(window.location.search);
  if (tab) {
    if (tab === "signal") params.delete("tab");
    else params.set("tab", tab);
  }
  if (company !== undefined) {
    if (company) params.set("company", company);
    else params.delete("company");
  }
  if (role !== undefined) {
    if (role) params.set("role", role);
    else params.delete("role");
  }
  const query = params.toString();
  return `${window.location.pathname}${query ? `?${query}` : ""}`;
}

export function buildShareUrl(
  companyId,
  roleId,
  baseUrl = window.location.origin,
  search = window.location.search
) {
  const params = new URLSearchParams(search);
  params.set("company", companyId);
  params.set("role", roleId);
  const query = params.toString();
  return `${baseUrl}${window.location.pathname}${query ? `?${query}` : ""}`;
}
