import { useState } from 'react';
import api from '../../services/api';
import Input from '../common/Input';
import Button from '../common/Button';
import './AuthForms.css';

const ForgotPassword = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage('Password reset instructions sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <p className="forgot-text">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="auth-links">
        <button onClick={onSwitchToLogin} className="link-btn">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
