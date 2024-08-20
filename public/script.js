document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const fileChosen = document.getElementById("file-chosen");
    const form = document.getElementById("pdf-form");
    const message = document.getElementById("message");

    fileInput.addEventListener("change", function () {
        const files = fileInput.files;
        if (files.length === 0) {
            fileChosen.textContent = "No file chosen";
        } else if (files.length < 2 || files.length > 5) {
            message.textContent = "Please select 2 to 5 PDF files.";
            fileChosen.textContent = "Invalid number of files";
        } else {
            message.textContent = "";
            fileChosen.textContent = `${files.length} file(s) selected`;
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const files = fileInput.files;

        if (files.length < 2 || files.length > 5) {
            message.textContent = "Please select between 2 to 5 PDF files.";
        } else {
            message.textContent = "Merging PDFs...";
        }
    });
});