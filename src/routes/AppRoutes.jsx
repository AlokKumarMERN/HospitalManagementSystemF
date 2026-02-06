import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Auth from '../pages/Auth';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Services from '../pages/Services';
import Blogs from '../pages/Blogs';
import Appointment from '../pages/Appointment';
import ViewAppointments from '../pages/ViewAppointments';
import Prescriptions from '../pages/Prescriptions';
import MedicalRecords from '../pages/MedicalRecords';
import TestResults from '../pages/TestResults';
import Dashboard from '../pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <PrivateRoute>
            <Contact />
          </PrivateRoute>
        }
      />
      <Route
        path="/services"
        element={
          <PrivateRoute>
            <Services />
          </PrivateRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <PrivateRoute>
            <Blogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointment"
        element={
          <PrivateRoute>
            <Appointment />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <ViewAppointments />
          </PrivateRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <PrivateRoute>
            <Prescriptions />
          </PrivateRoute>
        }
      />
      <Route
        path="/medical-records"
        element={
          <PrivateRoute>
            <MedicalRecords />
          </PrivateRoute>
        }
      />
      <Route
        path="/test-results"
        element={
          <PrivateRoute>
            <TestResults />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
