// Import express
const express = require('express');
const path = require('path');
const app = express();
const bcrypt = require("bcryptjs")
const session = require("express-session")
const bodyParser = require("body-parser")
const joi = require("joi")

// for the Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for Session Management
app.use(
  session({
    secret: "your_secret_key", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

// Mock Database
const users = [];
const accounts = [];

// for password hashing (Registration endpoint)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // code to validate input
  if (!username || !password) return res.status(400).send("Invalid input");

  // code to Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save to mock database
  users.push({ username, password: hashedPassword });
  res.status(201).send("User registered successfully");
});

// still password hashing (but Login endpoint)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // code to Find user
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).send("User not found");

  // code to Validate password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).send("Invalid credentials");

  // Set session
  req.session.user = { username };
  res.status(200).send("Login successful");
});

// Session management codes (session middleware)
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

// Session management contd. (Logout Endpoint)
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Could not log out");
    res.status(200).send("Logout successful");
  });
});

//  Code for Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong! Please try again later.");
});

// Code for Input Validation (Validation Schemas)
const transferSchema = Joi.object({
  amount: Joi.number().positive().required(),
  recipient: Joi.string().required(),
});

const loanSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

// Input validation contd. (For Transfer)
app.post("/transfer", isAuthenticated, (req, res) => {
  const { error } = transferSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { amount, recipient } = req.body;

  // Check if recipient exists
  const recipientAccount = accounts.find((acc) => acc.username === recipient);
  if (!recipientAccount) return res.status(400).send("Recipient not found");

  // Deduct from sender and add to recipient
  const senderAccount = accounts.find((acc) => acc.username === req.session.user.username);
  if (senderAccount.balance < amount) return res.status(400).send("Insufficient balance");

  senderAccount.balance -= amount;
  recipientAccount.balance += amount;
  res.status(200).send("Transfer successful");
});

// Input validation contd. (For loan)
app.post("/loan", isAuthenticated, (req, res) => {
  const { error } = loanSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { amount } = req.body;

  // Add loan amount to user account
  const userAccount = accounts.find((acc) => acc.username === req.session.user.username);
  userAccount.balance += amount;

  res.status(200).send("Loan approved");
});

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

