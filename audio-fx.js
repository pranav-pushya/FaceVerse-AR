/**
 * ═══════════════════════════════════════════════════════════
 * FaceVerse — Cybernetic UI Audio FX Engine
 * ═══════════════════════════════════════════════════════════
 * 
 * Procedural sound synthesis using the Web Audio API.
 * No external audio files needed — all sounds are generated
 * in real-time from oscillators, noise, and envelopes.
 *
 * Include with: <script src="audio-fx.js"></script>
 * 
 * Auto-attaches to:
 *   • Buttons / links    → hover tick
 *   • .card-cta / .game-btn → click confirm
 *   • Navigation          → whoosh on page leave
 *   • #capture-btn        → camera shutter
 *
 * Exposes global: FX.tick(), FX.click(), FX.whoosh(),
 *   FX.shutter(), FX.success(), FX.fail(), FX.countdown()
 */

const FX = (function () {
    let ctx = null;

    // Lazy-init AudioContext on first user interaction
    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // ─── HELPER: Create a gain node with attack/release envelope ────
    function envelope(ac, attack, hold, release, volume = 0.15) {
        const g = ac.createGain();
        const now = ac.currentTime;
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(volume, now + attack);
        g.gain.setValueAtTime(volume, now + attack + hold);
        g.gain.linearRampToValueAtTime(0, now + attack + hold + release);
        g.connect(ac.destination);
        return g;
    }

    // ─── HELPER: Noise buffer ──────────────────────────────────────
    function noiseBuffer(ac, duration) {
        const len = ac.sampleRate * duration;
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        return buf;
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Hover Tick — short high-freq click
    // ═══════════════════════════════════════════════════════════
    function tick() {
        const ac = getCtx();
        const g = envelope(ac, 0.001, 0.01, 0.04, 0.08);
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4200, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2800, ac.currentTime + 0.05);
        osc.connect(g);
        osc.start();
        osc.stop(ac.currentTime + 0.06);
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Click Confirm — two-tone rising beep
    // ═══════════════════════════════════════════════════════════
    function click() {
        const ac = getCtx();
        const g = envelope(ac, 0.005, 0.04, 0.08, 0.12);
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ac.currentTime + 0.08);
        osc.connect(g);
        osc.start();
        osc.stop(ac.currentTime + 0.13);
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Whoosh — filtered noise sweep for page transitions
    // ═══════════════════════════════════════════════════════════
    function whoosh() {
        const ac = getCtx();
        const g = envelope(ac, 0.01, 0.08, 0.25, 0.08);
        const noise = ac.createBufferSource();
        noise.buffer = noiseBuffer(ac, 0.35);
        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ac.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, ac.currentTime + 0.15);
        filter.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.35);
        filter.Q.value = 2;
        noise.connect(filter);
        filter.connect(g);
        noise.start();
        noise.stop(ac.currentTime + 0.35);
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Camera Shutter — mechanical click + mirror slap
    // ═══════════════════════════════════════════════════════════
    function shutter() {
        const ac = getCtx();
        // Part 1: Sharp click
        const g1 = envelope(ac, 0.001, 0.005, 0.03, 0.2);
        const n1 = ac.createBufferSource();
        n1.buffer = noiseBuffer(ac, 0.04);
        const hp = ac.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 3000;
        n1.connect(hp);
        hp.connect(g1);
        n1.start();
        n1.stop(ac.currentTime + 0.04);

        // Part 2: Low thud (mirror slap)
        const g2 = envelope(ac, 0.001, 0.01, 0.06, 0.12);
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ac.currentTime + 0.03);
        osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.1);
        osc.connect(g2);
        osc.start(ac.currentTime + 0.03);
        osc.stop(ac.currentTime + 0.1);
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Success — ascending three-note chime
    // ═══════════════════════════════════════════════════════════
    function success() {
        const ac = getCtx();
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            const delay = i * 0.09;
            const g = envelope(ac, 0.01, 0.06, 0.15, 0.1);
            g.gain.setValueAtTime(0, ac.currentTime + delay);
            g.gain.linearRampToValueAtTime(0.1, ac.currentTime + delay + 0.01);
            g.gain.linearRampToValueAtTime(0, ac.currentTime + delay + 0.22);
            const osc = ac.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            osc.connect(g);
            osc.start(ac.currentTime + delay);
            osc.stop(ac.currentTime + delay + 0.22);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Fail — descending buzzer
    // ═══════════════════════════════════════════════════════════
    function fail() {
        const ac = getCtx();
        const g = envelope(ac, 0.01, 0.12, 0.2, 0.15);
        const osc = ac.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.3);
        osc.connect(g);
        osc.start();
        osc.stop(ac.currentTime + 0.35);
    }

    // ═══════════════════════════════════════════════════════════
    // SOUND: Countdown Tick — clock tick for timers
    // ═══════════════════════════════════════════════════════════
    function countdown() {
        const ac = getCtx();
        const g = envelope(ac, 0.001, 0.01, 0.05, 0.06);
        const osc = ac.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 1000;
        osc.connect(g);
        osc.start();
        osc.stop(ac.currentTime + 0.06);
    }

    // ═══════════════════════════════════════════════════════════
    // AUTO-ATTACH to UI elements
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('DOMContentLoaded', () => {
        // Hover tick on all interactive elements
        const hoverTargets = document.querySelectorAll(
            'button, a, .card-cta, .game-btn, .fv-dock-item, .feat-card, .game-menu-btn'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', tick);
        });

        // Click confirm on CTA buttons
        document.querySelectorAll('.card-cta, .game-btn, .fv-dock-item').forEach(el => {
            el.addEventListener('click', click);
        });

        // Camera shutter on snap button (filters page)
        const snapBtn = document.getElementById('capture-btn');
        if (snapBtn) {
            snapBtn.addEventListener('click', shutter);
        }

        // Whoosh on page navigation (intercept link clicks)
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't whoosh on same-page links
                const target = link.getAttribute('href');
                const current = window.location.pathname.split('/').pop();
                if (target !== current) {
                    whoosh();
                }
            });
        });
    });

    // ─── PUBLIC API ─────────────────────────────────────────────
    return { tick, click, whoosh, shutter, success, fail, countdown };
})();
