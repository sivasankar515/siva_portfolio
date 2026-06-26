// ============================================
// PORTFOLIO SCRIPT - Siva Sankar V
// Version: 2.0.0 | Optimized for Global Deployment
// ============================================

// ============================================
// GLOBAL CONFIGURATION
// ============================================
const CONFIG = {
    storage: {
        version: '1.0',
        backupInterval: 300000, // 5 minutes
        maxDevices: 500
    },
    analytics: {
        enabled: true
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio Initializing...');
    
    try {
        // Initialize core systems in sequence
        initializeCoreSystems();
        
        // Initialize all features
        initializeAllFeatures();
        
        // Set up event listeners
        setupEventListeners();
        
        // Performance monitoring
        setupPerformanceMonitoring();
        
        console.log('✅ Portfolio Initialized Successfully!');
        
        // Mark initialization complete
        document.documentElement.setAttribute('data-initialized', 'true');
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('portfolioReady', {
            detail: { timestamp: Date.now(), version: '2.0' }
        }));
        
    } catch (error) {
        console.error('❌ Critical initialization error:', error);
        showNotification('Failed to initialize portfolio. Please refresh the page.', 'error');
        initializeFallbackFeatures();
    }
});

// ============================================
// CORE SYSTEMS INITIALIZATION
// ============================================
function initializeCoreSystems() {
    console.log('🛠️ Initializing core systems...');
    
    // Storage system first
    if (!initializeStorageSystem()) {
        console.warn('⚠️ Storage system had issues, using fallback');
    }
    
    // Setup storage persistence
    setupStoragePersistence();
    
    // Load theme preference
    loadThemePreference();
    
    // Initialize PWA
    initializePWA();
    
    // Protect contact data
    protectContactData();
    
    return true;
}

function initializeAllFeatures() {
    console.log('🔧 Initializing all features...');
    
    // Initialize all features
    const features = [
        initializeParticles,
        initializeTypingEffect,
        initializeMobileMenu,
        initializeBackToTop,
        initializeSkillAnimations,
        initializeScrollAnimations,
        initializeFormHandling,
        initializeThemeToggle,
        initializeEnhancedLikeSystem,
        setupSmoothScrolling,
        setupActiveNavLinks,
        initializeLazyLoading,
        preloadCriticalResources
    ];
    
    features.forEach(feature => {
        try {
            feature();
        } catch (error) {
            console.warn(`⚠️ Feature ${feature.name} failed:`, error);
        }
    });
}

// ============================================
// STORAGE MANAGEMENT SYSTEM
// ============================================
function initializeStorageSystem() {
    console.log('🗃️ Initializing storage system...');
    
    if (!isStorageAvailable()) {
        console.error('❌ Storage not available');
        showNotification('Storage is disabled. Some features may not work properly.', 'warning');
        return false;
    }
    
    // Setup storage event listeners
    setupStorageEvents();
    
    // Check and restore data
    checkStorageConsistency();
    
    // Backup critical data
    backupCriticalData();
    
    // Setup periodic sync
    setupStorageSync();
    
    return true;
}

function setupStoragePersistence() {
    console.log('💾 Setting up storage persistence...');
    
    // Request persistence if supported
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(persisted => {
            console.log(persisted ? '🔒 Storage will not be cleared' : '⚠️ Storage may be cleared');
        });
    }
    
    // Keep storage alive with periodic updates
    const keepAlive = setInterval(() => {
        if (document.visibilityState === 'visible') {
            localStorage.setItem('portfolio-heartbeat', Date.now().toString());
        }
    }, 30000); // Every 30 seconds
    
    // Save before unload
    window.addEventListener('beforeunload', () => {
        clearInterval(keepAlive);
        saveCriticalDataSnapshot();
    });
}

function isStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

function setupStorageEvents() {
    // Listen for storage changes across tabs
    window.addEventListener('storage', (event) => {
        console.log('📦 Storage changed:', event.key);
        
        if (event.key === 'portfolio-total-likes') {
            updateLikeDisplay();
        }
        
        if (event.key === 'portfolio-theme') {
            loadThemePreference();
        }
    });
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkStorageConsistency();
        }
    });
}

