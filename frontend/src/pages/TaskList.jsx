import { useState, useEffect, useCallback } from 'react';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaTh,
  FaList,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaRegCircle,
  FaCalendarAlt,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import { taskApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const TaskList = () => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and sorting state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('ASC');

  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tasks with current query filters
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const res = await taskApi.getTasks(params);
      if (res.data.success) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy, sortOrder, showToast]);

  // Debounced search / filter fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // Create or Update task handler
  const handleSaveTask = async (formData) => {
    try {
      setModalLoading(true);
      if (editingTask) {
        const res = await taskApi.updateTask(editingTask.id, formData);
        if (res.data.success) {
          showToast('Task updated successfully!', 'success');
          setIsModalOpen(false);
          setEditingTask(null);
          fetchTasks();
        }
      } else {
        const res = await taskApi.createTask(formData);
        if (res.data.success) {
          showToast('Task created successfully!', 'success');
          setIsModalOpen(false);
          fetchTasks();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving task.';
      showToast(msg, 'danger');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete task handler
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await taskApi.deleteTask(taskToDelete.id);
      if (res.data.success) {
        showToast('Task deleted successfully.', 'info');
        setIsDeleteOpen(false);
        setTaskToDelete(null);
        fetchTasks();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task.';
      showToast(msg, 'danger');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status toggle handler (e.g. Completed <-> Pending)
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await taskApi.updateStatus(task.id, newStatus);
      if (res.data.success) {
        showToast(
          `Marked "${task.title}" as ${newStatus}.`,
          newStatus === 'Completed' ? 'success' : 'info'
        );
        fetchTasks();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status.';
      showToast(msg, 'danger');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('due_date');
    setSortOrder('ASC');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (task) =>
    task.due_date &&
    new Date(task.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
    task.status !== 'Completed';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="badge badge-priority-high">High</span>;
      case 'Medium':
        return <span className="badge badge-priority-medium">Medium</span>;
      case 'Low':
        return <span className="badge badge-priority-low">Low</span>;
      default:
        return <span className="badge bg-secondary">{priority}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-status-completed">Completed</span>;
      case 'In Progress':
        return <span className="badge badge-status-in-progress">In Progress</span>;
      case 'Pending':
        return <span className="badge badge-status-pending">Pending</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  return (
    <div>
      {/* Top Header & New Task Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Tasks</h2>
          <p className="text-muted small mb-0">
            Create, track, organize, and manage all your academic assignments
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="custom-card p-3 p-md-4 mb-4">
        <div className="row g-2 align-items-center">
          {/* Search Box */}
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearch('')}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-sm-3 col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-6 col-sm-3 col-md-2">
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div className="col-6 col-sm-3 col-md-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="due_date">Sort: Due Date</option>
              <option value="created_at">Sort: Created Date</option>
              <option value="title">Sort: Title</option>
              <option value="priority">Sort: Priority</option>
            </select>
          </div>

          {/* Sort Order & View Switch */}
          <div className="col-6 col-sm-3 col-md-2 d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary flex-grow-1"
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              title={`Sorting: ${sortOrder === 'ASC' ? 'Ascending' : 'Descending'}`}
            >
              <FaSort className="me-1" />
              <span>{sortOrder}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-outline-secondary ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <FaList />
              </button>
              <button
                type="button"
                className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid / Card View"
              >
                <FaTh />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter tags row */}
        {(search || statusFilter || priorityFilter) && (
          <div className="d-flex align-items-center gap-2 mt-3 pt-2 border-top flex-wrap">
            <span className="small text-muted fw-semibold">Filtered by:</span>
            {search && (
              <span className="badge bg-light text-dark border">
                Search: "{search}"
              </span>
            )}
            {statusFilter && (
              <span className="badge bg-light text-dark border">
                Status: {statusFilter}
              </span>
            )}
            {priorityFilter && (
              <span className="badge bg-light text-dark border">
                Priority: {priorityFilter}
              </span>
            )}
            <button
              type="button"
              className="btn btn-link btn-sm text-danger p-0 ms-auto text-decoration-none small"
              onClick={handleResetFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="spinner-border text-primary fs-3" />
          <div className="text-muted mt-2 small">Loading your tasks...</div>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="custom-card text-center py-5 px-3">
          <div
            className="rounded-circle bg-light text-muted mx-auto d-flex align-items-center justify-content-center mb-3"
            style={{ width: '64px', height: '64px' }}
          >
            <FaFilter className="fs-3 opacity-50" />
          </div>
          <h5 className="fw-bold text-dark mb-1">No tasks found</h5>
          <p className="text-muted small mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
            {search || statusFilter || priorityFilter
              ? 'No tasks match your current search or filter criteria. Try clearing some filters.'
              : 'You have not added any tasks yet. Create your first assignment to get organized!'}
          </p>
          {search || statusFilter || priorityFilter ? (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleResetFilters}
            >
              Clear Filters
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
            >
              <FaPlus className="me-1" /> Add New Task
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="custom-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small">
                <tr>
                  <th scope="col" style={{ width: '48px' }} className="text-center">
                    Done
                  </th>
                  <th scope="col" style={{ minWidth: '220px' }}>
                    Title & Description
                  </th>
                  <th scope="col" style={{ width: '130px' }}>Priority</th>
                  <th scope="col" style={{ width: '140px' }}>Status</th>
                  <th scope="col" style={{ width: '150px' }}>Due Date</th>
                  <th scope="col" style={{ width: '130px' }} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const overdue = isOverdue(task);
                  return (
                    <tr
                      key={task.id}
                      className={task.status === 'Completed' ? 'bg-light bg-opacity-50' : ''}
                    >
                      {/* Checkbox toggle status */}
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => handleToggleStatus(task)}
                          title={
                            task.status === 'Completed'
                              ? 'Mark as Pending'
                              : 'Mark as Completed'
                          }
                        >
                          {task.status === 'Completed' ? (
                            <FaCheckCircle className="text-success fs-5" />
                          ) : (
                            <FaRegCircle className="text-muted fs-5" />
                          )}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td>
                        <div
                          className={`fw-semibold ${
                            task.status === 'Completed'
                              ? 'text-decoration-line-through text-muted'
                              : 'text-dark'
                          }`}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <div
                            className="text-muted small text-truncate"
                            style={{ maxWidth: '320px', fontSize: '0.8rem' }}
                          >
                            {task.description}
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td>{getPriorityBadge(task.priority)}</td>

                      {/* Status */}
                      <td>{getStatusBadge(task.status)}</td>

                      {/* Due Date */}
                      <td>
                        <div
                          className={`small d-flex align-items-center gap-1 ${
                            overdue ? 'text-danger fw-semibold' : 'text-secondary'
                          }`}
                        >
                          <FaCalendarAlt />
                          <span>{formatDate(task.due_date)}</span>
                          {overdue && (
                            <span className="badge bg-danger-subtle text-danger ms-1" style={{ fontSize: '0.65rem' }}>
                              Late
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-light border text-primary"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsDetailOpen(true);
                            }}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            type="button"
                            className="btn btn-light border text-secondary"
                            onClick={() => {
                              setEditingTask(task);
                              setIsModalOpen(true);
                            }}
                            title="Edit Task"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="btn btn-light border text-danger"
                            onClick={() => {
                              setTaskToDelete(task);
                              setIsDeleteOpen(true);
                            }}
                            title="Delete Task"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID / CARD VIEW */
        <div className="row g-3">
          {tasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <div key={task.id} className="col-12 col-md-6 col-xl-4">
                <div
                  className={`custom-card p-3 h-100 d-flex flex-column justify-content-between ${
                    task.status === 'Completed' ? 'opacity-75' : ''
                  }`}
                >
                  <div>
                    {/* Card Top: Badges and Quick Toggle */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex gap-1 flex-wrap">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                        {overdue && (
                          <span className="badge bg-danger text-white">Overdue</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleToggleStatus(task)}
                        title={
                          task.status === 'Completed'
                            ? 'Mark Pending'
                            : 'Mark Completed'
                        }
                      >
                        {task.status === 'Completed' ? (
                          <FaCheckCircle className="text-success fs-5" />
                        ) : (
                          <FaRegCircle className="text-muted fs-5" />
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h6
                      className={`fw-bold mb-2 ${
                        task.status === 'Completed'
                          ? 'text-decoration-line-through text-muted'
                          : 'text-dark'
                      }`}
                    >
                      {task.title}
                    </h6>

                    {/* Description */}
                    <p
                      className="text-muted small mb-3"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px',
                      }}
                    >
                      {task.description || (
                        <span className="fst-italic opacity-75">No description</span>
                      )}
                    </p>
                  </div>

                  {/* Card Bottom: Date and Actions */}
                  <div className="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                    <div
                      className={`small d-flex align-items-center gap-1 ${
                        overdue ? 'text-danger fw-semibold' : 'text-muted'
                      }`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      <FaCalendarAlt />
                      <span>{formatDate(task.due_date)}</span>
                    </div>

                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-light border text-primary"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDetailOpen(true);
                        }}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        type="button"
                        className="btn btn-light border text-secondary"
                        onClick={() => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        title="Edit Task"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-light border text-danger"
                        onClick={() => {
                          setTaskToDelete(task);
                          setIsDeleteOpen(true);
                        }}
                        title="Delete Task"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        loading={modalLoading}
      />

      {/* Task Details Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={(task) => {
          setEditingTask(task);
          setIsModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteTask}
        taskTitle={taskToDelete?.title || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default TaskList;
