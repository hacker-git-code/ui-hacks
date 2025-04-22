// DOM Elements
let publishButton;
let postTextarea;
let attachmentPreview;
let characterCount;

// Constants
const MAX_POST_LENGTH = 280;
let currentUser = null;

// Initialize the posts functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    publishButton = document.querySelector('.btn-primary[data-component-name="<button />"]');
    postTextarea = document.querySelector('.post-textarea');
    attachmentPreview = document.getElementById('attachment-preview');
    characterCount = document.querySelector('.character-count');
    
    // Load current user data
    loadCurrentUser();
    
    // Initialize post creation
    initPostCreation();
});

// Load current user data
function loadCurrentUser() {
    // Try to get user from session or local storage
    const user = JSON.parse(sessionStorage.getItem('builderspace_user') || localStorage.getItem('builderspace_user'));
    
    if (user) {
        currentUser = user;
    } else {
        // For demo purposes, create a mock user if none exists
        currentUser = {
            id: 'user-123',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            avatar: '../images/avatar-placeholder.jpg'
        };
    }
}

// Initialize post creation
function initPostCreation() {
    if (!publishButton) return;
    
    // Update character count on input if textarea exists
    if (postTextarea) {
        postTextarea.addEventListener('input', updateCharacterCount);
        
        // Allow submission with Ctrl+Enter
        postTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                createPost();
            }
        });
    }
    
    // Handle post submission
    publishButton.addEventListener('click', createPost);
    
    // Initialize attachment buttons
    const attachmentButtons = document.querySelectorAll('.tool-btn');
    if (attachmentButtons) {
        attachmentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.tool;
                handleAttachment(type);
            });
        });
    }
}

// Update character count
function updateCharacterCount() {
    if (!postTextarea || !characterCount) return;
    
    const text = postTextarea.value;
    const remaining = MAX_POST_LENGTH - text.length;
    
    characterCount.textContent = remaining;
    
    // Update UI based on remaining characters
    if (remaining < 0) {
        characterCount.classList.add('limit');
        if (publishButton) publishButton.disabled = true;
    } else {
        characterCount.classList.remove('limit');
        if (publishButton) publishButton.disabled = text.length === 0;
    }
    
    // Adjust textarea height
    postTextarea.style.height = 'auto';
    postTextarea.style.height = postTextarea.scrollHeight + 'px';
}

// Handle attachments
function handleAttachment(type) {
    // In a real app, this would open a file picker or other UI
    if (!attachmentPreview) return;
    
    switch (type) {
        case 'image':
            attachmentPreview.innerHTML = `
                <div class="attachment single">
                    <img src="../images/placeholder-image.jpg" alt="Attachment">
                    <button class="remove-attachment"><i class="fas fa-times"></i></button>
                </div>
            `;
            break;
        case 'video':
            attachmentPreview.innerHTML = `
                <div class="attachment single">
                    <video controls>
                        <source src="../images/placeholder-video.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <button class="remove-attachment"><i class="fas fa-times"></i></button>
                </div>
            `;
            break;
        case 'code':
            // Insert code snippet template into textarea
            if (postTextarea) {
                postTextarea.value += "\n```js\n// Your code here\n```\n";
                updateCharacterCount();
            }
            break;
    }
    
    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-attachment');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            button.parentElement.remove();
        });
    });
}

// Create a new post
function createPost() {
    if (!postTextarea) return;
    
    const text = postTextarea.value.trim();
    if (!text || text.length > MAX_POST_LENGTH) {
        showNotification('Please enter valid content for your post.', 'error');
        return;
    }
    
    // Get attachment if any
    const hasAttachment = attachmentPreview && attachmentPreview.children.length > 0;
    
    // Get visibility setting (if available)
    const visibilitySelector = document.querySelector('.visibility-selector');
    const visibility = visibilitySelector ? visibilitySelector.value : 'public';
    
    // Create post object
    const post = {
        id: 'post-' + Date.now(),
        author: {
            id: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            avatar: currentUser.avatar,
            verified: true
        },
        content: text,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        hasAttachment,
        visibility
    };
    
    // In a real app, this would send the post to a server
    // For demo purposes, we'll save it to localStorage and add it to the UI
    savePostToLocalStorage(post);
    
    // Add post to feed if we're on the dashboard
    const feedContainer = document.querySelector('.feed-posts');
    if (feedContainer) {
        addPostToFeed(post, feedContainer);
    }
    
    // Reset form
    postTextarea.value = '';
    if (attachmentPreview) {
        attachmentPreview.innerHTML = '';
    }
    updateCharacterCount();
    
    // Show success notification
    showNotification('Your post has been published!', 'success');
}

