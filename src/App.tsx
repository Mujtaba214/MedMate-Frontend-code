import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Prescriptions from "./pages/Prescriptions";
import Reminders from "./pages/Reminders";
import Family from "./pages/Family";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddPrescription from "./components/AddPrescription";
import AddFamilyMember from "./components/AddFamilyMember";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useAuth();

  return (
    // <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Show Header only if logged in */}
        {user && <Header />}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute>
                  <Prescriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-prescription"
              element={
                <ProtectedRoute>
                  <AddPrescription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-family-member"
              element={
                <ProtectedRoute>
                  <AddFamilyMember />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/family"
              element={
                <ProtectedRoute>
                  <Family />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Show Footer only if logged in */}
        {user && <Footer />}
      </div>
    // </Router>
  );
}

export default App;
