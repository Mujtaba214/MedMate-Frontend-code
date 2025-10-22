import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Calendar, Edit, X } from "lucide-react";

interface ProfileData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
}

export default function Profile() {
  const { user } = useAuth(); // Make sure your AuthContext provides the token
  const token = localStorage.getItem("token") || "";
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });

  const API_BASE = "http://localhost:4000/api";

  useEffect(() => {
    if (user?.id && token) fetchProfile();
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ send token
      });
      setProfile(res.data.data);
      setFormData(res.data.data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        alert("You are not authorized. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/profile/${user?.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ send token
      });
      setEditing(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            editing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {editing ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Edit className="w-4 h-4 mr-2" /> Edit</>}
        </button>
      </div>

      {!editing && profile && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3"><User className="h-6 w-6 text-blue-600" /><p className="text-lg font-medium">{user?.name}</p></div>
          <div className="flex items-center space-x-3"><Mail className="h-6 w-6 text-blue-600" /><p>{profile.email}</p></div>
          {/* <div className="flex items-center space-x-3"><Phone className="h-6 w-6 text-blue-600" /><p>{profile.phone}</p></div> */}
          {/* <div className="flex items-center space-x-3"><Calendar className="h-6 w-6 text-blue-600" /><p>DOB: {new Date(profile.date_of_birth).toLocaleDateString("en-GB")}</p></div> */}
          {/* <p className="text-gray-700">Gender: <span className="font-medium">{profile.gender}</span></p> */}
        </div>
      )}

      {editing && profile && (
        <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-xl p-6 space-y-4">
          {/* your input fields for editing remain the same */}
        </form>
      )}
    </div>
  );
}