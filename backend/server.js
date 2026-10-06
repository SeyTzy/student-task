const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
db.query('SELECT NOW()')
  .then((res) => {
    console.log(`Connected to PostgreSQL database successfully at: ${res.rows[0].now}`);
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  Student Task Management Backend Server`);
      console.log(`  Running on: http://localhost:${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL database:', err.message);
    process.exit(1);
  });
