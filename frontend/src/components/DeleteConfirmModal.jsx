import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered w-100"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow-lg border-0 rounded-3 overflow-hidden text-center p-4">
          <div
            className="rounded-circle bg-danger-subtle text-danger mx-auto d-flex align-items-center justify-content-center mb-3"
            style={{ width: '56px', height: '56px' }}
          >
            <FaExclamationTriangle className="fs-3" />
          </div>

          <h5 className="fw-bold text-dark mb-2">Delete Task?</h5>
          <p className="text-muted small mb-4">
            Are you sure you want to delete{' '}
            <strong className="text-dark">"{taskTitle}"</strong>? This action cannot be undone.
          </p>

          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-4"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm px-4 d-flex align-items-center gap-2"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FaTrash />
                  <span>Yes, Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
