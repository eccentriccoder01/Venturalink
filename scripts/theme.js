// Theme bootstrap and toggle for all pages
(function () {
  try {
    var root = document.documentElement;
    var saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(saved === 'dark' ? 'theme-dark' : 'theme-light');

    function setIcon(btn, theme) {
      if (!btn) return;
      btn.textContent = theme === 'dark' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function toggleTheme() {
      var current = root.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      // Hint to UA color-scheme for built-in widgets
      root.style.colorScheme = next;
      // Force reflow to ensure CSS vars recalc on some browsers
      void root.offsetHeight;
      // Also keep a body class for any page-specific styles that might rely on classes
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(next === 'dark' ? 'theme-dark' : 'theme-light');
      localStorage.setItem('theme', next);
      setIcon(button, next);
    }

    var button = document.getElementById('theme-toggle');
    // Always ensure the toggle is visible at the bottom-right so users notice it
    if (!button) {
      button = document.createElement('button');
      button.id = 'theme-toggle';
      button.type = 'button';
      button.classList.add('theme-toggle--floating');
      // Minimal, unobtrusive fallback styling
      button.style.position = 'fixed';
      button.style.bottom = '24px';
      button.style.right = '24px';
      button.style.zIndex = '9999';
      button.style.padding = '10px 12px';
      button.style.borderRadius = '9999px';
      button.style.border = '1px solid rgba(255,255,255,0.15)';
      button.style.background = 'rgba(0,0,0,0.35)';
      button.style.backdropFilter = 'blur(8px)';
      button.style.color = '#fff';
      button.style.cursor = 'pointer';
      button.style.fontSize = '16px';
      button.style.lineHeight = '1';
      document.body.appendChild(button);
    } else {
      // Ensure it's a button for accessibility and move it to body bottom-right
      button.type = 'button';
      if (button.parentElement !== document.body) {
        document.body.appendChild(button);
      }
      button.classList.add('theme-toggle--floating');
    }

    setIcon(button, saved);
    button.addEventListener('click', toggleTheme);
  } catch (e) {
    console.error('Theme init failed', e);
  }
})();


