import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // Hero Animations
  gsap.fromTo('.gsap-hero-title', {
    y: 50,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'power3.out'
  });

  gsap.fromTo('.gsap-hero-desc', {
    y: 30,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.fromTo('.gsap-hero-buttons', {
    y: 20,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.6,
    ease: 'power2.out'
  });

  // Fade up sections on scroll
  const sections = document.querySelectorAll('section:not(#home)');
  
  sections.forEach(sec => {
    gsap.fromTo(sec, 
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}
