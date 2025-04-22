// Live Rooms Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.live-rooms-tabs .tab-btn');
    const roomCards = document.querySelectorAll('.room-card');
    const upcomingRooms = document.querySelectorAll('.upcoming-room-card');
    const createRoomBtn = document.querySelector('.create-room-btn');
    const modal = document.getElementById('create-room-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const createBtn = document.querySelector('.create-btn');
    const scheduleOptions = document.querySelectorAll('input[name="schedule"]');
    const scheduleDetails = document.querySelector('.schedule-details');
    const joinRoomButtons = document.querySelectorAll('.join-room-btn');
    const remindButtons = document.querySelectorAll('.remind-btn');
    const shareButtons = document.querySelectorAll('.share-btn');
    const followButtons = document.querySelectorAll('.follow-btn');
    const searchInput = document.querySelector('.search-bar input');
    const filterBtn = document.querySelector('.filter-btn');
    
    // Initialize tabs
    initTabs();
    
    // Initialize modal
    initModal();
    
    // Initialize schedule options
    initScheduleOptions();
    
    // Initialize join room buttons
    initJoinRoomButtons();
    
    // Initialize remind buttons
    initRemindButtons();
    
    // Initialize share buttons
    initShareButtons();
    
    // Initialize follow buttons
    initFollowButtons();
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Initialize filter functionality
    initFilterFunctionality();
    
    // Tab functionality
    function initTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Filter rooms based on tab
                filterRooms(tabName);
            });
        });
    }
    
    // Filter rooms based on tab
    function filterRooms(tabName) {
        // In a real app, this would filter rooms from the server
        // For demo purposes, we'll just show a notification
        
        if (tabName === 'all') {
            roomCards.forEach(card => {
                card.style.display = 'flex';
            });
            
            showNotification('Showing all rooms', 'info');
        } else {
            // Simulate filtering by hiding some rooms
            let visibleCount = 0;
            
            roomCards.forEach((card, index) => {
                // Simple demo logic to show/hide cards based on tab
                // In a real app, this would check the room category
                const shouldShow = (
                    (tabName === 'following' && index % 4 === 0) ||
                    (tabName === 'popular' && index % 4 === 1) ||
                    (tabName === 'tech' && index % 4 === 2) ||
                    (tabName === 'design' && index % 4 === 3) ||
                    (tabName === 'career' && index % 4 === 0)
                );
                
                card.style.display = shouldShow ? 'flex' : 'none';
                if (shouldShow) visibleCount++;
            });
            
            showNotification(`Showing ${tabName} rooms`, 'info');
        }
    }
    
    // Modal functionality
    function initModal() {
        if (!createRoomBtn || !modal) return;
        
        createRoomBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
        
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('room-title').value;
            const description = document.getElementById('room-description').value;
            const category = document.getElementById('room-category').value;
            const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
            
            if (!title || !description || !category) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // In a real app, this would create a room on the server
            showNotification('Room created successfully!', 'success');
            modal.classList.remove('active');
            
            // Reset form
            document.getElementById('create-room-form').reset();
            scheduleDetails.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Schedule options functionality
    function initScheduleOptions() {
        if (!scheduleOptions.length) return;
        
        scheduleOptions.forEach(option => {
            option.addEventListener('change', () => {
                if (option.value === 'later') {
                    scheduleDetails.style.display = 'block';
                } else {
                    scheduleDetails.style.display = 'none';
                }
            });
        });
    }
    
    // Join room buttons functionality
    function initJoinRoomButtons() {
        joinRoomButtons.forEach(button => {
            button.addEventListener('click', () => {
                // In a real app, this would join the room
                showNotification('Joining room...', 'success');
                
                // Simulate joining after a delay
                setTimeout(() => {
                    showRoomInterface();
                }, 1000);
            });
        });
    }
    
    // Show room interface
    function showRoomInterface() {
        // In a real app, this would show the room interface
        // For demo purposes, we'll just show a notification
        showNotification('You are now in the room!', 'success');
    }
    
    // Remind buttons functionality
    function initRemindButtons() {
        remindButtons.forEach(button => {
            button.addEventListener('click', () => {
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    // Set reminder
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    button.innerHTML = '<i class="fas fa-bell"></i> Reminded';
                    showNotification('Reminder set!', 'success');
                } else {
                    // Remove reminder
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    button.innerHTML = '<i class="far fa-bell"></i> Remind Me';
                    showNotification('Reminder removed', 'info');
                }
            });
        });
    }
    
    // Share buttons functionality
    function initShareButtons() {
        shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                // In a real app, this would open a share dialog
                showNotification('Share feature coming soon!', 'info');
            });
        });
    }
    
    // Follow buttons functionality
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
            // In a real app, this would open a filter modal
            showNotification('Filters coming soon!', 'info');
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
