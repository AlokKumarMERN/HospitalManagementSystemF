import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Loader from '../common/Loader';
import './AuthForms.css';

const LoginForm = ({ onSwitchToRegister, onSwitchToForgot }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, googleAuth, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleAuth(tokenResponse.access_token);
      } catch (err) {
        setError('Google login failed');
      }
    },
    onError: () => {
      setError('Google login failed');
    },
  });

  if (loading) return <Loader />;

  return (
    <div className="auth-form">
      <h2>Login to SaveLife</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        
        <Button type="submit" fullWidth>Login</Button>
      </form>

      <div className="divider">OR</div>

      <Button variant="google" onClick={handleGoogleLogin} fullWidth>
        Login with Google
      </Button>

      <div className="auth-links">
        <button onClick={onSwitchToForgot} className="link-btn">
          Forgot Password?
        </button>
        <button onClick={onSwitchToRegister} className="link-btn">
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
