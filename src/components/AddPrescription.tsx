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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const token =
    (user && (user as any).token) ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

  // 🔹 Fetch family members
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!token) return;
      try {
        const response = await axios.get("https://med-mate-backend-code.vercel.app/api/family", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamilyMembers(response.data);
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };
    fetchFamilyMembers();
  }, [token]);

  // 🔹 Input change handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Image file change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // show local preview
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (image) data.append("image", image);

      const response = await axios.post(
        "https://med-mate-backend-code.vercel.app/api/prescriptions", // Backend handles Cloudinary upload
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Prescription added successfully!");
      setUploadedImageUrl(response.data.imageUrl || "");
      setFormData({
        medicine: "",
        dosage: "",
        duration: "",
        doctor: "",
        familyId: "",
      });
      setImage(null);
      setImagePreview("");
      setTimeout(() => navigate("/family"), 1500);
    } catch (error: any) {
      console.error("❌ Error adding prescription:", error);
      setMessage(
        error.response?.status === 401
          ? "Unauthorized: Please log in again."
          : "Failed to add prescription."
      );
    } finally {
      setLoading(false);
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
        />
        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 7 days)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
        <input
          type="text"
          name="doctor"
          placeholder="Prescribed By"
          value={formData.doctor}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
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

        {/* Image upload input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded-md"
        />

        {/* Local preview before upload */}
        {imagePreview && (
          <div className="text-center mt-3">
            <img
              src={imagePreview}
              alt="Prescription Preview"
              className="w-48 h-auto rounded-md mx-auto border"
            />
          </div>
        )}

        {/* Cloudinary uploaded image */}
        {uploadedImageUrl && (
          <div className="text-center mt-3">
            <p className="text-sm text-gray-500 mb-2">
              Uploaded to Cloudinary:
            </p>
            <img
              src={uploadedImageUrl}
              alt="Prescription Uploaded"
              className="w-48 h-auto rounded-md mx-auto border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Add Prescription"}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-600 mt-3">{message}</p>
      )}
    </div>
  );
};

export default AddPrescription;
