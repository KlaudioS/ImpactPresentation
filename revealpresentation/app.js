// Professional Reveal.js Configuration for Responsive C-Suite Presentation
class PresentationApp {
  constructor() {
    this.isInitialized = false;
    this.currentSlide = 0;
    this.totalSlides = 16;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.presentationStartTime = Date.now();
    this.timerInterval = null;
    
    this.init();
  }

  async init() {
    try {
      // Wait for Reveal.js to be available
      await this.waitForReveal();
      
      // Initialize Reveal.js
      await this.initializeReveal();
      
      // Setup custom features
      this.setupCustomFeatures();
      this.setupResponsiveHandlers();
      this.setupAccessibilityFeatures();
      this.setupKeyboardShortcuts();
      this.setupTouchNavigation();
      this.setupPresentationFeatures();
      
      this.isInitialized = true;
      console.log('🎯 Agentic AI Infrastructure Presentation Ready');
      console.log('📋 Navigation: Arrow keys, Space, or touch/swipe');
      console.log('📝 Speaker Notes: Press "S" key');
      console.log('🔍 Overview: Press "ESC" key');
      console.log('⚡ Total slides:', this.totalSlides);
      
    } catch (error) {
      console.error('Failed to initialize presentation:', error);
      this.showErrorMessage('Failed to load presentation. Please refresh the page.');
    }
  }

