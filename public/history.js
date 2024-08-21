document.addEventListener("DOMContentLoaded", function () {
  const historyList = document.querySelector(".history-list");

  fetch("/get-history")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      return response.json();
    })
    .then((history) => {
      history.forEach((item) => {
        const listItem = document.createElement("div");
        listItem.className = "history-item";
        listItem.innerHTML = `
          <p><strong>Original Files:</strong> ${item.originalFiles.join(", ")}</p>
          <p><strong>Date:</strong> ${new Date(item.date).toLocaleString()}</p>
          <a href="/merged-pdfs/${item.mergedFileName}" download>
            <button>Download</button>
          </a>
        `;
        historyList.appendChild(listItem);
      });
    })
    .catch((err) => {
      console.error("Error fetching history:", err);
    });
});
