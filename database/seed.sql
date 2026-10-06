-- ===================================================
-- Sample Seed Data for Student Task Management System
-- Passwords for both users is: password123
-- ===================================================

-- Clear existing data
TRUNCATE TABLE tasks, users RESTART IDENTITY CASCADE;

-- Insert Sample Users
-- Password hash corresponds to 'password123'
INSERT INTO users (name, email, password) VALUES
('Sophea Meas', 'sophea@example.com', '$2a$10$Vwy8WF0k6ih8A5WPa/lR1.OfaM46pZKYLaq5qZoS5pogjOjEzjghi'),
('Dara Chan', 'dara@example.com', '$2a$10$Vwy8WF0k6ih8A5WPa/lR1.OfaM46pZKYLaq5qZoS5pogjOjEzjghi');

-- Insert Sample Tasks for Sophea (user_id = 1)
INSERT INTO tasks (user_id, title, description, priority, status, due_date) VALUES
(1, 'Complete WBD I Midterm Project', 'Finish the React and Express full-stack task manager with PostgreSQL integration.', 'High', 'In Progress', CURRENT_DATE + INTERVAL '2 days'),
(1, 'Database System Assignment 2', 'Write SQL queries for normalization and indexing exercises.', 'Medium', 'Pending', CURRENT_DATE + INTERVAL '5 days'),
(1, 'Submit Java OOP Lab Report', 'Document inheritance, polymorphism, and interface implementation examples.', 'High', 'Completed', CURRENT_DATE - INTERVAL '1 day'),
(1, 'Review Network Protocols Chapter 4', 'Read slides on TCP/IP, UDP, and socket programming concepts.', 'Low', 'Pending', CURRENT_DATE + INTERVAL '7 days'),
(1, 'Web Design Wireframes Submission', 'Create Figma mockups for the responsive student portal.', 'Medium', 'Pending', CURRENT_DATE - INTERVAL '2 days'), -- Overdue task
(1, 'Algorithm Analysis Problem Set', 'Solve dynamic programming problems and analyze Big-O time complexity.', 'High', 'Pending', CURRENT_DATE + INTERVAL '4 days');

-- Insert Sample Tasks for Dara (user_id = 2) to demonstrate ownership isolation
INSERT INTO tasks (user_id, title, description, priority, status, due_date) VALUES
(2, 'Dara Private Study Notes', 'Read Operating Systems memory management chapter.', 'Low', 'Pending', CURRENT_DATE + INTERVAL '3 days'),
(2, 'Software Engineering Case Study', 'Prepare Agile sprint backlog and user stories.', 'High', 'Completed', CURRENT_DATE - INTERVAL '3 days');
