import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import EditPrescription from "./components/EditPrescription";
import EditFamilyMember from "./components/EditFamilyMember";
import AddReminder from "./components/AddReminder";
import EditReminder from "./components/EditReminder";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hidePaths = ["/login", "/signup"];
  const shouldHide = hidePaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!shouldHide && <Header />}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {!shouldHide && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Default redirect */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          <Route path="/add-prescription" element={<ProtectedRoute><AddPrescription /></ProtectedRoute>} />
          <Route path="/add-reminder" element={<ProtectedRoute><AddReminder /></ProtectedRoute>} />
          <Route path="/add-family-member" element={<ProtectedRoute><AddFamilyMember /></ProtectedRoute>} />
          <Route path="/edit-family-member/:id" element={<ProtectedRoute><EditFamilyMember /></ProtectedRoute>} />
          <Route path="/edit-prescription/:id" element={<ProtectedRoute><EditPrescription /></ProtectedRoute>} />
          <Route path="/edit-reminder/:id" element={<ProtectedRoute><EditReminder /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          <Route path="/family" element={<ProtectedRoute><Family /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
