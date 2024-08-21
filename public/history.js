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
          <p>${item.originalFiles.join(", ")}</p>
          <p>${new Date(item.date).toLocaleString()}</p>
        `;
        historyList.appendChild(listItem);
      });
    })
    .catch((err) => {
      console.error("Error fetching history:", err);
    });
});
