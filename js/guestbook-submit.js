document.getElementById("guestbook").addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      message: document.getElementById("message").value
    })
  });

  loadComments();
});

async function loadComments() {
  const response = await fetch("/api/comments");
  const comments = await response.json();

  document.getElementById("comments").innerHTML =
    comments.map(c => `
      <div>
        <strong>${c.name}</strong><br>
        ${c.message}
      </div>
    `).join("");
}

loadComments();