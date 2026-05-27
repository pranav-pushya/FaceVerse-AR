/**
 * ═══════════════════════════════════════════════════════════
 * FaceVerse — Universal Navigation Dock
 * ═══════════════════════════════════════════════════════════
 * 
 * Self-injecting glassmorphism nav dock that works on all pages.
 * Include with: <script src="nav-dock.js"></script>
 * 
 * Features:
 *   • Floating bottom-center dock with frosted glass
 *   • Active page indicator (glow + lift)
 *   • Hover tooltips with page names
 *   • Icon scale + bounce on hover
 *   • Auto-hides on scroll down, reappears on scroll up
 *   • Responsive — collapses on small screens
 */

(function () {
    // ─── DOCK ITEMS ─────────────────────────────────────────────
    const pages = [
        { name: 'Home',     icon: '🏠', href: 'index.html'    },
        { name: 'Detector', icon: '🧠', href: 'detector.html' },
        { name: 'Game Hub', icon: '🎮', href: 'game_hub.html' },
        { name: 'AR Filters', icon: '✨', href: 'filters.html' },
        { name: 'Analyzer', icon: '🔬', href: 'analyzer.html' },
    ];

    // Detect current page from the URL
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    // Skip dock on full-screen pages that have their own bottom UI
    const skipPages = ['filters.html', 'game_lv1.html', 'game_lv2.html', 'game_flappy.html', 'game_poker.html', 'game_chain.html', 'game_racer.html', 'game_dj.html'];
    if (skipPages.includes(currentFile)) return;

    // ─── INJECT CSS ─────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        /* ── DOCK CONTAINER ────────────────────────────────── */
        .fv-dock {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(0);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 18px;
            border-radius: 22px;
            background: rgba(15, 15, 20, 0.65);
            backdrop-filter: blur(24px) saturate(1.8);
            -webkit-backdrop-filter: blur(24px) saturate(1.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
            transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        opacity 0.4s ease;
            opacity: 1;
        }

        /* Auto-hide state */
        .fv-dock.hidden {
            transform: translateX(-50%) translateY(120px);
            opacity: 0;
            pointer-events: none;
        }

        /* ── INDIVIDUAL DOCK ITEM ──────────────────────────── */
        .fv-dock-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
            text-decoration: none;
        }

        .fv-dock-item:hover {
            transform: translateY(-8px) scale(1.18);
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(0, 255, 204, 0.3);
            box-shadow: 0 8px 24px rgba(0, 255, 204, 0.15);
        }

        /* ── ACTIVE PAGE INDICATOR ─────────────────────────── */
        .fv-dock-item.active {
            background: rgba(0, 255, 204, 0.12);
            border-color: rgba(0, 255, 204, 0.4);
            box-shadow: 0 4px 20px rgba(0, 255, 204, 0.25);
            transform: translateY(-4px);
        }

        /* Active dot below icon */
        .fv-dock-item.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #00ffcc;
            box-shadow: 0 0 8px #00ffcc;
        }

        /* ── EMOJI ICON ────────────────────────────────────── */
        .fv-dock-icon {
            font-size: 1.6rem;
            line-height: 1;
            transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .fv-dock-item:hover .fv-dock-icon {
            transform: scale(1.15);
        }

        /* ── TOOLTIP ───────────────────────────────────────── */
        .fv-dock-tooltip {
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%) translateY(6px);
            padding: 5px 12px;
            border-radius: 8px;
            background: rgba(10, 10, 15, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            font-family: 'Outfit', 'Segoe UI', sans-serif;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s, transform 0.2s;
        }

        .fv-dock-item:hover .fv-dock-tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        /* ── DIVIDER LINE ──────────────────────────────────── */
        .fv-dock-divider {
            width: 1px;
            height: 28px;
            background: rgba(255, 255, 255, 0.1);
            margin: 0 4px;
        }

        /* ── RESPONSIVE ────────────────────────────────────── */
        @media (max-width: 520px) {
            .fv-dock {
                padding: 8px 12px;
                gap: 4px;
                bottom: 12px;
            }
            .fv-dock-item {
                width: 42px;
                height: 42px;
                border-radius: 12px;
            }
            .fv-dock-icon {
                font-size: 1.25rem;
            }
            .fv-dock-tooltip {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);

    // ─── BUILD DOCK HTML ────────────────────────────────────────
    const dock = document.createElement('nav');
    dock.className = 'fv-dock';
    dock.setAttribute('aria-label', 'Site Navigation');

    pages.forEach((page, i) => {
        // Add divider after Home
        if (i === 1) {
            const div = document.createElement('div');
            div.className = 'fv-dock-divider';
            dock.appendChild(div);
        }

        const link = document.createElement('a');
        link.className = 'fv-dock-item';
        link.href = page.href;
        link.title = page.name;

        // Mark active page
        if (currentFile === page.href) {
            link.classList.add('active');
        }

        link.innerHTML = `
            <span class="fv-dock-icon">${page.icon}</span>
            <span class="fv-dock-tooltip">${page.name}</span>
        `;

        dock.appendChild(link);
    });

    // ─── INJECT INTO PAGE ───────────────────────────────────────
    document.body.appendChild(dock);

    // ─── AUTO-HIDE ON SCROLL DOWN ───────────────────────────────
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > lastScroll && current > 100) {
            dock.classList.add('hidden');    // Scrolling DOWN → hide
        } else {
            dock.classList.remove('hidden'); // Scrolling UP → show
        }
        lastScroll = current;
    }, { passive: true });

})();
