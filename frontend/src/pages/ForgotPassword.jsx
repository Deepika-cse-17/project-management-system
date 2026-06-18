import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If an account exists, an OTP was sent to that email.');
      // navigate to reset page with email prefilled
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-single">
        <div className="auth-right">
          <div className="auth-heading">Forgot Password</div>
          <div className="auth-subheading">Enter your account email to receive an OTP</div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-lg-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
