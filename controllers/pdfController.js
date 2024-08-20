exports.mergePDFs = async (req, res) => {
  try {
    console.log("Files received:", req.files); // Log received files

    const PDFMergerClass = await PDFMerger();
    const merger = new PDFMergerClass.default();

    // Add each uploaded file to the merger
    for (let i = 0; i < req.files.length; i++) {
      console.log("Adding file to merger:", req.files[i].path);
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
    console.log("Merged PDF saved to:", outputFilePath);

    res.status(200).json({
      message: "PDFs merged successfully",
      filePath: `/merged-pdfs/${path.basename(outputFilePath)}`,
    });
  } catch (err) {
    console.error("Error during PDF merge:", err); // Log any errors
    res.status(500).json({ message: "Error merging PDFs" });
  }
};
