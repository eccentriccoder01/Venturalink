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

      // Create and append to navbar
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        navbar.appendChild(button);
      } else {
        // Fallback: append to body but position at top-right
        document.body.appendChild(button);
        Object.assign(button.style, {
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: "9999",
        });
      }
    } else {
      // Ensure it's in the navbar
      button.type = "button";
      const navbar = document.querySelector(".navbar");
      if (navbar && button.parentElement !== navbar) {
        navbar.appendChild(button);
      }
      button.classList.add("theme-toggle--navbar");
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
      marginLeft: "auto", // Push to the right in flex container
      marginRight: "1rem", // Space from the edge
      flexShrink: "0", // Prevent shrinking in flex container
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
