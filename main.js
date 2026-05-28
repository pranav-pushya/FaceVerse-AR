document.addEventListener("DOMContentLoaded", () => {
    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        setTheme('light');
    } else if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    const menuHTML = `
      <button class="menu-btn" onclick="toggleMenu()" title="Menu">☰</button>
      <div class="sidebar" id="sidebar">
        <h3>VISUALS</h3>
        <button onclick="setTheme('light')">☀️ Light Mode</button>
        <button onclick="setTheme('dark')">🌙 Dark Mode</button>
        <h3>NAVIGATION</h3>
        <button onclick="window.location.href='index.html'">🏠 Home</button>
        <button onclick="window.location.href='analyzer.html'">🔬 Analyzer</button>
        <button onclick="toggleMenu()" style="border-color:#ff4444;color:#ff4444;">✕ Close</button>
      </div>`;
    if (!document.querySelector('.sidebar')) {
      const div = document.createElement('div');
      div.innerHTML = menuHTML;
      document.body.appendChild(div);
    }
});

// Global theme setter — used by all pages
window.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

window.toggleMenu = function() {
    const sidebar = document.getElementById('sidebar');
    const btn = document.querySelector('.menu-btn') || document.querySelector('.menu-toggle');
    sidebar.classList.toggle('active');
    if (btn) btn.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
}

// Optional: apply theme color to Three.js meshes (used by detector/analyzer)
window.applyThemeToMesh = function(theme) {
    if (typeof sphereMesh !== 'undefined' && sphereMesh) {
        sphereMesh.material.color.setHex(theme === 'light' ? 0x333333 : 0x00ffcc);
    }
    if (typeof faceMesh !== 'undefined' && faceMesh) {
        faceMesh.material.color.setHex(theme === 'light' ? 0x333333 : 0x00ffcc);
    }
}