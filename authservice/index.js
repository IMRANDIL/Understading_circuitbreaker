const express = require('express');
const app = express();
const PORT = 3001;

app.get('/authenticate', (req, res) => {
  // Dummy authentication logic
  const isAuthenticated = Math.random() < 0.8; // 50% chance of success
  if (isAuthenticated) {
    res.send('Authentication successful');
  } else {
    res.status(401).send('Authentication failed');
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service listening at http://localhost:${PORT}`);
});
