import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="app-topbar d-flex justify-content-between align-items-center">
      {/* Mobile Menu Toggle & Title */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-light d-lg-none border p-2 d-flex align-items-center justify-content-center"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>
        <span className="fw-semibold text-dark d-none d-sm-inline">
          Student Task Management System
        </span>
      </div>

      {/* User Info Bar */}
      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <div className="fw-semibold text-dark small lh-1">
            {user?.name || 'Student'}
          </div>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            {user?.email}
          </span>
        </div>
        <div
          className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-primary"
          style={{ width: '40px', height: '40px' }}
        >
          <FaUserCircle className="fs-4" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
