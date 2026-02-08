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
    } else {
        // Default to Dark (Black)
        setTheme('dark'); 
    }
});

window.toggleMenu = function() {
    const sidebar = document.getElementById('sidebar');
    const btn = document.querySelector('.menu-btn');
    sidebar.classList.toggle('active');
    
    // Icon toggle
    if(sidebar.classList.contains('active')) {
        btn.innerHTML = "✕";
    } else {
        btn.innerHTML = "☰";
    }
}

window.setTheme = function(theme) {
    // Set attribute on HTML tag (Best practice for CSS variables)
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Force Close Menu after selection
    const sidebar = document.getElementById('sidebar');
    if(sidebar && sidebar.classList.contains('active')) {
        toggleMenu();
    }
}