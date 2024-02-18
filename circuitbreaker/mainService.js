const axios = require('axios');

// Define URLs for the auth and order services
const authServiceUrl = 'http://localhost:3001/authenticate';
const orderServiceUrl = 'http://localhost:3002/orders';

// Define circuit breaker options
const circuitBreakerOptions = {
  timeout: 5000,        // Request timeout in milliseconds
  errorThreshold: 50,   // Number of consecutive failures to trip the circuit
  resetTimeout: 30000   // Time in milliseconds to wait before attempting to re-establish the connection
};

// Function to authenticate user with circuit breaker
async function authenticateUser() {
  try {
    const response = await circuitBreaker(authServiceUrl);
    console.log('Authentication:', response.data);
    return true;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return false;
  }
}

// Function to retrieve orders with circuit breaker
async function retrieveOrders() {
  try {
    const response = await circuitBreaker(orderServiceUrl);
    console.log('Orders:', response.data);
  } catch (error) {
    console.error('Error retrieving orders:', error);
  }
}

// Circuit breaker implementation
function circuitBreaker(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Call microservices periodically
setInterval(async () => {
  const isAuthenticated = await authenticateUser();
  if (isAuthenticated) {
    retrieveOrders();
  } else {
    console.log('Skipping order retrieval due to authentication failure.');
  }
}, 5000);
