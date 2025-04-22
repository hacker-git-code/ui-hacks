// DOM Elements
const body = document.body;
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const createPostBtn = document.querySelector('.create-post-btn');
const createPostModal = document.getElementById('create-post-modal');
const closeModalBtn = document.querySelector('.close-modal');
const themeToggle = document.querySelector('.theme-toggle');
const userProfileMenu = document.querySelector('.user-profile');
const userMenu = document.querySelector('.user-menu');
const postInput = document.querySelector('.post-input');
const postTextarea = document.querySelector('.post-textarea');
const postSubmitBtn = document.querySelector('.post-submit-btn');
const characterCount = document.querySelector('.character-count');
const feedContainer = document.querySelector('.feed-posts');
const followButtons = document.querySelectorAll('.follow-btn');
const searchInput = document.querySelector('.search-bar input');
const filterBtn = document.querySelector('.filter-btn');

// Constants
const MAX_POST_LENGTH = 280;
const POSTS_PER_PAGE = 10;
let currentPage = 1;
let isLoadingPosts = false;
let currentUser = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
    initSidebar();
    initModal();
    initThemeToggle();
    initPostInteractions();
    initPostCreation();
    initUserMenu();
    initFollowButtons();
    initSearchFunctionality();
    initInfiniteScroll();
    initLiveRooms();
});

// Load current user data
function loadCurrentUser() {
    // Try to get user from session or local storage
    const user = JSON.parse(sessionStorage.getItem('builderspace_user') || localStorage.getItem('builderspace_user'));
    
    if (user) {
        currentUser = user;
        updateUserInterface();
    } else {
        // Redirect to login if no user found
        // window.location.href = 'login.html';
        
        // For demo purposes, create a mock user
        currentUser = {
            id: 'user-123',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            avatar: '../images/avatar-placeholder.jpg'
        };
        updateUserInterface();
    }
}

// Update UI with user data
function updateUserInterface() {
    // Update user profile display
    const userProfileElements = document.querySelectorAll('.user-info h3');
    const userUsernameElements = document.querySelectorAll('.user-info p');
    const userAvatars = document.querySelectorAll('.avatar, .avatar-small');
    
    userProfileElements.forEach(element => {
        element.textContent = currentUser.name || 'User';
    });
    
    userUsernameElements.forEach(element => {
        element.textContent = `@${currentUser.username || 'user'}`;
    });
    
    // Only update avatars that are for the current user (not post authors)
    userAvatars.forEach(avatar => {
        if (avatar.closest('.post-author') === null && avatar.closest('.comment') === null) {
            avatar.src = currentUser.avatar || '../images/avatar-placeholder.jpg';
            avatar.alt = currentUser.name || 'User Avatar';
        }
    });
}

// Initialize sidebar functionality
function initSidebar() {
    if (!sidebarToggle) return;
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        
        // Add overlay when sidebar is active on mobile
        if (sidebar.classList.contains('active')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.remove();
            });
            document.body.appendChild(overlay);
        } else {
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.remove();
        }
    });
    
    // Close sidebar when clicking on a link (mobile only)
    const sidebarLinks = sidebar.querySelectorAll('a');
    if (window.innerWidth <= 768) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            });
        });
    }
}

// Initialize user menu
function initUserMenu() {
    if (!userProfileMenu || !userMenu) return;
    
    userProfileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', () => {
        if (userMenu.classList.contains('active')) {
            userMenu.classList.remove('active');
        }
    });
    
    // Prevent menu from closing when clicking inside it
    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Add logout functionality
    const logoutButton = userMenu.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }
}

// Logout function
function logout() {
    // Clear user data
    sessionStorage.removeItem('builderspace_user');
    localStorage.removeItem('builderspace_user');
    
    // Redirect to login page
    window.location.href = '../index.html';
}

// Initialize modal functionality
function initModal() {
    if (!createPostBtn || !createPostModal || !closeModalBtn) return;
    
    createPostBtn.addEventListener('click', () => {
        createPostModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus the textarea
        if (postTextarea) {
            setTimeout(() => {
                postTextarea.focus();
            }, 100);
        }
    });
    
    closeModalBtn.addEventListener('click', () => {
        createPostModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset the form
        if (postTextarea) {
            postTextarea.value = '';
            updateCharacterCount();
        }
    });
    
    // Close modal when clicking outside
    createPostModal.addEventListener('click', (e) => {
        if (e.target === createPostModal) {
            createPostModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Reset the form
            if (postTextarea) {
                postTextarea.value = '';
                updateCharacterCount();
            }
        }
    });
    
    // Handle quick post from feed
    if (postInput) {
        postInput.addEventListener('focus', () => {
            createPostModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus the textarea and copy any text
            if (postTextarea && postInput.value.trim()) {
                postTextarea.value = postInput.value;
                updateCharacterCount();
                
                // Reset the input
                postInput.value = '';
            }
            
            setTimeout(() => {
                postTextarea.focus();
            }, 100);
        });
    }
}

