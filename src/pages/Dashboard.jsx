import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) {
      return (
        <div className="no-user">
          <p>Loading user information...</p>
        </div>
      );
    }

    switch (user.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
