import SignalReport from "../components/SignalReport";

export default function Report({ report, companyId, roleId, onChooseAnother }) {
  return (
    <SignalReport
      report={report}
      companyId={companyId}
      roleId={roleId}
      onChooseAnother={onChooseAnother}
    />
  );
}
