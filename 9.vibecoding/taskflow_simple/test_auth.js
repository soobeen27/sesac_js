async function testAuth() {
  const url = 'http://localhost:3001/api/v1/auth/signup';
  const payload = {
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    name: 'TestUser',
  };

  console.log('Testing connection to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (e) {
    console.error('Connection failed:', e.message);
  }
}

testAuth();
