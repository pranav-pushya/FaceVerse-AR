/**
 * ═══════════════════════════════════════════════════════════
 * FaceVerse — Global Capture Module
 * ═══════════════════════════════════════════════════════════
 *
 * Adds a floating action button to capture high-res screenshots
 * of the AR filters, games, and detector. Composites the webcam
 * feed and any visible canvases into a single downloadable image.
 *
 * Include with: <script src="capture-module.js"></script>
 */

(function () {
    // ─── INJECT CSS ─────────────────────────────────────────────
    const style = document.createElement('style');
    style.innerHTML = `
        #fv-capture-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: #fff;
            font-size: 1.5rem;
        }
        
        #fv-capture-btn:hover {
            transform: scale(1.15) rotate(-10deg);
            background: rgba(0, 255, 204, 0.2);
            border-color: rgba(0, 255, 204, 0.5);
            box-shadow: 0 10px 40px rgba(0, 255, 204, 0.3);
        }

        #fv-capture-btn:active {
            transform: scale(0.9);
        }

        /* Tooltip */
        #fv-capture-btn::before {
            content: 'Take Snapshot';
            position: absolute;
            right: 75px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-family: 'Outfit', sans-serif;
            letter-spacing: 1px;
            opacity: 0;
            pointer-events: none;
            transition: 0.3s;
            white-space: nowrap;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        #fv-capture-btn:hover::before {
            opacity: 1;
            right: 80px;
        }

        /* Screen Flash Effect */
        #fv-flash-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #fff;
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease-out;
            mix-blend-mode: overlay;
        }
        
        .fv-flash-active {
            opacity: 1 !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);

    // ─── INJECT HTML ────────────────────────────────────────────
    const btn = document.createElement('div');
    btn.id = 'fv-capture-btn';
    btn.innerHTML = '📸';
    document.body.appendChild(btn);

    const flash = document.createElement('div');
    flash.id = 'fv-flash-overlay';
    document.body.appendChild(flash);

    // ─── CAPTURE LOGIC ──────────────────────────────────────────
    btn.addEventListener('click', () => {
        // 1. Play FX and Voice
        if (typeof FX !== 'undefined') FX.shutter();
        if (typeof Voice !== 'undefined') Voice.say('Snapshot saved.', { pitch: 1.2, rate: 1.2 });

        // 2. Flash Screen
        flash.classList.add('fv-flash-active');
        setTimeout(() => flash.classList.remove('fv-flash-active'), 50);

        // 3. Composite everything to a temporary canvas
        takeSnapshot();
    });

    function takeSnapshot() {
        // Find video element
        const video = document.querySelector('video');
        if (!video) {
            console.warn('No video element found to capture.');
            return;
        }

        const width = video.videoWidth || video.clientWidth;
        const height = video.videoHeight || video.clientHeight;

        if (width === 0 || height === 0) return;

        // Create temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');

        // Draw Video (handle mirroring if video is flipped)
        const isFlipped = window.getComputedStyle(video).transform.includes('matrix(-1');
        
        ctx.save();
        if (isFlipped) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();

        // Draw all visible canvases on top (WebGl or 2D)
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(c => {
            if (c.id === 'stability-ring' || c.id === 'bg-canvas') return; // Skip UI canvases if desired
            if (c.style.display !== 'none' && c.style.visibility !== 'hidden') {
                // If it's a game canvas, it spans the whole screen. We need to map it to video dimensions.
                ctx.drawImage(c, 0, 0, width, height);
            }
        });

        // Add Watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, height - 40, 140, 30);
        ctx.font = '16px "Outfit", sans-serif';
        ctx.fillStyle = '#00ffcc';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('FACEVERSE UI', 20, height - 25);

        // Export and Download
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.download = \`FaceVerse_Snap_\${timestamp}.png\`;
        link.href = dataURL;
        link.click();
    }
})();
