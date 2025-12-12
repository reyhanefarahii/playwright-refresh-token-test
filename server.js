const express = require('express');
const app = express();
app.use(express.json());

// Login API
app.post('/auth/login', (req, res) => {
  res.json({
    accessToken: 'expired-access-token',
    refreshToken: 'refresh-token-abc'
  });
});

// First call returns 401, second call returns profile
let expired = true;
app.get('/user/profile', (req, res) => {
  if (expired) {
    expired = false;
    return res.status(401).json({
      statusCode: 401,
      error: "TokenExpired",
      message: "Access token expired"
    });
  }

  res.json({
    name: 'Arash',
    email: 'arash@example.com',
    age: 30
  });
});

// Refresh API
app.post('/auth/refresh', (req, res) => {
  res.json({
    accessToken: 'new-access-token-456'
  });
});

app.listen(3000, () => {
  console.log('Mock API running at http://localhost:3000');
});
