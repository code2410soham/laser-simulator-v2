export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const nav = document.querySelector('nav');
  
  if (!mobileMenuBtn || !mobileMenu) return;

  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      mobileMenu.classList.add('mobile-menu-active');
      mobileMenu.classList.remove('pointer-events-none', 'opacity-0', 'translate-y-4');
      // Animate hamburger to X
      const spans = hamburgerIcon.querySelectorAll('span');
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.add('pointer-events-none', 'opacity-0', 'translate-y-4');
      mobileMenu.classList.remove('mobile-menu-active');
      // Reset hamburger
      const spans = hamburgerIcon.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      document.body.style.overflow = '';
    }
  };

  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      toggleMenu();
    }
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('sm:h-20', 'shadow-2xl', 'bg-white/95', 'dark:bg-black/95');
    } else {
      nav.classList.remove('shadow-2xl', 'bg-white/95', 'dark:bg-black/95');
    }
  });
}
