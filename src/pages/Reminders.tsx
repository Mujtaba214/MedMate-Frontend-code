import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Clock,
  Trash2,
  CreditCard as Edit,
  X,
  Bell,
  CheckCircle,
} from "lucide-react";

interface Reminder {
  _id: string;
  medication_name: string;
  dosage: string;
  reminder_time: string;
  reminder_date: string;
  frequency: string;
  family_member_id: string | null;
  family_member_name?: string;
  is_active: boolean;
}

interface FamilyMember {
  _id: string;
  name: string;
}

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    reminder_time: "",
    reminder_date: "",
    frequency: "daily",
    family_member_id: "",
    is_active: true,
  });

  const API_BASE = "http://localhost:4000/api"; // ✅ your backend base URL

  useEffect(() => {
    if (user) {
      fetchReminders();
      fetchFamilyMembers();
    }
  }, [user]);

  // 🧠 Fetch reminders
  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reminders/${user?.id}`);
      setReminders(res.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👨‍👩‍👧 Fetch family members
  const fetchFamilyMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/family/${user?.id}`);
      setFamilyMembers(res.data);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  // 💾 Save or update reminder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      user_id: user?.id,
      family_member_id: formData.family_member_id || null,
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/reminders/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/reminders`, payload);
      }

      setShowAddModal(false);
      setEditingId(null);
      resetForm();
      fetchReminders();
    } catch (error) {
      console.error("Error saving reminder:", error);
      alert("Failed to save reminder. Please try again.");
    }
  };

  // ✏️ Edit existing reminder
  const handleEdit = (reminder: Reminder) => {
    setFormData({
      medication_name: reminder.medication_name,
      dosage: reminder.dosage,
      reminder_time: reminder.reminder_time,
      reminder_date: reminder.reminder_date,
      frequency: reminder.frequency,
      family_member_id: reminder.family_member_id || "",
      is_active: reminder.is_active,
    });
    setEditingId(reminder._id);
    setShowAddModal(true);
  };

  // ❌ Delete reminder
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    try {
      await axios.delete(`${API_BASE}/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      alert("Failed to delete reminder.");
    }
  };

  // ✅ Toggle reminder active/inactive
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_BASE}/reminders/${id}/toggle`, {
        is_active: !currentStatus,
      });
      fetchReminders();
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      medication_name: "",
      dosage: "",
      reminder_time: "",
      reminder_date: "",
      frequency: "daily",
      family_member_id: "",
      is_active: true,
    });
  };

  const activeReminders = reminders.filter((r) => r.is_active);
  const inactiveReminders = reminders.filter((r) => !r.is_active);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage medication reminders
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* 🚫 No reminders */}
      {reminders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Reminders Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first medication reminder
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Reminder
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 🟩 Active Reminders */}
          {activeReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Active Reminders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeReminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {reminder.medication_name}
                          </h3>
                          <p className="text-blue-600 font-medium text-sm">
                            {reminder.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            {reminder.reminder_time}
                          </span>
                        </div>
                        <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {reminder.frequency}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          Date:{" "}
                          {new Date(reminder.reminder_date).toLocaleDateString()}
                        </p>
                        <p className="mt-1">
                          For: {reminder.family_member_name || "Self"}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          toggleActive(reminder._id, reminder.is_active)
                        }
                        className="w-full mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                      >
                        Mark as Taken
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🟨 Completed Reminders */}
          {inactiveReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Completed Reminders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveReminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className="bg-gray-50 rounded-xl shadow-md p-6 opacity-75"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {reminder.medication_name}
                          </h3>
                          <p className="text-gray-600 font-medium text-sm">
                            {reminder.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() =>
                            toggleActive(reminder._id, reminder.is_active)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Reactivate"
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{reminder.reminder_time}</span>
                      </div>
                      <p>
                        Date:{" "}
                        {new Date(reminder.reminder_date).toLocaleDateString()}
                      </p>
                      <p>For: {reminder.family_member_name || "Self"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🧾 Add/Edit Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Reminder" : "Add Reminder"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.medication_name}
                  onChange={(e) =>
                    setFormData({ ...formData, medication_name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Aspirin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="twice_daily">Twice Daily</option>
                  <option value="three_times_daily">Three Times Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as_needed">As Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Date
                </label>
                <input
                  type="date"
                  value={formData.reminder_date}
                  onChange={(e) =>
                    setFormData({ ...formData, reminder_date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={formData.reminder_time}
                  onChange={(e) =>
                    setFormData({ ...formData, reminder_time: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Member (Optional)
                </label>
                <select
                  value={formData.family_member_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      family_member_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Self</option>
                  {familyMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Reminder" : "Add Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
