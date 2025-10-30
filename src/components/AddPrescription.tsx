import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  gender: string;
}

interface PrescriptionFormData {
  medicine: string;
  dosage: string;
  duration: string;
  doctor: string;
  familyId: string;
}

const AddPrescription: React.FC = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [formData, setFormData] = useState<PrescriptionFormData>({
    medicine: "",
    dosage: "",
    duration: "",
    doctor: "",
    familyId: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const token =
    (user && (user as any).token) ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:4000/api/family", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamilyMembers(response.data);
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };
    fetchFamilyMembers();
  }, [token]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (image) data.append("image", image);

      const response = await axios.post(
        "http://localhost:4000/api/prescriptions",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Prescription added successfully!");
      setFormData({
        medicine: "",
        dosage: "",
        duration: "",
        doctor: "",
        familyId: "",
      });
      setImage(null);
      console.log("Added prescription:", response.data);
       navigate("/family")
    } catch (error: any) {
      console.error("❌ Error adding prescription:", error);
      setMessage(
        error.response?.status === 401
          ? "Unauthorized: Please log in again."
          : "Failed to add prescription."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Add Prescription
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="medicine"
          placeholder="Medicine Name"
          value={formData.medicine}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          // required
        />
        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          // required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 7 days)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          // required
        />
        <input
          type="text"
          name="doctor"
          placeholder="Prescribed By"
          value={formData.doctor}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          // required
        />

        <select
          name="familyId"
          value={formData.familyId}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Select Family Member (optional)</option>
          {familyMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} — {member.relation}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Prescription
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-600 mt-3">{message}</p>
      )}
    </div>
  );
};

export default AddPrescription;
