import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <div className="main-wrapper">
        <Sidebar />
        <main id="main-content" className="content-area" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
