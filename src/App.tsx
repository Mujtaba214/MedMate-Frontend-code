import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Prescriptions from './pages/Prescriptions';
import Reminders from './pages/Reminders';
import Family from './pages/Family';
import Profile from './pages/Profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading MedMate...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'signup') {
      return <Signup onNavigate={setCurrentPage} />;
    }
    return <Login onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === 'prescriptions' && <Prescriptions />}
        {currentPage === 'reminders' && <Reminders />}
        {currentPage === 'family' && <Family />}
        {currentPage === 'profile' && <Profile />}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
