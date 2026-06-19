import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const [navOpen, setNavOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Close the mobile menu when any nav link is clicked
  const closeNav = () => setNavOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-enhanced sticky-top">
      <div className="container-main d-flex align-items-center">
        {/* Brand */}
        <Link className="navbar-brand navbar-brand-logo me-3" to="/" onClick={closeNav}>
          <span>ProjectHub</span>
        </Link>

        {/* Navbar Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(prev => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu — controlled via React state, no Bootstrap JS needed */}
        <div className={`navbar-collapse${navOpen ? ' show' : ' collapse'}`} id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={closeNav}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects" onClick={closeNav}>Projects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={closeNav}>Home</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => { closeNav(); logout(); }}
                    style={{ marginTop: '8px', marginBottom: '8px' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={closeNav}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/features" onClick={closeNav}>Features</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about" onClick={closeNav}>About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact" onClick={closeNav}>Contact</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-primary btn-sm" to="/login" onClick={closeNav}>
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-primary btn-sm" to="/register" onClick={closeNav}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}