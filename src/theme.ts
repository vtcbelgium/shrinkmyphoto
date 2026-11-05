// Sovereign Theme Controller for ShrinkMyPhoto
export function initThemeController() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  function getEffectiveTheme(): 'dark' | 'light' {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark' || current === 'light') return current;
    const stored = localStorage.getItem('othrys-theme');
    if (stored === 'dark' || stored === 'oled') return 'dark';
    if (stored === 'light' || stored === 'paper') return 'light';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(theme: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('othrys-theme', theme);
    toggleBtn!.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    toggleBtn!.textContent = theme === 'dark' ? '☼' : '◐';
  }

  toggleBtn.addEventListener('click', () => {
    const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // Sync initial button icon
  const current = getEffectiveTheme();
  toggleBtn.textContent = current === 'dark' ? '☼' : '◐';
}
