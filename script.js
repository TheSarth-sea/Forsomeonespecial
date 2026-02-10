// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create floating hearts
    createFloatingHearts();
    
    // Load photos automatically
    loadPhotoCollage();
    
    // Initialize lightbox
    initLightbox();
    
    // Add click hearts
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.photo-item') && !e.target.closest('.nav-btn')) {
            createClickHeart(e.clientX, e.clientY);
        }
    });
});

// Create floating hearts
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const heartCount = 25;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.opacity = Math.random() * 0.15 + 0.05;
        heart.style.zIndex = '0';
        heart.style.pointerEvents = 'none';
        
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
    heart.style.color = '#ff4d8d';
    heart.style.zIndex = '10000';
    heart.style.pointerEvents = 'none';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'clickHeart 1.5s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// Add click heart animation
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

// Load photos in collage
let allPhotos = [];
let currentPhotoIndex = 0;

function loadPhotoCollage() {
    const collageContainer = document.getElementById('photoCollage');
    
    // Try to load up to 30 photos
    for (let i = 1; i <= 30; i++) {
        const photoUrl = `images/photo${i}.jpg`;
        
        // Test if image exists
        const testImage = new Image();
        testImage.onload = function() {
            // Photo exists, add to collage
            allPhotos.push(photoUrl);
            createPhotoElement(photoUrl, i);
        };
        testImage.onerror = function() {
            // Photo doesn't exist, stop checking after 6 consecutive failures
            if (i > 6 && allPhotos.length === 0) {
                console.log('No photos found. Using placeholders.');
                loadPlaceholderPhotos();
                return;
            }
        };
        testImage.src = photoUrl;
    }
    
    // If no photos found after checking, load placeholders
    setTimeout(() => {
        if (allPhotos.length === 0) {
            loadPlaceholderPhotos();
        }
    }, 2000);
}

function createPhotoElement(photoUrl, index) {
    const collageContainer = document.getElementById('photoCollage');
    
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.dataset.index = allPhotos.length - 1;
    
    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = `Our Memory ${index}`;
    img.loading = 'lazy';
    
    photoItem.appendChild(img);
    collageContainer.appendChild(photoItem);
    
    // Add click event
    photoItem.addEventListener('click', function() {
        currentPhotoIndex = parseInt(this.dataset.index);
        openLightbox(currentPhotoIndex);
    });
    
    // Add staggered animation
    photoItem.style.animationDelay = `${(index - 1) * 0.1}s`;
}

function loadPlaceholderPhotos() {
    const collageContainer = document.getElementById('photoCollage');
    const placeholderUrls = [
        'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494790108755-2616b786d4d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ];
    
    placeholderUrls.forEach((url, index) => {
        allPhotos.push(url);
        createPhotoElement(url, index + 1);
    });
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevPhoto');
    const nextBtn = document.getElementById('nextPhoto');
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', prevPhoto);
    nextBtn.addEventListener('click', nextPhoto);
    
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextPhoto();
            } else {
                prevPhoto();
            }
        }
    }
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const photoCounter = document.getElementById('photoCounter');
    
    if (allPhotos.length === 0) return;
    
    currentPhotoIndex = index;
    lightboxImage.src = allPhotos[currentPhotoIndex];
    photoCounter.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
    
    // Add fade in effect
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transition = 'opacity 0.3s ease';
    }, 10);
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function prevPhoto() {
    if (allPhotos.length === 0) return;
    
    currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
    updateLightboxImage();
}

function nextPhoto() {
    if (allPhotos.length === 0) return;
    
    currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightboxImage');
    const photoCounter = document.getElementById('photoCounter');
    
    // Add fade out effect
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.src = allPhotos[currentPhotoIndex];
        photoCounter.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
        
        // Add fade in effect
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
        }, 50);
    }, 200);
}

// Auto-detect and replace with your photos
function autoReplaceWithUserPhotos() {
    // This function runs after page loads to check for user photos
    setTimeout(() => {
        const userPhotos = [];
        
        // Check for user's photos
        for (let i = 1; i <= 30; i++) {
            const img = new Image();
            img.src = `images/photo${i}.jpg`;
            img.onload = function() {
                userPhotos.push(`images/photo${i}.jpg`);
                
                // Replace placeholder if found
                if (i <= 6) { // For first 6 placeholders
                    const placeholderImgs = document.querySelectorAll('.photo-item img');
                    if (placeholderImgs[i-1]) {
                        placeholderImgs[i-1].src = `images/photo${i}.jpg`;
                    }
                }
            };
        }
    }, 3000);
}

// Initialize auto-replace
autoReplaceWithUserPhotos();
