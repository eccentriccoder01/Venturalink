// scripts/mobile-menu.js

document.addEventListener('DOMContentLoaded', () => {
  // We use event delegation on the body so it works 
  // even if the header loads late (via fetch).
  document.body.addEventListener('click', function(e) {
    
    // 1. Did the user click the hamburger button?
    const toggleBtn = e.target.closest('#menu-toggle');
    
    if (toggleBtn) {
      e.preventDefault(); // Stop any weird default behaviors
      const navLinks = document.getElementById('nav-links');
      const navActions = document.querySelector('.nav-actions');
      
      // Toggle the classes
      if (navLinks) navLinks.classList.toggle('open');
      if (navActions) navActions.classList.toggle('open');
      toggleBtn.classList.toggle('open');
    }

    // 2. Did the user click a link inside the menu? (Close it)
    if (e.target.closest('.nav-link')) {
      const navLinks = document.getElementById('nav-links');
      const navActions = document.querySelector('.nav-actions');
      const toggleBtn = document.getElementById('menu-toggle');
      
      if (navLinks) navLinks.classList.remove('open');
      if (navActions) navActions.classList.remove('open');
      if (toggleBtn) toggleBtn.classList.remove('open');
    }
  });
});