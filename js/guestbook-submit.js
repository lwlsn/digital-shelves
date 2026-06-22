//Connect supabase
const supabaseClient = window.supabase.createClient(
    "https://hznxbijgoswqagdiaoln.supabase.co",
    "sb_publishable_LexfF2CtA5UfB-8vLK3j_Q_FE0_k00M"
);

// Reading Comments from DB and render them: 
async function loadComments() {
  const {data, error} = await supabaseClient
      .from("comments")
      .select("*")
      .order("created_at", {ascending: false});

      if (error) {
        console.error(error)
        return;
      }

      const container = document.getElementById("comments");
      container.innerHTML = data.map(comment => `
        <div class="comment">
            <strong>${escapeHtml(comment.name)}</strong>
            <p>${escapeHtml(comment.message)}</p>
            ${comment.music_url ? `<a href="${escapeHtml(comment.music_url)}" target="_blank">🎵 ${escapeHtml(comment.music_url)}</a>` : ""}
            <small>${new Date(comment.created_at).toLocaleDateString()}</small>
        </div>
        `).join("")
      
}


// Submit a new comment
async function submitComment(name, message, music_url) {
    const { error } = await supabaseClient
        .from("comments")
        .insert([{ name, message, music_url }]);

    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

// Sanitise user inputs before injecting into html
function escapeHtml(str) {
    if (!str) return ""
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// Wire up the form
document.getElementById("guestbook").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name     = document.getElementById("name").value.trim();
    const message  = document.getElementById("message").value.trim();
    const music_url = document.getElementById("music_url")?.value.trim() ?? "";

    if (!name || !message) return;

    const btn = e.target.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Submitting…";

    const ok = await submitComment(name, message, music_url);

    if (ok) {
        e.target.reset();
        await loadComments();
    }

    btn.disabled = false;
    btn.textContent = "Submit";
});

// Load comments on page load
loadComments();