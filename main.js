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
});

// Global theme setter — used by all pages
window.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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