// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create floating hearts in background
    createFloatingHearts();
    
    // Initialize memory gallery
    initMemoryGallery();
    
    // Initialize timeline animations
    initTimeline();
    
    // Setup WhatsApp sharing with Marathi message
    setupWhatsAppSharing();
    
    // Add more floating hearts on click
    document.addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
            createClickHeart(e.clientX, e.clientY);
        }
    });
    
    // Add Marathi font styling to all Marathi text
    styleMarathiText();
});

// Style all Marathi text elements
function styleMarathiText() {
    const marathiElements = document.querySelectorAll('.marathi-text, .marathi-title, .marathi-poem, .marathi-footer-note p');
    marathiElements.forEach(el => {
        el.classList.add('marathi-text');
    });
}

// Create floating hearts in background
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const heartCount = 30;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.opacity = Math.random() * 0.2 + 0.05;
        heart.style.zIndex = '0';
        heart.style.pointerEvents = 'none';
        
        // Random animation
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 10;
        heart.style.animation = `floatHeart ${duration}s linear ${delay}s infinite`;
        
        heartsContainer.appendChild(heart);
    }
}

// Create heart on click
function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.fontSize = '25px';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.color = '#B22222';
    heart.style.zIndex = '10000';
    heart.style.pointerEvents = 'none';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = `clickHeart 1.5s ease-out forwards`;
    
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// Add click heart animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes clickHeart {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -100%) scale(1.5);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

// Memory Gallery Functionality
function initMemoryGallery() {
    const memoryItems = document.querySelectorAll('.memory-item');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const autoPlayBtn = document.getElementById('auto-play');
    const dotsContainer = document.querySelector('.dots-container');
    const currentMemorySpan = document.querySelector('.current-memory');
    
    let currentIndex = 0;
    let autoPlayInterval = null;
    let isAutoPlaying = false;
    
    // Create dots for each memory
    memoryItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToMemory(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Update current memory display
    function updateCurrentMemory() {
        memoryItems.forEach((item, index) => {
            item.classList.remove('active');
            dots[index].classList.remove('active');
        });
        
        memoryItems[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        
        // Update text in Marathi
        currentMemorySpan.textContent = `आठवण ${currentIndex + 1} पैकी ${memoryItems.length}`;
        
        // Add photo zoom effect
        const activePhoto = memoryItems[currentIndex].querySelector('.memory-photo');
        activePhoto.style.transform = 'scale(1)';
        setTimeout(() => {
            activePhoto.style.transform = 'scale(1.05)';
        }, 100);
        
        // Add Marathi text animation
        const memoryText = memoryItems[currentIndex].querySelector('.memory-text');
        memoryText.style.animation = 'none';
        setTimeout(() => {
            memoryText.style.animation = 'fadeInUp 0.8s ease-out';
        }, 10);
    }
    
    // Go to specific memory
    function goToMemory(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = memoryItems.length - 1;
        if (currentIndex >= memoryItems.length) currentIndex = 0;
        updateCurrentMemory();
    }
    
    // Next memory
    function nextMemory() {
        currentIndex++;
        if (currentIndex >= memoryItems.length) currentIndex = 0;
        updateCurrentMemory();
    }
    
    // Previous memory
    function prevMemory() {
        currentIndex--;
        if (currentIndex < 0) currentIndex = memoryItems.length - 1;
        updateCurrentMemory();
    }
    
    // Auto-play functionality
    function toggleAutoPlay() {
        if (isAutoPlaying) {
            stopAutoPlay();
            autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> आठवणी स्वयंचलित पाहा';
            autoPlayBtn.style.background = 'linear-gradient(45deg, var(--marathi-red), var(--primary-pink))';
        } else {
            startAutoPlay();
            autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> स्वयंचलित थांबवा';
            autoPlayBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        }
        isAutoPlaying = !isAutoPlaying;
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextMemory, 5000); // Change every 5 seconds
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevMemory);
    nextBtn.addEventListener('click', nextMemory);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevMemory();
        if (e.key === 'ArrowRight') nextMemory();
        if (e.key === ' ') {
            e.preventDefault();
            toggleAutoPlay();
        }
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                nextMemory();
            } else {
                // Swipe right - previous
                prevMemory();
            }
        }
    }
    
    // Initialize
    updateCurrentMemory();
    
    // Auto-start after 10 seconds
    setTimeout(() => {
        if (!isAutoPlaying) {
            toggleAutoPlay();
        }
    }, 10000);
}

// Timeline animation on scroll
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Show timeline items when in viewport
    function showTimelineItems() {
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('visible');
            }
        });
    }
    
    // Initial check
    showTimelineItems();
    
    // Check on scroll
    window.addEventListener('scroll', showTimelineItems);
}

