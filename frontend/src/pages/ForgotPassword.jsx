import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const slowTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSlowNotice(false);
    setLoading(true);
    slowTimer.current = setTimeout(() => setSlowNotice(true), 4000);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('OTP sent! Check your inbox (and spam folder). Redirecting…');
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      clearTimeout(slowTimer.current);
      setLoading(false);
      setSlowNotice(false);
    }
  };

  return (
    <div className="auth-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-message">Sending OTP…</p>
          {slowNotice && (
            <p className="loading-wake-notice">
              ⏳ The server is waking up from sleep.<br />This can take up to 30 seconds on first load.
            </p>
          )}
        </div>
      )}

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