function checkStorageConsistency() {
    try {
        const requiredKeys = [
            'portfolio-total-likes',
            'portfolio-liked-devices',
            'portfolio-theme'
        ];
        
        let missingKeys = [];
        
        requiredKeys.forEach(key => {
            if (!localStorage.getItem(key)) {
                missingKeys.push(key);
            }
        });
        
        if (missingKeys.length > 0) {
            console.warn('Missing storage keys:', missingKeys);
            restoreFromBackup();
        }
        
        return missingKeys.length === 0;
        
    } catch (error) {
        console.error('Storage consistency check failed:', error);
        return false;
    }
}

function backupCriticalData() {
    try {
        const backupData = {
            likes: localStorage.getItem('portfolio-total-likes') || '0',
            devices: localStorage.getItem('portfolio-liked-devices') || '[]',
            theme: localStorage.getItem('portfolio-theme') || 'dark',
            timestamp: Date.now(),
            version: CONFIG.storage.version
        };
        
        // Save to sessionStorage as backup
        sessionStorage.setItem('portfolio-backup', JSON.stringify(backupData));
        
        // Save checksum
        sessionStorage.setItem('portfolio-backup-checksum', 
            createChecksum(JSON.stringify(backupData)));
        
        console.log('💽 Critical data backed up');
        return true;
        
    } catch (error) {
        console.warn('Backup failed:', error);
        return false;
    }
}

function restoreFromBackup() {
    try {
        const backup = sessionStorage.getItem('portfolio-backup');
        const checksum = sessionStorage.getItem('portfolio-backup-checksum');
        
        if (backup && checksum && createChecksum(backup) === checksum) {
            const data = JSON.parse(backup);
            
            if (data.likes) localStorage.setItem('portfolio-total-likes', data.likes);
            if (data.devices) localStorage.setItem('portfolio-liked-devices', data.devices);
            if (data.theme) localStorage.setItem('portfolio-theme', data.theme);
            
            console.log('✅ Restored from backup');
            return true;
        }
    } catch (error) {
        console.warn('Restore failed:', error);
    }
    return false;
}

function saveCriticalDataSnapshot() {
    try {
        const snapshot = {
            likes: localStorage.getItem('portfolio-total-likes') || '0',
            devices: localStorage.getItem('portfolio-liked-devices') || '[]',
            theme: localStorage.getItem('portfolio-theme') || 'dark',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        localStorage.setItem('portfolio-snapshot', JSON.stringify(snapshot));
        return true;
        
    } catch (error) {
        console.warn('Snapshot failed:', error);
        return false;
    }
}

function setupStorageSync() {
    const syncInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            saveCriticalDataSnapshot();
        }
    }, CONFIG.storage.backupInterval);
    
    window.addEventListener('beforeunload', () => {
        clearInterval(syncInterval);
    });
}

function createChecksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// ============================================
// ENHANCED LIKE SYSTEM
// ============================================
async function initializeEnhancedLikeSystem() {
    console.log('❤️ Initializing like system...');
    
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    
    if (!likeBtn || !likeCount) {
        console.warn('Like elements not found');
        return;
    }
    
    try {
        // Generate device ID
        const deviceId = await generateDeviceId();
        
        // Load like data
        const totalLikes = parseInt(localStorage.getItem('portfolio-total-likes') || '0');
        const likedDevices = JSON.parse(localStorage.getItem('portfolio-liked-devices') || '[]');
        
        // Update display
        likeCount.textContent = totalLikes;
        
        // Check if already liked
        const hasLiked = likedDevices.some(device => device.id === deviceId);
        
        if (hasLiked) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').classList.replace('far', 'fas');
            likeBtn.disabled = true;
            likeBtn.title = "You've already liked!";
        }
        
        // Setup click handler
        setupLikeButtonClick(likeBtn, deviceId, likedDevices);
        
        console.log('✅ Like system initialized');
        
    } catch (error) {
        console.error('Like system failed:', error);
        initializeBasicLikeSystem();
    }
}

