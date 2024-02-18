const express = require('express');
const app = express();
const PORT = 3002;

app.get('/orders', (req, res) => {
  // Dummy order retrieval logic
  const orders = ['Order 1', 'Order 2', 'Order 3'];
  res.send(orders);
});

app.listen(PORT, () => {
  console.log(`Order Service listening at http://localhost:${PORT}`);
});
