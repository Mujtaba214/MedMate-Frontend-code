import React from "react";
import axios from "axios";

interface DeleteFamilyMemberProps {
  id: number;
  onDeleted: () => void;
}

const DeleteFamilyMember: React.FC<DeleteFamilyMemberProps> = ({ id, onDeleted }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this family member?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://med-mate-backend-code.vercel.app/api/family/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Family member deleted successfully!");
      onDeleted();
    } catch (err) {
      console.error("❌ Error deleting family member:", err);
      alert("Failed to delete family member.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
    >
      🗑️
    </button>
  );
};

export default DeleteFamilyMember;
