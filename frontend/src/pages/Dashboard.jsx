import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTasks,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaArrowRight,
  FaEye,
  FaSpinner,
} from 'react-icons/fa';
import { taskApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionPercentage: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskApi.getDashboardStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentTasks(res.data.recentTasks || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      showToast('Failed to load dashboard metrics.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateTask = async (taskData) => {
    try {
      setModalLoading(true);
      const res = await taskApi.createTask(taskData);
      if (res.data.success) {
        showToast('New task added successfully!', 'success');
        setIsCreateModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task.';
      showToast(msg, 'danger');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetail = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <FaSpinner className="spinner-border text-primary fs-3" />
        <span className="ms-2 text-muted">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome & Top Action Bar */}
      <div className="d-flex flex-column flex-md-row md:align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            Welcome back, {user?.name || 'Student'}! 👋
          </h2>
          <p className="text-muted small mb-0">
            Here is a snapshot of your current coursework and academic task progress.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Total Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Total Tasks
              </span>
              <div
                className="rounded-3 bg-primary-subtle text-primary p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <FaTasks className="fs-5" />
              </div>
            </div>
            <div className="fs-2 fw-bold text-dark">{stats.totalTasks}</div>
            <div className="text-muted small mt-1">All assigned tasks</div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Pending Tasks
              </span>
              <div
                className="rounded-3 bg-secondary-subtle text-secondary p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <FaClock className="fs-5" />
              </div>
            </div>
            <div className="fs-2 fw-bold text-dark">{stats.pendingTasks}</div>
            <div className="text-muted small mt-1">
              {stats.inProgressTasks} task(s) currently in progress
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Completed
              </span>
              <div
                className="rounded-3 bg-success-subtle text-success p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <FaCheckCircle className="fs-5" />
              </div>
            </div>
            <div className="fs-2 fw-bold text-success">{stats.completedTasks}</div>
            <div className="text-muted small mt-1">Accomplished assignments</div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Overdue Tasks
              </span>
              <div
                className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${
                  stats.overdueTasks > 0
                    ? 'bg-danger-subtle text-danger'
                    : 'bg-light text-muted'
                }`}
                style={{ width: '40px', height: '40px' }}
              >
                <FaExclamationTriangle className="fs-5" />
              </div>
            </div>
            <div
              className={`fs-2 fw-bold ${
                stats.overdueTasks > 0 ? 'text-danger' : 'text-dark'
              }`}
            >
              {stats.overdueTasks}
            </div>
            <div className="text-muted small mt-1">
              {stats.overdueTasks > 0
                ? 'Requires immediate attention'
                : 'No overdue deadlines!'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator Card */}
      <div className="custom-card p-4 mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-2">
          <div>
            <h5 className="fw-bold text-dark mb-0">Task Completion Rate</h5>
            <small className="text-muted">
              {stats.completedTasks} of {stats.totalTasks} total tasks completed
            </small>
          </div>
          <span className="badge bg-primary fs-6 px-3 py-2 align-self-start align-self-sm-center">
            {stats.completionPercentage}% Done
          </span>
        </div>

        <div
          className="progress mt-3"
          style={{ height: '12px', borderRadius: '8px', backgroundColor: '#e2e8f0' }}
        >
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            role="progressbar"
            style={{ width: `${stats.completionPercentage}%` }}
            aria-valuenow={stats.completionPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Recent Tasks Card */}
      <div className="custom-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-0">Recent Tasks</h5>
            <small className="text-muted">Latest additions to your task list</small>
          </div>
          <Link
            to="/tasks"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          >
            <span>View All</span>
            <FaArrowRight style={{ fontSize: '0.75rem' }} />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-5 border rounded-3 bg-light">
            <FaTasks className="text-muted fs-1 mb-2 opacity-50" />
            <h6 className="fw-semibold text-muted">No tasks created yet</h6>
            <p className="text-muted small mb-3">
              Get started by clicking the "New Task" button above.
            </p>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FaPlus className="me-1" /> Create Your First Task
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small">
                <tr>
                  <th scope="col" style={{ width: '40%' }}>Title</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Due Date</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '280px' }}>
                        {t.title}
                      </div>
                      {t.description && (
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: '280px', fontSize: '0.75rem' }}
                        >
                          {t.description}
                        </div>
                      )}
                    </td>
                    <td>{getPriorityBadge(t.priority)}</td>
                    <td>{getStatusBadge(t.status)}</td>
                    <td className="small text-secondary">{formatDate(t.due_date)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-light btn-sm text-primary border"
                        onClick={() => handleViewDetail(t)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
        loading={modalLoading}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onEdit={() => {
          // Navigating to /tasks page where full edit can be done or user can click edit
          window.location.href = '/tasks';
        }}
      />
    </div>
  );
};

export default Dashboard;