// WhatsApp sharing functionality with Marathi message
function setupWhatsAppSharing() {
    const whatsappBtn = document.getElementById('whatsapp-share');
    
    whatsappBtn.addEventListener('click', function() {
        // Marathi message for your partner
        const marathiMessage = `माझ्या प्रियेला 💖

मी तुझ्यासाठी काहीतरी विशेष तयार केलंय - आपल्या एकत्रित सुंदर आठवणींचा संग्रह.

प्रत्येक फोटो आपल्या प्रेमकथेची सांगतो, प्रत्येक कैद केलेला क्षण माझ्या हृदयातील एक खजिना आहे.

माझं तुला लिहिलेलं प्रेमपत्र पाहण्यासाठी ही लिंक उघडा: ${window.location.href}

तू माझ्यासाठी सर्वकाही आहेस.
तुझाच, कायमचा ❤️`;
        
        // English translation
        const englishMessage = `My Dearest Love 💖

I've created something special just for you - a beautiful collection of our memories together.

Every photo tells our story, every moment captured is a treasure in my heart.

Open this link to see my love letter to you: ${window.location.href}

You mean everything to me.
Forever yours ❤️`;
        
        // Combine both messages
        const message = `${marathiMessage}\n\n${englishMessage}`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp share URL
        const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappURL, '_blank');
        
        // Create a Marathi romantic notification
        createMarathiNotification();
    });
}

// Create a Marathi romantic notification when sharing
function createMarathiNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #B22222, #ff4d8d);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.5s ease-out;
            max-width: 300px;
            font-family: 'Kalam', cursive;
            font-size: 1.3rem;
            border-right: 5px solid #ffd700;
        ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <i class="fas fa-heart" style="font-size: 1.5rem; color: #ffd700;"></i>
                <strong style="font-family: 'Hind', sans-serif;">प्रेम पाठवलं!</strong>
            </div>
            <p>तुझा सरप्राईज तयार केला जात आहे! तुला हे नक्की आवडेल! 💖</p>
            <p style="font-size: 1rem; margin-top: 10px; font-style: italic;">Love Sent! She's going to love this!</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Add the slide out animation
    const notifStyle = document.createElement('style');
    notifStyle.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(notifStyle);
}

// Photo replacement helper - This function helps replace placeholder images
function replacePhoto(photoId, newSrc) {
    const photo = document.getElementById(photoId);
    if (photo) {
        // Create a fade out effect
        photo.style.opacity = '0';
        photo.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            photo.src = newSrc;
            photo.style.opacity = '1';
            
            // Add a nice transition effect
            photo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                photo.style.transform = 'scale(1.05)';
                photo.style.transition = 'transform 1.5s cubic-bezier(0.215, 0.61, 0.355, 1)';
            }, 50);
        }, 500);
    }
}

// Add floating Rangoli patterns
function createRangoliPatterns() {
    const rangoliPatterns = ['🌸', '🌺', '💮', '🏵️', '🌼', '🌻', '🥀', '🌷'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 15; i++) {
        const rangoli = document.createElement('div');
        rangoli.innerHTML = rangoliPatterns[Math.floor(Math.random() * rangoliPatterns.length)];
        rangoli.style.position = 'absolute';
        rangoli.style.fontSize = Math.random() * 25 + 15 + 'px';
        rangoli.style.left = Math.random() * 100 + '%';
        rangoli.style.top = Math.random() * 100 + '%';
        rangoli.style.opacity = Math.random() * 0.1 + 0.05;
        rangoli.style.zIndex = '0';
        rangoli.style.pointerEvents = 'none';
        rangoli.style.animation = `rangoliFloat ${Math.random() * 40 + 20}s linear infinite`;
        
        container.appendChild(rangoli);
    }
    
    // Add rangoli animation to CSS
    const rangoliStyle = document.createElement('style');
    rangoliStyle.textContent = `
        @keyframes rangoliFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.1;
            }
            50% {
                opacity: 0.15;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rangoliStyle);
}

// Initialize rangoli patterns
setTimeout(createRangoliPatterns, 2000);

// Example of how to use the replacePhoto function
// To replace photo1 with your image:
// replacePhoto('photo-1', 'images/your-photo1.jpg');

// Auto-replace placeholder images if real images exist
function autoReplacePhotos() {
    const photoIds = ['photo-1', 'photo-2', 'photo-3', 'photo-4', 'photo-5', 'photo-6'];
    
    photoIds.forEach((id, index) => {
        const imgNumber = index + 1;
        const testImage = new Image();
        testImage.src = `images/photo${imgNumber}.jpg`;
        
        testImage.onload = function() {
            // Image exists, replace it
            replacePhoto(id, `images/photo${imgNumber}.jpg`);
        };
        
        testImage.onerror = function() {
            // Image doesn't exist, keep placeholder
            console.log(`Image images/photo${imgNumber}.jpg not found, using placeholder`);
        };
    });
}

// Try to auto-replace photos after page loads
setTimeout(autoReplacePhotos, 3000);