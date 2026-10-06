const db = require('../config/db');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

// GET /api/tasks - Retrieve all tasks for the logged in user with search, filter, and sort
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, status, priority, sortBy, sortOrder } = req.query;

    let queryText = 'SELECT * FROM tasks WHERE user_id = $1';
    const queryParams = [userId];
    let paramIndex = 2;

    // Search by title or description
    if (search && search.trim() !== '') {
      queryText += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    // Filter by status
    if (status && VALID_STATUSES.includes(status)) {
      queryText += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Filter by priority
    if (priority && VALID_PRIORITIES.includes(priority)) {
      queryText += ` AND priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }

    // Sorting
    const allowedSortFields = {
      due_date: 'due_date',
      created_at: 'created_at',
      title: 'title',
      priority: 'priority',
      status: 'status',
    };

    const sortField = allowedSortFields[sortBy] || 'due_date';
    const order = (sortOrder && sortOrder.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';

    // When sorting by due_date ASC, nulls usually go last
    if (sortField === 'due_date') {
      queryText += ` ORDER BY due_date IS NULL, due_date ${order}, created_at DESC`;
    } else {
      queryText += ` ORDER BY ${sortField} ${order}`;
    }

    const result = await db.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id - Retrieve a specific task by ID (ownership protected)
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID provided.',
      });
    }

    const result = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to view it.',
      });
    }

    return res.status(200).json({
      success: true,
      task: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks - Create a new task
const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, status, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const assignedPriority = priority && VALID_PRIORITIES.includes(priority)
      ? priority
      : 'Medium';

    const assignedStatus = status && VALID_STATUSES.includes(status)
      ? status
      : 'Pending';

    const assignedDueDate = due_date && due_date !== '' ? due_date : null;

    const result = await db.query(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        title.trim(),
        description ? description.trim() : null,
        assignedPriority,
        assignedStatus,
        assignedDueDate,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id - Update an existing task (ownership protected)
const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID provided.',
      });
    }

    const { title, description, priority, status, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be empty.',
      });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`,
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    const assignedDueDate = due_date && due_date !== '' ? due_date : null;

    const result = await db.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           priority = COALESCE($3, priority),
           status = COALESCE($4, status),
           due_date = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        title.trim(),
        description !== undefined ? (description ? description.trim() : null) : null,
        priority,
        status,
        assignedDueDate,
        taskId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to modify it.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id - Delete a task (ownership protected)
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID provided.',
      });
    }

    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete it.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      deletedId: taskId,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/status - Update task status quickly (Pending, In Progress, Completed)
const updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID provided.',
      });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    const result = await db.query(
      `UPDATE tasks
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to update it.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Task status updated to "${status}".`,
      task: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats/summary - Summary statistics for the Dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Single aggregated query for all count statistics
    const statsResult = await db.query(
      `SELECT
         COUNT(*)::INTEGER AS total_tasks,
         COUNT(CASE WHEN status = 'Pending' THEN 1 END)::INTEGER AS pending_tasks,
         COUNT(CASE WHEN status = 'In Progress' THEN 1 END)::INTEGER AS in_progress_tasks,
         COUNT(CASE WHEN status = 'Completed' THEN 1 END)::INTEGER AS completed_tasks,
         COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'Completed' THEN 1 END)::INTEGER AS overdue_tasks
       FROM tasks
       WHERE user_id = $1`,
      [userId]
    );

    const stats = statsResult.rows[0];
    const total = stats.total_tasks || 0;
    const completed = stats.completed_tasks || 0;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Recent 5 tasks
    const recentTasksResult = await db.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalTasks: total,
        pendingTasks: stats.pending_tasks || 0,
        inProgressTasks: stats.in_progress_tasks || 0,
        completedTasks: completed,
        overdueTasks: stats.overdue_tasks || 0,
        completionPercentage,
      },
      recentTasks: recentTasksResult.rows,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getDashboardStats,
};
