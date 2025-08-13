document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".logo-card");

  // Load current votes from serverless function
  fetch("/.netlify/functions/get-votes")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch votes");
      return res.json();
    })
    .then(data => {
      cards.forEach(card => {
        const id = card.dataset.id;
        const voteSpan = card.querySelector(".votes");
        voteSpan.textContent = data[id] || 0;
      });
    })
    .catch(err => {
      console.error("Error loading votes:", err);
    });

  // Set up click handlers to send upvotes
  cards.forEach(card => {
    const id = card.dataset.id;
    const voteSpan = card.querySelector(".votes");
    const btn = card.querySelector(".upvote-btn");

    btn.addEventListener("click", () => {
      fetch("/.netlify/functions/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to upvote");
          return res.json();
        })
        .then(data => {
          voteSpan.textContent = data.votes;
        })
        .catch(err => {
          console.error("Upvote failed:", err);
        });
    });
  });
});
