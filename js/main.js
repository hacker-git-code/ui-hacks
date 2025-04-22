// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const body = document.body;
let mobileMenu;
let headerThemeToggle;
const header = document.querySelector('.landing-header');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initThemeToggle();
    initAnimations();
    initStickyHeader();
});

// Create mobile menu dynamically
function initMobileMenu() {
    // Create mobile menu
    mobileMenu = document.createElement('div');
    mobileMenu.classList.add('mobile-menu');
    
    // Create close button
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-menu');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', toggleMobileMenu);
    
    // Clone navigation links
    const navLinks = document.querySelector('.landing-nav ul').cloneNode(true);
    
    // Append elements
    mobileMenu.appendChild(closeButton);
    mobileMenu.appendChild(navLinks);
    document.body.appendChild(mobileMenu);
    
    // Add event listener to toggle button
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Initialize theme toggle
function initThemeToggle() {
    // Initialize the header theme toggle button
    headerThemeToggle = document.querySelector('.theme-toggle-header');
    if (headerThemeToggle) {
        headerThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcons('light');
    }
}

// Toggle theme between light and dark mode
function toggleTheme() {
    body.classList.toggle('light-mode');
    
    // Update theme in local storage and icons
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        updateThemeIcons('light');
    } else {
        localStorage.setItem('theme', 'dark');
        updateThemeIcons('dark');
    }
}

// Update theme icons
function updateThemeIcons(theme) {
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';
    
    if (headerThemeToggle) {
        headerThemeToggle.innerHTML = theme === 'light' ? sunIcon : moonIcon;
    }
}

// Initialize sticky header
function initStickyHeader() {
    if (!header) return;
    
    // Initial check for page load position
    checkHeaderScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkHeaderScroll);
}

// Check scroll position and update header
function checkHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Initialize animations
function initAnimations() {
    // Animate hero section on load
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 600);
    }
    
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length > 0) {
        // Add initial styles
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        // Observe each card
        featureCards.forEach(card => {
            observer.observe(card);
        });
    }
}

// Handle smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        }
    }
});
