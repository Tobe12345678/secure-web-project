// Import express
const express = require('express');
const path = require('path');
const app = express();

// Code to serve static files from the `Bankist-main` folder
app.use(express.static(path.join(__dirname, '../Bankist-main')));

// Code to Define the path to the `index.html` file
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

// Code to define the root route
app.get('/', (req, res) => {
  res.sendFile(INDEX_PATH);
});

// Code to start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

