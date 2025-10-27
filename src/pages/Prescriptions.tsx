
import { useSearchParams } from "react-router-dom";
import PrescriptionList from "../components/PrescriptionList";

export default function Prescriptions() {
  const [searchParams] = useSearchParams();
  const familyId = searchParams.get("familyId");

  console.log("🟢 Family ID from URL:", familyId);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Prescriptions</h1>
      {familyId ? (
        <PrescriptionList familyId={familyId} />
      ) : (
        <p className="text-gray-600">
          Please select a family member to view their prescriptions.
        </p>
      )}
    </div>
  );
}

