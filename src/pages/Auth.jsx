import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPassword from '../components/auth/ForgotPassword';
import './Auth.css';

const Auth = () => {
  const [view, setView] = useState('login');
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {view === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setView('register')}
            onSwitchToForgot={() => setView('forgot')}
          />
        )}
        {view === 'register' && (
          <RegisterForm onSwitchToLogin={() => setView('login')} />
        )}
        {view === 'forgot' && (
          <ForgotPassword onSwitchToLogin={() => setView('login')} />
        )}
      </div>
    </div>
  );
};

export default Auth;
