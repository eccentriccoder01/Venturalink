// ==============================
// Theme toggle for all pages
// ==============================
(function () {
  try {
    const root = document.documentElement;
    const body = document.body;

    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";

    // Apply a theme
    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      root.style.colorScheme = theme;
      body.classList.remove("theme-dark", "theme-light");
      body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
      setButtonIcon(theme);
    }

    // Always ensure a visible toggle button
    var button = document.getElementById("theme-toggle");
    if (!button) {
      button = document.createElement("button");
      button.id = "theme-toggle";
      button.type = "button";
      button.classList.add("theme-toggle--navbar");

      // Always append to body to ensure fixed positioning works (avoids backdrop-filter containing block issues)
      document.body.appendChild(button);

      // Ensure specific ID for CSS targeting
      button.id = "theme-toggle";
      button.classList.add("theme-toggle--floating");
    } else {
      // Ensure it is attached to body if it exists but is elsewhere
      if (button.parentElement !== document.body) {
        document.body.appendChild(button);
      }
      button.classList.add("theme-toggle--floating");
      button.classList.remove("theme-toggle--navbar");
    }

    // Style the button for navbar positioning
    Object.assign(button.style, {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "1px solid var(--glass-border, rgba(255,255,255,0.1))",
      background: "var(--bg-secondary, #111118)",
      color: "var(--text-primary, #fff)",
      fontSize: "18px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transition: "background 0.3s, color 0.3s, transform 0.2s",
      zIndex: "9999" // Ensure it stays on top
    });

    // Add hover effect
    button.addEventListener(
      "mouseenter",
      () => (button.style.transform = "scale(1.1)")
    );
    button.addEventListener(
      "mouseleave",
      () => (button.style.transform = "scale(1)")
    );

    // Set button icon based on theme
    function setButtonIcon(theme) {
      button.textContent = theme === "dark" ? "🌙" : "☀️";
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    // Initialize theme
    applyTheme(savedTheme);

    // Toggle on click
    button.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  } catch (error) {
    console.error("Theme toggle failed:", error);
  }
})();
