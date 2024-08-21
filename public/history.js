document.addEventListener("DOMContentLoaded", function () {
    fetch("/get-history")
      .then(response => response.json())
      .then(history => {
        const historyList = document.getElementById("history-list");
  
        history.forEach(item => {
          const historyItem = document.createElement("div");
          historyItem.classList.add("history-item");
  
          const fileInfo = document.createElement("p");
          fileInfo.textContent = `Filename: ${item.filename}, Original Files: ${item.originalFiles.join(', ')}, Merged At: ${new Date(item.mergedAt).toLocaleString()}`;
          historyItem.appendChild(fileInfo);
  
          const downloadButton = document.createElement("a");
          downloadButton.href = `/public/merged-pdfs/${item.filename}`;
          downloadButton.textContent = "Download";
          downloadButton.classList.add("download-btn");
          historyItem.appendChild(downloadButton);
  
          historyList.appendChild(historyItem);
        });
      })
      .catch(err => {
        console.error("Error fetching history:", err);
      });
  });
  