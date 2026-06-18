import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    setLoading(true);

    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError('Unable to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
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
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

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

                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Sending message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
