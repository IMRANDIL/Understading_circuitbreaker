// mainService.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Circuit breaker configuration
const circuitBreakerOptions = {
  timeout: 5000,        // Request timeout in milliseconds
  errorThreshold: 3,    // Number of consecutive failures to trip the circuit
  resetTimeout: 10000   // Time in milliseconds to wait before attempting to re-establish the connection
};

// Circuit breaker state
let isCircuitOpen = false;
let consecutiveFailures = 0;
let lastFailureTime = null;
let failedService = null;

// Define service URLs
const userServiceUrl = 'http://localhost:3001/users';
const paymentServiceUrl = 'http://localhost:3002/processPayment';

// Function to get service name from URL
const getServiceName = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

// Endpoint to process user order (simulated)
app.get('/processOrder/:userId/:amount', async (req, res) => {
  const { userId, amount } = req.params;

  // Check if circuit is open
  if (isCircuitOpen) {
    const serviceName = getServiceName(failedService);
    res.status(500).json({ error: `Sorry, ${serviceName} service is down. Please try again later.` });
    return;
  }

  try {
    // Get user data
    const userData = await axios.get(userServiceUrl);
    const user = userData.data.find(user => user.id === parseInt(userId));

    // Process payment
    const paymentResult = await axios.get(paymentServiceUrl, {
      params: {
        userId,
        amount
      },
      timeout: circuitBreakerOptions.timeout
    });

    // If successful, reset circuit state
    isCircuitOpen = false;
    consecutiveFailures = 0;

    res.json({
      user,
      paymentResult: paymentResult.data
    });
  } catch (error) {
    // Increment consecutive failures
    consecutiveFailures++;
    failedService = error.config.url; // Set the failed service

    // If consecutive failures exceed threshold, open circuit
    if (consecutiveFailures >= circuitBreakerOptions.errorThreshold) {
      isCircuitOpen = true;
      lastFailureTime = Date.now();

      // Schedule resetting circuit after reset timeout
      setTimeout(() => {
        // Check if circuit has been open for reset timeout duration
        if (isCircuitOpen && Date.now() - lastFailureTime >= circuitBreakerOptions.resetTimeout) {
          isCircuitOpen = false;
          consecutiveFailures = 0;
        }
      }, circuitBreakerOptions.resetTimeout);
    }

    const serviceName = getServiceName(failedService);
    res.status(500).json({ error: `Sorry, ${serviceName} service is down. Please try again later.` });
  }
});

app.listen(PORT, () => {
  console.log(`UserOrderService listening at http://localhost:${PORT}`);
});