async function generateDeviceId() {
    // Create a stable device ID
    const components = [
        navigator.userAgent,
        navigator.language,
        navigator.platform,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown'
    ];
    
    // Simple hash
    let hash = 0;
    const str = components.join('||');
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    return 'device_' + Math.abs(hash).toString(36);
}

function setupLikeButtonClick(button, deviceId, likedDevices) {
    let isProcessing = false;
    
    button.addEventListener('click', async function(event) {
        event.preventDefault();
        
        if (isProcessing || this.classList.contains('liked')) {
            return;
        }
        
        isProcessing = true;
        
        try {
            // Get current data
            let currentLikes = parseInt(localStorage.getItem('portfolio-total-likes') || '0');
            let devices = JSON.parse(localStorage.getItem('portfolio-liked-devices') || '[]');
            
            // Check again
            if (devices.some(d => d.id === deviceId)) {
                this.classList.add('liked');
                this.querySelector('i').classList.replace('far', 'fas');
                this.disabled = true;
                return;
            }
            
            // Increment likes
            currentLikes++;
            
            // Add device
            devices.push({
                id: deviceId,
                timestamp: Date.now(),
                date: new Date().toISOString()
            });
            
            // Trim if too many
            if (devices.length > CONFIG.storage.maxDevices) {
                devices = devices.slice(-CONFIG.storage.maxDevices);
            }
            
            // Update storage
            localStorage.setItem('portfolio-total-likes', currentLikes.toString());
            localStorage.setItem('portfolio-liked-devices', JSON.stringify(devices));
            
            // Update UI
            animateCounter(button.querySelector('.like-count'), currentLikes - 1, currentLikes);
            this.classList.add('liked');
            this.querySelector('i').classList.replace('far', 'fas');
            this.disabled = true;
            
            // Animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
            
            // Confetti
            triggerConfetti();
            
            // Show message
            showNotification('Thank you for your support! ❤️', 'success');
            
            // Backup data
            backupCriticalData();
            
            console.log('👍 Like registered:', { totalLikes: currentLikes });
            
        } catch (error) {
            console.error('Like processing error:', error);
            showNotification('Failed to process like. Please try again.', 'error');
        } finally {
            isProcessing = false;
        }
    });
}

function initializeBasicLikeSystem() {
    console.log('🔄 Initializing basic like system...');
    
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    
    if (!likeBtn || !likeCount) return;
    
    const totalLikes = parseInt(localStorage.getItem('portfolio-basic-likes') || '0');
    likeCount.textContent = totalLikes;
    
    if (sessionStorage.getItem('portfolio-basic-liked')) {
        likeBtn.classList.add('liked');
        likeBtn.querySelector('i').classList.replace('far', 'fas');
        likeBtn.disabled = true;
    }
    
    likeBtn.addEventListener('click', function() {
        if (this.classList.contains('liked')) return;
        
        const currentLikes = parseInt(localStorage.getItem('portfolio-basic-likes') || '0') + 1;
        
        localStorage.setItem('portfolio-basic-likes', currentLikes.toString());
        sessionStorage.setItem('portfolio-basic-liked', 'true');
        
        likeCount.textContent = currentLikes;
        this.classList.add('liked');
        this.querySelector('i').classList.replace('far', 'fas');
        this.disabled = true;
        
        triggerConfetti();
        showNotification('Thank you for your like! 🎉', 'success');
    });
}

function updateLikeDisplay() {
    const likeCount = document.getElementById('like-count');
    if (likeCount) {
        const totalLikes = localStorage.getItem('portfolio-total-likes') || '0';
        likeCount.textContent = totalLikes;
    }
}

