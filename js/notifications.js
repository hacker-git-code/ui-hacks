// Notifications Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const notificationItems = document.querySelectorAll('.notification-item');
    const markReadBtn = document.querySelector('.mark-read-btn');
    const filterBtn = document.querySelector('.filter-btn');
    const readMarkers = document.querySelectorAll('.notification-action');
    const followButtons = document.querySelectorAll('.follow-btn');
    
    // Initialize tabs
    initTabs();
    
    // Initialize read markers
    initReadMarkers();
    
    // Initialize mark all read button
    initMarkAllRead();
    
    // Initialize filter button
    initFilterButton();
    
    // Initialize follow buttons
    initFollowButtons();
    
    // Tab functionality
    function initTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Filter notifications based on tab
                filterNotifications(tabName);
            });
        });
    }
    
    // Filter notifications based on tab
    function filterNotifications(tabName) {
        // In a real app, this would filter notifications from the server
        // For demo purposes, we'll just show a notification
        
        if (tabName === 'all') {
            notificationItems.forEach(item => {
                item.style.display = 'flex';
            });
            
            // Show all section titles
            document.querySelectorAll('.notification-section').forEach(section => {
                section.style.display = 'block';
            });
        } else {
            // Simulate filtering by hiding some notifications
            let visibleCount = 0;
            
            notificationItems.forEach((item, index) => {
                // Simple demo logic to show/hide items based on tab
                // In a real app, this would check the notification type
                const shouldShow = (
                    (tabName === 'mentions' && index % 5 === 3) ||
                    (tabName === 'likes' && index % 5 === 0) ||
                    (tabName === 'comments' && index % 5 === 1) ||
                    (tabName === 'follows' && index % 5 === 2)
                );
                
                item.style.display = shouldShow ? 'flex' : 'none';
                if (shouldShow) visibleCount++;
            });
            
            // Hide empty section titles
            document.querySelectorAll('.notification-section').forEach(section => {
                const hasVisibleNotifications = Array.from(section.querySelectorAll('.notification-item'))
                    .some(item => item.style.display === 'flex');
                
                section.style.display = hasVisibleNotifications ? 'block' : 'none';
            });
            
            if (visibleCount === 0) {
                showNotification(`No ${tabName} notifications found.`, 'info');
            }
        }
    }
    
    // Initialize read markers
    function initReadMarkers() {
        readMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                const notificationItem = marker.closest('.notification-item');
                const icon = marker.querySelector('i');
                
                if (notificationItem.classList.contains('unread')) {
                    // Mark as read
                    notificationItem.classList.remove('unread');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    marker.setAttribute('title', 'Mark as unread');
                    
                    // Update badge count
                    updateBadgeCount(-1);
                    
                    showNotification('Notification marked as read', 'success');
                } else {
                    // Mark as unread
                    notificationItem.classList.add('unread');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    marker.setAttribute('title', 'Mark as read');
                    
                    // Update badge count
                    updateBadgeCount(1);
                    
                    showNotification('Notification marked as unread', 'info');
                }
            });
        });
    }
    
    // Initialize mark all read button
    function initMarkAllRead() {
        if (!markReadBtn) return;
        
        markReadBtn.addEventListener('click', () => {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            
            if (unreadItems.length === 0) {
                showNotification('No unread notifications', 'info');
                return;
            }
            
            unreadItems.forEach(item => {
                item.classList.remove('unread');
                
                const marker = item.querySelector('.notification-action');
                if (marker) {
                    const icon = marker.querySelector('i');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    marker.setAttribute('title', 'Mark as unread');
                }
            });
            
            // Reset badge count
            resetBadgeCount();
            
            showNotification('All notifications marked as read', 'success');
        });
    }
    
    // Initialize filter button
    function initFilterButton() {
        if (!filterBtn) return;
        
        filterBtn.addEventListener('click', () => {
            // In a real app, this would open a filter modal
            showNotification('Filter options coming soon!', 'info');
        });
    }
    
    // Initialize follow buttons
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
    
    // Update badge count
    function updateBadgeCount(change) {
        const badge = document.querySelector('.sidebar-nav .badge');
        if (!badge) return;
        
        let count = parseInt(badge.textContent);
        count += change;
        
        if (count <= 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'inline-flex';
            badge.textContent = count;
        }
    }
    
    // Reset badge count
    function resetBadgeCount() {
        const badge = document.querySelector('.sidebar-nav .badge');
        if (!badge) return;
        
        badge.style.display = 'none';
        badge.textContent = '0';
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
