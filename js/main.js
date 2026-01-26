document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    
    const updateHeader = () => {
         if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    // Gallery Drag & Auto-Scroll Logic
    const galleryWindows = document.querySelectorAll('.track-window');
    
    galleryWindows.forEach(windowEl => {
        let isDown = false;
        let startX;
        let scrollLeftBase; // Renamed to clear confusion with DOM scrollLeft
        let animationId;
        
        // Auto-scroll settings
        const direction = windowEl.dataset.direction || 'left';
        const speed = 1.0; 
        
        let scrollPos = windowEl.scrollLeft;

        const animate = () => {
            // 1. Update State
            if (!isDown) {
                if (direction === 'left') {
                    scrollPos += speed;
                } else {
                    scrollPos -= speed;
                }
            }
            
            // 2. Handle Wrapping (Infinite Scroll)
            const maxScroll = windowEl.scrollWidth / 2;
            // Guard against division by zero or uninitialized width
            if (maxScroll > 0) {
                if (scrollPos >= maxScroll) {
                    scrollPos -= maxScroll;
                    if (isDown) scrollLeftBase -= maxScroll;
                } else if (scrollPos <= 0) {
                    scrollPos += maxScroll;
                    if (isDown) scrollLeftBase += maxScroll;
                }
            }

            // 3. Render (Update DOM)
            windowEl.scrollLeft = scrollPos;
            
            animationId = requestAnimationFrame(animate);
        };
        
        const initScroll = () => {
            if (direction === 'right') {
                 scrollPos = windowEl.scrollWidth / 2;
                 // Sync if initial position was clamped
                 if (scrollPos > windowEl.scrollWidth - windowEl.clientWidth) {
                     scrollPos = windowEl.scrollWidth - windowEl.clientWidth;
                 }
            }
            animate();
        };

        if (document.readyState === 'complete') {
            initScroll();
        } else {
            window.addEventListener('load', initScroll);
        }

        // Drag functionality
        windowEl.addEventListener('mousedown', (e) => {
            isDown = true;
            windowEl.style.cursor = 'grabbing';
            startX = e.pageX - windowEl.offsetLeft;
            scrollLeftBase = scrollPos; // Capture current calculated pos
        });

        const stopDrag = () => {
            isDown = false;
            windowEl.style.cursor = 'grab';
        };

        windowEl.addEventListener('mouseleave', stopDrag);
        windowEl.addEventListener('mouseup', stopDrag);

        windowEl.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - windowEl.offsetLeft;
            const walk = (x - startX) * 2; 
            scrollPos = scrollLeftBase - walk; // Update state, don't touch DOM
        });
        
        // Touch events
        let touchStartX = 0;
        let touchStartY = 0;

        windowEl.addEventListener('touchstart', (e) => {
            isDown = true;
            touchStartX = e.touches[0].pageX;
            touchStartY = e.touches[0].pageY;
            startX = e.touches[0].pageX - windowEl.offsetLeft;
            scrollLeftBase = scrollPos;
        }, { passive: true });

        windowEl.addEventListener('touchend', stopDrag);

        windowEl.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            
            const xPage = e.touches[0].pageX;
            const yPage = e.touches[0].pageY;
            const xDiff = Math.abs(xPage - touchStartX);
            const yDiff = Math.abs(yPage - touchStartY);

            if (xDiff > yDiff) {
                if (e.cancelable) e.preventDefault();
                const x = xPage - windowEl.offsetLeft;
                const walk = (x - startX) * 2;
                scrollPos = scrollLeftBase - walk;
            }
        }, { passive: false });
    });

    // Reviews Carousel Logic
    const reviewsTrack = document.getElementById('reviewsTrack');
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (reviewsTrack && prevBtn && nextBtn) {
        const scrollAmount = 330; // Card width + gap (approx)
        
        nextBtn.addEventListener('click', () => {
            reviewsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            reviewsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const cardWidth = reviewsTrack.querySelector('.review-card').offsetWidth;
                const gap = 32; // 2rem
                const scrollPos = index * (cardWidth + gap);
                reviewsTrack.scrollTo({ left: scrollPos, behavior: 'smooth' });
                
                updateActiveDot(index);
            });
        });
        
        // Update dots on scroll
        reviewsTrack.addEventListener('scroll', () => {
            const cardWidth = reviewsTrack.querySelector('.review-card').offsetWidth;
            const gap = 32;
            const index = Math.round(reviewsTrack.scrollLeft / (cardWidth + gap));
            updateActiveDot(index);
        });
        
        function updateActiveDot(index) {
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        }
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav li, nav .cta-button');
    const headerContainer = document.querySelector('.header-container');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('active');
            headerContainer.classList.toggle('menu-open');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                headerContainer.classList.remove('menu-open');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            });
        });
    }
});
