// Discover Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const followButtons = document.querySelectorAll('.follow-btn');
    const starButtons = document.querySelectorAll('.star-btn');
    const searchInput = document.querySelector('.search-bar input');
    const filterBtn = document.querySelector('.filter-btn');
    
    // Initialize tabs
    initTabs();
    
    // Initialize follow buttons
    initFollowButtons();
    
    // Initialize star buttons
    initStarButtons();
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Initialize filter functionality
    initFilterFunctionality();
    
    // Tab functionality
    function initTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(`${tabName}-content`).classList.add('active');
            });
        });
    }
    
    // Follow button functionality
    function initFollowButtons() {
        followButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.textContent === 'Follow') {
                    button.textContent = 'Following';
                    button.classList.add('following');
                    showNotification('User followed successfully!', 'success');
                } else {
                    button.textContent = 'Follow';
                    button.classList.remove('following');
                    showNotification('User unfollowed', 'info');
                }
            });
        });
    }
    
    // Star button functionality
    function initStarButtons() {
        starButtons.forEach(button => {
            button.addEventListener('click', () => {
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    button.innerHTML = '<i class="fas fa-star"></i> Starred';
                    showNotification('Project starred!', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    button.innerHTML = '<i class="far fa-star"></i> Star';
                    showNotification('Project unstarred', 'info');
                }
            });
        });
    }
    
    // Search functionality
    function initSearchFunctionality() {
        if (!searchInput) return;
        
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            
            // In a real app, this would perform a search against the API
            // For demo purposes, we'll just show a notification
            if (query.length > 2) {
                // Show search results (would be implemented in a real app)
                console.log('Searching for:', query);
            }
        });
        
        // Handle search form submission
        searchInput.closest('.search-bar').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                
                if (query) {
                    showNotification(`Searching for "${query}"...`, 'info');
                    // In a real app, this would navigate to search results
                }
            }
        });
    }
    
    // Filter functionality
    function initFilterFunctionality() {
        if (!filterBtn) return;
        
        filterBtn.addEventListener('click', () => {
            // In a real app, this would open a filter modal or dropdown
            showNotification('Filters coming soon!', 'info');
        });
    }
    
    // Post interaction functionality
    initPostInteractions();
    
    function initPostInteractions() {
        // Like buttons
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const icon = button.querySelector('i');
                const count = button.querySelector('.count');
                const currentCount = parseInt(count.textContent);
                
                if (icon.classList.contains('far')) {
                    // Like
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = 'var(--like-color)';
                    count.textContent = currentCount + 1;
                    showNotification('Post liked!', 'success');
                } else {
                    // Unlike
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    count.textContent = currentCount - 1;
                    showNotification('Post unliked', 'info');
                }
            });
        });
        
        // Comment buttons
        const commentButtons = document.querySelectorAll('.comment-btn');
        commentButtons.forEach(button => {
            button.addEventListener('click', () => {
                // In a real app, this would open the comments section
                showNotification('Comments feature coming soon!', 'info');
            });
        });
        
        // Share buttons
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                // In a real app, this would open a share dialog
                showNotification('Share feature coming soon!', 'info');
            });
        });
        
        // Bookmark buttons
        const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
        bookmarkButtons.forEach(button => {
            button.addEventListener('click', () => {
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    // Bookmark
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification('Post bookmarked!', 'success');
                } else {
                    // Unbookmark
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification('Post removed from bookmarks', 'info');
                }
            });
        });
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
});
