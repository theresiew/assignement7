// ─── State ───────────────────────────────────────────────────────────────────
let score = 0;
const likedPosts = new Set();

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const searchBar     = document.querySelector('#searchBar');
const scoreValue    = document.querySelector('#scoreValue');
const backToTopBtn  = document.querySelector('#backToTop');
const tags          = document.querySelectorAll('.tag');
const posts         = document.querySelectorAll('.post');
const blogTitle     = document.querySelector('#blogTitle');

// ─── Toast notification ───────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ─── Score ────────────────────────────────────────────────────────────────────
function updateScore(amount = 1) {
    score += amount;
    scoreValue.innerText = score;
    scoreValue.classList.toggle('gold', score >= 10);

    // Pulse animation on score
    scoreValue.classList.remove('score-pulse');
    void scoreValue.offsetWidth; // reflow
    scoreValue.classList.add('score-pulse');
}

// ─── Search ───────────────────────────────────────────────────────────────────
if (searchBar) {
    searchBar.addEventListener('input', function () {
        const term = this.value.toLowerCase().trim();
        posts.forEach(post => {
            const match = term === '' || post.innerText.toLowerCase().includes(term);
            post.classList.toggle('hidden', !match);
        });
    });
}

// ─── Like buttons ─────────────────────────────────────────────────────────────
document.querySelectorAll('.like-btn').forEach(function (button, index) {
    button.addEventListener('click', function () {
        if (likedPosts.has(index)) return; // prevent double-liking
        likedPosts.add(index);

        // Update button appearance
        this.classList.add('liked');
        const icon = this.querySelector('.like-icon');
        const label = this.querySelector('.like-label');
        if (icon) icon.style.filter = 'invert(35%) sepia(100%) saturate(600%) hue-rotate(340deg)';
        if (label) label.textContent = 'Liked!';

        updateScore();
        showToast('You liked this post! +1 engagement point 🎉');
    });
});

// ─── Tag filtering ────────────────────────────────────────────────────────────
tags.forEach(function (tag) {
    tag.addEventListener('click', function () {
        const tagName = this.getAttribute('data-tag');

        // Highlight active tag
        tags.forEach(t => t.classList.remove('tag-active'));
        this.classList.add('tag-active');

        if (blogTitle) {
            blogTitle.innerHTML = `Jane's<br>${tagName.toUpperCase()} BLOG`;
        }

        posts.forEach(function (post) {
            const postTags = post.getAttribute('data-tags') || '';
            post.classList.toggle('hidden', !postTags.includes(tagName));
        });

        updateScore();
    });
});