// Initialize post creation
function initPostCreation() {
    if (!postTextarea || !postSubmitBtn || !characterCount) return;
    
    // Update character count on input
    postTextarea.addEventListener('input', updateCharacterCount);
    
    // Handle post submission
    postSubmitBtn.addEventListener('click', createPost);
    
    // Allow submission with Ctrl+Enter
    postTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            createPost();
        }
    });
    
    // Initialize attachment buttons
    const attachmentButtons = document.querySelectorAll('.tool-btn');
    attachmentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.tool;
            handleAttachment(type);
        });
    });
}

// Update character count
function updateCharacterCount() {
    if (!postTextarea || !characterCount || !postSubmitBtn) return;
    
    const text = postTextarea.value;
    const remaining = MAX_POST_LENGTH - text.length;
    
    characterCount.textContent = remaining;
    
    // Update UI based on remaining characters
    if (remaining < 0) {
        characterCount.classList.add('limit');
        postSubmitBtn.disabled = true;
    } else {
        characterCount.classList.remove('limit');
        postSubmitBtn.disabled = text.length === 0;
    }
    
    // Adjust textarea height
    postTextarea.style.height = 'auto';
    postTextarea.style.height = postTextarea.scrollHeight + 'px';
}

// Handle attachments
function handleAttachment(type) {
    // In a real app, this would open a file picker or other UI
    // For demo purposes, we'll simulate adding an attachment
    
    const attachmentPreview = document.getElementById('attachment-preview');
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
            postTextarea.value += "\n```js\n// Your code here\n```\n";
            updateCharacterCount();
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
    if (!postTextarea || !postSubmitBtn) return;
    
    const text = postTextarea.value.trim();
    if (!text || text.length > MAX_POST_LENGTH) return;
    
    // Get attachment if any
    const attachmentPreview = document.getElementById('attachment-preview');
    const hasAttachment = attachmentPreview && attachmentPreview.children.length > 0;
    
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
    
    // In a real app, this would send the post to a server
    // For demo purposes, we'll add it to the UI directly
    addPostToFeed(post);
    
    // Close modal and reset form
    createPostModal.style.display = 'none';
    document.body.style.overflow = '';
    postTextarea.value = '';
    if (attachmentPreview) {
        attachmentPreview.innerHTML = '';
    }
    updateCharacterCount();
    
    // Show success notification
    showNotification('Your post has been published!', 'success');
}

// Add a post to the feed
function addPostToFeed(post) {
    if (!feedContainer) return;
    
    // Format timestamp
    const timeAgo = formatTimeAgo(post.timestamp);
    
    // Create post element
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.dataset.postId = post.id;
    
    // Create post HTML
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${post.author.avatar || '../images/avatar-placeholder.jpg'}" alt="${post.author.name}" class="avatar-small">
                <div class="author-info">
                    <h3>${post.author.name} ${post.author.verified ? '<span class="verified-badge"><i class="fas fa-check"></i></span>' : ''}</h3>
                    <p>@${post.author.username} · ${timeAgo}</p>
                </div>
            </div>
            <div class="post-options">
                <button class="post-option-btn"><i class="fas fa-ellipsis-h"></i></button>
            </div>
        </div>
        <div class="post-content">
            <p>${formatPostContent(post.content)}</p>
        </div>
        ${post.hasAttachment ? `
        <div class="post-image">
            <img src="../images/placeholder-image.jpg" alt="Post attachment">
        </div>
        ` : ''}
        <div class="post-stats">
            <div class="post-stat">
                <i class="far fa-comment"></i>
                <span>${post.comments}</span>
            </div>
            <div class="post-stat">
                <i class="far fa-retweet"></i>
                <span>${post.shares}</span>
            </div>
            <div class="post-stat">
                <i class="far fa-heart"></i>
                <span>${post.likes}</span>
            </div>
            <div class="post-stat">
                <i class="far fa-bookmark"></i>
            </div>
            <div class="post-stat">
                <i class="far fa-share-square"></i>
            </div>
        </div>
    `;
    
    // Add to the beginning of the feed
    if (feedContainer.firstChild) {
        feedContainer.insertBefore(postElement, feedContainer.firstChild);
    } else {
        feedContainer.appendChild(postElement);
    }
    
    // Initialize interactions for the new post
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
        '<a href="search.html?q=%23$1" class="hashtag">#$1</a>'
    );
    
    // Convert mentions
    content = content.replace(
        /@(\w+)/g, 
        '<a href="profile.html?username=$1" class="mention">@$1</a>'
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
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d`;
    }
    
    // Format as MM/DD/YY for older posts
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

