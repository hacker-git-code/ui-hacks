// Profile Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data
    initializeProfile();
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Load content based on tab if needed
            loadTabContent(tabName);
        });
    });
    
    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const saveProfileBtn = document.querySelector('.save-profile-btn');
    
    editProfileBtn.addEventListener('click', openEditProfileModal);
    saveProfileBtn.addEventListener('click', saveProfileChanges);
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Character count for text inputs
    const textInputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    textInputs.forEach(input => {
        const maxLength = input.getAttribute('maxlength');
        const countDisplay = input.nextElementSibling;
        
        if (countDisplay && countDisplay.classList.contains('character-count')) {
            input.addEventListener('input', () => {
                const remaining = maxLength - input.value.length;
                countDisplay.textContent = remaining;
                
                if (remaining < 10) {
                    countDisplay.classList.add('warning');
                } else {
                    countDisplay.classList.remove('warning');
                }
            });
        }
    });
    
    // Edit avatar and cover image
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    const editCoverBtn = document.querySelector('.edit-cover-btn');
    
    editAvatarBtn.addEventListener('click', () => uploadImage('avatar'));
    editCoverBtn.addEventListener('click', () => uploadImage('cover'));
    
    // Share profile button
    const shareProfileBtn = document.querySelector('.share-profile-btn');
    shareProfileBtn.addEventListener('click', shareProfile);
});

// Initialize profile with user data
function initializeProfile() {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const userData = {
        id: '123456',
        name: 'John Doe',
        username: 'johndoe',
        bio: 'Full-stack developer building cool stuff. Passionate about web technologies and open source.',
        location: 'San Francisco, CA',
        website: 'example.com',
        joinDate: 'March 2023',
        following: 245,
        followers: 1200,
        avatar: '../images/avatar-placeholder.jpg',
        coverImage: '../images/cover-placeholder.jpg',
        posts: []
    };
    
    // Update profile UI with user data
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-display-name').textContent = userData.name;
    document.getElementById('profile-username').textContent = `@${userData.username}`;
    document.getElementById('profile-bio').innerHTML = `<p>${userData.bio}</p>`;
    document.getElementById('profile-location').textContent = userData.location;
    document.getElementById('profile-website').textContent = userData.website;
    document.getElementById('profile-website').href = `https://${userData.website}`;
    document.getElementById('profile-joined').textContent = userData.joinDate;
    document.getElementById('following-count').textContent = userData.following;
    document.getElementById('followers-count').textContent = formatCount(userData.followers);
    document.getElementById('post-count').textContent = `${userData.posts.length} posts`;
    
    // Set profile images
    const avatarElements = document.querySelectorAll('#profile-avatar, .avatar, .avatar-small');
    avatarElements.forEach(img => {
        img.src = userData.avatar;
        img.alt = `${userData.name}'s avatar`;
    });
    
    document.getElementById('cover-image').src = userData.coverImage;
    
    // Load initial posts
    loadUserPosts();
    
    // Populate edit profile form
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-bio').value = userData.bio;
    document.getElementById('edit-location').value = userData.location;
    document.getElementById('edit-website').value = userData.website;
    
    // Update character counts
    updateCharacterCounts();
}

// Format large numbers (e.g., 1200 -> 1.2K)
function formatCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Load content based on selected tab
function loadTabContent(tabName) {
    switch(tabName) {
        case 'posts':
            loadUserPosts();
            break;
        case 'replies':
            loadUserReplies();
            break;
        case 'media':
            loadUserMedia();
            break;
        case 'likes':
            loadUserLikes();
            break;
    }
}

// Load user's posts
function loadUserPosts() {
    // In a real app, this would fetch posts from an API
    const posts = getMockPosts();
    renderPosts(posts, 'user-posts');
}

// Load user's replies
function loadUserReplies() {
    // In a real app, this would fetch replies from an API
    const replies = getMockReplies();
    renderPosts(replies, 'user-replies');
}

