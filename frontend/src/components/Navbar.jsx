import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className=" navbar\>
 <div className=\logo\>ProjectHub</div>

 {/* Hamburger button */}
 <div className=\hamburger\ onClick={() => setMenuOpen(!menuOpen)}>
 ☰
 </div>

 <ul className={
av-links }>
 <li><Link to=\/\>Home</Link></li>
 <li><Link to=\/features\>Features</Link></li>
 <li><Link to=\/about\>About</Link></li>
 <li><Link to=\/contact\>Contact</Link></li>
 </ul>

 <div className=\auth-buttons\>
 <Link to=\/login\>Login</Link>
 <Link to=\/register\>Sign Up</Link>
 </div>
 </nav>
 );
}
