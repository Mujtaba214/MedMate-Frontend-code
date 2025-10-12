// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface Prescription {
//   _id: string;
//   medicine: string;
//   dosage: string;
//   duration: string;
//   doctor: string;
//   image?: string;
//   familyId?: string;
//   createdAt?: string;
// }

// const API_URL = "http://localhost:4000/api/prescriptions";

// const Prescriptions: React.FC = () => {
//   const navigate = useNavigate();
//   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchPrescriptions = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const userData = localStorage.getItem("user");
//       if (!userData) {
//         console.error("User not found in localStorage");
//         return;
//       }
//       const user = JSON.parse(userData);
//       const userId = user.id; // <-- correct way

//       if (!userId) {
//         console.error("User ID not found in localStorage");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(`${API_URL}/family/1`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPrescriptions(res.data);
//     } catch (err) {
//       console.error("Error fetching prescriptions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPrescriptions();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Delete this prescription?")) return;
//     const token = localStorage.getItem("token");
//     try {
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPrescriptions();
//     } catch (err) {
//       console.error("Error deleting prescription:", err);
//       alert("Failed to delete prescription.");
//     }
//   };

//   const handleAddPrescription = () => {
//     navigate("/add-prescription");
//   };

//   const handleEdit = (id: string) => {
//     navigate(`/edit-prescription/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold text-gray-800">Prescriptions</h1>
//         <button
//           onClick={handleAddPrescription}
//           className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Prescription
//         </button>
//       </div>

//       {/* Prescription Cards */}
//       {prescriptions.length === 0 ? (
//         <p className="text-gray-500">No prescriptions found.</p>
//       ) : (
//         <div className="grid gap-5 md:grid-cols-3">
//           {prescriptions.map((p) => (
//             <div
//               key={p._id}
//               className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 mb-2">
//                 {p.medicine}
//               </h2>
//               <p className="text-gray-600 text-sm">
//                 <strong>Dosage:</strong> {p.dosage}
//               </p>
//               <p className="text-gray-600 text-sm">
//                 <strong>Duration:</strong> {p.duration}
//               </p>
//               <p className="text-gray-600 text-sm mb-2">
//                 <strong>Doctor:</strong> {p.doctor}
//               </p>

//               {p.image && (
//                 <img
//                   src={p.image}
//                   alt="Prescription"
//                   className="rounded-lg w-full h-40 object-cover mb-3"
//                 />
//               )}

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleEdit(p._id)}
//                   className="flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
//                 >
//                   <Pencil className="w-4 h-4 mr-1" /> Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(p._id)}
//                   className="flex items-center px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
//                 >
//                   <Trash2 className="w-4 h-4 mr-1" /> Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Prescriptions;

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

