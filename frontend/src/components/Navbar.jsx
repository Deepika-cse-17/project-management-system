import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userEmail');
    setMenuOpen(false);
    navigate('/login');
  };

  const close = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-bar">
      <div className="nav-inner">

        {/* Brand */}
        <Link className="nav-brand" to="/" onClick={close}>
          ProjectHub
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Desktop links */}
        <div className="nav-links-desktop">
          {isLoggedIn ? (
            <>
              <Link className={`nav-link-item${isActive('/') ? ' active' : ''}`} to="/">Home</Link>
              <Link className={`nav-link-item${isActive('/dashboard') ? ' active' : ''}`} to="/dashboard">Dashboard</Link>
              <Link className={`nav-link-item${isActive('/projects') ? ' active' : ''}`} to="/projects">Projects</Link>
              <Link className={`nav-link-item${isActive('/contact') ? ' active' : ''}`} to="/contact">Contact</Link>
              <button className="nav-btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className={`nav-link-item${isActive('/') ? ' active' : ''}`} to="/">Home</Link>
              <Link className={`nav-link-item${isActive('/features') ? ' active' : ''}`} to="/features">Features</Link>
              <Link className={`nav-link-item${isActive('/about') ? ' active' : ''}`} to="/about">About</Link>
              <Link className={`nav-link-item${isActive('/contact') ? ' active' : ''}`} to="/contact">Contact</Link>
              <Link className="nav-btn-outline" to="/login">Login</Link>
              <Link className="nav-btn-solid" to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <div className="nav-drawer-inner">
          {isLoggedIn ? (
            <>
              <Link className={`nav-drawer-link${isActive('/') ? ' active' : ''}`} to="/" onClick={close}>Home</Link>
              <Link className={`nav-drawer-link${isActive('/dashboard') ? ' active' : ''}`} to="/dashboard" onClick={close}>Dashboard</Link>
              <Link className={`nav-drawer-link${isActive('/projects') ? ' active' : ''}`} to="/projects" onClick={close}>Projects</Link>
              <Link className={`nav-drawer-link${isActive('/contact') ? ' active' : ''}`} to="/contact" onClick={close}>Contact</Link>
              <div className="nav-drawer-divider" />
              <button className="nav-drawer-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className={`nav-drawer-link${isActive('/') ? ' active' : ''}`} to="/" onClick={close}>Home</Link>
              <Link className={`nav-drawer-link${isActive('/features') ? ' active' : ''}`} to="/features" onClick={close}>Features</Link>
              <Link className={`nav-drawer-link${isActive('/about') ? ' active' : ''}`} to="/about" onClick={close}>About</Link>
              <Link className={`nav-drawer-link${isActive('/contact') ? ' active' : ''}`} to="/contact" onClick={close}>Contact</Link>
              <div className="nav-drawer-divider" />
              <Link className="nav-drawer-btn-outline" to="/login" onClick={close}>Login</Link>
              <Link className="nav-drawer-btn-solid" to="/register" onClick={close}>Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop — closes menu when tapping outside */}
      {menuOpen && <div className="nav-backdrop" onClick={close} />}
    </nav>
  );
}
