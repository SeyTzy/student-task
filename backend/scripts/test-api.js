const http = require('http');

const PORT = 5000;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Backend API Test Suite ---');

  // 1. Health check
  const health = await request({ path: '/api/health', method: 'GET' });
  console.log('1. Health check:', health.status === 200 ? 'PASS' : 'FAIL', health.body);

  // 2. Login seed user Sophea
  const loginRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: 'sophea@example.com', password: 'password123' }
  );
  console.log('2. Login Sophea:', loginRes.status === 200 ? 'PASS' : 'FAIL', loginRes.body.user);
  const token = loginRes.body.token;

  // 3. Get Me
  const meRes = await request({
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('3. GET /api/auth/me:', meRes.status === 200 ? 'PASS' : 'FAIL', meRes.body.user);

  // 4. Register new user
  const uniqueEmail = `student_${Date.now()}@example.com`;
  const regRes = await request(
    { path: '/api/auth/register', method: 'POST' },
    { name: 'Kosal Sen', email: uniqueEmail, password: 'password123' }
  );
  console.log('4. Register new user:', regRes.status === 201 ? 'PASS' : 'FAIL', regRes.body.user);
  const newUserToken = regRes.body.token;

  // 5. Test duplicate registration
  const dupRes = await request(
    { path: '/api/auth/register', method: 'POST' },
    { name: 'Duplicate User', email: uniqueEmail, password: 'password123' }
  );
  console.log('5. Duplicate registration rejection:', dupRes.status === 409 ? 'PASS' : 'FAIL');

  // 6. Test invalid login
  const invalidLogin = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: uniqueEmail, password: 'wrongpassword' }
  );
  console.log('6. Invalid login rejection:', invalidLogin.status === 401 ? 'PASS' : 'FAIL');

  // 7. Dashboard Stats for Sophea
  const statsRes = await request({
    path: '/api/tasks/stats/summary',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('7. Dashboard Stats for Sophea:', statsRes.status === 200 ? 'PASS' : 'FAIL', statsRes.body.stats);

  // 8. Get Tasks with search & filter
  const tasksRes = await request({
    path: '/api/tasks?search=Midterm&status=In%20Progress',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('8. Search & filter tasks:', tasksRes.status === 200 && tasksRes.body.tasks.length === 1 ? 'PASS' : 'FAIL', `Found ${tasksRes.body.tasks?.length} task(s)`);

  // 9. Create a new task
  const createRes = await request(
    {
      path: '/api/tasks',
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    },
    {
      title: 'Automated Test Task',
      description: 'Verifying task creation endpoint',
      priority: 'High',
      status: 'Pending',
      due_date: '2026-11-01',
    }
  );
  console.log('9. Create task:', createRes.status === 201 ? 'PASS' : 'FAIL', createRes.body.task?.id);
  const createdTaskId = createRes.body.task.id;

  // 10. Get task by ID
  const getByIdRes = await request({
    path: `/api/tasks/${createdTaskId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('10. Get task by ID:', getByIdRes.status === 200 && getByIdRes.body.task.title === 'Automated Test Task' ? 'PASS' : 'FAIL');

  // 11. Update task
  const updateRes = await request(
    {
      path: `/api/tasks/${createdTaskId}`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    },
    {
      title: 'Automated Test Task (Updated)',
      description: 'Updated description',
      priority: 'Medium',
      status: 'In Progress',
      due_date: '2026-11-05',
    }
  );
  console.log('11. Update task:', updateRes.status === 200 && updateRes.body.task.title.includes('Updated') ? 'PASS' : 'FAIL');

  // 12. Patch status
  const patchRes = await request(
    {
      path: `/api/tasks/${createdTaskId}/status`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    },
    { status: 'Completed' }
  );
  console.log('12. Patch status to Completed:', patchRes.status === 200 && patchRes.body.task.status === 'Completed' ? 'PASS' : 'FAIL');

  // 13. Ownership test: new user cannot access Sophea's task
  const forbiddenAccess = await request({
    path: `/api/tasks/${createdTaskId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${newUserToken}` },
  });
  console.log('13. Ownership isolation check:', forbiddenAccess.status === 404 ? 'PASS' : 'FAIL');

  // 14. Delete task
  const deleteRes = await request({
    path: `/api/tasks/${createdTaskId}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('14. Delete task:', deleteRes.status === 200 ? 'PASS' : 'FAIL');

  console.log('--- All Backend API Tests Completed! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
