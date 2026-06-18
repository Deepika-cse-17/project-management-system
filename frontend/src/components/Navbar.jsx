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

  return (
    <nav className="navbar navbar-expand-lg navbar-enhanced sticky-top">
      <div className="container-main d-flex align-items-center">
        {/* Brand */}
        <Link className="navbar-brand navbar-brand-logo me-3" to="/">
          <span>ProjectHub</span>
        </Link>

        {/* Navbar Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {isLoggedIn ? (
              <>
                {/* Logged In Menu */}
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects">Projects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={logout}
                    style={{ marginTop: '8px' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Logged Out Menu */}
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/features">Features</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-primary btn-sm" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-primary btn-sm" to="/register">
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