/**
 * ═══════════════════════════════════════════════════════════
 * FaceVerse — Synthetic AI Voice Guide
 * ═══════════════════════════════════════════════════════════
 *
 * Uses the Web Speech API (speechSynthesis) to provide a
 * futuristic AI narrator voice across the FaceVerse suite.
 *
 * Include with: <script src="ai-voice.js"></script>
 *
 * Auto-speaks contextual lines based on which page loads.
 * Exposes global: Voice.say(text), Voice.announce(text)
 *
 * Voice settings are tuned for a robotic, clipped delivery:
 *   • Low pitch (0.85)
 *   • Moderate rate (1.05)
 *   • Prefers English voices with "Google" or "Daniel" names
 */

const Voice = (function () {
    const synth = window.speechSynthesis;
    let preferredVoice = null;
    let enabled = true;

    // ─── FIND BEST VOICE ────────────────────────────────────────
    // Looks for a deep, clear English voice. Falls back to default.
    function pickVoice() {
        const voices = synth.getVoices();
        if (!voices.length) return null;

        // Priority order of preferred voice names
        const preferred = [
            'Google UK English Male',
            'Microsoft David',
            'Daniel',
            'Google US English',
            'Microsoft Mark',
            'Alex',
        ];

        for (const name of preferred) {
            const match = voices.find(v => v.name.includes(name));
            if (match) return match;
        }

        // Fallback: any English voice
        return voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    // Load voices (async in some browsers)
    if (synth.getVoices().length) {
        preferredVoice = pickVoice();
    }
    synth.addEventListener('voiceschanged', () => {
        preferredVoice = pickVoice();
    });

    // ─── CORE SPEAK FUNCTION ────────────────────────────────────
    function say(text, options = {}) {
        if (!enabled || !synth) return;

        // Cancel any ongoing speech
        synth.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = preferredVoice;
        utter.pitch = options.pitch || 0.85;
        utter.rate = options.rate || 1.05;
        utter.volume = options.volume || 0.8;

        synth.speak(utter);
    }

    // Announce with a short delay (for page load timing)
    function announce(text, delayMs = 800) {
        setTimeout(() => say(text), delayMs);
    }

    // Toggle voice on/off
    function toggle() {
        enabled = !enabled;
        if (!enabled) synth.cancel();
        return enabled;
    }

    // ═══════════════════════════════════════════════════════════
    // AUTO-ANNOUNCE based on current page
    // ═══════════════════════════════════════════════════════════
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    const pageLines = {
        'index.html':     'Welcome to FaceVerse. Neural AI Suite online.',
        'detector.html':  'Biometrics synchronized. 3D Face Mapping online.',
        'game_hub.html':  'Mimic Arena loaded. Select your challenge.',
        'game_lv1.html':  'Level 1 initialized. Normal mode. Good luck.',
        'game_lv2.html':  'Warning. Level 2. Insane difficulty. Survive.',
        'filters.html':   'A R Filters ready. 15 procedural effects loaded.',
        'analyzer.html':  'Raw data analyzer active. 52 blendshapes streaming.',
    };

    // Speak the page welcome line after DOM loads
    document.addEventListener('DOMContentLoaded', () => {
        const line = pageLines[currentFile];
        if (line) {
            announce(line, 1200);
        }
    });

    // ─── PUBLIC API ─────────────────────────────────────────────
    return { say, announce, toggle };
})();
