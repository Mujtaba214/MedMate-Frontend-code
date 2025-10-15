import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:4000/api/family/";

interface FamilyMemberForm {
  name: string;
  relation: string;
  gender: string;
}

const EditFamilyMember: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FamilyMemberForm>({
    name: "",
    relation: "",
    gender: "",
  });

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const member = res.data.find((m: any) => m.id === Number(id));
      if (member) setFormData(member);
    } catch (error) {
      console.error("❌ Error fetching family member:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Family member updated successfully!");
      navigate("/family");
    } catch (err) {
      console.error("❌ Error updating family member:", err);
      alert("Failed to update family member.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
          required
        />
        <input
          type="text"
          name="relation"
          value={formData.relation}
          onChange={handleChange}
          placeholder="Relation"
          className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/family")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFamilyMember;
