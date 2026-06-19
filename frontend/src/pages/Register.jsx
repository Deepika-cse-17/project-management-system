import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const slowTimer = useRef(null);
  const navigate = useNavigate();

  // Clean up timer on unmount
  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const validatePassword = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?"":{}|<>\[\]\\/\\'`~;:_+=-]/.test(pwd);
    return pwd.length >= 6 && hasUpper && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!validatePassword(form.password)) {
      setError('Password must contain at least one uppercase letter, one number, and one special character');
      return;
    }

    setLoading(true);
    setSlowNotice(false);
    slowTimer.current = setTimeout(() => setSlowNotice(true), 4000);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      
      // Check for duplicate email error
      if (data?.message && data.message.includes('Email')) {
        setEmailError(data.message);
        setError('');
      } else if (data?.errors && Array.isArray(data.errors)) {
        const emailErrors = data.errors.filter(x => x.param === 'email');
        if (emailErrors.length > 0) {
          setEmailError(emailErrors[0].msg);
          setError(data.errors.filter(x => x.param !== 'email').map(x => x.msg).join(', '));
        } else {
          setError(data.errors.map(x => x.msg).join(', '));
        }
      } else if (data?.message) {
        setError(data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
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
          <p className="loading-message">Creating your account…</p>
          {slowNotice && (
            <p className="loading-wake-notice">
              ⏳ The server is waking up from sleep.<br />This can take up to 30 seconds on first load.
            </p>
          )}
        </div>
      )}

      <div className="auth-split-single">
        {/* Registration Form */}
        <div className="auth-right">
          <div className="auth-heading">Create Account</div>
          <div className="auth-subheading">Join our platform to get started</div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="form-group-custom">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input
                  id="fullName"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group-custom">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setEmailError('');
                  }}
                  required
                />
              </div>
              {emailError && <div className="form-text" style={{ color: '#d32f2f', marginTop: '6px' }}>⚠ {emailError}</div>}
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
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-text">
                Password must be at least 6 characters and include one uppercase letter, one number, and one special character.
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="btn-lg-primary"
              disabled={loading}
              style={{ marginTop: '24px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}