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
  const { user } = useAuth();
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

  const API_BASE = "http://localhost:4000/api"; // ✅ your backend base URL

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile/${user?.id}`);
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/profile/${user?.id}`, formData);
      setEditing(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
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
          {editing ? (
            <>
              <X className="w-4 h-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </button>
      </div>

      {!editing && profile && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <p className="text-lg font-medium">{profile.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <p>{profile.email}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6 text-blue-600" />
            <p>{profile.phone}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <p>
              DOB:{" "}
              {new Date(profile.date_of_birth).toLocaleDateString("en-GB")}
            </p>
          </div>
          <p className="text-gray-700">
            Gender: <span className="font-medium">{profile.gender}</span>
          </p>
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow-md rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}
