
var score = 0;
var likedPosts = new Set();


var searchBar    = document.querySelector('#searchBar');
var scoreValue   = document.querySelector('#scoreValue');
var backToTopBtn = document.querySelector('#backToTop');
var tags         = document.querySelectorAll('.tag');
var posts        = document.querySelectorAll('.post');
var blogTitle    = document.querySelector('#blogTitle');


function showToast(message, type) {
    type = type || 'success';
    document.querySelectorAll('.toast').forEach(function(t) { t.remove(); });

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML =
        '<span class="toast-icon">' + (type === 'success' ? '&#10003;' : '&#10005;') + '</span>' +
        '<span>' + message + '</span>';
    document.body.appendChild(toast);

    requestAnimationFrame(function() { toast.classList.add('toast-visible'); });

    setTimeout(function() {
        toast.classList.remove('toast-visible');
        setTimeout(function() { toast.remove(); }, 400);
    }, 3000);
}

function updateScore(amount) {
    amount = amount || 1;
    score += amount;
    scoreValue.innerText = score;
    scoreValue.classList.toggle('gold', score >= 10);

    scoreValue.classList.remove('score-pulse');
    void scoreValue.offsetWidth;
    scoreValue.classList.add('score-pulse');
}


if (searchBar) {
    searchBar.addEventListener('input', function() {
        var term = this.value.toLowerCase().trim();
        posts.forEach(function(post) {
            var match = term === '' || post.innerText.toLowerCase().includes(term);
            post.classList.toggle('hidden', !match);
        });
    });
}


document.querySelectorAll('.like-btn').forEach(function(button, index) {
    button.addEventListener('click', function() {
        if (likedPosts.has(index)) return;
        likedPosts.add(index);

        this.classList.add('liked');
        var icon  = this.querySelector('.like-icon');
        var label = this.querySelector('.like-label');
        if (icon)  icon.style.color = '#c62828';
        if (label) label.textContent = 'Liked!';

        updateScore(1);
        showToast('You liked this post! +1 engagement point');
    });
});

tags.forEach(function(tag) {
    tag.addEventListener('click', function() {
        var tagName = this.getAttribute('data-tag');

        tags.forEach(function(t) { t.classList.remove('tag-active'); });
        this.classList.add('tag-active');

        if (blogTitle) {
            blogTitle.innerHTML = "Jane's<br>" + tagName.toUpperCase() + ' BLOG';
        }

        posts.forEach(function(post) {
            var postTags = post.getAttribute('data-tags') || '';
            post.classList.toggle('hidden', !postTags.includes(tagName));
        });

        updateScore(1);
    });
});

if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('hidden', window.scrollY < 200);
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

var sidebarSubscribeBtn = document.querySelector('.subscribe-btn');
var sidebarEmailInput   = document.querySelector('.widget-content input[type="email"]');

if (sidebarSubscribeBtn) {
    sidebarSubscribeBtn.addEventListener('click', function() {
        handleSidebarSubscribe();
    });
}

if (sidebarEmailInput) {
    sidebarEmailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleSidebarSubscribe();
    });
}

function handleSidebarSubscribe() {
    var email = sidebarEmailInput ? sidebarEmailInput.value.trim() : '';

    if (!email) {
        showToast('Please enter your e-mail address.', 'error');
        if (sidebarEmailInput) sidebarEmailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid e-mail address.', 'error');
        if (sidebarEmailInput) sidebarEmailInput.focus();
        return;
    }

    sidebarEmailInput.value = '';
    updateScore(3);
    showToast("You're subscribed! Welcome to Jane's world!");
}

var heroSubscribeBtn = document.querySelector('.subscribe-hero');
if (heroSubscribeBtn) {
    heroSubscribeBtn.addEventListener('click', function() {
        openSubscribeModal();
    });
}

function openSubscribeModal() {
    var existing = document.querySelector('.subscribe-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.className = 'subscribe-modal';
    modal.innerHTML =
        '<div class="modal-backdrop"></div>' +
        '<div class="modal-box">' +
            '<button class="modal-close" aria-label="Close">&#10005;</button>' +
            '<h2>Stay in the Loop</h2>' +
            '<p>Get Jane\'s latest fashion picks delivered straight to your inbox.</p>' +
            '<input type="email" class="modal-email" placeholder="your@email.com" autocomplete="email">' +
            '<button class="modal-subscribe-btn">Subscribe Now</button>' +
        '</div>';
    document.body.appendChild(modal);

    var modalEmail = modal.querySelector('.modal-email');
    setTimeout(function() { modalEmail.focus(); }, 100);

    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    modal.querySelector('.modal-subscribe-btn').addEventListener('click', function() {
        var email = modalEmail.value.trim();
        if (!email) {
            showToast('Please enter your e-mail.', 'error');
            modalEmail.focus();
            return;
        }
        if (!isValidEmail(email)) {
            showToast('Please enter a valid e-mail.', 'error');
            modalEmail.focus();
            return;
        }
        closeModal();
        updateScore(3);
        showToast("You're subscribed! Welcome to Jane's world!");
    });

    modalEmail.addEventListener('keydown', function(e) {
        if (e.key === 'Enter')  modal.querySelector('.modal-subscribe-btn').click();
        if (e.key === 'Escape') closeModal();
    });

    function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    }
    document.addEventListener('keydown', escHandler);

    requestAnimationFrame(function() { modal.classList.add('modal-visible'); });
}

function closeModal() {
    var modal = document.querySelector('.subscribe-modal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    setTimeout(function() { modal.remove(); }, 300);
}


posts.forEach(function(post) {
    var footer = post.querySelector('.post-footer');
    if (!footer) return;

    var commentToggle = document.createElement('button');
    commentToggle.className = 'comment-toggle-btn';
    commentToggle.textContent = 'Add Comment';
    footer.after(commentToggle);

    var commentForm = document.createElement('div');
    commentForm.className = 'comment-form hidden';
    commentForm.innerHTML =
        '<input type="text" class="cf-name" placeholder="Your name" maxlength="50">' +
        '<textarea class="cf-message" placeholder="Write a comment..." rows="3" maxlength="300"></textarea>' +
        '<button class="cf-submit">Post Comment</button>';
    commentToggle.after(commentForm);

    commentToggle.addEventListener('click', function() {
        commentForm.classList.toggle('hidden');
        this.textContent = commentForm.classList.contains('hidden') ? 'Add Comment' : 'Cancel';
    });

    commentForm.querySelector('.cf-submit').addEventListener('click', function() {
        var name = commentForm.querySelector('.cf-name').value.trim();
        var msg  = commentForm.querySelector('.cf-message').value.trim();

        if (!name) { showToast('Please enter your name.', 'error'); return; }
        if (!msg)  { showToast('Please write something!', 'error'); return; }

        var now = new Date().toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        var newComment = document.createElement('div');
        newComment.className = 'comment comment-new';
        newComment.innerHTML =
            '<div class="comment-avatar-placeholder">' + escapeHtml(name.charAt(0).toUpperCase()) + '</div>' +
            '<div class="comment-content">' +
                '<h4>' + escapeHtml(name) + ' <span>' + now + '</span></h4>' +
                '<p>' + escapeHtml(msg) + '</p>' +
            '</div>';
        commentForm.after(newComment);

        var countEl = post.querySelector('.replies .count');
        if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1;

        commentForm.querySelector('.cf-name').value    = '';
        commentForm.querySelector('.cf-message').value = '';
        commentForm.classList.add('hidden');
        commentToggle.textContent = 'Add Comment';

        updateScore(2);
        showToast('Comment posted! +2 engagement points');
    });
});

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}