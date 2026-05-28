const fs = require('fs');

const controlsHTML = `
    <!-- INJECTED GAME CONTROLS -->
    <style>
        .global-game-controls { position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; }
        .global-game-btn { background:rgba(20,20,20,0.8); border:1px solid #00ffcc; color:#00ffcc; padding:10px 20px; border-radius:8px; cursor:pointer; font-family:'Bangers',cursive; font-size:1.2rem; letter-spacing:1px; backdrop-filter:blur(10px); transition:0.2s; }
        .global-game-btn:hover { background:#00ffcc; color:#000; }
        .global-pause-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:9998; display:none; justify-content:center; align-items:center; flex-direction:column; gap:20px; backdrop-filter:blur(10px); }
        .global-pause-overlay h1 { font-size:5rem; color:#00ffcc; text-shadow:0 0 20px #00ffcc; font-family:'Bangers',cursive; margin:0; }
    </style>
    <div class="global-game-controls">
        <button class="global-game-btn" onclick="if(window.togglePause) window.togglePause(); else location.reload();" id="global-pause-btn">⏸️ PAUSE</button>
        <button class="global-game-btn" onclick="location.reload()">🔄 RESTART</button>
        <button class="global-game-btn" onclick="location.href='game_hub.html'">🔙 BACK</button>
    </div>
    <div class="global-pause-overlay" id="global-pause-overlay">
        <h1>PAUSED</h1>
        <button class="global-game-btn" style="font-size:2rem; padding:15px 40px;" onclick="if(window.togglePause) window.togglePause();">RESUME</button>
    </div>
    <!-- END INJECTED GAME CONTROLS -->
`;

const isPausedLogic = `
        let isPaused = false;
        window.togglePause = function() {
            if (typeof playing !== 'undefined' && !playing) return;
            isPaused = !isPaused;
            document.getElementById('global-pause-overlay').style.display = isPaused ? 'flex' : 'none';
            document.getElementById('global-pause-btn').innerHTML = isPaused ? '▶️ RESUME' : '⏸️ PAUSE';
            if (!isPaused && typeof loop === 'function') loop();
            if (!isPaused && typeof animate === 'function') animate();
        };
`;

const files = fs.readdirSync('.').filter(f => f.startsWith('game_') && f.endsWith('.html') && f !== 'game_hub.html' && f !== 'game_racer.html');

for(let f of files) {
  let c = fs.readFileSync(f, 'utf8');
  
  if(!c.includes('global-game-controls')) {
      c = c.replace('</body>', controlsHTML + '\n</body>');
  }

  if(c.includes('setupGameMenu();')) {
      c = c.replace(/setupGameMenu\(\);/g, '// setupGameMenu();');
  }
  
  // Note: if game already has isPaused logic from its own togglePause, we don't inject this one
  if(!c.includes('let isPaused') && c.includes('<script type="module">')) {
      c = c.replace('<script type="module">', '<script type="module">\n' + isPausedLogic);
  } else if (!c.includes('let isPaused')) {
      // fallback if no module script
      c = c.replace('</head>', '<script>\n' + isPausedLogic + '</script>\n</head>');
  }

  if(!c.includes('isPaused) return')) {
      c = c.replace(/function loop\(\)\s*\{/g, 'function loop() {\n            if (typeof isPaused !== "undefined" && isPaused) return;');
      c = c.replace(/function animate\(\)\s*\{/g, 'function animate() {\n            if (typeof isPaused !== "undefined" && isPaused) return;');
  }

  fs.writeFileSync(f, c);
  console.log('Patched', f);
}