// Load user's media posts
function loadUserMedia() {
    // In a real app, this would fetch media posts from an API
    const media = getMockMedia();
    renderMedia(media);
}

// Load posts liked by the user
function loadUserLikes() {
    // In a real app, this would fetch liked posts from an API
    const likedPosts = getMockLikedPosts();
    renderPosts(likedPosts, 'user-likes');
}

// Render posts to a container
function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-feather-alt"></i>
                <h3>No posts yet</h3>
                <p>When you create posts, they will appear here.</p>
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

// Create a post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.setAttribute('data-post-id', post.id);
    
    let mediaHtml = '';
    if (post.media) {
        if (post.media.type === 'image') {
            mediaHtml = `<img src="${post.media.url}" alt="Post image" class="post-image">`;
        } else if (post.media.type === 'video') {
            mediaHtml = `<video src="${post.media.url}" controls class="post-video"></video>`;
        }
    }
    
    let codeHtml = '';
    if (post.code) {
        codeHtml = `
            <div class="post-code">
                <pre><code>${post.code.content}</code></pre>
                <div class="code-language">${post.code.language}</div>
            </div>
        `;
    }
    
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="avatar-small">
            <div class="post-author">
                <h3>${post.author.name}</h3>
                <p>@${post.author.username} · ${post.timeAgo}</p>
            </div>
            <div class="post-menu">
                <button class="post-menu-btn"><i class="fas fa-ellipsis-h"></i></button>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
            ${mediaHtml}
            ${codeHtml}
        </div>
        <div class="post-actions">
            <button class="post-action-btn reply-btn">
                <i class="far fa-comment"></i>
                <span>${formatCount(post.stats.replies)}</span>
            </button>
            <button class="post-action-btn repost-btn">
                <i class="fas fa-retweet"></i>
                <span>${formatCount(post.stats.reposts)}</span>
            </button>
            <button class="post-action-btn like-btn ${post.liked ? 'liked' : ''}">
                <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
                <span>${formatCount(post.stats.likes)}</span>
            </button>
            <button class="post-action-btn share-btn">
                <i class="far fa-share-square"></i>
            </button>
        </div>
    `;
    
    // Add event listeners for post actions
    const likeBtn = postElement.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => toggleLike(post.id, likeBtn));
    
    return postElement;
}

// Render media grid
function renderMedia(media) {
    const container = document.getElementById('user-media');
    container.innerHTML = '';
    
    if (media.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-photo-video"></i>
                <h3>No media yet</h3>
                <p>When you post photos or videos, they will appear here.</p>
            </div>
        `;
        return;
    }
    
    media.forEach(item => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item';
        mediaElement.setAttribute('data-post-id', item.postId);
        
        if (item.type === 'image') {
            mediaElement.innerHTML = `<img src="${item.url}" alt="Media">`;
        } else if (item.type === 'video') {
            mediaElement.innerHTML = `<video src="${item.url}"></video>`;
        }
        
        mediaElement.addEventListener('click', () => {
            // Show the full post
            showPost(item.postId);
        });
        
        container.appendChild(mediaElement);
    });
}

// Toggle like on a post
function toggleLike(postId, likeBtn) {
    const isLiked = likeBtn.classList.contains('liked');
    const countSpan = likeBtn.querySelector('span');
    const icon = likeBtn.querySelector('i');
    
    if (isLiked) {
        likeBtn.classList.remove('liked');
        icon.className = 'far fa-heart';
        countSpan.textContent = formatCount(parseInt(countSpan.textContent.replace(/[^\d]/g, '')) - 1);
    } else {
        likeBtn.classList.add('liked');
        icon.className = 'fas fa-heart';
        countSpan.textContent = formatCount(parseInt(countSpan.textContent.replace(/[^\d]/g, '')) + 1);
        
        // Show like animation
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        likeBtn.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
    
    // In a real app, send like/unlike request to the server
    console.log(`Post ${postId} ${isLiked ? 'unliked' : 'liked'}`);
}

// Open edit profile modal
function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('active');
    
    // Focus on first input
    document.getElementById('edit-name').focus();
}

