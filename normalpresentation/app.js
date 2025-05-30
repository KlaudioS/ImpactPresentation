// Professional C-Suite Presentation Application
class PresentationApp {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 15;
    this.isFullscreen = false;
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.createSlideDots();
    this.updateSlideDisplay();
    this.updateSlideCounter();
  }

  setupElements() {
    this.slidesContainer = document.querySelector('.slides-container');
    this.slides = document.querySelectorAll('.slide');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.printBtn = document.getElementById('print-btn');
    this.currentSlideSpan = document.getElementById('current-slide');
    this.totalSlidesSpan = document.getElementById('total-slides');
    this.slideDotsContainer = document.querySelector('.slide-dots');
    this.presentationContainer = document.querySelector('.presentation-container');
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Fullscreen toggle
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    
    // Print functionality
    this.printBtn.addEventListener('click', () => this.printPresentation());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Handle fullscreen change events
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    
    // Touch/swipe support for mobile
    this.setupTouchEvents();
    
    // Prevent context menu for cleaner presentation
    document.addEventListener('contextmenu', (e) => {
      if (this.isFullscreen) {
        e.preventDefault();
      }
    });
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    
    this.slidesContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    this.slidesContainer.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
          if (diffX > 0) {
            this.nextSlide();
          } else {
            this.previousSlide();
          }
        }
      }
      
      startX = 0;
      startY = 0;
    });
  }

  createSlideDots() {
    this.slideDotsContainer.innerHTML = '';
    
    for (let i = 1; i <= this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'slide-dot';
      dot.setAttribute('data-slide', i);
      dot.setAttribute('aria-label', `Go to slide ${i}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      
      if (i === this.currentSlide) {
        dot.classList.add('active');
      }
      
      this.slideDotsContainer.appendChild(dot);
    }
  }

  updateSlideDots() {
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index + 1 === this.currentSlide);
    });
  }

  updateSlideDisplay() {
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index + 1 === this.currentSlide);
    });
    
    this.updateSlideDots();
    this.updateNavigationButtons();
  }

  updateSlideCounter() {
    this.currentSlideSpan.textContent = this.currentSlide;
    this.totalSlidesSpan.textContent = this.totalSlides;
  }

  updateNavigationButtons() {
    this.prevBtn.disabled = this.currentSlide === 1;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    
    // Update button opacity for better UX
    this.prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
    this.nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.currentSlide++;
      this.updateSlideDisplay();
      this.updateSlideCounter();
      this.announceSlideChange();
    }
  }

  previousSlide() {
    if (this.currentSlide > 1) {
      this.currentSlide--;
      this.updateSlideDisplay();
      this.updateSlideCounter();
      this.announceSlideChange();
    }
  }

  goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
      this.currentSlide = slideNumber;
      this.updateSlideDisplay();
      this.updateSlideCounter();
      this.announceSlideChange();
    }
  }

  announceSlideChange() {
    // For screen readers
    const slideTitle = this.slides[this.currentSlide - 1].querySelector('h1, h2');
    if (slideTitle) {
      const announcement = `Slide ${this.currentSlide} of ${this.totalSlides}: ${slideTitle.textContent}`;
      this.announceToScreenReader(announcement);
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.totalSlides);
        break;
      case 'F11':
      case 'f':
      case 'F':
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case 'Escape':
        if (this.isFullscreen) {
          e.preventDefault();
          this.exitFullscreen();
        }
        break;
      case 'p':
      case 'P':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.printPresentation();
        }
        break;
      default:
        // Number keys for direct slide navigation
        if (e.key >= '1' && e.key <= '9') {
          const slideNum = parseInt(e.key);
          if (slideNum <= this.totalSlides) {
            e.preventDefault();
            this.goToSlide(slideNum);
          }
        }
        break;
    }
  }

  toggleFullscreen() {
    if (!this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    const element = this.presentationContainer;
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  exitFullscreen() {
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

  handleFullscreenChange() {
    this.isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    
    this.presentationContainer.classList.toggle('fullscreen', this.isFullscreen);
    
    // Update fullscreen button icon
    this.updateFullscreenButton();
    
    // Announce fullscreen state change
    const message = this.isFullscreen ? 'Entered fullscreen mode' : 'Exited fullscreen mode';
    this.announceToScreenReader(message);
  }

  updateFullscreenButton() {
    const icon = this.fullscreenBtn.querySelector('svg');
    if (this.isFullscreen) {
      // Exit fullscreen icon
      icon.innerHTML = `
        <polyline points="4 14 10 14 10 20"></polyline>
        <polyline points="20 10 14 10 14 4"></polyline>
        <line x1="14" y1="10" x2="21" y2="3"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      `;
      this.fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
    } else {
      // Enter fullscreen icon
      icon.innerHTML = `
        <polyline points="15 3 21 3 21 9"></polyline>
        <polyline points="9 21 3 21 3 15"></polyline>
        <line x1="21" y1="3" x2="14" y2="10"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      `;
      this.fullscreenBtn.setAttribute('aria-label', 'Enter fullscreen');
    }
  }

  printPresentation() {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    const printDocument = printWindow.document;
    
    printDocument.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Driving Scalable, Error-Free Infra with Agentic AI</title>
        <style>
          ${this.getPrintStyles()}
        </style>
      </head>
      <body>
        ${this.getPrintContent()}
      </body>
      </html>
    `);
    
    printDocument.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }

  getPrintStyles() {
    return `
      @page {
        size: landscape;
        margin: 0.5in;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        margin: 0;
        padding: 0;
        background: white;
        color: black;
      }
      
      .print-slide {
        page-break-after: always;
        padding: 20px;
        min-height: 7in;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .print-slide:last-child {
        page-break-after: avoid;
      }
      
      h1, h2, h3, h4 {
        color: #1e3a8a;
        margin-bottom: 16px;
      }
      
      h1 {
        font-size: 2em;
        text-align: center;
        border-bottom: 2px solid #1e3a8a;
        padding-bottom: 8px;
      }
      
      h2 {
        font-size: 1.5em;
        text-align: center;
      }
      
      ul {
        padding-left: 20px;
      }
      
      li {
        margin-bottom: 8px;
      }
      
      .slide-number {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 12px;
        color: #666;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
      }
      
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      
      .print-visual {
        text-align: center;
        font-style: italic;
        color: #666;
        margin: 16px 0;
        padding: 16px;
        border: 1px dashed #ccc;
      }
    `;
  }

  getPrintContent() {
    const slideData = this.getSlideData();
    let content = '';
    
    slideData.forEach((slide, index) => {
      content += `
        <div class="print-slide">
          <div class="slide-number">Slide ${index + 1} of ${slideData.length}</div>
          ${this.formatSlideForPrint(slide, index + 1)}
        </div>
      `;
    });
    
    return content;
  }

  getSlideData() {
    return [
      {
        title: "Driving Scalable, Error-Free Infra with Agentic AI",
        subtitle: "Today's cloud complexity demands automation that's both powerful and trustworthy",
        type: "title",
        content: ["Customer pain points: Security alerts, Failed deployments, Spreadsheet chaos"]
      },
      {
        title: "Today's Journey & What You'll Take Away",
        type: "agenda",
        content: [
          "Why Terraform/HCL matters—and why it trips you up",
          "Agentic AI: the difference between buzz and real autonomy",
          "Our end-to-end workflow & dev cycle",
          "Architecture: simple view → deep-dive",
          "Personas, challenges, ROI",
          "Live Demo highlights",
          "Competitive edge & next steps",
          "",
          "Outcome Focus: Faster time-to-deploy, fewer incidents, long-term cost savings"
        ]
      },
      {
        title: "Infrastructure as Code: Power & Complexity",
        type: "split",
        content: [
          "HCL 101: Industry standard for infrastructure",
          "HCL Pitfalls: Nested modules, typos, drift, merge conflicts",
          "Even small mistakes in HCL can cost hours of downtime"
        ]
      },
      {
        title: "Beyond Bots—True Autonomy",
        type: "definition",
        content: [
          "Agentic AI: Actors that perceive, decide, and act end-to-end",
          "Non-Agentic Examples: Scheduled cron jobs, simple scripts",
          "Real Agents vs Pseudo-Agents: Autonomous decision making, continuous learning, self-correcting error handling",
          "Key Message: Not all automations are created equal"
        ]
      },
      {
        title: "From Code to Cloud—Our Dev Cycle",
        type: "flow",
        content: [
          "1. Write HCL → 2. Init & Plan → 3. Peer Review → 4. Apply → 5. Monitor & Drift Detect",
          "Manual bottlenecks and error-risk points occur throughout the process"
        ]
      },
      {
        title: "Minimizing Error, Maximizing Best Practices",
        type: "pillars",
        content: [
          "Three Pillars:",
          "• Automated Guardrails (linting, policy as code)",
          "• Idempotent Execution (safe retries, rollbacks)",
          "• Continuous State Sync (no drift)",
          "",
          "Business Impact: Lower cost of ops, fewer escalations, easier audits"
        ]
      },
      {
        title: "Onboarding in 3 Clicks",
        type: "workflow",
        content: [
          "Step 1: Welcome screen - Pick cloud & repo",
          "Step 2: Define Scope - Select modules to manage",
          "Step 3: Go - Agent spins up, auto-discovers resources",
          "Even non-technical managers can kick off discovery runs"
        ]
      },
      {
        title: "High-Level Architecture",
        type: "architecture",
        content: [
          "Three-Layer Architecture:",
          "• Agent Layer: AI-powered decision making and orchestration",
          "• Tool/Connector Layer: Integration with Terraform, cloud providers, CI/CD",
          "• State & Logging Layer: Persistent state management and audit logging",
          "",
          "All built in-house—no black-box third-party"
        ]
      },
      {
        title: "Under the Hood",
        type: "technical",
        content: [
          "Day 1 Agent: Initial inventory & mapping",
          "Day 2 Agent: Plan, apply, rollback",
          "Tool Plugins: Terraform CLI, Cloud SDKs, Custom APIs",
          "State Store: FAISS + Postgres for audit trail"
        ]
      },
      {
        title: "Agent Portfolio & Functions",
        type: "table",
        content: [
          "Day 1 | Discovery & Triage | AWS/GCP/Azure SDKs | Unified cross-cloud view",
          "Day 2 | Planning & Execution | Terraform CLI, Rollbacks | Safe, idempotent changes",
          "Policy AI | Compliance & Best Practices | OPA, Sentinel plugin | Prevent misconfigurations"
        ]
      },
      {
        title: "From Junior to Senior—We've Got You Covered",
        type: "personas",
        content: [
          "Junior Dev: Learning curve → Guided workflows",
          "DevOps Engineer: Manual drift → Auto-remediation",
          "Infra Lead: Audit prep → Comprehensive audit logs",
          "",
          "C-Suite Value: Reduced onboarding cost, faster developer productivity"
        ]
      },
      {
        title: "Multi-Env in Action",
        type: "pipeline",
        content: [
          "Development → Staging → Production",
          "Same agents, same code—zero-touch promotion",
          "Color-coded environments for clear visualization"
        ]
      },
      {
        title: "Why We're Unique",
        type: "comparison",
        content: [
          "Competitive Differentiation:",
          "• 100% In-House Code—no hidden costs or vendor lock-in",
          "• Modular & Extensible—swap in third-party if needed",
          "• Industry-Agnostic—finance, retail, gov't, etc.",
          "",
          "Superior to DIY solutions and existing platforms like N8N/CrewAI"
        ]
      },
      {
        title: "Live Demo Flow",
        type: "demo",
        content: [
          "1. List RDS instances → shows inventory agent",
          "2. Click Plan → see Terraform diff",
          "3. Safety Drill → simulate failure → rollback",
          "4. State Sync → verify drift correction",
          "Demonstrates end-to-end automation capabilities"
        ]
      },
      {
        title: "ROI & Roadmap",
        type: "conclusion",
        content: [
          "Key Metrics:",
          "• 50% fewer mis-configs",
          "• 30% faster on-boarding",
          "",
          "Next Steps:",
          "• Pilot dates",
          "• Integration with existing tools",
          "• Executive dashboard rollout"
        ]
      }
    ];
  }

  formatSlideForPrint(slide, slideNumber) {
    let content = `<h1>${slide.title}</h1>`;
    
    if (slide.subtitle) {
      content += `<p style="text-align: center; font-style: italic; color: #666;">${slide.subtitle}</p>`;
    }
    
    if (slide.type === 'table' && slide.content.length > 0) {
      content += '<table>';
      content += '<tr><th>Agent Name</th><th>Role</th><th>Key Tools</th><th>Why We Built It</th></tr>';
      slide.content.forEach(row => {
        const cols = row.split(' | ');
        content += `<tr><td>${cols[0]}</td><td>${cols[1]}</td><td>${cols[2]}</td><td>${cols[3]}</td></tr>`;
      });
      content += '</table>';
    } else {
      content += '<ul>';
      slide.content.forEach(item => {
        if (item.trim() === '') {
          content += '<br>';
        } else {
          content += `<li>${item}</li>`;
        }
      });
      content += '</ul>';
    }
    
    return content;
  }

  // Utility method to get slide titles for accessibility
  getSlideTitle(slideNumber) {
    const slide = this.slides[slideNumber - 1];
    const titleElement = slide.querySelector('h1, h2');
    return titleElement ? titleElement.textContent : `Slide ${slideNumber}`;
  }

  // Method to handle window resize
  handleResize() {
    // Adjust layout if needed for responsive design
    this.updateSlideDisplay();
  }

  // Add smooth transitions between slides
  addSlideTransition(direction = 'next') {
    const currentSlideElement = this.slides[this.currentSlide - 1];
    
    // Add transition class
    currentSlideElement.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
    
    // Remove transition after animation
    setTimeout(() => {
      currentSlideElement.style.transition = '';
    }, 300);
  }

  // Auto-advance functionality (for demo mode)
  startAutoAdvance(intervalMs = 30000) {
    this.autoAdvanceInterval = setInterval(() => {
      if (this.currentSlide < this.totalSlides) {
        this.nextSlide();
      } else {
        this.stopAutoAdvance();
      }
    }, intervalMs);
  }

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  }

  // Export presentation data
  exportData() {
    const presentationData = {
      title: "Driving Scalable, Error-Free Infra with Agentic AI",
      totalSlides: this.totalSlides,
      currentSlide: this.currentSlide,
      slides: this.getSlideData(),
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(presentationData, null, 2);
  }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.presentationApp = new PresentationApp();
  
  // Add global keyboard shortcuts info
  console.log(`
    Presentation Controls:
    - Arrow Keys: Navigate slides
    - Space/Page Down: Next slide
    - Page Up: Previous slide
    - Home: First slide
    - End: Last slide
    - F/F11: Toggle fullscreen
    - Esc: Exit fullscreen
    - Ctrl+P: Print presentation
    - Number keys (1-9): Jump to slide
    - Touch: Swipe left/right to navigate
  `);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    window.presentationApp.handleResize();
  });
  
  // Prevent zooming in fullscreen mode for better presentation experience
  document.addEventListener('wheel', (e) => {
    if (window.presentationApp.isFullscreen && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }
  });
  
  // Prevent browser zoom shortcuts in fullscreen
  document.addEventListener('keydown', (e) => {
    if (window.presentationApp.isFullscreen && 
        (e.ctrlKey || e.metaKey) && 
        (e.key === '=' || e.key === '-' || e.key === '0')) {
      e.preventDefault();
    }
  });
});