function animateCounter(element, start, end, duration = 500) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(start + (end - start) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// THEME SYSTEM
// ============================================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        const isLight = document.body.classList.toggle('light-mode');
        
        if (isLight) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            this.title = 'Switch to dark mode';
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            this.title = 'Switch to light mode';
            localStorage.setItem('portfolio-theme', 'dark');
        }
        
        // Animation
        this.style.transform = 'rotate(180deg) scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = 'Switch to dark mode';
        }
    } else if (!savedTheme && !prefersDark) {
        document.body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = 'Switch to dark mode';
        }
    }
}

// ============================================
// ANIMATIONS & EFFECTS
// ============================================
function initializeParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    try {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: "#00d2ff" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00d2ff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true
                }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
    } catch (error) {
        console.warn('Particles error:', error);
    }
}

function initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const texts = [
        "Recent CS Graduate",
        "AI Enthusiast",
        "Front-End Developer",
        "Python Programmer",
        "Quick Learner",
        "Problem Solver"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    setTimeout(type, 1000);
}

function initializeSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.querySelector('.skill-level');
                if (skillLevel) {
                    const width = skillLevel.style.width;
                    skillLevel.style.width = '0';
                    
                    setTimeout(() => {
                        skillLevel.style.transition = 'width 1.5s ease';
                        skillLevel.style.width = width;
                    }, 100);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillItems.forEach(item => observer.observe(item));
}

function initializeScrollAnimations() {
    const animateOnScroll = (elements, className) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => observer.observe(element));
    };
    
    // Animate cards
    const cards = document.querySelectorAll('.glass-effect');
    animateOnScroll(cards, 'animate__fadeInUp');
    
    // Animate titles
    const titles = document.querySelectorAll('.section-title');
    animateOnScroll(titles, 'animate__fadeIn');
}

// ============================================
// NAVIGATION & MENU
// ============================================
function initializeMobileMenu() {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (!menuIcon || !navLinks || !hamburger) return;
    
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Toggle body scroll
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuIcon.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

function closeMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    if (navLinks && hamburger) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            // Close mobile menu
            closeMenu();
            
            // Calculate scroll position
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            // Smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL
            history.pushState(null, null, href);
        });
    });
}

function setupActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ============================================
// FORM HANDLING
// ============================================
function initializeFormHandling() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Setup form validation
    setupFormValidation(contactForm);
    
    // Setup form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Setup real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.parentElement.classList.remove('error', 'success');
            
            if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value.trim())) {
                    this.parentElement.classList.add('error');
                } else {
                    this.parentElement.classList.add('success');
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.parentElement;
    
    formGroup.classList.remove('error', 'success');
    
    if (!value && field.hasAttribute('required')) {
        formGroup.classList.add('error');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            formGroup.classList.add('error');
            return false;
        }
    }
    
    if (value) {
        formGroup.classList.add('success');
    }
    
    return true;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.btn-submit');
    const formMessage = document.getElementById('form-message');
    
    // Validate form
    if (!validateForm(form)) {
        showFormMessage('Please fill all required fields correctly.', 'error', formMessage);
        return;
    }
    
    // Disable button
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Collect form data
    const formData = {
        user_name: sanitizeInput(form.user_name.value),
        user_email: sanitizeInput(form.user_email.value),
        user_subject: sanitizeInput(form.user_subject.value),
        message: sanitizeInput(form.message.value),
        fresher_acknowledge: form.fresher_acknowledge.checked ? 'Yes' : 'No',
        timestamp: new Date().toISOString(),
        page_url: window.location.href
    };
    
    try {
        // Try EmailJS if enabled in email-config.js
        if (typeof EMAIL_CONFIG !== 'undefined' && EMAIL_CONFIG.enabled) {
            
            // Call the function from email-config.js
            const result = await sendPortfolioEmail(formData);
            
            if (result.success) {
                showFormMessage(result.message, 'success', formMessage);
                // Reset form
                form.reset();
                // Clear validation states
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('success');
                });
            } else {
                showFormMessage(result.message, 'error', formMessage);
            }
        } else {
            // Fallback to mailto
            sendEmailViaMailto(formData);
            showFormMessage('Opening your email client... Please send the pre-filled email.', 'info', formMessage);
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Failed to send message. Please try again or email me directly.', 'error', formMessage);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    for (let input of inputs) {
        if (!input.value.trim()) {
            return false;
        }
        
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                return false;
            }
        }
    }
    
    return true;
}

