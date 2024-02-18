// userService.js
const express = require('express');
const app = express();
const PORT = 3001;

// Dummy user data
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// Endpoint to retrieve users
app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`UserService listening at http://localhost:${PORT}`);
});