// Save profile changes
function saveProfileChanges() {
    // Get form values
    const name = document.getElementById('edit-name').value;
    const bio = document.getElementById('edit-bio').value;
    const location = document.getElementById('edit-location').value;
    const website = document.getElementById('edit-website').value;
    
    // Validate form
    if (!name.trim()) {
        showNotification('Name cannot be empty', 'error');
        return;
    }
    
    // In a real app, send data to the server
    console.log('Saving profile changes:', { name, bio, location, website });
    
    // Update UI
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-display-name').textContent = name;
    document.getElementById('profile-bio').innerHTML = `<p>${bio}</p>`;
    document.getElementById('profile-location').textContent = location;
    document.getElementById('profile-website').textContent = website;
    document.getElementById('profile-website').href = website.startsWith('http') ? website : `https://${website}`;
    
    // Close modal
    document.getElementById('edit-profile-modal').classList.remove('active');
    
    // Show success notification
    showNotification('Profile updated successfully', 'success');
}

// Upload image (avatar or cover)
function uploadImage(type) {
    // In a real app, this would open a file picker
    // For demo purposes, we'll use a mock image
    const mockImageUrl = type === 'avatar' 
        ? '../images/avatar-placeholder-2.jpg' 
        : '../images/cover-placeholder-2.jpg';
    
    if (type === 'avatar') {
        document.getElementById('profile-avatar').src = mockImageUrl;
        document.querySelectorAll('.avatar, .avatar-small').forEach(img => {
            img.src = mockImageUrl;
        });
    } else {
        document.getElementById('cover-image').src = mockImageUrl;
    }
    
    // Show success notification
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`, 'success');
}

// Share profile
function shareProfile() {
    // In a real app, this would open a share dialog
    const profileUrl = window.location.href;
    
    // For demo purposes, copy to clipboard
    navigator.clipboard.writeText(profileUrl)
        .then(() => {
            showNotification('Profile URL copied to clipboard', 'success');
        })
        .catch(err => {
            console.error('Failed to copy profile URL:', err);
            showNotification('Failed to copy profile URL', 'error');
        });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Update character counts for all inputs
function updateCharacterCounts() {
    const textInputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    textInputs.forEach(input => {
        const maxLength = input.getAttribute('maxlength');
        const countDisplay = input.nextElementSibling;
        
        if (countDisplay && countDisplay.classList.contains('character-count')) {
            const remaining = maxLength - input.value.length;
            countDisplay.textContent = remaining;
        }
    });
}

// Show a specific post (for media grid click)
function showPost(postId) {
    // In a real app, this would navigate to the post detail page
    console.log(`Showing post ${postId}`);
    // For demo purposes, we'll just scroll to the post if it's in the current view
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth' });
        postElement.classList.add('highlight');
        setTimeout(() => postElement.classList.remove('highlight'), 2000);
    }
}

// Mock data functions
function getMockPosts() {
    return [
        {
            id: 'p1',
            author: {
                name: 'John Doe',
                username: 'johndoe',
                avatar: '../images/avatar-placeholder.jpg'
            },
            content: 'Just launched my new portfolio website! Check it out and let me know what you think. #webdev #portfolio',
            timeAgo: '2h',
            media: {
                type: 'image',
                url: '../images/post-image-1.jpg'
            },
            stats: {
                replies: 12,
                reposts: 5,
                likes: 42
            },
            liked: false
        },
        {
            id: 'p2',
            author: {
                name: 'John Doe',
                username: 'johndoe',
                avatar: '../images/avatar-placeholder.jpg'
            },
            content: 'Here\'s a snippet of code I\'ve been working on for my new project:',
            timeAgo: '1d',
            code: {
                language: 'JavaScript',
                content: 'function createAvatar(name) {\n  const canvas = document.createElement(\'canvas\');\n  canvas.width = 200;\n  canvas.height = 200;\n  const context = canvas.getContext(\'2d\');\n  \n  // Draw background\n  const colors = [\'#0ea5e9\', \'#6366f1\'];\n  const gradient = context.createLinearGradient(0, 0, 200, 200);\n  gradient.addColorStop(0, colors[0]);\n  gradient.addColorStop(1, colors[1]);\n  context.fillStyle = gradient;\n  context.fillRect(0, 0, 200, 200);\n  \n  // Draw initials\n  const initials = getInitials(name);\n  context.fillStyle = \'white\';\n  context.font = \'bold 80px Inter\';\n  context.textAlign = \'center\';\n  context.textBaseline = \'middle\';\n  context.fillText(initials, 100, 100);\n  \n  return canvas.toDataURL(\'image/png\');\n}'
            },
            stats: {
                replies: 8,
                reposts: 15,
                likes: 76
            },
            liked: true
        },
        {
            id: 'p3',
            author: {
                name: 'John Doe',
                username: 'johndoe',
                avatar: '../images/avatar-placeholder.jpg'
            },
            content: 'Excited to announce that I\'ll be speaking at the upcoming WebDev Conference next month! Topic: "Building Modern UIs with React and CSS Variables" #webdevconf',
            timeAgo: '3d',
            stats: {
                replies: 24,
                reposts: 18,
                likes: 132
            },
            liked: false
        }
    ];
}

function getMockReplies() {
    return [
        {
            id: 'r1',
            author: {
                name: 'John Doe',
                username: 'johndoe',
                avatar: '../images/avatar-placeholder.jpg'
            },
            content: 'Thanks for the feedback! I\'ll definitely consider adding that feature in the next update.',
            timeAgo: '5h',
            stats: {
                replies: 2,
                reposts: 0,
                likes: 8
            },
            liked: false,
            replyTo: {
                name: 'Jane Smith',
                username: 'janesmith'
            }
        },
        {
            id: 'r2',
            author: {
                name: 'John Doe',
                username: 'johndoe',
                avatar: '../images/avatar-placeholder.jpg'
            },
            content: 'I agree! The new React hooks API has made state management so much cleaner.',
            timeAgo: '2d',
            stats: {
                replies: 1,
                reposts: 3,
                likes: 15
            },
            liked: true,
            replyTo: {
                name: 'React',
                username: 'reactjs'
            }
        }
    ];
}

function getMockMedia() {
    return [
        {
            postId: 'p1',
            type: 'image',
            url: '../images/post-image-1.jpg'
        },
        {
            postId: 'p4',
            type: 'image',
            url: '../images/post-image-2.jpg'
        },
        {
            postId: 'p5',
            type: 'video',
            url: '../videos/post-video-1.mp4'
        }
    ];
}

function getMockLikedPosts() {
    return [
        {
            id: 'lp1',
            author: {
                name: 'Jane Smith',
                username: 'janesmith',
                avatar: '../images/avatar-placeholder-2.jpg'
            },
            content: 'Just released a new open-source library for handling complex forms in React. Check it out! #react #opensource',
            timeAgo: '6h',
            media: {
                type: 'image',
                url: '../images/post-image-3.jpg'
            },
            stats: {
                replies: 18,
                reposts: 24,
                likes: 156
            },
            liked: true
        },
        {
            id: 'lp2',
            author: {
                name: 'Tech News',
                username: 'technews',
                avatar: '../images/avatar-placeholder-3.jpg'
            },
            content: 'Breaking: GitHub introduces new AI-powered code completion tool for all users. #github #ai #coding',
            timeAgo: '1d',
            stats: {
                replies: 45,
                reposts: 87,
                likes: 320
            },
            liked: true
        }
    ];
}