function sendEmailViaMailto(data) {
    const email = 'sivasankarvenkatesan5@gmail.com';
    const subject = encodeURIComponent(data.user_subject || 'Portfolio Inquiry');
    const body = encodeURIComponent(
        `Name: ${data.user_name}\nEmail: ${data.user_email}\n\nMessage:\n${data.message}`
    );
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function showFormMessage(message, type, container) {
    container.textContent = message;
    container.className = `form-message ${type}`;
    container.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

// ============================================
// DATA PROTECTION
// ============================================
function protectContactData() {
    try {
        const phoneData = "KzkxIDk5NDQwMjg0MjU="; // Base64 encoded
        const emailData = "c2l2YXNhbmthcnZlbmthdGVzYW41QGdtYWlsLmNvbQ==";
        
        // Decode phone
        const phoneElement = document.getElementById('b-phone');
        const callLink = document.getElementById('call-link');
        
        if (phoneElement) {
            const decodedPhone = atob(phoneData);
            phoneElement.textContent = decodedPhone;
            
            if (callLink) {
                callLink.href = `tel:${decodedPhone.replace(/\s/g, '')}`;
            }
        }
        
        // Decode email
        const emailElement = document.getElementById('b-email');
        const emailLink = document.getElementById('email-link');
        
        if (emailElement) {
            const decodedEmail = atob(emailData);
            emailElement.textContent = decodedEmail;
            
            if (emailLink) {
                emailLink.href = `mailto:${decodedEmail}`;
            }
        }
        
        // Update WhatsApp links
        const whatsappLinks = document.querySelectorAll('.whatsapp-link');
        if (whatsappLinks.length > 0 && phoneElement) {
            const cleanNumber = atob(phoneData).replace(/\s/g, '').replace('+', '');
            const whatsappUrl = `https://wa.me/${cleanNumber}`;
            whatsappLinks.forEach(link => {
                link.href = whatsappUrl;
            });
        }
        
    } catch (error) {
        console.error('Data protection error:', error);
        // Fallback to plain text
        const phoneElement = document.getElementById('b-phone');
        const emailElement = document.getElementById('b-email');
        
        if (phoneElement) phoneElement.textContent = '+91 99440 28425';
        if (emailElement) emailElement.textContent = 'sivasankarvenkatesan5@gmail.com';
    }
}

function sanitizeInput(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input.toString();
    return div.innerHTML;
}

// ============================================
// BACK TO TOP
// ============================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 100));
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

function preloadCriticalResources() {
    const resources = [
        'style.css',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    resources.forEach(resource => {
        if (resource.endsWith('.css')) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            link.onload = () => link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// CONFETTI & NOTIFICATIONS
// ============================================
function triggerConfetti() {
    if (typeof confetti !== 'function') return;
    
    try {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00d2ff', '#3a7bd5', '#ff6b6b', '#4CAF50']
        });
    } catch (error) {
        console.warn('Confetti error:', error);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.getElementById('portfolio-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.id = 'portfolio-notification';
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: rgba(10, 10, 26, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 210, 255, 0.3);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 50px;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            .notification.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            .notification.success {
                background: linear-gradient(135deg, #00d2ff, #3a7bd5);
            }
            .notification.error {
                background: linear-gradient(135deg, #ff6b6b, #ff4757);
            }
            .notification.info {
                background: linear-gradient(135deg, #6c757d, #495057);
            }
            .notification i:first-child {
                font-size: 1.2rem;
            }
            .notification span {
                font-weight: 500;
                white-space: nowrap;
            }
            .close-notification {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            }
            .close-notification:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            @media (max-width: 768px) {
                .notification {
                    width: 90%;
                    padding: 0.8rem 1.2rem;
                }
                .notification span {
                    white-space: normal;
                    text-align: center;
                    flex: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-remove
    const autoRemove = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    });
}

// ============================================
// PWA & SERVICE WORKER
// ============================================
function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.warn('Service Worker registration failed:', error);
            });
    }
    
    // Detect standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.documentElement.setAttribute('data-pwa', 'true');
    }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', () => {
        console.log('🌐 Online');
        showNotification('You are back online!', 'success');
    });
    
    window.addEventListener('offline', () => {
        console.log('📴 Offline');
        showNotification('You are offline. Some features may not work.', 'warning');
    });
    
    // Page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('🔍 Page became visible');
        }
    });
    
    // Error handling
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);
}

