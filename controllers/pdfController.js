const fs = require("fs");
const path = require("path");

// Dynamic import
const PDFMerger = async () => await import("pdf-merger-js");

exports.mergePDFs = async (req, res) => {
  try {
    const PDFMergerClass = await PDFMerger();
    const merger = new PDFMergerClass.default();

    // Add each uploaded file to the merger
    for (let i = 0; i < req.files.length; i++) {
      await merger.add(req.files[i].path);
    }

    // Define the output path in the public/merged-pdfs directory
    const outputFilePath = path.join(
      __dirname,
      "../public/merged-pdfs",
      `merged-${Date.now()}.pdf`
    );

    // Save the merged PDF
    await merger.save(outputFilePath);

    // Optionally, you could redirect to the history.html or send a response
    res.status(200).json({
      message: "PDFs merged successfully",
      filePath: `/merged-pdfs/${path.basename(outputFilePath)}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error merging PDFs" });
  }
};
