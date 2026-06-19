import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const slowTimer = useRef(null);

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    setSlowNotice(false);
    setLoading(true);
    slowTimer.current = setTimeout(() => setSlowNotice(true), 4000);

    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message. Please try again.');
    } finally {
      clearTimeout(slowTimer.current);
      setLoading(false);
      setSlowNotice(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-message">Sending your message…</p>
          {slowNotice && (
            <p className="loading-wake-notice">
              ⏳ The server is waking up from sleep.<br />This can take up to 30 seconds on first load.
            </p>
          )}
        </div>
      )}

      {/* Page Header */}
      <section className="page-header">
        <div className="container-main">
          <h1>Contact Us</h1>
          <p>Get in touch with our team</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-section">
        <div className="container-main">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have questions about ProjectHub? We'd love to hear from you.
                Send us a message and we'll respond as soon as possible.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <h3>Email</h3>
                  <p>supportprojecthub@gmail.com</p>
                </div>
                <div className="contact-item">
                  <h3>Response Time</h3>
                  <p>Usually within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">
                {submitted && (
                  <div className="alert alert-success">
                    ✓ Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-group-custom">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group-custom">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group-custom">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                  />
                </div>

                <div className="form-group-custom">
                  <label>Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us what you think..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
