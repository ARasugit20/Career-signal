export function buildShareUrl(companyId, roleId, baseUrl = window.location.origin) {
  const params = new URLSearchParams();
  params.set("company", companyId);
  params.set("role", roleId);
  return `${baseUrl}${window.location.pathname}?${params.toString()}`;
}
