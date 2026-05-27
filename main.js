document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Menu UI (Clean & Simple)
    const menuHTML = `
        <button class="menu-btn" onclick="toggleMenu()" title="Settings">☰</button>
        <div class="sidebar" id="sidebar">
            <h3>VISUALS</h3>
            <button onclick="setTheme('light')">☀️ Light Mode</button>
            <button onclick="setTheme('dark')">🌙 Dark Mode</button>
            <br>
            <h3>DEV TOOLS</h3>
            <button onclick="window.location.href='analyzer.html'">🔓 Analyzer</button>
            <button onclick="toggleMenu()" style="border-color: #ff4444; color:#ff4444;">✕ Close</button>
        </div>
    `;
    
    if (!document.querySelector('.sidebar')) {
        const div = document.createElement('div');
        div.innerHTML = menuHTML;
        document.body.appendChild(div);
    }

    // 2. FORCE DARK MODE FIX
    // Agar pehli baar load ho raha hai ya koi confusion hai, toh Dark Mode hi lagao.
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        setTheme('light');
    } else if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
});

window.toggleMenu = function() {
    const sidebar = document.getElementById('sidebar');
    const btn = document.querySelector('.menu-btn') || document.querySelector('.menu-toggle');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        if (btn) btn.innerHTML = "✕";
    } else {
        if (btn) btn.innerHTML = btn.classList.contains('menu-toggle') ? "⋮" : "☰";
    }
}

window.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const sidebar = document.getElementById('sidebar');
    if(sidebar && sidebar.classList.contains('active')) {
        toggleMenu();
    }
}

window.applyThemeToMesh = function(theme) {
    if (typeof sphereMesh !== 'undefined' && sphereMesh) {
        sphereMesh.material.color.setHex(theme === 'light' ? 0x333333 : 0x00ffcc);
    }
    if (typeof faceMesh !== 'undefined' && faceMesh) {
        faceMesh.material.color.setHex(theme === 'light' ? 0x333333 : 0x00ffcc);
    }
}