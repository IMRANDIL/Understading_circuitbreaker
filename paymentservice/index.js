// paymentService.js
const express = require('express');
const app = express();
const PORT = 3002;

// Endpoint to process payments
app.get('/processPayment', (req, res) => {
  const { userId, amount } = req.query;
  console.log(`Processing payment for user ${userId} with amount $${amount}`);
  // Simulate payment processing
  res.json({ success: true, message: 'Payment processed successfully' });
});

app.listen(PORT, () => {
  console.log(`PaymentService listening at http://localhost:${PORT}`);
});
