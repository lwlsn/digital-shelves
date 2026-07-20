//Old supabase - remove
// const supabaseClient = window.supabase.createClient(
//     "https://hznxbijgoswqagdiaoln.supabase.co",
//     "sb_publishable_LexfF2CtA5UfB-8vLK3j_Q_FE0_k00M"
// );


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "__FIREBASE_API_KEY__",
  authDomain: "digitalshelves-guestbook.firebaseapp.com",
  projectId: "digitalshelves-guestbook",
  storageBucket: "digitalshelves-guestbook.firebasestorage.app",
  messagingSenderId: "832167843299",
  appId: "1:832167843299:web:11bc0ce893a764fad93cd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const commentsRef = collection(db, "comments");

// Reading Comments from DB and render them: 
async function loadComments() {
  let snapshot;
  try {
    const q = query(commentsRef, orderBy("created_at", "desc"));
    snapshot = await getDocs(q);
  } catch (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("comments");
  container.innerHTML = snapshot.docs.map(doc => {
    const comment = doc.data();
    const createdAt = comment.created_at?.toDate
      ? comment.created_at.toDate()
      : new Date();

    return `
      <div class="comment">
          <strong>${escapeHtml(comment.name)}</strong>
          <p>${escapeHtml(comment.message)}</p>
          ${comment.music_url ? `<a href="${escapeHtml(comment.music_url)}" target="_blank">🎵 ${escapeHtml(comment.music_url)}</a>` : ""}
          <small>${createdAt.toLocaleDateString()}</small>
      </div>
    `;
  }).join("");
}


// Submit a new comment
async function submitComment(name, message, music_url) {
    try {
        await addDoc(commentsRef, {
            name,
            message,
            music_url,
            created_at: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Sanitise user inputs before injecting into html
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Wire up the form
document.getElementById("guestbook").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
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
