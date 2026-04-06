export function initTheme() {
  const html = document.documentElement;
  const themeToggles = [
    { btn: document.getElementById('theme-toggle'), icon: document.getElementById('theme-icon') },
    { btn: document.getElementById('theme-toggle-mobile'), icon: document.getElementById('theme-icon-mobile') }
  ];

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }
  
  updateIcons();

  themeToggles.forEach(t => {
    if(!t.btn) return;
    t.btn.addEventListener('click', () => {
      html.classList.toggle('dark');
      const isDark = html.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateIcons();
    });
  });

  function updateIcons() {
    const isDark = html.classList.contains('dark');
    const moonPath = 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
    const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
    
    themeToggles.forEach(t => {
      if(t.icon) t.icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isDark ? moonPath : sunPath}"></path>`;
    });
  }
}
