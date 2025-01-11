// Initialize EmailJS (add this at the top of your file)
(function() {
    // Replace with your actual EmailJS public key
    emailjs.init("YOUR_COPIED_PUBLIC_KEY");
})();

// Modal functionality
const modals = {
    login: document.getElementById('loginModal'),
    signup: document.getElementById('signupModal')
};

// Open modal functions
function openLoginModal() {
    modals.login.style.display = 'block';
}

function closeLoginModal() {
    modals.login.style.display = 'none';
}

function openSignupModal() {
    modals.signup.style.display = 'block';
}

function closeSignupModal() {
    modals.signup.style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
});

// Form handling
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted');
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log('Signup submitted');
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Hamburger Menu Toggle
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !hamburgerMenu.contains(e.target)) {
            sidebar.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Signup Form Handler
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('fullName'),
            email: formData.get('email')
        };

        try {
            const response = await fetch('http://localhost:3000/api/notify/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Notification failed');
            }

            alert('Signup successful!');
            closeSignupModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Signup successful, but notification failed to send.');
        }
    });

    // Login Form Handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            email: formData.get('email')
        };

        try {
            const response = await fetch('http://localhost:3000/api/notify/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Notification failed');
            }

            alert('Login successful!');
            closeLoginModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Login successful, but notification failed to send.');
        }
    });
});

// Update the email sending function
async function sendEmailNotification(templateParams) {
    try {
        await emailjs.send(
            "YOUR_COPIED_SERVICE_ID", // The service ID you copied
            "YOUR_COPIED_TEMPLATE_ID", // The template ID you copied
            {
                ...templateParams,
                time: new Date().toLocaleString(),
                to_email: "joneshussmax@gmail.com"
            }
        );
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
}

// For Africa's Talking SMS
async function sendSMSNotification(phoneNumber, message) {
    const API_KEY = 'YOUR_AFRICASTALKING_API_KEY';
    const USERNAME = 'YOUR_AFRICASTALKING_USERNAME';
    const SMS_URL = 'https://api.africastalking.com/version1/messaging';

    try {
        const response = await fetch(SMS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': API_KEY,
                'username': USERNAME,
            },
            body: new URLSearchParams({
                'to': phoneNumber,
                'message': message,
                'from': 'EWS' // Your sender ID
            })
        });

        if (!response.ok) {
            throw new Error('SMS notification failed');
        }

        return await response.json();
    } catch (error) {
        console.error('SMS error:', error);
        throw error;
    }
} 