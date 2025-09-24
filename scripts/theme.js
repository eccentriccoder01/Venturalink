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
    var ensureButtonStyles = function (btn) {
      if (!btn) return;
      btn.type = 'button';
      btn.style.position = 'fixed';
      btn.style.top = '30px';
      btn.style.right = '20px';
      btn.style.zIndex = '99999';
      btn.style.padding = '12px 18px';
      btn.style.borderRadius = '9999px';
      btn.style.border = '1px solid var(--glass-border, rgba(0,0,0,0.1))';
      btn.style.background = 'var(--bg-secondary, #f5f5f5)';
      btn.style.color = 'var(--text-primary, #000)';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '18px';
      btn.style.lineHeight = '1';
      btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    };

    if (!button) {
      button = document.createElement('button');
      button.id = 'theme-toggle';
      ensureButtonStyles(button);
      document.body.appendChild(button);
    } else {
      // If an existing button is hidden by layout, reattach it to body and style it
      var computed = window.getComputedStyle(button);
      var hidden = computed.display === 'none' || computed.visibility === 'hidden' || button.offsetParent === null;
      if (hidden || button.parentElement !== document.body) {
        document.body.appendChild(button);
      }
      ensureButtonStyles(button);
    }

    setIcon(button, saved);
    button.addEventListener('click', toggleTheme);
  } catch (e) {
    console.error('Theme init failed', e);
  }
})();


