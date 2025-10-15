import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddReminder() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({
    family_member_id: "",
    prescription_id: "",
    reminder_time: "",
    note: "",
  });

  useEffect(() => {
    fetchFamilyMembers();
    fetchPrescriptions();
  }, []);

  const fetchFamilyMembers = async () => {
    const res = await fetch("http://localhost:4000/api/family", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFamilyMembers(data || []);
  };

  const fetchPrescriptions = async () => {
    const res = await fetch("http://localhost:4000/api/prescriptions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPrescriptions(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:4000/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      alert("✅ Reminder added successfully!");
      navigate("/reminders");
    } catch (err) {
      console.error("❌ Error adding reminder:", err);
      alert("Failed to add reminder");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Add Reminder
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            {familyMembers.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

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
            {prescriptions.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.medicine}
              </option>
            ))}
          </select>
        </div>

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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Reminder
        </button>
      </form>
    </div>
  );
}