function handleGlobalError(event) {
    console.error('Global error:', event.error);
    
    // Don't show error notifications for minor errors
    if (event.message && event.message.includes('ResizeObserver')) {
        return; // Ignore ResizeObserver errors
    }
}

function handlePromiseRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
}

// ============================================
// FALLBACK FEATURES
// ============================================
function initializeFallbackFeatures() {
    console.log('🔄 Initializing fallback features...');
    
    const fallbackFeatures = [
        () => document.getElementById('like-count') && (document.getElementById('like-count').textContent = '0'),
        protectContactData,
        initializeMobileMenu,
        initializeBackToTop,
        setupSmoothScrolling
    ];
    
    fallbackFeatures.forEach(feature => {
        try {
            feature();
        } catch (error) {
            console.warn('Fallback feature failed:', error);
        }
    });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('⏱️ Page load time:', loadTime, 'ms');
            
            if (loadTime > 3000) {
                console.warn('⚠️ Page load time is slow');
            }
        });
    }
    
    // Monitor FPS
    if (CONFIG.analytics.enabled) {
        monitorFPS();
    }
}

function monitorFPS() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            if (fps < 30) {
                console.warn('⚠️ Low FPS detected:', fps);
            }
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    requestAnimationFrame(checkFPS);
}

// ============================================
// EXPORT GLOBAL FUNCTIONS
// ============================================
window.portfolioApp = {
    // Core functions
    initialize: initializeCoreSystems,
    backupData: backupCriticalData,
    restoreData: restoreFromBackup,
    
    // UI functions
    toggleTheme: function() {
        document.querySelector('#theme-toggle')?.click();
    },
    showNotification: showNotification,
    triggerConfetti: triggerConfetti,
    
    // Utility functions
    sanitizeInput: sanitizeInput,
    validateEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Contact functions
    makeCall: function() {
        const phoneElement = document.getElementById('b-phone');
        if (phoneElement) {
            window.location.href = `tel:${phoneElement.textContent.replace(/\s/g, '')}`;
        }
    },
    sendEmail: function() {
        const emailElement = document.getElementById('b-email');
        if (emailElement) {
            window.location.href = `mailto:${emailElement.textContent}`;
        }
    },
    
    // Version info
    version: '2.0.0',
    config: CONFIG
};

// ============================================
// PAGE LOAD COMPLETE
// ============================================
window.addEventListener('load', () => {
    console.log('📄 Page fully loaded');
    
    // Remove loading class if present
    document.body.classList.remove('loading');
    
    // Track visit
    const visitCount = parseInt(localStorage.getItem('portfolio-visit-count') || '0') + 1;
    localStorage.setItem('portfolio-visit-count', visitCount.toString());
    localStorage.setItem('portfolio-last-visit', Date.now().toString());
    
    // Show welcome message on first visit
    if (visitCount === 1) {
        setTimeout(() => {
            showNotification('Welcome to my portfolio! 👋 Explore my projects and skills.', 'info');
        }, 2000);
    }
    
    // Check connection quality
    if (navigator.connection) {
        console.log('📡 Connection:', {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        });
    }
});

// ============================================
// INITIALIZATION COMPLETE
// ============================================
console.log('🎯 Portfolio script loaded successfully!');