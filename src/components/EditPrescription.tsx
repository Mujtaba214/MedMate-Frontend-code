import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// ✅ Use your deployed API URL (replace with your live backend)
const API_URL = "https://med-mate-backend-code.vercel.app/api/prescriptions";

const EditPrescription: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    duration: "",
    doctor: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // ✅ Fetch Prescription details
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setFormData({
          medicine: data.medicine,
          dosage: data.dosage,
          duration: data.duration,
          doctor: data.doctor,
        });

        // ✅ Cloudinary images already have a full URL
        if (data.image_url) {
          setPreview(data.image_url);
        }
      } catch (err) {
        console.error("Error fetching prescription:", err);
      }
    };

    fetchPrescription();
  }, [id, token]);

  // ✅ Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Change (Preview)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle Update Request
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("medicine", formData.medicine);
      form.append("dosage", formData.dosage);
      form.append("duration", formData.duration);
      form.append("doctor", formData.doctor);

      if (image) {
        form.append("image", image); // Multer → Cloudinary handles this
      }

      const response = await axios.put(`${API_URL}/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updated = response.data.data;

      // ✅ Update Preview with Cloudinary URL
      if (updated.image_url) {
        setPreview(updated.image_url);
      }

      alert("✅ Prescription updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating prescription:", error);
      alert("❌ Failed to update prescription");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Prescription
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Medicine Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Medicine Name
            </label>
            <input
              type="text"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter medicine name"
              required
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 2 tablets daily"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 7 days"
              required
            />
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Doctor Name
            </label>
            <input
              type="text"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter doctor name"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Prescription Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none"
            />
          </div>

          {/* ✅ Image Preview */}
          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Prescription Preview"
                className="rounded-lg shadow-md w-40 h-40 object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md"
          >
            Update Prescription
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPrescription;
