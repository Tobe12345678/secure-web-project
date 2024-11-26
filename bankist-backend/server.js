// Backend: app.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // To parse JSON request bodies

// Example endpoint to fetch account details
app.get("/api/accounts", (req, res) => {
  const accounts = [
    {
      owner: "Guna Palanivel",
      movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
      interestRate: 1.2,
      pin: 8052,
    },
    {
      owner: "Jonas Schmedtmann",
      movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
      interestRate: 1.5,
      pin: 5252,
    },
  ];
  res.status(200).json(accounts);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Endpoint for transferring money
app.post("/api/transfer", (req, res) => {
  const { sender, receiver, amount } = req.body;

  if (!sender || !receiver || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Perform transfer logic (mock example)
  console.log(`Transferred ${amount} from ${sender} to ${receiver}`);
  res.status(200).json({ message: "Transfer successful" });
});