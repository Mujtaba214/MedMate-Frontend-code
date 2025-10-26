import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Reminder } from "../types/Reminder";
import { useNavigate } from "react-router-dom";

export default function Reminders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchReminders();
  }, [token]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("📦 Reminder API response:", data);

      if (data.success && Array.isArray(data.data)) {
        setReminders(data.data);
      } else {
        console.warn("⚠️ Unexpected reminder response:", data);
        setReminders([]);
      }
    } catch (err) {
      console.error("❌ Error fetching reminders:", err);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reminders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchReminders();
    } catch (err) {
      console.error("❌ Error deleting reminder:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="text-blue-600" /> Reminders
        </h1>
        <button
          onClick={() => navigate("/add-reminder")}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5" />
          <span>Add Reminder</span>
        </button>
      </div>

      {reminders.length === 0 ? (
        <p className="text-gray-600">No reminders found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {r.medicine_name || "General Reminder"}
                  </h3>
                  {r.family_member_name && (
                    <p className="text-sm text-blue-600">
                      For: {r.family_member_name}
                    </p>
                  )}
                  <p className="text-gray-600 mt-1 text-sm">
                    🕒 {new Date(r.reminder_time).toLocaleString()}
                  </p>
                  {r.note && (
                    <p className="text-gray-700 mt-2 italic">"{r.note}"</p>
                  )}
                  {r.email_sent && (
                    <span className="inline-block mt-2 text-green-600 text-sm font-medium">
                      ✅ Email Sent
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/edit-reminder/${r.id}`)}
                    className="text-blue-600 hover:bg-blue-50 rounded-lg p-2"
                    title="Edit Reminder"
                  >
                    <Edit className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-600 hover:bg-red-50 rounded-lg p-2"
                    title="Delete Reminder"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
