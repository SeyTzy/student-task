import { NavLink } from 'react-router-dom';
import {
  FaThLarge,
  FaTasks,
  FaSignOutAlt,
  FaGraduationCap,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully.', 'info');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose} />}

      <aside className={`app-sidebar d-flex flex-column ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
              style={{ width: '38px', height: '38px' }}
            >
              <FaGraduationCap className="fs-5" />
            </div>
            <div>
              <span className="fw-bold text-dark fs-6 d-block lh-1">TaskMaster</span>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                Student Portal
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light d-lg-none text-muted"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 flex-grow-1">
          <div className="text-uppercase text-muted fw-bold px-2 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
            Main Menu
          </div>
          <nav className="nav flex-column gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <FaThLarge className="fs-5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <FaTasks className="fs-5" />
              <span>My Tasks</span>
            </NavLink>
          </nav>
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center gap-2 mb-3 px-1">
            <FaUserCircle className="text-primary fs-3 flex-shrink-0" />
            <div className="overflow-hidden">
              <div className="fw-semibold text-truncate small" title={user?.name}>
                {user?.name || 'Student'}
              </div>
              <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }} title={user?.email}>
                {user?.email}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
