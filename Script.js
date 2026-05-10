// ==========================================
// UNDANGAN DIGITAL - INTERACTIVE FEATURES
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== OPEN INVITATION ==========
    const cover = document.getElementById('cover');
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    openBtn.addEventListener('click', function() {
        cover.classList.add('open');
        mainContent.classList.remove('hidden');
        
        // Auto play music
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }).catch(err => {
            console.log('Autoplay prevented:', err);
        });
        
        // Start animations
        startPetalAnimation();
        initScrollAnimations();
    });
    
    // ========== MUSIC TOGGLE ==========
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.textContent = '🔇';
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }
        isPlaying = !isPlaying;
    });
    
    bgMusic.addEventListener('play', () => isPlaying = true);
    bgMusic.addEventListener('pause', () => isPlaying = false);
    
    // ========== COUNTDOWN TIMER ==========
    const weddingDate = new Date('Juni 6, 2026 08:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // ========== FLOATING PETALS ANIMATION ==========
    function startPetalAnimation() {
        const petalsContainer = document.querySelector('.floating-petals');
        if (!petalsContainer) return;
        
        function createPetal() {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            const size = Math.random() * 15 + 10;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 3;
            
            petal.style.width = size + 'px';
            petal.style.height = size + 'px';
            petal.style.left = startX + 'px';
            petal.style.animationDuration = duration + 's';
            petal.style.animationDelay = delay + 's';
            
            petalsContainer.appendChild(petal);
            
            // Remove petal after animation
            setTimeout(() => {
                petal.remove();
            }, (duration + delay) * 1000);
        }
        
        // Create initial petals
        for (let i = 0; i < 15; i++) {
            createPetal();
        }
        
        // Continuously create petals
        setInterval(createPetal, 800);
    }
    
    // ========== SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        fadeElements.forEach(el => observer.observe(el));
    }
    
    // ========== RSVP FORM ==========
    const rsvpForm = document.getElementById('rsvpForm');
    const wishesList = document.getElementById('wishesList');
    
    // Load existing wishes from localStorage
    loadWishes();
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('guestName').value.trim();
        const attendance = document.getElementById('attendance').value;
        const guests = document.getElementById('guests').value;
        const wishes = document.getElementById('wishes').value.trim();
        
        if (!name || !attendance) {
            showNotification('Mohon lengkapi nama dan konfirmasi kehadiran', 'error');
            return;
        }
        
        // Create wish object
        const wishData = {
            name: name,
            attendance: attendance,
            guests: guests,
            wishes: wishes,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        saveWish(wishData);
        
        // Display the wish
        displayWish(wishData);
        
        // Reset form
        rsvpForm.reset();
        
        // Show success notification
        showNotification('Terima kasih atas konfirmasi Anda! 💝', 'success');
    });
    
    function saveWish(wish) {
        let wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
        wishes.unshift(wish);
        localStorage.setItem('weddingWishes', JSON.stringify(wishes));
    }
    
    function loadWishes() {
        const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
        wishes.forEach(wish => displayWish(wish));
    }
    
    function displayWish(wish) {
        if (!wish.wishes) return;
        
        const wishItem = document.createElement('div');
        wishItem.classList.add('wish-item');
        
        const attendanceEmoji = wish.attendance === 'hadir' ? '✅' : 
                                wish.attendance === 'tidak' ? '❌' : '🤔';
        
        const timeAgo = getTimeAgo(new Date(wish.timestamp));
        
        wishItem.innerHTML = `
            <h4>${attendanceEmoji} ${wish.name}</h4>
            <p>${wish.wishes}</p>
            <p class="wish-time">${timeAgo}</p>
        `;
        
        wishesList.insertBefore(wishItem, wishesList.firstChild);
    }
    
    function getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Baru saja';
        if (minutes < 60) return `${minutes} menit yang lalu`;
        if (hours < 24) return `${hours} jam yang lalu`;
        return `${days} hari yang lalu`;
    }
    
    // ========== GALLERY LIGHTBOX ==========
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems);
    
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(img.src);
        });
    });
    
    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });
    
    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 50px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            animation: slideDown 0.3s ease;
            background: ${type === 'success' ? 'linear-gradient(135deg, #8B5A6B, #5C3D47)' : '#e74c3c'};
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // ========== SMOOTH SCROLL FOR NAV LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
});

// ========== COPY TO CLIPBOARD ==========
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Find notification or create simple alert
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.8rem 1.5rem;
            background: #333;
            color: white;
            border-radius: 50px;
            z-index: 3000;
            font-size: 0.9rem;
        `;
        notification.textContent = '📋 Nomor rekening disalin!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Nomor rekening: ' + text);
    });
}

// ========== ADD TO CALENDAR ==========
function addToCalendar(event) {
    const title = encodeURIComponent('Pernikahan Andi & Bella');
    const details = encodeURIComponent('Kami mengundang Anda untuk menghadiri pernikahan kami');
    const location = encodeURIComponent('Gedung Serbaguna Harmoni, Jakarta');
    const startDate = '20260615T080000';
    const endDate = '20260615T140000';
    
    const googleCalendarUrl = `[calendar.google.com](https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate})`;
    
    window.open(googleCalendarUrl, '_blank');
}