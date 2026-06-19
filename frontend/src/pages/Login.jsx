import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const slowTimer = useRef(null);
  const navigate = useNavigate();

  // Clean up timer on unmount
  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSlowNotice(false);
    setLoading(true);

    // If the request takes more than 4 seconds, show wake-up notice
    slowTimer.current = setTimeout(() => setSlowNotice(true), 4000);

    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      localStorage.setItem('token', data.token);
      if (form.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', form.email);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      clearTimeout(slowTimer.current);
      setLoading(false);
      setSlowNotice(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-message">Signing in…</p>
          {slowNotice && (
            <p className="loading-wake-notice">
              ⏳ The server is waking up from sleep.<br />This can take up to 30 seconds on first load.
            </p>
          )}
        </div>
      )}

      <div className="auth-split-single">
        {/* Login Form */}
        <div className="auth-right">
          <div className="auth-heading">Login</div>
          <div className="auth-subheading">Sign in to your account to continue</div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group-custom">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group-custom">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div className="form-check-custom">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="link-primary">Forgot password?</Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-lg-primary"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}