  waitForReveal() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkReveal = () => {
        if (typeof Reveal !== 'undefined') {
          resolve();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkReveal, 100);
        } else {
          reject(new Error('Reveal.js failed to load'));
        }
      };
      
      checkReveal();
    });
  }

  async initializeReveal() {
    try {
      await Reveal.initialize({
        // Display settings - responsive
        width: '100%',
        height: '100%',
        margin: 0,
        minScale: 0.2,
        maxScale: 3.0,

        // Navigation settings
        controls: true,
        controlsTutorial: true,
        controlsLayout: 'bottom-right',
        controlsBackArrows: 'faded',
        progress: true,
        slideNumber: 'c/t',
        showSlideNumber: 'all',
        hashOneBasedIndex: false,
        hash: true,
        respondToHashChanges: true,

        // Navigation behavior
        keyboard: true,
        overview: true,
        center: true,
        touch: true,
        loop: false,
        rtl: false,
        navigationMode: 'default',
        shuffle: false,
        fragments: true,
        fragmentInURL: false,
        embedded: false,
        help: true,
        pause: true,
        showNotes: false,
        autoPlayMedia: null,
        preloadIframes: null,
        autoAnimate: true,
        autoAnimateEasing: 'ease',
        autoAnimateDuration: 1.0,
        autoAnimateUnmatched: true,

        // Responsive settings
        disableLayout: false,
        
        // Transition settings
        transition: 'slide',
        transitionSpeed: 'default',
        backgroundTransition: 'fade',

        // Plugin configuration
        plugins: [
          RevealNotes,
          RevealHighlight
        ],

        // Mobile optimization
        hideInactiveCursor: true,
        hideCursorTime: 5000,

        // Touch settings
        touchSensitivity: 15,
        
        // Accessibility
        keyboardCondition: null
      });

      console.log('✅ Reveal.js initialized successfully');
      
    } catch (error) {
      console.error('Reveal.js initialization failed:', error);
      throw error;
    }
  }

  setupCustomFeatures() {
    // Add slide change listeners
    Reveal.addEventListener('slidechanged', (event) => {
      this.handleSlideChange(event);
    });

    Reveal.addEventListener('ready', (event) => {
      this.handlePresentationReady(event);
    });

    // Fragment listeners
    Reveal.addEventListener('fragmentshown', (event) => {
      this.handleFragmentShown(event);
    });

    Reveal.addEventListener('fragmenthidden', (event) => {
      this.handleFragmentHidden(event);
    });

    // Auto-hide cursor in presentation mode
    this.setupCursorAutoHide();
  }

  setupResponsiveHandlers() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        Reveal.layout();
        this.adjustForOrientation();
      }, 100);
    });

    // Initial responsive adjustments
    this.adjustForScreenSize();
  }

  setupAccessibilityFeatures() {
    // Add ARIA labels and roles
    this.enhanceAccessibility();
    
    // Setup live region for announcements
    this.createLiveRegion();
    
    // Add skip navigation
    this.addSkipNavigation();
    
    // Enhance keyboard navigation
    this.enhanceKeyboardNavigation();

    // Add focus management
    this.setupFocusManagement();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Don't interfere with Reveal.js default behavior for basic navigation
      if (this.isRevealNavigationKey(event.key)) {
        return;
      }
      
      // Custom shortcuts that don't conflict with Reveal.js
      switch(event.key.toLowerCase()) {
        case 'h':
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            this.showHelp();
          }
          break;
          
        case 'f':
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            this.toggleFullscreen();
          }
          break;
          
        case 't':
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            this.toggleTimer();
          }
          break;
          
        case 'r':
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            this.resetPresentation();
          }
          break;
          
        case 'p':
          if ((event.ctrlKey || event.metaKey) && !event.altKey) {
            event.preventDefault();
            this.printPresentation();
          }
          break;
          
        default:
          // Number keys for direct slide navigation
          if (event.key >= '1' && event.key <= '9' && !event.ctrlKey && !event.metaKey) {
            const slideNumber = parseInt(event.key);
            if (slideNumber <= this.totalSlides) {
              event.preventDefault();
              Reveal.slide(slideNumber - 1);
            }
          }
          break;
      }
    });
  }

  setupTouchNavigation() {
    const slidesContainer = document.querySelector('.reveal .slides');
    if (!slidesContainer) return;

    let startTime = 0;
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;

    // Enhanced touch handling
    slidesContainer.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startTime = Date.now();
      startX = touch.clientX;
      startY = touch.clientY;
      distX = 0;
      distY = 0;
    }, { passive: true });

    slidesContainer.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
      
      // Prevent vertical scrolling during horizontal swipes
      if (Math.abs(distX) > Math.abs(distY)) {
        e.preventDefault();
      }
    }, { passive: false });

    slidesContainer.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      const absDistX = Math.abs(distX);
      const absDistY = Math.abs(distY);
      
      // Only trigger if it's a swipe (not a tap) and primarily horizontal
      if (duration < 1000 && absDistX > 50 && absDistX > absDistY * 2) {
        if (distX > 0) {
          Reveal.prev();
        } else {
          Reveal.next();
        }
        
        // Announce slide change for accessibility
        this.announceSlideChange();
      }
      
      // Reset values
      startTime = 0;
      startX = 0;
      startY = 0;
      distX = 0;
      distY = 0;
    }, { passive: true });
  }

  setupPresentationFeatures() {
    // Create presentation timer
    this.createPresentationTimer();
    
    // Setup auto-save position
    this.setupAutoSave();
    
    // Add performance monitoring
    this.setupPerformanceMonitoring();
    
    // Setup error handling
    this.setupErrorHandling();
  }

  handleSlideChange(event) {
    this.currentSlide = event.indexh;
    
    // Update browser title
    this.updateBrowserTitle(event);
    
    // Announce slide change for screen readers
    this.announceSlideChange(event);
    
    // Animate slide content
    this.animateSlideContent(event.currentSlide);
    
    // Save current position
    this.saveCurrentPosition();
    
    // Track slide timing
    this.trackSlideProgress();
  }

  handlePresentationReady(event) {
    // Initial slide content animation
    this.animateSlideContent(event.currentSlide);
    
    // Load saved position
    this.loadSavedPosition();
    
    // Setup slide-specific features
    this.setupSlideSpecificFeatures();
    
    // Announce ready state
    this.announceToScreenReader('Presentation ready. Use arrow keys or swipe to navigate.');
  }

  handleFragmentShown(event) {
    event.fragment.classList.add('fragment-animated');
    this.announceToScreenReader(`Fragment shown: ${event.fragment.textContent.slice(0, 50)}...`);
  }

  handleFragmentHidden(event) {
    event.fragment.classList.remove('fragment-animated');
  }

  handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.adjustForScreenSize();
      if (Reveal.isReady()) {
        Reveal.layout();
      }
    }, 100);
  }

  adjustForScreenSize() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Adjust font sizes for mobile
    if (viewport.width < 768) {
      document.documentElement.style.setProperty('--mobile-scale', '0.8');
    } else if (viewport.width < 1024) {
      document.documentElement.style.setProperty('--mobile-scale', '0.9');
    } else {
      document.documentElement.style.setProperty('--mobile-scale', '1');
    }
    
    // Adjust spacing for very small screens
    if (viewport.width < 480) {
      document.documentElement.classList.add('small-screen');
    } else {
      document.documentElement.classList.remove('small-screen');
    }
  }

  adjustForOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    document.documentElement.classList.toggle('landscape', isLandscape);
    document.documentElement.classList.toggle('portrait', !isLandscape);
  }

  enhanceAccessibility() {
    // Add ARIA labels to navigation controls
    setTimeout(() => {
      const controls = document.querySelectorAll('.reveal .controls button');
      const labels = ['Previous slide', 'Next slide', 'Up', 'Down'];
      controls.forEach((control, index) => {
        if (labels[index]) {
          control.setAttribute('aria-label', labels[index]);
          control.setAttribute('role', 'button');
        }
      });
      
      // Add ARIA labels to progress bar
      const progress = document.querySelector('.reveal .progress');
      if (progress) {
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-label', 'Presentation progress');
      }
      
      // Add slide numbers for screen readers
      const slideNumber = document.querySelector('.reveal .slide-number');
      if (slideNumber) {
        slideNumber.setAttribute('aria-live', 'polite');
        slideNumber.setAttribute('aria-label', 'Current slide number');
      }
    }, 1000);
  }

  createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'presentation-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }

  addSkipNavigation() {
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.textContent = 'Skip to main content';
    skipNav.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      font-size: 14px;
    `;
    
    skipNav.addEventListener('focus', function() {
      this.style.top = '6px';
    });
    
    skipNav.addEventListener('blur', function() {
      this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipNav, document.body.firstChild);

    // Add main content landmark
    const slides = document.querySelector('.reveal .slides');
    if (slides) {
      slides.id = 'main-content';
      slides.setAttribute('role', 'main');
      slides.setAttribute('aria-label', 'Presentation slides');
    }
  }

  enhanceKeyboardNavigation() {
    // Ensure all interactive elements are keyboard accessible
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupFocusManagement() {
    // Manage focus during slide transitions
    Reveal.addEventListener('slidechanged', () => {
      const currentSlide = Reveal.getCurrentSlide();
      if (currentSlide) {
        // Focus the slide for screen readers
        currentSlide.setAttribute('tabindex', '-1');
        currentSlide.focus();
        
        // Remove tabindex after focus
        setTimeout(() => {
          currentSlide.removeAttribute('tabindex');
        }, 100);
      }
    });
  }

  setupCursorAutoHide() {
    let cursorTimer;
    let isHidden = false;
    
    const hideCursor = () => {
      if (!isHidden) {
        document.body.style.cursor = 'none';
        isHidden = true;
      }
    };
    
    const showCursor = () => {
      if (isHidden) {
        document.body.style.cursor = 'auto';
        isHidden = false;
      }
      clearTimeout(cursorTimer);
      cursorTimer = setTimeout(hideCursor, 3000);
    };
    
    document.addEventListener('mousemove', showCursor);
    document.addEventListener('mousedown', showCursor);
    document.addEventListener('keydown', showCursor);
    
    // Initial timer
    cursorTimer = setTimeout(hideCursor, 3000);
  }

  createPresentationTimer() {
    const timerElement = document.createElement('div');
    timerElement.id = 'presentation-timer';
    timerElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: var(--font-family-mono);
      font-size: 14px;
      z-index: 50;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: none;
      min-width: 80px;
      text-align: center;
    `;
    document.body.appendChild(timerElement);
    this.timerElement = timerElement;
  }

  toggleTimer() {
    if (!this.timerElement) return;
    
    const isVisible = this.timerElement.style.display !== 'none';
    this.timerElement.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      this.presentationStartTime = Date.now();
      this.startTimer();
      this.announceToScreenReader('Presentation timer started');
    } else {
      this.stopTimer();
      this.announceToScreenReader('Presentation timer stopped');
    }
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimer() {
    if (!this.timerElement || this.timerElement.style.display === 'none') {
      return;
    }
    
    const elapsed = Date.now() - this.presentationStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  setupAutoSave() {
    // Save presentation state to sessionStorage
    Reveal.addEventListener('slidechanged', () => {
      this.saveCurrentPosition();
    });
    
    // Load saved state on page load
    window.addEventListener('beforeunload', () => {
      this.saveCurrentPosition();
    });
  }

  saveCurrentPosition() {
    try {
      const state = {
        slide: Reveal.getIndices().h,
        fragment: Reveal.getIndices().f,
        timestamp: Date.now()
      };
      sessionStorage.setItem('presentation-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Could not save presentation state:', error);
    }
  }

  loadSavedPosition() {
    try {
      const saved = sessionStorage.getItem('presentation-state');
      if (saved) {
        const state = JSON.parse(saved);
        // Only restore if saved recently (within 1 hour)
        if (Date.now() - state.timestamp < 3600000) {
          Reveal.slide(state.slide, 0, state.fragment);
        }
      }
    } catch (error) {
      console.warn('Could not load saved presentation state:', error);
    }
  }

  setupPerformanceMonitoring() {
    // Monitor performance and optimize if needed
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // If FPS is too low, reduce visual effects
        if (fps < 30) {
          document.body.classList.add('low-performance');
        } else {
          document.body.classList.remove('low-performance');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFPS);
    };
    
    requestAnimationFrame(monitorFPS);
  }

  setupErrorHandling() {
    window.addEventListener('error', (error) => {
      console.error('Presentation error:', error);
      this.showErrorMessage('An error occurred. Please refresh the page if issues persist.');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.showErrorMessage('An error occurred. Please refresh the page if issues persist.');
    });
  }

  setupSlideSpecificFeatures() {
    // Add slide-specific enhancements
    const slides = document.querySelectorAll('.reveal .slides section');
    slides.forEach((slide, index) => {
      this.enhanceSlide(slide, index);
    });
  }

  enhanceSlide(slide, index) {
    // Add slide-specific improvements
    const progressBars = slide.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      this.animateProgressBar(bar);
    });
    
    // Enhanced code examples
    const codeBlocks = slide.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      this.enhanceCodeBlock(block);
    });
    
    // Interactive elements
    const interactiveElements = slide.querySelectorAll('[data-interactive]');
    interactiveElements.forEach(element => {
      this.makeInteractive(element);
    });
  }

  animateProgressBar(bar) {
    if (!bar) return;
    
    // Reset and animate
    bar.style.width = '0%';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            bar.style.transition = 'width 2s ease-in-out';
            bar.style.width = '70%';
          }, 500);
        }
      });
    });
    
    observer.observe(bar);
  }

  enhanceCodeBlock(codeBlock) {
    if (!codeBlock) return;
    
    // Add line numbers
    const lines = codeBlock.textContent.split('\n');
    const numberedLines = lines.map((line, index) => {
      return `<span class="line-number">${index + 1}</span>${line}`;
    }).join('\n');
    
    // Add copy functionality
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-code-btn';
    copyButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 4px;
      color: white;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0.7;
    `;
    
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });
    
    const pre = codeBlock.parentElement;
    if (pre && pre.tagName === 'PRE') {
      pre.style.position = 'relative';
      pre.appendChild(copyButton);
    }
  }

  makeInteractive(element) {
    // Add interactive behaviors
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'transform 0.2s ease';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
    });
  }

  animateSlideContent(slide) {
    if (!slide) return;

    // Animate elements with staggered timing
    const animatableElements = slide.querySelectorAll('.pain-point, .flow-step, .pillar, .agent-card, .metric-card');
    
    animatableElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });

    // Animate metric numbers
    const metricNumbers = slide.querySelectorAll('.metric-number, .count');
    metricNumbers.forEach(number => {
      this.animateNumber(number);
    });
  }

  animateNumber(element) {
    if (!element) return;
    
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    let current = 0;
    const increment = numericValue / 30;
    const duration = 2000;
    const stepTime = duration / 30;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      
      element.textContent = Math.floor(current) + (isPercentage ? '%' : '');
    }, stepTime);
  }

  isRevealNavigationKey(key) {
    const revealKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      ' ', 'PageDown', 'PageUp', 'Home', 'End', 'Escape'
    ];
    return revealKeys.includes(key);
  }

  announceSlideChange(event) {
    if (!event) {
      // Get current slide info
      const indices = Reveal.getIndices();
      const currentSlide = Reveal.getSlide(indices.h);
      const slideTitle = currentSlide?.querySelector('h1, h2')?.textContent || '';
      const announcement = `Slide ${indices.h + 1} of ${this.totalSlides}: ${slideTitle}`;
      this.announceToScreenReader(announcement);
    } else {
      const slideTitle = event.currentSlide.querySelector('h1, h2');
      if (slideTitle) {
        const announcement = `Slide ${event.indexh + 1} of ${this.totalSlides}: ${slideTitle.textContent}`;
        this.announceToScreenReader(announcement);
      }
    }
  }

  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        this.liveRegion.textContent = '';
      }, 1000);
    }
  }

  updateBrowserTitle(event) {
    const slideTitle = event.currentSlide.querySelector('h1, h2');
    if (slideTitle) {
      document.title = `${slideTitle.textContent} - Agentic AI Infrastructure`;
    }
  }

  trackSlideProgress() {
    // Track slide viewing for analytics (if needed)
    const indices = Reveal.getIndices();
    console.log(`Slide progress: ${indices.h + 1}/${this.totalSlides}`);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      this.announceToScreenReader('Entered fullscreen mode');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.announceToScreenReader('Exited fullscreen mode');
    }
  }

  resetPresentation() {
    Reveal.slide(0);
    this.announceToScreenReader('Presentation reset to first slide');
  }

  printPresentation() {
    const printWindow = window.open('', '_blank');
    const printDoc = printWindow.document;
    
    printDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Driving Scalable, Error-Free Infra with Agentic AI - Print Version</title>
        <style>
          ${this.getPrintStyles()}
        </style>
      </head>
      <body>
        ${this.getPrintContent()}
      </body>
      </html>
    `);
    
    printDoc.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
    
    this.announceToScreenReader('Print dialog opened');
  }

  getPrintStyles() {
    return `
      @page {
        size: landscape;
        margin: 0.5in;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        background: white;
        color: black;
        font-size: 12px;
        line-height: 1.4;
      }
      
      .print-slide {
        page-break-after: always;
        padding: 20px;
        min-height: 7in;
        border-bottom: 2px solid #333;
        margin-bottom: 20px;
      }
      
      .print-slide:last-child {
        page-break-after: avoid;
        border-bottom: none;
      }
      
      h1, h2, h3, h4 {
        color: #1e3a8a;
        margin-bottom: 16px;
        margin-top: 0;
      }
      
      h1 {
        font-size: 24px;
        text-align: center;
        border-bottom: 3px solid #1e3a8a;
        padding-bottom: 8px;
      }
      
      h2 {
        font-size: 20px;
        text-align: center;
      }
      
      h3 {
        font-size: 16px;
      }
      
      ul {
        padding-left: 20px;
        margin: 8px 0;
      }
      
      li {
        margin-bottom: 4px;
      }
      
      .slide-number {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 10px;
        color: #666;
        font-weight: bold;
      }
      
      .print-section {
        margin: 16px 0;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f9f9f9;
      }
      
      .code-block {
        background: #f0f0f0;
        padding: 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 10px;
        border: 1px solid #ccc;
        margin: 8px 0;
      }
      
      .metrics {
        display: flex;
        justify-content: space-around;
        margin: 16px 0;
      }
      
      .metric {
        text-align: center;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 100px;
      }
      
      .metric-value {
        font-size: 18px;
        font-weight: bold;
        color: #1e3a8a;
      }
      
      .flow-step {
        display: inline-block;
        padding: 8px;
        margin: 4px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f5f5f5;
        text-align: center;
        min-width: 120px;
      }
    `;
  }

  getPrintContent() {
    const slideData = [
      {
        title: "Driving Scalable, Error-Free Infra with Agentic AI",
        subtitle: "Today's cloud complexity demands automation that's both powerful and trustworthy",
        content: ["Key pain points: Security alerts, Failed deployments, Spreadsheet chaos"]
      },
      {
        title: "Today's Journey & What You'll Take Away",
        content: [
          "• Why Terraform/HCL matters—and why it trips you up",
          "• Agentic AI: the difference between buzz and real autonomy",
          "• Our end-to-end workflow & dev cycle",
          "• Architecture: simple view → deep-dive",
          "• Personas, challenges, ROI",
          "• Live Demo highlights",
          "• Competitive edge & next steps",
          "",
          "Business Outcomes:",
          "• 50% fewer misconfigurations",
          "• 30% faster onboarding", 
          "• 42% faster deployment cycles",
          "• 67% reduction in configuration errors"
        ]
      },
      {
        title: "Infrastructure as Code: Power & Complexity",
        content: [
          "HCL 101: Industry standard for infrastructure definition",
          "Common Pitfalls:",
          "• Nested modules complexity",
          "• Typos and syntax errors",
          "• Configuration drift",
          "• Merge conflicts in team environments",
          "",
          "Impact: Even small mistakes can cost hours of downtime"
        ]
      },
      {
        title: "Beyond Bots—True Autonomy",
        content: [
          "Agentic AI Definition: Actors that perceive, decide, and act end-to-end",
          "",
          "Real vs Pseudo Agents:",
          "• Decision Making: Autonomous vs Pre-programmed",
          "• Learning: Continuous vs Static rules",
          "• Error Handling: Self-correcting vs Manual intervention",
          "• Adaptation: Context-aware vs Rigid workflows",
          "",
          "Key Message: Not all automations are created equal"
        ]
      },
      {
        title: "From Code to Cloud—Our Enhanced Dev Cycle",
        content: [
          "Traditional Workflow Issues:",
          "1. Write HCL → Manual coding errors",
          "2. Init & Plan → Validation bottlenecks",
          "3. Peer Review → Delay bottlenecks",
          "4. Apply → Runtime errors",
          "5. Monitor & Drift → Manual oversight",
          "",
          "Our Agent Solution:",
          "✓ Natural language → HCL generation",
          "✓ Automated review and validation",
          "✓ Safe, guided application with rollback"
        ]
      },
      {
        title: "Reducing Errors, Enforcing Best Practices, Enabling Growth",
        content: [
          "Three Pillars:",
          "",
          "1. Reducing Errors:",
          "   • Automated guardrails prevent misconfigurations",
          "   • Pre-deployment validation",
          "   • Configuration drift detection",
          "",
          "2. Enforcing Best Practices:",
          "   • Built-in compliance and standards",
          "   • Security best practices",
          "   • Cost optimization rules",
          "",
          "3. Enabling Developer Growth:",
          "   • Learning-oriented feedback",
          "   • Progressive complexity handling",
          "   • Best practice suggestions"
        ]
      },
      {
        title: "Terraform Development Agents—Your Code Co-pilots",
        content: [
          "Code Development Assistance:",
          "",
          "• HCL Generator Agent: Natural language → Terraform code",
          "• Code Review Agent: Security & performance insights",
          "• Optimization Agent: Improvement recommendations",
          "",
          "Co-development Focus:",
          "• Pair programming with AI assistance",
          "• Context-aware code suggestions",
          "• Learning-oriented feedback and explanations"
        ]
      },
      {
        title: "Onboarding in 3 Clicks",
        content: [
          "Step 1: Welcome Screen",
          "   • Pick cloud provider & repository",
          "",
          "Step 2: Define Scope", 
          "   • Select modules to manage",
          "",
          "Step 3: Go",
          "   • Agent auto-discovers resources",
          "   • 24+ resources found and cataloged",
          "",
          "Result: Even non-technical managers can initiate discovery"
        ]
      },
      {
        title: "High-Level Architecture",
        content: [
          "Three-Layer Architecture:",
          "",
          "1. Agent Layer:",
          "   • AI-powered decision making",
          "   • Orchestration and coordination",
          "",
          "2. Tool/Connector Layer:",
          "   • Terraform integration",
          "   • Cloud provider APIs",
          "   • CI/CD pipeline integration",
          "",
          "3. State & Logging Layer:",
          "   • Persistent state management",
          "   • Comprehensive audit logging",
          "",
          "✓ 100% in-house development—no vendor dependencies"
        ]
      },
      {
        title: "Day 1 vs Day 2: Co-development and AIops",
        content: [
          "Day 1: Co-development of Code",
          "• Pair programming with AI agents",
          "• Natural language to HCL translation",
          "• Real-time code review and suggestions",
          "• Learning-oriented guidance",
          "• Built-in best practice enforcement",
          "",
          "Day 2: AIops",
          "• Automated drift detection and remediation",
          "• Intelligent monitoring and alerting",
          "• Predictive issue identification",
          "• Self-healing infrastructure",
          "• Performance optimization"
        ]
      },
      {
        title: "Our Agent Portfolio & Platform Summary",
        content: [
          "Available Agents:",
          "• Day 1 Development: Code Co-pilot (50% faster development)",
          "• Day 2 Operations: AIops Engine (67% fewer incidents)",
          "• Policy Enforcement: Compliance Guardian (100% policy compliance)",
          "• Discovery Agent: Infrastructure Mapper (Complete visibility)",
          "",
          "Platform Summary:",
          "• What: Transform manual processes to intelligent automation",
          "• How: AI agents with context awareness and learning",
          "• Why: Reduce costs, improve reliability, accelerate innovation"
        ]
      },
      {
        title: "Deep Dive: What Each Agent Does",
        content: [
          "Day 1 Development Agent:",
          "• Natural Language Processing → HCL code generation",
          "• Best practice guidance and error prevention",
          "",
          "Day 2 Operations Agent:",
          "• Drift detection and auto-remediation",
          "• Performance monitoring and predictive analytics",
          "",
          "Policy Enforcement Agent:",
          "• Security scanning and compliance checking",
          "• Cost optimization and policy as code",
          "",
          "Discovery Agent:",
          "• Resource mapping and dependency analysis",
          "• State reconciliation and asset inventory"
        ]
      },
      {
        title: "Traditional Workflow vs. Agent-Enhanced Workflow",
        content: [
          "Before (Traditional): 2-4 weeks, High error rate",
          "1. Manual requirements (2-3 days)",
          "2. Hand-coded HCL (1-2 weeks)",
          "3. Manual review (2-5 days)",
          "4. Manual testing (3-7 days)",
          "5. Manual monitoring (ongoing overhead)",
          "",
          "After (Agent-Enhanced): 2-4 hours, Minimal errors",
          "1. Natural language requirements (30 min)",
          "2. AI-generated HCL (1-2 hours)",
          "3. Automated review (15 min)",
          "4. Safe deployment (30 min)",
          "5. Intelligent monitoring (zero overhead)",
          "",
          "Result: 95% time reduction, 80% error reduction, 10x faster iteration"
        ]
      },
      {
        title: "Enterprise Integration Solutions",
        content: [
          "Multi-Cloud Platforms:",
          "• AWS, GCP, Azure native APIs",
          "• Cross-cloud state synchronization",
          "",
          "DevOps Toolchain:",
          "• Jenkins, GitLab CI, GitHub Actions",
          "• Ansible, Puppet, Chef integration",
          "• Kubernetes, Docker orchestration",
          "",
          "Enterprise Systems:",
          "• ServiceNow, Jira integration",
          "• Datadog, New Relic monitoring",
          "• Active Directory, LDAP, SSO",
          "",
          "Benefits: No rip-and-replace, gradual adoption, workflow preservation"
        ]
      },
      {
        title: "Our Competitive Edge: Ownership, Security & Innovation",
        content: [
          "Platform Comparison:",
          "• Integration: Limited → Moderate → Extensive (Ours)",
          "• Autonomy: Manual → Semi-automated → Fully Autonomous (Ours)",
          "• Data Control: Your Infrastructure → Vendor Cloud → 100% Your Control (Ours)",
          "",
          "Key Differentiators:",
          "• 100% In-House Development—no vendor lock-in",
          "• Complete Solution Ownership—full control",
          "• Client Data Privacy—never leaves your environment",
          "• Data Sovereignty—meet all regulatory requirements",
          "• Modular & Extensible—adapt to any environment",
          "• Industry-Agnostic—proven across sectors"
        ]
      },
      {
        title: "Ready to Transform Your Infrastructure Operations?",
        content: [
          "ROI Metrics:",
          "• 50% Fewer Misconfigurations",
          "• 30% Faster Onboarding",
          "• 42% Faster Deployments",
          "",
          "Implementation Roadmap:",
          "Phase 1: 30-day pilot program",
          "Phase 2: Integration with existing tools",
          "Phase 3: Full deployment with success metrics",
          "",
          "Get Started:",
          "• Scan QR code for demo access",
          "• Visit: demo.agentops.ai/pilot",
          "• Contact: pilot@agentops.ai",
          "",
          "Next Steps: Schedule Demo | Start Pilot Program"
        ]
      }
    ];

    let content = '';
    slideData.forEach((slide, index) => {
      content += `
        <div class="print-slide">
          <div class="slide-number">Slide ${index + 1} of ${slideData.length}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p style="text-align: center; font-style: italic; margin-bottom: 20px;"><strong>${slide.subtitle}</strong></p>` : ''}
          <div class="print-section">
            ${slide.content.map(item => {
              if (item.trim() === '') return '<br>';
              if (item.includes('•')) return `<div style="margin: 4px 0;">${item}</div>`;
              if (item.includes(':') && !item.includes('http')) return `<div style="font-weight: bold; margin: 12px 0 8px 0; color: #1e3a8a;">${item}</div>`;
              return `<div style="margin: 6px 0;">${item}</div>`;
            }).join('')}
          </div>
        </div>
      `;
    });
    
    return content;
  }

  showHelp() {
    const helpModal = document.createElement('div');
    helpModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(5px);
    `;

    const helpContent = document.createElement('div');
    helpContent.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      color: black;
    `;

    helpContent.innerHTML = `
      <h3 style="margin-top: 0; color: #1e3a8a;">Presentation Controls</h3>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 1rem 2rem; font-size: 0.9rem; margin-bottom: 1.5rem;">
        <strong>Navigation:</strong>
        <div>Arrow keys, Space, Page Up/Down, Touch/Swipe</div>
        
        <strong>Speaker Notes:</strong>
        <div>Press "S" key</div>
        
        <strong>Overview:</strong>
        <div>Press "ESC" key</div>
        
        <strong>Fullscreen:</strong>
        <div>Press "F" key</div>
        
        <strong>Timer:</strong>
        <div>Press "T" key</div>
        
        <strong>Print:</strong>
        <div>Ctrl/Cmd + P</div>
        
        <strong>Reset:</strong>
        <div>Press "R" key</div>
        
        <strong>Jump to slide:</strong>
        <div>Number keys (1-9)</div>
        
        <strong>Help:</strong>
        <div>Press "H" key</div>
      </div>
      
      <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #1e3a8a;">
        <strong>Tips:</strong>
        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
          <li>Use touch gestures on mobile devices</li>
          <li>Press 'S' to open speaker notes in a new window</li>
          <li>Use ESC to see slide overview</li>
          <li>Presentation auto-saves your position</li>
        </ul>
      </div>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              style="margin-top: 1.5rem; padding: 0.5rem 1rem; background: #1e3a8a; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
        Close Help
      </button>
    `;

    helpModal.appendChild(helpContent);
    document.body.appendChild(helpModal);

    // Close on click outside
    helpModal.addEventListener('click', function(e) {
      if (e.target === helpModal) {
        helpModal.remove();
      }
    });

    // Close on escape key
    const closeOnEscape = function(e) {
      if (e.key === 'Escape') {
        helpModal.remove();
        document.removeEventListener('keydown', closeOnEscape);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    
    // Focus management
    helpContent.querySelector('button').focus();
    
    this.announceToScreenReader('Help dialog opened');
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc2626;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      max-width: 400px;
      font-size: 14px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(errorDiv);
        }, 300);
      }
    }, 5000);
    
    this.announceToScreenReader(`Error: ${message}`);
  }
}

// Initialize the presentation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.presentationApp = new PresentationApp();
});

// Handle window load for additional setup
window.addEventListener('load', () => {
  if (window.presentationApp && window.presentationApp.isInitialized) {
    console.log('🎉 Presentation fully loaded and ready');
  }
});

// Handle unload for cleanup
window.addEventListener('beforeunload', () => {
  if (window.presentationApp) {
    window.presentationApp.saveCurrentPosition();
  }
});

// Global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Export for external access
window.PresentationUtils = {
  getInstance: () => window.presentationApp,
  toggleFullscreen: () => window.presentationApp?.toggleFullscreen(),
  showHelp: () => window.presentationApp?.showHelp(),
  toggleTimer: () => window.presentationApp?.toggleTimer(),
  resetPresentation: () => window.presentationApp?.resetPresentation(),
  printPresentation: () => window.presentationApp?.printPresentation()
};

// Console startup message
console.log(`
🎯 Agentic AI Infrastructure Presentation
📊 16 slides covering infrastructure automation with AI agents
🎮 Interactive controls: H for help, F for fullscreen, T for timer
📱 Responsive design: Works on desktop, tablet, and mobile
♿ Accessibility: Full screen reader support and keyboard navigation
🖨️ Print ready: Ctrl/Cmd+P for print-friendly version

Ready to present! Use arrow keys or swipe to navigate.
`);