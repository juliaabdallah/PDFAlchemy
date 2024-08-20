const express = require("express");

const multer = require("multer"); // specifically for handling file uploads
const path = require("path"); // path kamen it like manipulates the file url so comes in handy for joining
const history = require("./models/mergedModel.js")
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

app.get('/history', async (req,res) => {
  try {
    const mergedFiles = await history.find().sort('-createdAt');
    res.render('history', {mergers});
  } catch (err) {
    res.status(500).send('Server Error');
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
