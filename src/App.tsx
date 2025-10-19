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

// Wrapper to conditionally render Header and Footer
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
    // <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/add-prescription" element={<AddPrescription />} />
        <Route path="/add-reminder" element={<AddReminder />} />
        <Route path="/add-family-member" element={<AddFamilyMember />} />
        <Route path="/edit-family-member/:id" element={<EditFamilyMember />} />
        <Route path="/edit-prescription/:id" element={<EditPrescription />} />
        <Route path="/edit-reminder/:id" element={<EditReminder />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/family" element={<Family />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
    // {/* </Router> */}
  );
}

export default App;
