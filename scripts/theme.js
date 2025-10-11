// ==============================
// Theme toggle for all pages
// ==============================
(function () {
  try {
    const root = document.documentElement;
    const body = document.body;

    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Apply a theme
    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
      body.classList.remove('theme-dark', 'theme-light');
      body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
      setButtonIcon(theme);
    }

    // Always ensure a visible toggle button
    var button = document.getElementById('theme-toggle');
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

    // Style the button (floating circular)
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '2.5rem',
      left: '2.5rem',
      zIndex: '99999',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
      background: 'var(--bg-secondary, #111118)',
      color: 'var(--text-primary, #fff)',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
      transition: 'background 0.3s, color 0.3s, transform 0.2s',
    });

    // Add hover effect
    button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.1)');
    button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');

    // Set button icon based on theme
    function setButtonIcon(theme) {
      button.textContent = theme === 'dark' ? '🌙' : '☀️';
      button.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }

    // Initialize theme
    applyTheme(savedTheme);

    // Toggle on click
    button.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });

  } catch (error) {
    console.error('Theme toggle failed:', error);
  }
})();
