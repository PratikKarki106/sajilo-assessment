import { NavLink, useLocation } from 'react-router-dom';
import { getActiveSection } from '../../constants/navigation';
import './Sidebar.css';

export default function Sidebar() {
  const { pathname } = useLocation();
  const section = getActiveSection(pathname);

  return (
    <aside className="sidebar" aria-label={`${section.label} navigation`}>
      <p className="sidebar-title">{section.label}</p>
      <nav className="sidebar-menu">
        {section.items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
