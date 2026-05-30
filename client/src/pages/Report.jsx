import SignalReport from "../components/SignalReport";

export default function Report({ report, companyId, roleId }) {
  return <SignalReport report={report} companyId={companyId} roleId={roleId} />;
}