// Function to be called from the Publish button in the modal
function publishPost() {
    // Get the modal textarea and create post
    const modalTextarea = document.querySelector('#create-post-modal .post-textarea');
    const modalAttachmentPreview = document.querySelector('#create-post-modal #attachment-preview');
    
    if (!modalTextarea) return;
    
    const text = modalTextarea.value.trim();
    if (!text || text.length > MAX_POST_LENGTH) {
        showNotification('Please enter valid content for your post.', 'error');
        return;
    }
    
    // Get attachment if any
    const hasAttachment = modalAttachmentPreview && modalAttachmentPreview.children.length > 0;
    
    // Get visibility setting
    const visibilitySelector = document.querySelector('.visibility-selector');
    const visibility = visibilitySelector ? visibilitySelector.value : 'public';
    
    // Create post object
    const post = {
        id: 'post-' + Date.now(),
        author: {
            id: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            avatar: currentUser.avatar,
            verified: true
        },
        content: text,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        hasAttachment,
        visibility
    };
    
    // Save to localStorage and add to UI
    savePostToLocalStorage(post);
    
    // Add post to feed
    const feedContainer = document.querySelector('.feed-posts');
    if (feedContainer) {
        addPostToFeed(post, feedContainer);
    }
    
    // Close modal and reset form
    const modal = document.getElementById('create-post-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    modalTextarea.value = '';
    if (modalAttachmentPreview) {
        modalAttachmentPreview.innerHTML = '';
    }
    
    // Show success notification
    showNotification('Your post has been published!', 'success');
}

// Make publishPost available globally
window.publishPost = publishPost;

// Function to open the post modal
function openPostModal() {
    const modal = document.getElementById('create-post-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on the textarea
        const textarea = modal.querySelector('.post-textarea');
        if (textarea) {
            textarea.focus();
        }
    }
}

// Function to open post modal with a specific tool activated
function openPostModalWithTool(toolType) {
    // First open the modal
    openPostModal();
    
    // Then trigger the tool
    setTimeout(() => {
        handleAttachment(toolType);
    }, 100);
}

// Make these functions available globally
window.openPostModal = openPostModal;
window.openPostModalWithTool = openPostModalWithTool;

// Save post to localStorage
function savePostToLocalStorage(post) {
    // Get existing posts
    let posts = JSON.parse(localStorage.getItem('builderspace_posts') || '[]');
    
    // Add new post at the beginning
    posts.unshift(post);
    
    // Save back to localStorage
    localStorage.setItem('builderspace_posts', JSON.stringify(posts));
}

// Add a post to the feed
function addPostToFeed(post, feedContainer) {
    // Create post element
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.dataset.postId = post.id;
    
    // Format the post timestamp
    const timeAgo = formatTimeAgo(post.timestamp);
    
    // Format the post content
    const formattedContent = formatPostContent(post.content);
    
    // Create HTML for post
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${post.author.avatar || '../images/avatar-placeholder.jpg'}" alt="${post.author.name}" class="avatar-small">
                <div class="author-info">
                    <div class="author-name">
                        <h4>${post.author.name}</h4>
                        ${post.author.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i></span>' : ''}
                    </div>
                    <p>@${post.author.username}</p>
                </div>
            </div>
            <div class="post-options">
                <button class="options-btn"><i class="fas fa-ellipsis-h"></i></button>
                <div class="options-menu">
                    <ul>
                        <li><i class="fas fa-bookmark"></i> Save post</li>
                        <li><i class="fas fa-user-plus"></i> Follow @${post.author.username}</li>
                        <li><i class="fas fa-volume-mute"></i> Mute @${post.author.username}</li>
                        <li><i class="fas fa-flag"></i> Report post</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="post-content">
            <p>${formattedContent}</p>
            ${post.hasAttachment ? `
                <div class="post-attachment">
                    <img src="../images/placeholder-image.jpg" alt="Post attachment">
                </div>
            ` : ''}
        </div>
        <div class="post-footer">
            <div class="post-meta">
                <span class="post-time">${timeAgo}</span>
                ${post.visibility !== 'public' ? `<span class="post-visibility"><i class="fas fa-lock"></i> ${post.visibility}</span>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" title="Like">
                    <i class="far fa-heart"></i>
                    <span class="count">${post.likes}</span>
                </button>
                <button class="action-btn comment-btn" title="Comment">
                    <i class="far fa-comment"></i>
                    <span class="count">${post.comments}</span>
                </button>
                <button class="action-btn share-btn" title="Share">
                    <i class="far fa-share-square"></i>
                    <span class="count">${post.shares}</span>
                </button>
                <button class="action-btn bookmark-btn" title="Bookmark">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </div>
        <div class="post-comments">
            <div class="comment-input">
                <img src="${currentUser.avatar || '../images/avatar-placeholder.jpg'}" alt="${currentUser.name}" class="avatar-small">
                <input type="text" placeholder="Write a comment...">
                <button class="comment-submit"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    // Add post to feed at the beginning
    feedContainer.insertBefore(postElement, feedContainer.firstChild);
    
    // Initialize post interactions
    initPostInteractions(postElement);
}

// Format post content (handle links, hashtags, mentions)
function formatPostContent(content) {
    // Convert URLs to links
    content = content.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Convert hashtags
    content = content.replace(
        /#(\w+)/g, 
        '<a href="hashtag/$1" class="hashtag">#$1</a>'
    );
    
    // Convert mentions
    content = content.replace(
        /@(\w+)/g, 
        '<a href="profile/$1" class="mention">@$1</a>'
    );
    
    // Handle code blocks
    content = content.replace(
        /```(\w+)?\n([\s\S]*?)\n```/g,
        '<pre><code class="language-$1">$2</code></pre>'
    );
    
    return content;
}

// Format time ago
function formatTimeAgo(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval + 'y ago';
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + 'mo ago';
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + 'd ago';
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + 'h ago';
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + 'm ago';
    }
    
    if (seconds < 10) return 'just now';
    
    return Math.floor(seconds) + 's ago';
}

// Initialize post interactions
function initPostInteractions(postElement) {
    // Like button
    const likeBtn = postElement.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const icon = likeBtn.querySelector('i');
            const count = likeBtn.querySelector('.count');
            
            if (icon.classList.contains('far')) {
                // Like
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--like-color)';
                count.textContent = parseInt(count.textContent) + 1;
            } else {
                // Unlike
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                count.textContent = parseInt(count.textContent) - 1;
            }
        });
    }
    
    // Comment button
    const commentBtn = postElement.querySelector('.comment-btn');
    if (commentBtn) {
        commentBtn.addEventListener('click', () => {
            const commentsSection = postElement.querySelector('.post-comments');
            commentsSection.classList.toggle('active');
            
            // Focus the input
            const input = commentsSection.querySelector('input');
            if (input && commentsSection.classList.contains('active')) {
                input.focus();
            }
        });
    }
    
    // Comment submit
    const commentSubmit = postElement.querySelector('.comment-submit');
    if (commentSubmit) {
        commentSubmit.addEventListener('click', () => {
            const input = postElement.querySelector('.comment-input input');
            submitComment(input, postElement);
        });
        
        // Also submit on Enter key
        const commentInput = postElement.querySelector('.comment-input input');
        if (commentInput) {
            commentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitComment(commentInput, postElement);
                }
            });
        }
    }
    
    // Post options
    const optionsBtn = postElement.querySelector('.options-btn');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = postElement.querySelector('.options-menu');
            menu.classList.toggle('active');
            
            // Close when clicking outside
            const closeMenu = (event) => {
                if (!menu.contains(event.target) && event.target !== optionsBtn) {
                    menu.classList.remove('active');
                    document.removeEventListener('click', closeMenu);
                }
            };
            
            document.addEventListener('click', closeMenu);
        });
    }
    
    // Bookmark button
    const bookmarkBtn = postElement.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            const icon = bookmarkBtn.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Bookmark
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Post saved to bookmarks', 'success');
            } else {
                // Unbookmark
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Post removed from bookmarks', 'info');
            }
        });
    }
}

// Submit a comment
function submitComment(inputElement, postElement) {
    if (!inputElement || !postElement) return;
    
    const text = inputElement.value.trim();
    if (!text) return;
    
    // Get post ID
    const postId = postElement.dataset.postId;
    
    // Create comment element
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <img src="${currentUser.avatar || '../images/avatar-placeholder.jpg'}" alt="${currentUser.name}" class="avatar-small">
        <div class="comment-content">
            <div class="comment-header">
                <h4>${currentUser.name}</h4>
                <span class="comment-time">just now</span>
            </div>
            <p>${text}</p>
            <div class="comment-actions">
                <button class="comment-like"><i class="far fa-heart"></i> <span>0</span></button>
                <button class="comment-reply">Reply</button>
            </div>
        </div>
    `;
    
    // Add comment to post
    const commentsSection = postElement.querySelector('.post-comments');
    commentsSection.insertBefore(commentElement, commentsSection.querySelector('.comment-input'));
    
    // Update comment count
    const countElement = postElement.querySelector('.comment-btn .count');
    countElement.textContent = parseInt(countElement.textContent) + 1;
    
    // Clear input
    inputElement.value = '';
    
    // In a real app, this would send the comment to a server
    // For demo purposes, we'll just update the UI
}

// Show notification
function showNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // Create container if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'info':
        default:
            icon = 'fas fa-info-circle';
            break;
    }
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}
