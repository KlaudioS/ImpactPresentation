// Professional Reveal.js Configuration for C-Suite Presentation
// Wait for Reveal.js to be available
function initializePresentation() {
  if (typeof Reveal === 'undefined') {
    console.log('Waiting for Reveal.js to load...');
    setTimeout(initializePresentation, 100);
    return;
  }

  // Initialize Reveal.js with professional configuration
  Reveal.initialize({
    // Display settings
    width: 1280,
    height: 720,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,

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
    autoAnimateMatcher: null,
    autoAnimateEasing: 'ease',
    autoAnimateDuration: 1.0,
    autoAnimateUnmatched: true,

    // Transition settings for smooth professional look
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',

    // Display options
    display: 'block',
    hideInactiveCursor: true,
    hideCursorTime: 5000,

    // Plugin configuration
    plugins: [
      RevealNotes,
      RevealHighlight
    ],

    // Dependencies for older Reveal.js versions
    dependencies: [
      { src: 'https://unpkg.com/reveal.js@4.6.1/plugin/notes/notes.js', async: true },
      { src: 'https://unpkg.com/reveal.js@4.6.1/plugin/highlight/highlight.js', async: true }
    ]
  }).then(() => {
    console.log('🎯 Agentic AI Infrastructure Presentation Ready');
    setupCustomFeatures();
    setupKeyboardShortcuts();
    setupAccessibilityFeatures();
    setupPresentationMode();
    
    // Add speaker notes to slides
    addSpeakerNotes();
    
    console.log('📋 Navigation: Arrow keys, Space, or click controls');
    console.log('📝 Speaker Notes: Press "S" key');
    console.log('🔍 Overview: Press "ESC" key');
    console.log('⚡ Total slides:', Reveal.getTotalSlides());
  });
}

// Add speaker notes to slides programmatically
function addSpeakerNotes() {
  const speakerNotesData = [
    "Open with a brief anecdote—e.g. a mission-critical outage caused by a mis-typed HCL variable.",
    "Focus on business outcomes that matter to executives: faster deployment, fewer incidents, cost savings.",
    "Emphasize that even small HCL mistakes can cost hours of downtime and significant business impact.",
    "Distinguish between real autonomous agents and simple automation scripts. Not all 'AI' solutions are truly agentic.",
    "Highlight the manual bottlenecks and error-risk points throughout the traditional development cycle.",
    "Connect technical capabilities to business value: lower operational costs, fewer escalations, easier audits.",
    "Emphasize ease of use - even non-technical managers can initiate discovery processes.",
    "Stress the all in-house approach - no vendor lock-in or black-box third-party dependencies.",
    "Detail the technical architecture while keeping it accessible for C-suite audience.",
    "Explain how different agents serve different functions but work together seamlessly.",
    "Address different personas and their specific pain points to show comprehensive solution coverage.",
    "Demonstrate the consistency across environments - same agents, same code, zero-touch promotion.",
    "Highlight competitive advantages: 100% in-house, modular, industry-agnostic approach.",
    "Connect demo steps to real business value - showing inventory, planning, safety, and state management.",
    "Present concrete metrics and clear next steps for implementation and executive dashboard rollout."
  ];

  const slides = document.querySelectorAll('.reveal .slides section');
  slides.forEach((slide, index) => {
    if (speakerNotesData[index]) {
      let notesSection = slide.querySelector('aside.notes');
      if (!notesSection) {
        notesSection = document.createElement('aside');
        notesSection.className = 'notes';
        slide.appendChild(notesSection);
      }
      notesSection.textContent = speakerNotesData[index];
    }
  });
}

// Custom features for enhanced presentation experience
function setupCustomFeatures() {
  // Add slide transition animations
  Reveal.addEventListener('slidechanged', function(event) {
    // Announce slide change for screen readers
    announceSlideChange(event);
    
    // Handle auto-animations for charts and diagrams
    animateSlideContent(event.currentSlide);
    
    // Update browser title with current slide
    updateBrowserTitle(event);
  });

  // Add ready event handler
  Reveal.addEventListener('ready', function(event) {
    // Setup first slide animations
    animateSlideContent(event.currentSlide);
  });

  // Handle fragments (step-by-step reveals)
  Reveal.addEventListener('fragmentshown', function(event) {
    // Add custom animations for fragments
    event.fragment.classList.add('fragment-animated');
  });

  Reveal.addEventListener('fragmenthidden', function(event) {
    // Remove animations when going back
    event.fragment.classList.remove('fragment-animated');
  });
}

// Enhanced keyboard shortcuts for professional presentation
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(event) {
    // Don't interfere with Reveal.js default behavior for basic navigation
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Escape'].includes(event.key)) {
      return; // Let Reveal.js handle these
    }
    
    // Custom shortcuts that don't conflict with Reveal.js
    switch(event.key.toLowerCase()) {
      case 'p':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          enterPrintMode();
        }
        break;
      case 'f':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          toggleFullscreen();
        }
        break;
      case 'r':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          resetPresentation();
        }
        break;
      case 'h':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          showHelp();
        }
        break;
      case 't':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          toggleTimer();
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
          const slideNumber = parseInt(event.key);
          if (slideNumber <= Reveal.getTotalSlides()) {
            event.preventDefault();
            Reveal.slide(slideNumber - 1);
          }
        }
        break;
    }
  });
}

