import { NavLink, useLocation } from 'react-router-dom';
import { SECTIONS } from '../../constants/navigation';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">Sajilo Assessment</div>
        <nav className="navbar-links" aria-label="Primary">
          {SECTIONS.map((section) => (
            <NavLink
              key={section.id}
              to={section.path}
              className={() =>
                section.match(pathname) ? 'nav-link active' : 'nav-link'
              }
              aria-current={section.match(pathname) ? 'page' : undefined}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
