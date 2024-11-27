// Import Express
const express = require('express');
const app = express();

// Middleware to parse JSON (optional, depending on your needs)
app.use(express.json());

// Define the root route
app.get('/', (req, res) => {
  res.send('Hello, world! Your server is working.');
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

