document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-input");
  const message = document.getElementById("message");
  const form = document.getElementById("pdf-merger-form");

  fileInput.addEventListener("change", function () {
    const files = fileInput.files;
    if (files.length === 0) {
      message.textContent = "No file chosen";
    } else if (files.length < 2 || files.length > 5) {
      message.textContent = "Please select between 2 to 5 PDF files.";
    } else {
      message.textContent = `${files.length} file(s) selected`;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const files = fileInput.files;

    if (files.length < 2 || files.length > 5) {
      message.textContent = "Please select between 2 to 5 PDF files.";
      return;
    }

    message.textContent = "Merging PDFs...";

    const formData = new FormData(form);

    fetch("/merge-pdfs", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.filePath) {
          // Create a link element to trigger the download
          const a = document.createElement("a");
          a.href = data.filePath;
          a.download = data.filePath.split("/").pop(); // Extract file name
          document.body.appendChild(a);
          a.click();
          a.remove();
          message.textContent = "PDFs merged successfully";
        } else {
          message.textContent = "Error merging PDFs";
        }
      })
      .catch((err) => {
        console.error(err);
        message.textContent = "Error merging PDFs";
      });
  });
});
