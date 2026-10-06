import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3 text-center">
      <div className="custom-card p-5" style={{ maxWidth: '480px' }}>
        <FaExclamationTriangle className="text-warning fs-1 mb-3" />
        <h1 className="fw-bold text-dark display-5">404</h1>
        <h4 className="fw-semibold text-secondary mb-2">Page Not Found</h4>
        <p className="text-muted small mb-4">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <FaHome />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
