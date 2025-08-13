document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".logo-card");

  // Load votes
  fetch("./netlify/functions/get-votes.js")
    .then(res => res.json())
    .then(data => {
      cards.forEach(card => {
        const id = card.dataset.id;
        const voteSpan = card.querySelector(".votes");
        voteSpan.textContent = data[id] || 0;
      });
    });

  // Upvote logic
  cards.forEach(card => {
    const id = card.dataset.id;
    const voteSpan = card.querySelector(".votes");

    card.querySelector(".upvote-btn").addEventListener("click", () => {
      fetch("./netlify/functions/upvote.js", {
        method: "POST",
        body: JSON.stringify({ id }),
      })
        .then(res => res.json())
        .then(data => {
          voteSpan.textContent = data.votes;
        });
    });
  });
});
