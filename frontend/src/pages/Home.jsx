import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-main">
          <div className="hero-content">
            <h1 className="hero-title">Professional Project Management</h1>
            <p className="hero-subtitle">
              Manage your projects, tasks, and teams in one powerful platform. 
              Simple, efficient, and built for teams of all sizes.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-hero">
                Get Started
              </Link>
              <a href="#features" className="btn btn-outline-primary btn-hero">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview-section" id="features">
        <div className="container-main">
          <h2 className="section-title">Why Choose ProjectHub?</h2>
          <p className="section-subtitle">
            Everything you need to manage projects effectively
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">→</div>
              <h3>Easy to Use</h3>
              <p>Intuitive interface that your team will love. No complicated setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">•</div>
              <h3>Task Management</h3>
              <p>Organize tasks with priorities, deadlines, and status tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">=</div>
              <h3>Team Collaboration</h3>
              <p>Work together seamlessly with real-time project updates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">√</div>
              <h3>Progress Tracking</h3>
              <p>Monitor project status and track completion in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container-main">
          <div className="cta-content">
            <h2>Ready to streamline your workflow?</h2>
            <p>Join thousands of teams already using ProjectHub</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
