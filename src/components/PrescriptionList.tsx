import React, { useEffect, useState } from "react";
import { FileText, Trash2, Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Prescription {
  id: number;
  medicine: string;
  dosage: string;
  duration: string;
  doctor: string;
  image_url?: string;
  created_at?: string;
}

interface Props {
  familyId: string;
}

const PrescriptionList: React.FC<Props> = ({ familyId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token =
    (user && (user as any).token) ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, [familyId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/prescriptions/family/${familyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setPrescriptions(data || []);
    } catch (error) {
      console.error("❌ Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await fetch(`http://localhost:4000/api/prescriptions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPrescriptions();
    } catch (error) {
      console.error("❌ Error deleting prescription:", error);
      alert("Failed to delete prescription.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Family/Caregivers Prescriptions</h2>
        <a
          href="/add-prescription"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Prescription
        </a>
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-gray-600">No prescriptions found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600 w-5 h-5" /> {p.medicine}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-prescription/${p.id}`)}
                    className="text-blue-600 hover:bg-blue-50 rounded-lg p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:bg-red-50 rounded-lg p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600"><strong>Dosage:</strong> {p.dosage}</p>
              <p className="text-sm text-gray-600"><strong>Duration:</strong> {p.duration}</p>
              <p className="text-sm text-gray-600"><strong>Doctor:</strong> {p.doctor}</p>

              {p.image_url && (
                <img
                  src={`http://localhost:4000/${p.image_url}`}
                  alt="Prescription"
                  className="w-full h-40 object-cover rounded-lg mt-3"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
