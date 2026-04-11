import { gsap } from 'gsap';

export function initTour() {
  const desktopBtn = document.getElementById('start-tour-btn');
  const mobileBtn = document.getElementById('start-tour-mobile-btn');
  
  if (!desktopBtn && !mobileBtn) return;

  const steps = [
    {
      element: '#simulator',
      title: 'Welcome to LaserSim!',
      content: 'I am your guide. Let me show you how to use this advanced laser simulator. We are currently in the laboratory environment.'
    },
    {
      element: 'aside.modern-card',
      title: 'Control Center',
      content: 'This sidebar is where you adjust the physics parameters. You can change wavelength, pump power, and medium type here.'
    },
    {
      element: '#wavelength',
      title: 'Wavelength Slider',
      content: 'Adjust the wavelength to change the color and energy of the photons. 632nm (Red) is the hallmark of He-Ne lasers.'
    },
    {
      element: '#pump-power',
      title: 'Pump Power',
      content: 'This controls the energy input. Higher power increases the rate of population inversion, creating more photons.'
    },
    {
      element: '#mirror-align',
      title: 'Mirror Alignment',
      content: 'Critical for laser stability. Perfect alignment (100%) produces a collimated beam. Lower alignment causes scattering.'
    },
    {
      element: '#toggle-laser',
      title: 'Main Power Switch',
      content: 'Flip this switch to start or stop the stimulated emission process. Watch the inversion happen in real-time!'
    },
    {
      element: '#tour-photons',
      title: 'Photon Statistics',
      content: 'This panel shows live metrics including density, intensity, and beam coherence calculated from the active simulation.'
    },
    {
      element: '#formulas',
      title: 'Scientific Formulas',
      content: 'Curious about the math? This section explains how we obtain each reading using valid physical principles.'
    },
    {
      element: '#tour-chart',
      title: 'Power Profile',
      content: 'As you log data points, this graph tracks the output power over time, allowing for experimental analysis.'
    }
  ];

  let currentStep = -1;
  let isTourActive = false;

  const tourOverlay = document.createElement('div');
  tourOverlay.id = 'tour-overlay';
  tourOverlay.className = 'fixed inset-0 z-[9998] pointer-events-none opacity-0 transition-opacity duration-300';
  tourOverlay.innerHTML = `
    <svg class="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect id="spotlight-hole" x="0" y="0" width="0" height="0" rx="16" fill="black" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.85)" mask="url(#spotlight-mask)" />
    </svg>
    <div id="tour-card" class="fixed bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] shadow-2xl w-[calc(100vw-40px)] sm:max-w-sm z-[9999] pointer-events-auto border border-brand-blue/30 transform-gpu overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-blue opacity-50"></div>
      <button id="tour-close" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 opacity-40 hover:opacity-100 transition-all">✕</button>
      <div class="space-y-4">
        <h4 id="tour-title" class="text-lg sm:text-2xl font-bold font-[Outfit] text-brand-blue pr-8 leading-tight"></h4>
        <p id="tour-content" class="text-muted text-[11px] sm:text-sm leading-relaxed"></p>
        
        <div class="flex flex-col gap-4 pt-4 border-t border-gray-500/10">
          <div class="flex justify-between items-center">
            <span id="tour-progress" class="text-[10px] font-black uppercase opacity-30 tracking-widest font-mono"></span>
            <div class="flex gap-2">
              <button id="tour-skip" class="px-3 sm:px-4 py-2 rounded-xl text-[10px] font-bold text-muted hover:text-current transition-all uppercase tracking-tighter">Skip</button>
              <button id="tour-next" class="px-5 sm:px-6 py-2 bg-brand-red dark:bg-brand-blue text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-red/20 dark:shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all">Next Step</button>
            </div>
          </div>
          
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" id="tour-dont-show" class="w-3 h-3 rounded border-gray-300 text-brand-red dark:text-brand-blue focus:ring-brand-red dark:focus:ring-brand-blue">
            <span class="text-[9px] font-bold text-muted uppercase tracking-widest group-hover:opacity-100 transition-opacity">Don't show again</span>
          </label>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(tourOverlay);

  const card = document.getElementById('tour-card');
  const spotlightHole = document.getElementById('spotlight-hole');
  const title = document.getElementById('tour-title');
  const content = document.getElementById('tour-content');
  const progress = document.getElementById('tour-progress');
  const nextBtn = document.getElementById('tour-next');
  const skipBtn = document.getElementById('tour-skip');
  const closeBtn = document.getElementById('tour-close');
  const dontShowCheck = document.getElementById('tour-dont-show');

  function showStep(index) {
    if (index >= steps.length) {
      endTour();
      return;
    }
    currentStep = index;
    isTourActive = true;
    const step = steps[index];
    const el = document.querySelector(step.element);
    
    if (!el || (window.getComputedStyle(el).display === 'none')) {
       showStep(index + 1);
       return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Update contents
    title.textContent = step.title;
    content.textContent = step.content;
    progress.textContent = `${index + 1} / ${steps.length}`;
    nextBtn.textContent = index === steps.length - 1 ? 'Finish' : (index === 0 ? 'Start Tour' : 'Next Step');

    // Settle loop: Focus on positioning
    let settleFrames = 0;
    const settle = () => {
      if (!isTourActive || currentStep !== index) return;

      const rect = el.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      
      const padding = 12; // Increased padding for better visual breath
      
      // Update SVG mask
      gsap.to(spotlightHole, {
        attr: {
          x: rect.left - padding,
          y: rect.top - padding,
          width: rect.width + (padding * 2),
          height: rect.height + (padding * 2)
        },
        duration: settleFrames === 0 ? 0.6 : 0.1,
        overwrite: true,
        ease: 'power2.out'
      });

      let cardTop, cardLeft;
      const offset = isMobile ? 30 : 60;

      if (isMobile) {
        // MOBILE CENTERED POSITIONING
        cardLeft = Math.max(20, (window.innerWidth - cardRect.width) / 2);
        
        // Decide if card should be above or below the element
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow > cardRect.height + offset + 20) {
          cardTop = rect.bottom + offset;
        } else if (spaceAbove > cardRect.height + offset + 20) {
          cardTop = rect.top - cardRect.height - offset;
        } else {
          // Fallback to bottom of screen if no space
          cardTop = window.innerHeight - cardRect.height - 20;
        }
      } else {
        // DESKTOP INTELLIGENT POSITIONING
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = window.innerWidth - rect.right;

        if (spaceBelow > cardRect.height + offset + 20) {
          cardTop = rect.bottom + offset;
          cardLeft = rect.left + (rect.width / 2) - (cardRect.width / 2);
        } else if (spaceAbove > cardRect.height + offset + 20) {
          cardTop = rect.top - cardRect.height - offset;
          cardLeft = rect.left + (rect.width / 2) - (cardRect.width / 2);
        } else if (spaceRight > cardRect.width + offset + 20) {
          cardTop = rect.top + (rect.height / 2) - (cardRect.height / 2);
          cardLeft = rect.right + offset;
        } else {
          cardTop = rect.top + (rect.height / 2) - (cardRect.height / 2);
          cardLeft = rect.left - cardRect.width - offset;
        }
      }

      // Bound checks
      cardTop = Math.max(80, Math.min(cardTop, window.innerHeight - cardRect.height - 20));
      cardLeft = Math.max(20, Math.min(cardLeft, window.innerWidth - cardRect.width - 20));

      gsap.to(card, {
        top: cardTop,
        left: cardLeft,
        duration: settleFrames === 0 ? 0.6 : 0.1,
        overwrite: true,
        ease: 'power2.out'
      });

      if (settleFrames < 60) { // Settle longer to follow smooth scroll
        settleFrames++;
        requestAnimationFrame(settle);
      }
    };
    
    settle();
    gsap.to(tourOverlay, { opacity: 1, pointerEvents: 'auto', duration: 0.4 });
  }

  function endTour() {
    isTourActive = false;
    if (dontShowCheck.checked) {
      localStorage.setItem('tour-opt-out', 'true');
    }
    
    gsap.to(tourOverlay, { 
      opacity: 0, 
      pointerEvents: 'none', 
      duration: 0.4,
      onComplete: () => {
        // Reset spotlight to avoid flashing on next start
        gsap.set(spotlightHole, { attr: { width: 0, height: 0 } });
      }
    });
    localStorage.setItem('tour-completed', 'true');
  }

  const startAction = () => {
    // Close mobile menu if it exists and is open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('mobile-menu-active')) {
       const menuBtn = document.getElementById('mobile-menu-btn');
       if (menuBtn) menuBtn.click();
    }
    localStorage.removeItem('tour-opt-out');
    showStep(0);
  };

  if (desktopBtn) desktopBtn.addEventListener('click', startAction);
  if (mobileBtn) mobileBtn.addEventListener('click', startAction);
  const mobileHeaderBtn = document.getElementById('start-tour-mobile-header-btn');
  if (mobileHeaderBtn) mobileHeaderBtn.addEventListener('click', startAction);

  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showStep(currentStep + 1); });
  skipBtn.addEventListener('click', (e) => { e.stopPropagation(); endTour(); });
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); endTour(); });

  // Handle Resize
  window.addEventListener('resize', () => {
    if (isTourActive) showStep(currentStep);
  });

  // Auto start logic
  const hasOptedOut = localStorage.getItem('tour-opt-out') === 'true';
  const hasCompleted = localStorage.getItem('tour-completed') === 'true';

  if (!hasOptedOut && !hasCompleted) {
    const startAuto = () => {
       setTimeout(() => {
         if (!isTourActive) showStep(0);
       }, 2000);
    };

    if (document.readyState === 'complete') {
      startAuto();
    } else {
      window.addEventListener('load', startAuto);
    }
  }
}