// Initialize post interactions
function initPostInteractions(postElement) {
    if (!postElement) return;
    
    // Like button
    const likeButton = postElement.querySelector('.post-stat i.fa-heart');
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            const countElement = likeButton.nextElementSibling;
            if (countElement) {
                let count = parseInt(countElement.textContent);
                if (likeButton.classList.contains('liked')) {
                    countElement.textContent = count + 1;
                } else {
                    countElement.textContent = count - 1;
                }
            }
        });
    }
    
    // Bookmark button
    const bookmarkButton = postElement.querySelector('.post-stat i.fa-bookmark');
    if (bookmarkButton) {
        bookmarkButton.addEventListener('click', () => {
            bookmarkButton.classList.toggle('bookmarked');
        });
    }
    
    // Comment button
    const commentButton = postElement.querySelector('.post-stat i.fa-comment');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            // Open comment section
            const commentSection = postElement.querySelector('.post-comments');
            if (commentSection) {
                commentSection.classList.toggle('active');
            }
        });
    }
    
    // Share button
    const shareButton = postElement.querySelector('.post-stat i.fa-share-square');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            // Open share modal
            const shareModal = document.getElementById('share-modal');
            if (shareModal) {
                shareModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Comment input
    const commentInput = postElement.querySelector('.comment-input');
    if (commentInput) {
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment(commentInput, postElement);
            }
        });
    }
    
    // Comment submit button
    const commentSubmitButton = postElement.querySelector('.send-comment-btn');
    if (commentSubmitButton) {
        commentSubmitButton.addEventListener('click', () => {
            submitComment(commentInput, postElement);
        });
    }
}

// Submit a comment
function submitComment(inputElement, postElement) {
    const commentText = inputElement.value.trim();
    if (!commentText) return;
    
    // Get the comments container
    const commentsContainer = postElement.querySelector('.post-comments');
    
    // Create new comment element
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
        <img src="${currentUser.avatar || '../images/avatar-placeholder.jpg'}" alt="${currentUser.name}" class="avatar-small">
        <div class="comment-content">
            <div class="comment-header">
                <h4>${currentUser.name}</h4>
                <span>@${currentUser.username} · Just now</span>
            </div>
            <p>${commentText}</p>
            <div class="comment-actions">
                <button><i class="fas fa-heart"></i> 0</button>
                <button><i class="fas fa-reply"></i> Reply</button>
            </div>
        </div>
    `;
    
    // Insert the new comment
    commentsContainer.appendChild(newComment);
    
    // Clear the input
    inputElement.value = '';
    
    // Update comment count
    const commentCountElement = postElement.querySelector('.post-stat i.fa-comment + span');
    if (commentCountElement) {
        let count = parseInt(commentCountElement.textContent);
        commentCountElement.textContent = count + 1;
    }
}

// Initialize follow buttons
function initFollowButtons() {
    followButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('following');
        });
    });
}

// Initialize search functionality
function initSearchFunctionality() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query) {
            // Show search results
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.style.display = 'block';
            }
        } else {
            // Hide search results
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        }
    });
    
    // Handle search button click
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                // Navigate to search page
                window.location.href = `search.html?q=${query}`;
            }
        });
    }
}

// Initialize infinite scroll
function initInfiniteScroll() {
    if (!feedContainer) return;
    
    const loadMoreButton = document.getElementById('load-more-btn');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            loadMorePosts();
        });
    }
    
    // Handle scroll event
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const feedHeight = feedContainer.offsetHeight;
        if (scrollPosition >= feedHeight && !isLoadingPosts) {
            loadMorePosts();
        }
    });
}

// Load more posts
function loadMorePosts() {
    if (isLoadingPosts) return;
    
    isLoadingPosts = true;
    
    // Simulate loading posts
    setTimeout(() => {
        // Add new posts to the feed
        const newPosts = [
            {
                id: 'post-123',
                author: {
                    id: 'user-123',
                    name: 'John Doe',
                    username: 'johndoe',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                content: 'This is a sample post.',
                timestamp: new Date(),
                likes: 0,
                comments: 0,
                shares: 0
            },
            {
                id: 'post-456',
                author: {
                    id: 'user-456',
                    name: 'Jane Doe',
                    username: 'janedoe',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                content: 'This is another sample post.',
                timestamp: new Date(),
                likes: 0,
                comments: 0,
                shares: 0
            }
        ];
        
        newPosts.forEach(post => {
            addPostToFeed(post);
        });
        
        isLoadingPosts = false;
    }, 1000);
}

// Initialize live rooms
function initLiveRooms() {
    // Simulate live rooms
    const liveRooms = [
        {
            id: 'room-123',
            name: 'Sample Room',
            description: 'This is a sample live room.',
            users: [
                {
                    id: 'user-123',
                    name: 'John Doe',
                    username: 'johndoe',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'user-456',
                    name: 'Jane Doe',
                    username: 'janedoe',
                    avatar: '../images/avatar-placeholder.jpg'
                }
            ]
        }
    ];
    
    // Add live rooms to the UI
    const liveRoomsContainer = document.getElementById('live-rooms');
    if (liveRoomsContainer) {
        liveRooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.className = 'live-room';
            roomElement.innerHTML = `
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <ul class="users">
                    ${room.users.map(user => `
                        <li>
                            <img src="${user.avatar}" alt="${user.name}" class="avatar-small">
                            <span>${user.name}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            liveRoomsContainer.appendChild(roomElement);
        });
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}
