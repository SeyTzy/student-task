import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';

const TaskDetailModal = ({ isOpen, onClose, task, onEdit }) => {
  if (!isOpen || !task) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date specified';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue =
    task.due_date &&
    new Date(task.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
    task.status !== 'Completed';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="badge badge-priority-high px-2 py-1">High Priority</span>;
      case 'Medium':
        return <span className="badge badge-priority-medium px-2 py-1">Medium Priority</span>;
      case 'Low':
        return <span className="badge badge-priority-low px-2 py-1">Low Priority</span>;
      default:
        return <span className="badge bg-secondary px-2 py-1">{priority}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-status-completed px-2 py-1">Completed</span>;
      case 'In Progress':
        return <span className="badge badge-status-in-progress px-2 py-1">In Progress</span>;
      case 'Pending':
        return <span className="badge badge-status-pending px-2 py-1">Pending</span>;
      default:
        return <span className="badge bg-light text-dark px-2 py-1">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered w-100"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-white shadow-lg border-0 rounded-3 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary-subtle text-secondary border">
                Task #{task.id}
              </span>
              <h5 className="modal-title fw-bold text-dark fs-5 mb-0">Task Details</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body bg-white p-4">
            <h4 className="fw-bold text-dark mb-3">{task.title}</h4>

            {/* Badges Bar */}
            <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
              {isOverdue && (
                <span className="badge bg-danger text-white px-2 py-1">
                  Overdue
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="fw-semibold small text-muted text-uppercase mb-1 d-block">
                Description
              </label>
              <div
                className="p-3 rounded-2 bg-light border text-secondary"
                style={{ whiteSpace: 'pre-line', minHeight: '80px' }}
              >
                {task.description || <em>No description provided for this task.</em>}
              </div>
            </div>

            {/* Meta Information Grid */}
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-white">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <FaCalendarAlt className="text-primary" />
                    <span>Due Date</span>
                  </div>
                  <div className={`fw-semibold mt-1 ${isOverdue ? 'text-danger' : 'text-dark'}`}>
                    {formatDate(task.due_date)}
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-2 border rounded-2 bg-white">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <FaClock className="text-info" />
                    <span>Created Date</span>
                  </div>
                  <div className="fw-semibold text-dark mt-1">
                    {formatDateTime(task.created_at)}
                  </div>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="p-2 border rounded-2 bg-white">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <FaInfoCircle className="text-secondary" />
                    <span>Last Updated</span>
                  </div>
                  <div className="fw-semibold text-dark mt-1">
                    {formatDateTime(task.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-white border-top py-3 px-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <FaEdit />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
