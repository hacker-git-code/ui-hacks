// DOM Elements
const contactForm = document.getElementById('contact-form');
const faqItems = document.querySelectorAll('.faq-item');

// Initialize the contact page
document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
    initContactForm();
});

// Initialize FAQ accordion functionality
function initFaqAccordion() {
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize contact form submission
function initContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // Validate form (simple validation)
    if (!validateForm(formValues)) {
        showNotification('Please fill out all required fields.', 'error');
        return;
    }
    
    // Simulate form submission (would be an API call in a real app)
    console.log('Form submitted:', formValues);
    
    // Show success message
    showNotification('Your message has been sent! We\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Validate form fields
function validateForm(values) {
    return Object.values(values).every(value => value.trim() !== '');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.form-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'form-notification';
        contactForm.parentNode.insertBefore(notification, contactForm.nextSibling);
    }
    
    // Set content and type
    notification.textContent = message;
    notification.className = `form-notification ${type}`;
    
    // Show notification
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
    }, 5000);
}

// Add CSS for form notification
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .form-notification {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: var(--border-radius-md);
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .form-notification.success {
        background-color: rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
        color: #10b981;
    }
    
    .form-notification.error {
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
        color: #ef4444;
    }
    
    .form-notification.info {
        background-color: rgba(59, 130, 246, 0.1);
        border-left: 4px solid #3b82f6;
        color: #3b82f6;
    }
    
    body.light-mode .form-notification.success {
        background-color: rgba(16, 185, 129, 0.05);
    }
    
    body.light-mode .form-notification.error {
        background-color: rgba(239, 68, 68, 0.05);
    }
    
    body.light-mode .form-notification.info {
        background-color: rgba(59, 130, 246, 0.05);
    }
`;

document.head.appendChild(notificationStyles);
