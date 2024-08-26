// Import necessary modules
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

// Define port number and create an instance of express
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Connect to the db and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});