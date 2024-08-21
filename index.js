const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define the schema for storing merge history
const historySchema = new mongoose.Schema({
  mergedFileName: String,
  originalFiles: [String],
  date: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create the 'merged-pdfs' directory if it doesn't exist
const mergedPdfsDir = path.join(__dirname, "public/merged-pdfs");
if (!fs.existsSync(mergedPdfsDir)) {
  fs.mkdirSync(mergedPdfsDir);
}

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mergedPdfsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Handle the merge PDF route
app.post("/merge-pdfs", upload.array("pdfs"), async (req, res) => {
  try {
    console.log("Files received:", req.files);

    const PDFMerger = (await import("pdf-merger-js")).default;
    const merger = new PDFMerger();

    const originalFiles = req.files.map(file => file.originalname);

    // Add each uploaded file to the merger
    for (const file of req.files) {
      console.log("Adding file to merger:", file.path);
      await merger.add(file.path);
    }

    const mergedFileName = `merged-${Date.now()}.pdf`;
    const outputFilePath = path.join(mergedPdfsDir, mergedFileName);

    // Save the merged PDF
    await merger.save(outputFilePath);
    console.log("Merged PDF saved to:", outputFilePath);

    // Save history to MongoDB
    const historyEntry = new History({
      mergedFileName,
      originalFiles,
    });
    await historyEntry.save();

    // Send the merged PDF file as a response to trigger download
    res.download(outputFilePath, mergedFileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error merging PDFs" });
      } else {
        // Optionally, delete the file after sending
        fs.unlink(outputFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting merged PDF:", unlinkErr);
          }
        });
      }
    });
  } catch (err) {
    console.error("Error during PDF merging:", err);
    res.status(500).json({ message: "Error merging PDFs" });
  }
});

// Handle the history request
app.get("/get-history", async (req, res) => {
  try {
    const history = await History.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
