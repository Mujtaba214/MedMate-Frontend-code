import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Users, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  gender: string;
  user_id?: number;
}

export default function Family() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchFamilyMembers();
  }, [token]);

  const fetchFamilyMembers = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/family`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("✅ Family members fetched:", data);
      setFamilyMembers(data || []);
    } catch (err) {
      console.error("❌ Error fetching family members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this family member?")) return;
    try {
      await fetch(`http://localhost:4000/api/family-members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFamilyMembers();
    } catch (err) {
      console.error("❌ Error deleting family member:", err);
      alert("Failed to delete family member.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
        <button
          onClick={() => navigate("/add-family-member")}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Family Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between mb-4 items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">{member.relation}</p>
                  <p className="text-gray-600 text-sm font-medium capitalize">
                    {member.gender}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => navigate(`/prescriptions?familyId=${member.id}`)}
              className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FileText className="h-4 w-4" />
              <span>View Prescriptions</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
