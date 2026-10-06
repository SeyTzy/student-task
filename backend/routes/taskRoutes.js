const express = require('express');
const router = express.Router();
const {getTasks,getTaskById,createTask,updateTask,deleteTask,updateTaskStatus,getDashboardStats,} = require('../controllers/taskController');
const authenticate = require('../middleware/auth');

router.use(authenticate);
router.get('/stats/summary', getDashboardStats);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
