import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EditReminder() {
  const { id } = useParams(); // reminder ID from URL
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [form, setForm] = useState({
    family_member_id: "",
    prescription_id: "",
    reminder_time: "",
    note: "",
  });

  useEffect(() => {
    fetchFamilyMembers();
    fetchPrescriptions();
    fetchReminder();
  }, [id]);

  // ✅ Fetch all family members
  const fetchFamilyMembers = async () => {
    const res = await fetch("http://localhost:4000/api/family", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFamilyMembers(data || []);
  };

  // ✅ Fetch all prescriptions
  const fetchPrescriptions = async () => {
    const res = await fetch("http://localhost:4000/api/prescriptions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPrescriptions(data || []);
  };

  // ✅ Fetch reminder details to prefill form
  const fetchReminder = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data?.data) {
        setForm({
          family_member_id: data.data.family_member_id || "",
          prescription_id: data.data.prescription_id || "",
          reminder_time: data.data.reminder_time
            ? new Date(data.data.reminder_time).toISOString().slice(0, 16) // for datetime-local input
            : "",
          note: data.data.note || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching reminder:", err);
    }
  };

  // ✅ Handle form submission (PUT request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/reminders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");
      alert("✅ Reminder updated successfully!");
      navigate("/reminders");
    } catch (err) {
      console.error("❌ Error updating reminder:", err);
      alert("Failed to update reminder");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Edit Reminder
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Family Member */}
        <div>
          <label className="block text-gray-700 mb-1">Family Member</label>
          <select
            value={form.family_member_id}
            onChange={(e) =>
              setForm({ ...form, family_member_id: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Member</option>
            {familyMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prescription */}
        <div>
          <label className="block text-gray-700 mb-1">Prescription</label>
          <select
            value={form.prescription_id}
            onChange={(e) =>
              setForm({ ...form, prescription_id: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Prescription</option>
            {prescriptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.medicine}
              </option>
            ))}
          </select>
        </div>

        {/* Reminder Time */}
        <div>
          <label className="block text-gray-700 mb-1">Reminder Time</label>
          <input
            type="datetime-local"
            value={form.reminder_time}
            onChange={(e) =>
              setForm({ ...form, reminder_time: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-gray-700 mb-1">Note</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Optional note..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Update Reminder
        </button>
      </form>
    </div>
  );
}
