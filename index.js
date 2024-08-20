const express = require("express");

const multer = require("multer"); // specifically for handling file uploads
const path = require("path"); // path kamen it like manipulates the file url so comes in handy for joining

const connectDB = require("./database.js");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public'

// Routes
app.use("/api/pdf", require("./routes/pdfRoutes"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
