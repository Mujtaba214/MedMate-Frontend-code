import { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Pill,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalPrescriptions: number;
  activePrescriptions: number;
  upcomingReminders: number;
  familyMembers: number;
}

interface UpcomingReminder {
  id: string;
  medication_name: string;
  dosage: string;
  time: string;
  family_member_name: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalPrescriptions: 0,
    activePrescriptions: 0,
    upcomingReminders: 0,
    familyMembers: 0,
  });
  const [upcomingReminders, setUpcomingReminders] = useState<UpcomingReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const [prescriptionsRes, familyRes, remindersRes] = await Promise.all([
        axios.get(`http://localhost:4000/api/prescriptions/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:4000/api/family/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:4000/api/reminders/${user.id}?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const prescriptions = prescriptionsRes.data || [];
      const familyMembers = familyRes.data || [];
      const reminders = remindersRes.data || [];

      const activePrescriptions =
        prescriptions.filter(
          (p: any) => !p.end_date || new Date(p.end_date) >= new Date()
        ).length || 0;

      setStats({
        totalPrescriptions: prescriptions.length,
        activePrescriptions,
        upcomingReminders: reminders.length,
        familyMembers: familyMembers.length,
      });

      const formattedReminders = reminders.map((r: any) => ({
        id: r.id,
        medication_name: r.medication_name,
        dosage: r.dosage,
        time: r.reminder_time,
        family_member_name: r.family_member_name || "You",
      }));

      setUpcomingReminders(formattedReminders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Pill, label: "Total Prescriptions", value: stats.totalPrescriptions, bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { icon: TrendingUp, label: "Active Prescriptions", value: stats.activePrescriptions, bgColor: "bg-green-50", textColor: "text-green-600" },
    { icon: Clock, label: "Upcoming Reminders", value: stats.upcomingReminders, bgColor: "bg-orange-50", textColor: "text-orange-600" },
    { icon: Users, label: "Family Members", value: stats.familyMembers, bgColor: "bg-purple-50", textColor: "text-purple-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your medication overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Reminders</h2>
            <button
              onClick={() => navigate("/reminders")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>

          {upcomingReminders.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming reminders</p>
              <button
                onClick={() => navigate("/reminders")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Set a reminder
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{reminder.medication_name}</p>
                    <p className="text-sm text-gray-600">{reminder.dosage} for {reminder.family_member_name}</p>
                  </div>
                  <span className="text-blue-600 font-semibold">{reminder.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/prescriptions")}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add Prescription</p>
                <p className="text-sm text-gray-600">Upload a new prescription</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/reminders")}
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <div className="bg-green-600 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Set Reminder</p>
                <p className="text-sm text-gray-600">Schedule medication reminder</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/family")}
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <div className="bg-purple-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add Family Member</p>
                <p className="text-sm text-gray-600">Manage family profiles</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Health Reminder */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Health Reminder</h3>
            <p className="text-blue-800 text-sm">
              Always consult with your healthcare provider before making any
              changes to your medication schedule. MedMate is a reminder tool
              and does not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
