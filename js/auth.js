// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthMeter = document.querySelector('.strength-meter');
const strengthText = document.querySelector('.strength-text');
const strengthSegments = document.querySelectorAll('.strength-segment');

// Supabase configuration
const SUPABASE_URL = 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZGN3cXBrc3lucWJvaHdqc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5NTIyMjUsImV4cCI6MTk5NjUyODIyNX0.cGF_EGpXPOHYTEcFj3iBJ8Jm2VxMlvP6arfwn9T2CQ4';

// Initialize Supabase client
let supabase;

// Initialize the authentication pages
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    initPasswordToggle();
    initPasswordStrengthMeter();
    initFormSubmission();
    initThemeToggle();
    checkAuthState();
});

// Initialize Supabase
function initSupabase() {
    // Load Supabase from CDN if not already loaded
    if (typeof supabase === 'undefined') {
        loadSupabaseScript()
            .then(() => {
                // Initialize client after script is loaded
                supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                console.log('Supabase client initialized');
            })
            .catch(error => {
                console.error('Failed to load Supabase:', error);
                // Fallback to local auth if Supabase fails to load
            });
    }
}

// Load Supabase script dynamically
function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
        if (document.getElementById('supabase-js')) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.id = 'supabase-js';
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.10.0/dist/umd/supabase.min.js';
        script.async = true;
        
        script.onload = () => {
            resolve();
        };
        
        script.onerror = () => {
            reject(new Error('Failed to load Supabase script'));
        };
        
        document.head.appendChild(script);
    });
}

// Check if user is already authenticated
async function checkAuthState() {
    try {
        // First check localStorage/sessionStorage
        const storedUser = localStorage.getItem('builderspace_user') || sessionStorage.getItem('builderspace_user');
        
        if (storedUser) {
            const user = JSON.parse(storedUser);
            
            // If we're on the login or signup page, redirect to dashboard
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                window.location.href = 'dashboard.html';
                return;
            }
        } else if (typeof supabase !== 'undefined') {
            // If no stored user, check with Supabase
            const { data, error } = await supabase.auth.getSession();
            
            if (data?.session?.user) {
                localStorage.setItem('builderspace_user', JSON.stringify(data.session.user));
                
                // If we're on the login or signup page, redirect to dashboard
                if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                    window.location.href = 'dashboard.html';
                    return;
                }
            } else if (
                !window.location.pathname.includes('login.html') && 
                !window.location.pathname.includes('signup.html') && 
                !window.location.pathname.includes('index.html')
            ) {
                // If not authenticated and not on auth pages or landing page, redirect to login
                window.location.href = 'login.html';
                return;
            }
        }
    } catch (error) {
        console.error('Auth state check error:', error);
    }
}

// Toggle password visibility
function initPasswordToggle() {
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle icon
            const icon = button.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
}

// Password strength meter
function initPasswordStrengthMeter() {
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

function updatePasswordStrength() {
    if (!strengthMeter || !strengthText || !strengthSegments) return;
    
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    // Update strength meter
    strengthSegments.forEach((segment, index) => {
        if (index < strength) {
            segment.classList.add('active');
        } else {
            segment.classList.remove('active');
        }
    });
    
    // Update strength text
    let strengthLabel = '';
    let color = '';
    
    if (strength === 0) {
        strengthLabel = 'Very Weak';
        color = 'var(--danger-color)';
    } else if (strength === 1) {
        strengthLabel = 'Weak';
        color = 'var(--danger-color)';
    } else if (strength === 2) {
        strengthLabel = 'Fair';
        color = 'var(--warning-color)';
    } else if (strength === 3) {
        strengthLabel = 'Good';
        color = 'var(--success-color)';
    } else {
        strengthLabel = 'Strong';
        color = 'var(--success-color)';
    }
    
    strengthText.textContent = strengthLabel;
    strengthText.style.color = color;
}

function calculatePasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    // Contains numbers
    if (/\d/.test(password)) strength += 1;
    
    // Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return strength;
}

