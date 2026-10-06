import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const TaskModal = ({ isOpen, onClose, onSave, task = null, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    due_date: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        // Format ISO date YYYY-MM-DD for date input
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        due_date: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      due_date: formData.due_date ? formData.due_date : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered w-100"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow-lg border-0 rounded-3 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light border-bottom py-3 px-4">
            <h5 className="modal-title fw-bold text-dark fs-5">
              {task ? 'Edit Task' : 'Create New Task'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">
                  Task Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g., Complete WBD I Midterm Project"
                  value={formData.title}
                  onChange={handleChange}
                  autoFocus
                  disabled={loading}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">
                  Description
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Provide context, deliverables, or notes..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Priority & Status */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">
                    Priority
                  </label>
                  <select
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">
                    Status
                  </label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-2">
                <label className="form-label fw-semibold small text-muted">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  className="form-control"
                  value={formData.due_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light border-top py-3 px-4">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm px-4 d-flex align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>{task ? 'Update Task' : 'Create Task'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