// ─── Back to top ──────────────────────────────────────────────────────────────
if (backToTopBtn) {
    window.addEventListener('scroll', function () {
        backToTopBtn.classList.toggle('hidden', window.scrollY < 200);
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Subscribe buttons (hero + sidebar) ───────────────────────────────────────
function handleSubscribe(emailInput) {
    const email = emailInput ? emailInput.value.trim() : '';

    // Hero button has no email field — open a modal instead
    if (!emailInput) {
        openSubscribeModal();
        return;
    }

    if (!email) {
        showToast('Please enter your e-mail address.', 'error');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid e-mail address.', 'error');
        emailInput.focus();
        return;
    }

    // Simulate sending (replace with real API call if needed)
    emailInput.value = '';
    updateScore(3);
    showToast(`🎉 You're subscribed! Welcome to Jane's world, ${email}`);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sidebar subscribe button
const sidebarSubscribeBtn = document.querySelector('.subscribe-btn');
const sidebarEmailInput   = document.querySelector('.widget-content input[type="email"]');

if (sidebarSubscribeBtn) {
    sidebarSubscribeBtn.addEventListener('click', function () {
        handleSubscribe(sidebarEmailInput);
    });

    // Also allow Enter key
    if (sidebarEmailInput) {
        sidebarEmailInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') handleSubscribe(sidebarEmailInput);
        });
    }
}

// Hero subscribe button → opens modal
const heroSubscribeBtn = document.querySelector('.subscribe-hero');
if (heroSubscribeBtn) {
    heroSubscribeBtn.addEventListener('click', function () {
        openSubscribeModal();
    });
}

// ─── Subscribe modal ──────────────────────────────────────────────────────────
function openSubscribeModal() {
    // Remove any existing modal
    document.querySelector('.subscribe-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'subscribe-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-box">
            <button class="modal-close" aria-label="Close">✕</button>
            <h2>Stay in the Loop</h2>
            <p>Get Jane's latest fashion picks delivered straight to your inbox.</p>
            <input type="email" class="modal-email" placeholder="your@email.com" autocomplete="email">
            <button class="modal-subscribe-btn">Subscribe Now</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Focus email field
    const modalEmail = modal.querySelector('.modal-email');
    setTimeout(() => modalEmail.focus(), 100);

    // Close handlers
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    // Subscribe action
    modal.querySelector('.modal-subscribe-btn').addEventListener('click', function () {
        const email = modalEmail.value.trim();
        if (!email) { showToast('Please enter your e-mail.', 'error'); modalEmail.focus(); return; }
        if (!isValidEmail(email)) { showToast('Please enter a valid e-mail.', 'error'); modalEmail.focus(); return; }
        closeModal();
        updateScore(3);
        showToast(`🎉 Subscribed! Welcome, ${email}`);
    });

    modalEmail.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') modal.querySelector('.modal-subscribe-btn').click();
        if (e.key === 'Escape') closeModal();
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
    });

    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeModal() {
    const modal = document.querySelector('.subscribe-modal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(() => modal.remove(), 300);
}

// ─── Comment forms ────────────────────────────────────────────────────────────
posts.forEach(function (post) {
    const footer = post.querySelector('.post-footer');
    if (!footer) return;

    // Inject comment toggle button
    const commentToggle = document.createElement('button');
    commentToggle.className = 'comment-toggle-btn';
    commentToggle.textContent = '💬 Add Comment';
    footer.after(commentToggle);

    // Comment form (hidden initially)
    const commentForm = document.createElement('div');
    commentForm.className = 'comment-form hidden';
    commentForm.innerHTML = `
        <input type="text"  class="cf-name"    placeholder="Your name"    maxlength="50">
        <textarea           class="cf-message"  placeholder="Write a comment..." rows="3" maxlength="300"></textarea>
        <button class="cf-submit">Post Comment</button>
    `;
    commentToggle.after(commentForm);

    commentToggle.addEventListener('click', function () {
        commentForm.classList.toggle('hidden');
        commentToggle.textContent = commentForm.classList.contains('hidden')
            ? '💬 Add Comment'
            : '✕ Cancel';
    });

    commentForm.querySelector('.cf-submit').addEventListener('click', function () {
        const name = commentForm.querySelector('.cf-name').value.trim();
        const msg  = commentForm.querySelector('.cf-message').value.trim();

        if (!name) { showToast('Please enter your name.', 'error'); return; }
        if (!msg)  { showToast('Please write something!', 'error'); return; }

        // Build comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment comment-new';
        newComment.innerHTML = `
            <div class="comment-avatar-placeholder">${name.charAt(0).toUpperCase()}</div>
            <div class="comment-content">
                <h4>${escapeHtml(name)} <span>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></h4>
                <p>${escapeHtml(msg)}</p>
            </div>
        `;
        commentForm.after(newComment);

        // Update reply count
        const countEl = post.querySelector('.replies .count');
        if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1;

        // Reset form
        commentForm.querySelector('.cf-name').value = '';
        commentForm.querySelector('.cf-message').value = '';
        commentForm.classList.add('hidden');
        commentToggle.textContent = '💬 Add Comment';

        updateScore(2);
        showToast('Comment posted! +2 engagement points 🗨️');
    });
});

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}