// Form submission
function initFormSubmission() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    try {
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        if (typeof supabase !== 'undefined') {
            // Use Supabase authentication
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Store user data
            if (remember) {
                localStorage.setItem('builderspace_user', JSON.stringify(data.user));
                localStorage.setItem('builderspace_session', JSON.stringify(data.session));
            } else {
                sessionStorage.setItem('builderspace_user', JSON.stringify(data.user));
                sessionStorage.setItem('builderspace_session', JSON.stringify(data.session));
            }
            
            // Fetch user profile from profiles table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
                
            if (!profileError && profileData) {
                if (remember) {
                    localStorage.setItem('builderspace_profile', JSON.stringify(profileData));
                } else {
                    sessionStorage.setItem('builderspace_profile', JSON.stringify(profileData));
                }
            }
            
            showNotification('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Fallback to local authentication for demo
            console.log('Using local auth fallback:', { email, password, remember });
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store mock user data
            const mockUser = { id: 'user-123', email, name: email.split('@')[0] };
            if (remember) {
                localStorage.setItem('builderspace_user', JSON.stringify(mockUser));
            } else {
                sessionStorage.setItem('builderspace_user', JSON.stringify(mockUser));
            }
            
            showNotification('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Failed to login. Please check your credentials.', 'error');
    } finally {
        // Reset button state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    
    // Validate password match
    if (confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(signupForm);
    const userData = Object.fromEntries(formData.entries());
    
    try {
        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        if (typeof supabase !== 'undefined') {
            // Use Supabase authentication
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName || '',
                        username: userData.username || ''
                    }
                }
            });
            
            if (error) throw error;
            
            if (data.user) {
                // Store user data
                localStorage.setItem('builderspace_user', JSON.stringify(data.user));
                
                // Create a profile record in the profiles table
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { 
                            id: data.user.id,
                            username: userData.username || data.user.email.split('@')[0],
                            full_name: userData.fullName || '',
                            email: userData.email,
                            avatar_url: null,
                            bio: '',
                            website: '',
                            location: '',
                            created_at: new Date().toISOString()
                        }
                    ]);
                
                if (profileError) {
                    console.error('Error creating profile:', profileError);
                }
                
                showNotification('Account created successfully! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // Email confirmation required
                showNotification('Please check your email to confirm your account!', 'info');
            }
        } else {
            // Fallback to local authentication for demo
            console.log('Using local auth fallback for signup:', userData);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store mock user data
            const mockUser = { 
                id: 'user-' + Math.random().toString(36).substring(2, 9), 
                email: userData.email,
                name: userData.fullName || userData.email.split('@')[0]
            };
            localStorage.setItem('builderspace_user', JSON.stringify(mockUser));
            
            showNotification('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification(error.message || 'Failed to create account. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Logout function
function logout() {
    if (typeof supabase !== 'undefined') {
        // Use Supabase logout
        supabase.auth.signOut()
            .then(() => {
                // Clear stored user data
                localStorage.removeItem('builderspace_user');
                localStorage.removeItem('builderspace_session');
                localStorage.removeItem('builderspace_profile');
                sessionStorage.removeItem('builderspace_user');
                sessionStorage.removeItem('builderspace_session');
                sessionStorage.removeItem('builderspace_profile');
                
                // Redirect to login page
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Logout error:', error);
                showNotification('Failed to logout. Please try again.', 'error');
            });
    } else {
        // Fallback to local logout
        localStorage.removeItem('builderspace_user');
        sessionStorage.removeItem('builderspace_user');
        window.location.href = 'login.html';
    }
}

// Expose logout function globally
window.logout = logout;

// Notification system
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
    const icon = getIconForType(type);
    
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

function getIconForType(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        case 'info':
        default:
            return 'fas fa-info-circle';
    }
}

// Theme toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Add event listener to toggle theme
    themeToggle.addEventListener('click', toggleTheme);
}

// Toggle theme between light and dark mode
function toggleTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    document.body.classList.toggle('light-mode');
    
    // Update icon and save preference
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
    }
    
    .notification {
        display: flex;
        align-items: center;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slide-in 0.3s ease-out forwards;
        background-color: var(--bg-secondary);
        border-left: 4px solid var(--primary-color);
    }
    
    .notification.success {
        border-left-color: var(--success-color);
    }
    
    .notification.error {
        border-left-color: var(--danger-color);
    }
    
    .notification.warning {
        border-left-color: var(--warning-color);
    }
    
    .notification-icon {
        margin-right: 15px;
        font-size: 1.2rem;
    }
    
    .notification.success .notification-icon {
        color: var(--success-color);
    }
    
    .notification.error .notification-icon {
        color: var(--danger-color);
    }
    
    .notification.warning .notification-icon {
        color: var(--warning-color);
    }
    
    .notification.info .notification-icon {
        color: var(--primary-color);
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-content p {
        margin: 0;
        color: var(--text-primary);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    .notification.fade-out {
        animation: fade-out 0.3s ease-out forwards;
    }
    
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fade-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
