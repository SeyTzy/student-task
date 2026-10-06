const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sey123',
};

const targetDbName = process.env.DB_NAME || 'student_task_db';

async function initDatabase() {
  console.log('--- Initializing PostgreSQL Database ---');
  console.log(`Host: ${config.host}:${config.port}`);
  console.log(`User: ${config.user}`);
  console.log(`Target Database: ${targetDbName}`);

  // Step 1: Connect to default postgres DB to ensure target database exists
  const rootClient = new Client({
    ...config,
    database: 'postgres',
  });

  try {
    await rootClient.connect();
    const checkDb = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDbName]
    );

    if (checkDb.rowCount === 0) {
      console.log(`Database "${targetDbName}" does not exist. Creating...`);
      await rootClient.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`Database "${targetDbName}" created successfully!`);
    } else {
      console.log(`Database "${targetDbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  // Step 2: Connect to target database and execute schema + seed
  const targetPool = new Pool({
    ...config,
    database: targetDbName,
  });

  try {
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

    console.log(`Executing schema from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await targetPool.query(schemaSql);
    console.log('Schema executed successfully (Tables & triggers created)!');

    console.log(`Executing seed data from: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await targetPool.query(seedSql);
    console.log('Seed data inserted successfully!');

    // Verify row counts
    const usersCount = await targetPool.query('SELECT COUNT(*) FROM users');
    const tasksCount = await targetPool.query('SELECT COUNT(*) FROM tasks');
    console.log(`Database is ready! Users: ${usersCount.rows[0].count}, Tasks: ${tasksCount.rows[0].count}`);
  } catch (err) {
    console.error('Error applying schema/seed:', err.message);
    process.exit(1);
  } finally {
    await targetPool.end();
  }
}

initDatabase();
