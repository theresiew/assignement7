// --- Dynamic Search ---
const searchInput = document.querySelector('#searchInput');
const posts = document.querySelectorAll('article');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    posts.forEach(post => {
        const text = post.innerText.toLowerCase();
        post.style.display = text.includes(query) ? '' : 'none';
    });
});

// --- Engagement Score ---
let score = 0;
const scoreCounter = document.querySelector('#scoreCounter');
const likeButtons = document.querySelectorAll('.like-btn');

function updateScore() {
    score++;
    scoreCounter.innerText = `Score: ${score}`;
    if (score >= 10) scoreCounter.style.color = 'gold';
}

likeButtons.forEach(btn => btn.addEventListener('click', updateScore));

// --- Tag Filtering ---
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
    tag.addEventListener('click', () => {
        const selectedTag = tag.dataset.tag;
        posts.forEach(post => {
            const postTags = post.dataset.tags.split(',');
            post.style.display = postTags.includes(selectedTag) ? '' : 'none';
        });
    });
});

// --- Back to Top ---
const backToTop = document.querySelector('#backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('hidden', window.scrollY < 200);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
