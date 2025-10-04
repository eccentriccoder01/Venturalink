// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

// Serve all static files (CSS, JS, images, favicon, etc.)
app.use(express.static(__dirname));

// Routes
app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "register.html")));

// Optional: catch-all 404 route
app.use((req, res) => res.status(404).send("Page not found"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