// Accessibility enhancements
function setupAccessibilityFeatures() {
  // Add ARIA labels to navigation controls
  setTimeout(() => {
    const controls = document.querySelectorAll('.reveal .controls button');
    const labels = ['Previous slide', 'Next slide', 'Up', 'Down'];
    controls.forEach((control, index) => {
      if (labels[index]) {
        control.setAttribute('aria-label', labels[index]);
      }
    });
  }, 1000);

  // Add skip navigation
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
    z-index: 100;
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

// Presentation mode features
function setupPresentationMode() {
  // Add presentation timer
  let presentationStartTime = Date.now();
  let timerElement = null;
  let timerInterval = null;

  // Create timer display
  function createTimer() {
    timerElement = document.createElement('div');
    timerElement.id = 'presentation-timer';
    timerElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: var(--font-family-mono);
      font-size: 14px;
      z-index: 30;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: none;
    `;
    document.body.appendChild(timerElement);
  }

  // Update timer
  function updateTimer() {
    if (timerElement && timerElement.style.display !== 'none') {
      const elapsed = Date.now() - presentationStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // Toggle timer function
  window.toggleTimer = function() {
    if (!timerElement) {
      createTimer();
    }
    
    const isVisible = timerElement.style.display !== 'none';
    timerElement.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      presentationStartTime = Date.now(); // Reset timer when showing
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  };

  createTimer();
}

// Slide content animations
function animateSlideContent(slide) {
  if (!slide) return;

  // Animate pain points on title slide
  const painPoints = slide.querySelectorAll('.pain-point');
  painPoints.forEach((point, index) => {
    point.style.opacity = '0';
    point.style.transform = 'translateY(20px)';
    setTimeout(() => {
      point.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      point.style.opacity = '1';
      point.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });

  // Animate flow steps
  const flowSteps = slide.querySelectorAll('.flow-step');
  flowSteps.forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'scale(0.8)';
    setTimeout(() => {
      step.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      step.style.opacity = '1';
      step.style.transform = 'scale(1)';
    }, 200 + (index * 150));
  });

  // Animate progress bars
  const progressFills = slide.querySelectorAll('.progress-fill');
  progressFills.forEach(fill => {
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.transition = 'width 2s ease-in-out';
      fill.style.width = '70%';
    }, 500);
  });

  // Animate metric numbers
  const metricNumbers = slide.querySelectorAll('.metric-number');
  metricNumbers.forEach(number => {
    const finalValue = number.textContent;
    number.textContent = '0%';
    setTimeout(() => {
      animateNumber(number, finalValue, 2000);
    }, 800);
  });
}

// Number animation utility
function animateNumber(element, finalValue, duration) {
  const isPercentage = finalValue.includes('%');
  const numericValue = parseInt(finalValue.replace('%', ''));
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(numericValue * easeOutCubic(progress));
    element.textContent = currentValue + (isPercentage ? '%' : '');

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

// Easing function for smooth animations
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Utility functions
function announceSlideChange(event) {
  const slideTitle = event.currentSlide.querySelector('h1, h2');
  if (slideTitle) {
    const announcement = `Slide ${event.indexh + 1} of ${Reveal.getTotalSlides()}: ${slideTitle.textContent}`;
    announceToScreenReader(announcement);
  }
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

function updateBrowserTitle(event) {
  const slideTitle = event.currentSlide.querySelector('h1, h2');
  if (slideTitle) {
    document.title = `${slideTitle.textContent} - Agentic AI Infrastructure`;
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
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
  }
}

function enterPrintMode() {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  const printDoc = printWindow.document;
  
  printDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Agentic AI Infrastructure Presentation</title>
      <style>
        @page { size: landscape; margin: 0.5in; }
        body { font-family: Arial, sans-serif; margin: 0; }
        .slide { page-break-after: always; padding: 20px; }
        h1, h2 { color: #1e3a8a; margin-bottom: 16px; }
        h1 { font-size: 2em; text-align: center; }
        h2 { font-size: 1.5em; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
  `);
  
  // Add slide content for print
  const slides = document.querySelectorAll('.reveal .slides section');
  slides.forEach((slide, index) => {
    const title = slide.querySelector('h1, h2');
    const content = slide.innerHTML;
    printDoc.write(`
      <div class="slide">
        <div style="text-align: right; font-size: 12px; color: #666;">Slide ${index + 1}</div>
        ${content}
      </div>
    `);
  });
  
  printDoc.write('</body></html>');
  printDoc.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
}

function resetPresentation() {
  Reveal.slide(0);
  announceToScreenReader('Presentation reset to first slide');
}

function showHelp() {
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
    z-index: 1000;
    backdrop-filter: blur(5px);
  `;

  const helpContent = document.createElement('div');
  helpContent.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    color: black;
  `;

  helpContent.innerHTML = `
    <h3 style="margin-top: 0; color: #1e3a8a;">Presentation Controls</h3>
    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; font-size: 0.9rem;">
      <strong>Navigation:</strong>
      <div>Arrow keys, Space, Page Up/Down</div>
      
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
    <button onclick="this.parentElement.parentElement.remove()" 
            style="margin-top: 1.5rem; padding: 0.5rem 1rem; background: #1e3a8a; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Close
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePresentation);
} else {
  initializePresentation();
}

// Export functions for potential external use
window.PresentationUtils = {
  toggleFullscreen,
  enterPrintMode,
  resetPresentation,
  showHelp,
  toggleTimer,
  announceToScreenReader
};

// Log successful initialization
console.log('🚀 Agentic AI Infrastructure Presentation - JavaScript loaded successfully');
console.log('💡 Press "H" for help with controls');