import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const preEmail = searchParams.get('email') || '';
  const [form, setForm] = useState({ email: preEmail, otp: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (preEmail) setForm(f => ({ ...f, email: preEmail }));
  }, [preEmail]);

  const validatePassword = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?\"":{}|<>\[\]\\/\\'`~;:_+=-]/.test(pwd);
    return pwd.length >= 6 && hasUpper && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validatePassword(form.newPassword)) {
      setError('Password must be at least 6 chars and include uppercase, number, and special char');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      setSuccess('Password has been reset. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-single">
        <div className="auth-right">
          <div className="auth-heading">Reset Password</div>
          <div className="auth-subheading">Enter the OTP sent to your email and choose a new password</div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-group-custom">
              <label htmlFor="otp">OTP</label>
              <input id="otp" type="text" className="form-control" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} required />
            </div>

            <div className="form-group-custom">
              <label htmlFor="newPassword">New Password</label>
              <input id="newPassword" type="password" className="form-control" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
            </div>

            <div className="form-group-custom">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" className="form-control" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>

            <button type="submit" className="btn-lg-primary" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
