const express = require("express");
const multer = require("multer");
const path = require("path");
const { mergePDFs } = require("./controllers/pdfController");
const connectDB = require("./database");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public'

// Updated multer configuration to save in public/merged-pdfs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/merged-pdfs"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Route to handle PDF merging
app.post("/merge-pdfs", upload.array("pdfs"), mergePDFs);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
