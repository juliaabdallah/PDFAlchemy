const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/merged-pdfs"));
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

    // Add each uploaded file to the merger
    for (const file of req.files) {
      console.log("Adding file to merger:", file.path);
      await merger.add(file.path);
    }

    const outputFilePath = path.join(
      __dirname,
      "public/merged-pdfs",
      `merged-${Date.now()}.pdf`
    );

    // Save the merged PDF
    await merger.save(outputFilePath);
    console.log("Merged PDF saved to:", outputFilePath);

    // Send the merged PDF file as a response to trigger download
    res.download(outputFilePath, (err) => {
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
    console.error("Detailed error:", err);
    res.status(500).json({ message: "Error merging PDFs" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
