// Import Express
const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON (optional, depending on your needs)
app.use(express.json());

// Serve static files from the `Bankist-main` folder
app.use(express.static(path.join(__dirname, '../Bankist-main')));

// Define the path to the `index.html` file
const INDEX_PATH = path.join(__dirname, '..', 'index.html'); // Adjust path for one level up

// Define the root route
app.get('/', (req, res) => {
  res.sendFile(INDEX_PATH);
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

