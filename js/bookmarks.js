// Bookmarks Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const bookmarkItems = document.querySelectorAll('.bookmark-item');
    const collectionCards = document.querySelectorAll('.collection-card');
    const addToCollectionBtns = document.querySelectorAll('.add-to-collection-btn');
    const removeBookmarkBtns = document.querySelectorAll('.remove-bookmark-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const searchInput = document.querySelector('.search-bar input');
    const sortSelect = document.querySelector('.sort-select');
    const filterBtn = document.querySelector('.filter-btn');
    const editBtn = document.querySelector('.edit-btn');
    const collectionModal = document.getElementById('collection-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    // Initialize tabs
    initTabs();
    
    // Initialize collection cards
    initCollectionCards();
    
    // Initialize bookmark actions
    initBookmarkActions();
    
    // Initialize load more button
    initLoadMoreButton();
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Initialize sort functionality
    initSortFunctionality();
    
    // Initialize filter functionality
    initFilterFunctionality();
    
    // Initialize edit mode
    initEditMode();
    
    // Initialize modal
    initModal();
    
    // Initialize copy buttons
    initCopyButtons();
    
    // Tab functionality
    function initTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Filter bookmarks based on tab
                filterBookmarks(tabName);
            });
        });
    }
    
    // Filter bookmarks based on tab
    function filterBookmarks(tabName) {
        if (tabName === 'all') {
            bookmarkItems.forEach(item => {
                item.style.display = 'block';
            });
            
            showNotification('Showing all bookmarks', 'info');
        } else {
            // Filter bookmarks by type
            let visibleCount = 0;
            
            bookmarkItems.forEach(item => {
                const type = item.querySelector('.bookmark-type').classList[1];
                
                if (type === tabName) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            if (visibleCount === 0) {
                showNotification(`No ${tabName} bookmarks found`, 'info');
            } else {
                showNotification(`Showing ${visibleCount} ${tabName} bookmarks`, 'info');
            }
        }
    }
    
    // Collection cards functionality
    function initCollectionCards() {
        collectionCards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('add-collection')) {
                    // Show create collection modal
                    showNotification('Create collection feature coming soon!', 'info');
                } else {
                    // Navigate to collection
                    const collectionName = card.querySelector('h3').textContent;
                    showNotification(`Opening ${collectionName} collection...`, 'info');
                }
            });
        });
    }
    
    // Bookmark actions functionality
    function initBookmarkActions() {
        // Add to collection buttons
        addToCollectionBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Show collection modal
                collectionModal.classList.add('active');
                
                // Store reference to current bookmark
                collectionModal.setAttribute('data-bookmark-id', button.closest('.bookmark-item').getAttribute('id') || 'bookmark-' + Math.random().toString(36).substr(2, 9));
            });
        });
        
        // Remove bookmark buttons
        removeBookmarkBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const bookmarkItem = button.closest('.bookmark-item');
                
                // Animate removal
                bookmarkItem.style.opacity = '0';
                bookmarkItem.style.transform = 'translateX(20px)';
                bookmarkItem.style.transition = 'opacity 0.3s, transform 0.3s';
                
                setTimeout(() => {
                    bookmarkItem.style.display = 'none';
                    showNotification('Bookmark removed', 'success');
                }, 300);
            });
        });
        
        // Share buttons
        shareBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // In a real app, this would open a share dialog
                showNotification('Share feature coming soon!', 'info');
            });
        });
    }
    
    // Load more button functionality
    function initLoadMoreButton() {
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', () => {
            // In a real app, this would load more bookmarks from the server
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Loading...</span>';
            
            // Simulate loading delay
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i> <span>Load More</span>';
                showNotification('No more bookmarks to load', 'info');
            }, 1500);
        });
    }
    
    // Search functionality
    function initSearchFunctionality() {
        if (!searchInput) return;
        
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            
            if (query.length > 2) {
                // Filter bookmarks by search query
                let matchCount = 0;
                
                bookmarkItems.forEach(item => {
                    const title = item.querySelector('h3').textContent.toLowerCase();
                    const content = item.querySelector('p').textContent.toLowerCase();
                    const author = item.querySelector('.author-info h4').textContent.toLowerCase();
                    
                    if (title.includes(query) || content.includes(query) || author.includes(query)) {
                        item.style.display = 'block';
                        matchCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                if (matchCount === 0) {
                    showNotification('No bookmarks match your search', 'info');
                }
            } else if (query.length === 0) {
                // Reset to show all bookmarks
                bookmarkItems.forEach(item => {
                    item.style.display = 'block';
                });
            }
        });
        
        // Handle search form submission
        searchInput.closest('.search-bar').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                
                if (query) {
                    showNotification(`Searching for "${query}"...`, 'info');
                }
            }
        });
    }
    
    // Sort functionality
    function initSortFunctionality() {
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            
            // In a real app, this would sort bookmarks based on the selected option
            showNotification(`Sorting by ${sortValue}...`, 'info');
            
            // Simulate sorting
            const bookmarksList = document.querySelector('.bookmark-items');
            const bookmarks = Array.from(bookmarkItems);
            
            switch (sortValue) {
                case 'recent':
                    // Sort by most recent (already in this order in our demo)
                    break;
                case 'oldest':
                    // Reverse the order
                    bookmarks.reverse().forEach(bookmark => {
                        bookmarksList.appendChild(bookmark);
                    });
                    break;
                case 'popular':
                    // Sort by popularity (likes count in our demo)
                    bookmarks.sort((a, b) => {
                        const aLikes = parseInt(a.querySelector('.bookmark-stats span:first-child').textContent.match(/\d+/)[0]);
                        const bLikes = parseInt(b.querySelector('.bookmark-stats span:first-child').textContent.match(/\d+/)[0]);
                        return bLikes - aLikes;
                    }).forEach(bookmark => {
                        bookmarksList.appendChild(bookmark);
                    });
                    break;
            }
        });
    }
    
    // Filter functionality
    function initFilterFunctionality() {
        if (!filterBtn) return;
        
        filterBtn.addEventListener('click', () => {
            // In a real app, this would open a filter modal
            showNotification('Filter options coming soon!', 'info');
        });
    }
    
    // Edit mode functionality
    function initEditMode() {
        if (!editBtn) return;
        
        editBtn.addEventListener('click', () => {
            const isEditing = editBtn.classList.toggle('active');
            
            if (isEditing) {
                editBtn.innerHTML = '<i class="fas fa-check"></i> <span>Done</span>';
                document.querySelector('.bookmark-items').classList.add('edit-mode');
                showNotification('Edit mode enabled. Click on bookmarks to select them.', 'info');
            } else {
                editBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Edit</span>';
                document.querySelector('.bookmark-items').classList.remove('edit-mode');
                showNotification('Edit mode disabled', 'info');
            }
        });
    }
    
    // Modal functionality
    function initModal() {
        if (!collectionModal) return;
        
        closeModalBtn.addEventListener('click', () => {
            collectionModal.classList.remove('active');
        });
        
        cancelBtn.addEventListener('click', () => {
            collectionModal.classList.remove('active');
        });
        
        saveBtn.addEventListener('click', () => {
            // Get selected collections
            const selectedCollections = Array.from(document.querySelectorAll('.collection-checkbox input:checked'))
                .map(checkbox => checkbox.closest('.collection-item').querySelector('.collection-label span').textContent);
            
            if (selectedCollections.length === 0) {
                showNotification('Please select at least one collection', 'warning');
                return;
            }
            
            // In a real app, this would save the bookmark to the selected collections
            showNotification(`Bookmark added to ${selectedCollections.length} collection(s)`, 'success');
            
            // Close modal
            collectionModal.classList.remove('active');
            
            // Reset checkboxes
            document.querySelectorAll('.collection-checkbox input').forEach(checkbox => {
                checkbox.checked = false;
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === collectionModal) {
                collectionModal.classList.remove('active');
            }
        });
    }
    
    // Copy buttons functionality
    function initCopyButtons() {
        copyBtns.forEach(button => {
            button.addEventListener('click', () => {
                const codeBlock = button.closest('.code-snippet').querySelector('code');
                const textToCopy = codeBlock.textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showNotification('Code copied to clipboard!', 'success');
                        
                        // Change button icon temporarily
                        const originalIcon = button.innerHTML;
                        button.innerHTML = '<i class="fas fa-check"></i>';
                        
                        setTimeout(() => {
                            button.innerHTML = originalIcon;
                        }, 2000);
                    })
                    .catch(err => {
                        showNotification('Failed to copy code', 'error');
                        console.error('Could not copy text: ', err);
                    });
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
