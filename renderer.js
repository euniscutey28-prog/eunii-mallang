// renderer.js - SVG Renderer for Mallang World
const MallangRenderer = (() => {
  const SHAPE_PATHS = {
    circle: `
      <ellipse cx="50" cy="55" rx="38" ry="35" class="mallang-body-shape" />
    `,
    cloud: `
      <path d="M 25,65 
               C 15,65 10,55 18,45 
               C 12,32 28,20 40,28 
               C 48,15 70,18 75,32 
               C 88,30 92,45 85,55 
               C 92,65 80,75 70,72 
               C 60,78 35,78 25,65 Z" class="mallang-body-shape" />
    `,
    bear: `
      <circle cx="25" cy="28" r="12" class="mallang-body-shape" />
      <circle cx="75" cy="28" r="12" class="mallang-body-shape" />
      <circle cx="25" cy="28" r="6" fill="#fff" opacity="0.3" />
      <circle cx="75" cy="28" r="6" fill="#fff" opacity="0.3" />
      <ellipse cx="50" cy="58" rx="38" ry="32" class="mallang-body-shape" />
    `,
    heart: `
      <path d="M 50,30 
               C 32,12 10,28 10,52 
               C 10,75 40,92 50,96 
               C 60,92 90,75 90,52 
               C 90,28 68,12 50,30 Z" class="mallang-body-shape" />
    `,
    star: `
      <path d="M 50,12 
               L 61,38 
               L 89,39 
               L 66,56 
               L 74,83 
               L 50,66 
               L 26,83 
               L 34,56 
               L 11,39 
               L 39,38 Z" class="mallang-body-shape" />
    `,
    cat: `
      <polygon points="18,35 32,18 36,38" class="mallang-body-shape" />
      <polygon points="82,35 68,18 64,38" class="mallang-body-shape" />
      <path d="M 18,35 Q 12,35 12,42 L 12,70 Q 12,85 50,85 Q 88,85 88,70 L 88,42 Q 88,35 82,35 Z" class="mallang-body-shape" />
      <polygon points="21,32 29,21 31,34" fill="#ffb6c1" />
      <polygon points="79,32 71,21 69,34" fill="#ffb6c1" />
    `,
    needoh_cube: '__SPECIAL__',
    butter_block: '__SPECIAL__'
  };

  const EXPRESSIONS = {
    smile: `
      <!-- Eyes -->
      <circle cx="36" cy="52" r="3.5" fill="#2d3748" />
      <circle cx="64" cy="52" r="3.5" fill="#2d3748" />
      <!-- Mouth -->
      <path d="M 46,59 Q 50,63 54,59" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `,
    wink: `
      <!-- Left Eye: Wink -->
      <path d="M 30,52 Q 36,46 42,52" stroke="#2d3748" stroke-width="3" stroke-linecap="round" fill="none" />
      <!-- Right Eye -->
      <circle cx="64" cy="52" r="3.5" fill="#2d3748" />
      <!-- Mouth -->
      <path d="M 46,59 Q 50,64 54,59" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `,
    blush: `
      <!-- Blush Cheeks -->
      <ellipse cx="28" cy="58" rx="6" ry="4" fill="#ff4d6d" opacity="0.4" />
      <ellipse cx="72" cy="58" rx="6" ry="4" fill="#ff4d6d" opacity="0.4" />
      <!-- Eyes -->
      <circle cx="36" cy="52" r="3.5" fill="#2d3748" />
      <circle cx="64" cy="52" r="3.5" fill="#2d3748" />
      <!-- Mouth -->
      <path d="M 45,58 Q 50,65 55,58" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `,
    sleepy: `
      <!-- Closed Eyes -->
      <path d="M 30,52 Q 36,56 42,52" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M 58,52 Q 64,56 70,52" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Mouth -->
      <circle cx="50" cy="62" r="3" fill="#2d3748" />
      <!-- Zzz -->
      <text x="72" y="38" font-size="10" font-family="'Outfit', sans-serif" font-weight="bold" fill="#4a5568" opacity="0.8">z</text>
      <text x="78" y="28" font-size="13" font-family="'Outfit', sans-serif" font-weight="bold" fill="#4a5568" opacity="0.8">Z</text>
    `,
    shocked: `
      <!-- Wide Eyes -->
      <circle cx="36" cy="50" r="4.5" fill="#2d3748" />
      <circle cx="64" cy="50" r="4.5" fill="#2d3748" />
      <circle cx="35" cy="48" r="1.5" fill="#fff" />
      <circle cx="63" cy="48" r="1.5" fill="#fff" />
      <!-- Mouth -->
      <ellipse cx="50" cy="63" rx="4.5" ry="6" fill="#2d3748" />
    `,
    crying: `
      <!-- Sad Eyes -->
      <path d="M 32,54 Q 36,49 40,54" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M 60,54 Q 64,49 68,54" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Tears -->
      <path d="M 34,56 C 34,56 31,65 34,68 C 37,65 34,56 34,56" fill="#3b82f6" />
      <path d="M 66,56 C 66,56 63,65 66,68 C 69,65 66,56 66,56" fill="#3b82f6" />
      <!-- Sad Mouth -->
      <path d="M 46,63 Q 50,59 54,63" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `,
    squeezed: `
      <!-- Squeezed >_< Eyes -->
      <path d="M 31,48 L 41,54 M 31,54 L 41,48" stroke="#2d3748" stroke-width="3" stroke-linecap="round" />
      <path d="M 59,48 L 69,54 M 59,54 L 69,48" stroke="#2d3748" stroke-width="3" stroke-linecap="round" />
      <!-- Wobbly Mouth -->
      <path d="M 44,61 Q 47,57 50,61 Q 53,65 56,61" stroke="#2d3748" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Squeeze lines -->
      <path d="M 15,40 Q 8,55 15,70" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
      <path d="M 85,40 Q 92,55 85,70" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
    `
  };

  const ACCESSORIES = {
    none: ``,
    crown: `
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffd700" />
          <stop offset="100%" stop-color="#ffa500" />
        </linearGradient>
      </defs>
      <path d="M 34,22 L 39,8 L 50,14 L 61,8 L 66,22 Z" fill="url(#gold-grad)" stroke="#d4af37" stroke-width="1.5" />
      <circle cx="34" cy="22" r="1.5" fill="#ffa500" />
      <circle cx="39" cy="8" r="2" fill="#ff4d6d" />
      <circle cx="50" cy="14" r="2" fill="#3b82f6" />
      <circle cx="61" cy="8" r="2" fill="#ff4d6d" />
      <circle cx="66" cy="22" r="1.5" fill="#ffa500" />
    `,
    bow: `
      <path d="M 38,22 C 34,14 30,28 38,24 C 46,28 42,14 38,22 Z" fill="#ff4d6d" stroke="#c9184a" stroke-width="1.5" />
      <circle cx="38" cy="22" r="3" fill="#ff85a1" />
    `,
    glasses: `
      <!-- Sunglasses -->
      <ellipse cx="36" cy="51" rx="9" ry="7" fill="#1a202c" stroke="#fff" stroke-width="1.5" />
      <ellipse cx="64" cy="51" rx="9" ry="7" fill="#1a202c" stroke="#fff" stroke-width="1.5" />
      <!-- Glasses Bridge -->
      <path d="M 45,51 Q 50,48 55,51" stroke="#1a202c" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Reflection shine -->
      <path d="M 31,50 L 35,46" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
      <path d="M 59,50 L 63,46" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
    `,
    hat: `
      <defs>
        <linearGradient id="hat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8a2be2" />
          <stop offset="100%" stop-color="#4169e1" />
        </linearGradient>
      </defs>
      <polygon points="34,22 50,0 66,22" fill="url(#hat-grad)" stroke="#fff" stroke-width="1" />
      <!-- Dots on hat -->
      <circle cx="45" cy="15" r="1.5" fill="#ffd700" />
      <circle cx="55" cy="12" r="1.5" fill="#ff69b4" />
      <circle cx="50" cy="18" r="1.5" fill="#00ffff" />
      <circle cx="50" cy="0" r="3.5" fill="#ffd700" />
    `,
    hairpin: `
      <path d="M 24,35 L 29,42 L 36,42 L 31,47 L 33,54 L 28,50 L 23,54 L 25,47 L 20,42 L 27,42 Z" fill="#ffd700" stroke="#ffa500" stroke-width="1" />
    `
  };

  /**
   * Generates a fully dynamic SVG representation of a Mallang.
   * @param {Object} squishy Mallang config object
   * @param {Object} options Override parameters { expression, stretchX, stretchY }
   */
  function createSVG(squishy, options = {}) {
    const expr = options.expression || squishy.face || 'smile';
    const stretchX = options.stretchX || 1.0;
    const stretchY = options.stretchY || 1.0;
    const width = options.width || 120;
    const height = options.height || 120;

    const bodyPath = SHAPE_PATHS[squishy.shape] || SHAPE_PATHS.circle;
    const facePath = EXPRESSIONS[expr] || EXPRESSIONS.smile;
    const accPath = ACCESSORIES[squishy.accessory] || ACCESSORIES.none;

    const gradId = `mallang-grad-${squishy.id || 'default'}-${Math.floor(Date.now() / 100)}`;
    const fillStyle = squishy.gradient
      ? `url(#${gradId})`
      : (squishy.color || '#ffc0cb');

    let gradientDef = '';
    if (squishy.gradient) {
      gradientDef = `
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${squishy.color || '#ffc0cb'}" />
          <stop offset="100%" stop-color="${squishy.color2 || '#fff'}" />
        </linearGradient>
      `;
    }

    const glowColor = squishy.color || '#ffc0cb';
    const rarityClass = `mallang-rarity-${(squishy.rarity || 'Common').toLowerCase()}`;

    // Wax shell rendering logic for Wack-pu-ball
    let waxShellHTML = '';
    const crackStage = options.crackStage !== undefined ? options.crackStage : (squishy.crackStage || 0);

    if (squishy.material === 'wackpu' && crackStage < 3) {
      let crackLines = '';
      if (crackStage === 1) {
        crackLines = `
          <path d="M 35,45 L 45,55 L 40,70" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 65,40 L 58,52 L 62,65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" />
        `;
      } else if (crackStage === 2) {
        crackLines = `
          <!-- Heavy cracks -->
          <path d="M 35,45 L 45,55 L 40,70" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 65,40 L 58,52 L 62,65" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 45,55 L 58,52" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 22,60 L 35,45" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 78,60 L 65,40" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M 50,25 L 45,35" stroke="#475569" stroke-width="2.5" stroke-linecap="round" fill="none" />
        `;
      }

      // Render wax shell over the body and face
      waxShellHTML = `
        <!-- Frosted Wax Coating Shell -->
        <g fill="#ffffff" opacity="0.88" stroke="#cbd5e1" stroke-width="2" class="wax-shell-coating">
          ${bodyPath}
        </g>
        <!-- Glossy Highlights on Wax -->
        <ellipse cx="40" cy="40" rx="8" ry="4" fill="#fff" opacity="0.5" transform="rotate(-30, 40, 40)" />
        <!-- Cracks Overlay -->
        <g class="wax-cracks">
          ${crackLines}
        </g>
      `;
    }

    // ===== SPECIAL SHAPE: NeeDoh Jelly Cube =====
    if (squishy.shape === 'needoh_cube') {
      const c1 = squishy.color || '#c084fc';
      const c2 = squishy.color2 || '#e9d5ff';
      const uid = `nd-${squishy.id || 'x'}-${Math.floor(Date.now()/100)}`;
      return `
        <svg viewBox="0 0 100 100" width="${width}" height="${height}"
             class="mallang-svg ${rarityClass}"
             style="transform: scale(${stretchX}, ${stretchY}); transform-origin: 50% 70%;"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="nd-body-${uid}" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.55" />
              <stop offset="40%" stop-color="${c2}" stop-opacity="0.75" />
              <stop offset="100%" stop-color="${c1}" stop-opacity="0.92" />
            </radialGradient>
            <radialGradient id="nd-inner-${uid}" cx="60%" cy="65%" r="55%">
              <stop offset="0%" stop-color="${c1}" stop-opacity="0.3" />
              <stop offset="100%" stop-color="${c2}" stop-opacity="0.05" />
            </radialGradient>
            <filter id="nd-blur-${uid}" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="nd-shadow-${uid}">
              <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="${c1}" flood-opacity="0.5" />
            </filter>
          </defs>

          <!-- Drop shadow -->
          <rect x="13" y="13" width="74" height="74" rx="22" ry="22"
                fill="${c1}" opacity="0.18" filter="url(#nd-shadow-${uid})" />

          <!-- Main jelly body (translucent) -->
          <rect x="12" y="12" width="76" height="76" rx="22" ry="22"
                fill="url(#nd-body-${uid})" stroke="${c1}" stroke-width="1.5" stroke-opacity="0.4" />

          <!-- Inner color depth layer -->
          <rect x="18" y="18" width="64" height="64" rx="17" ry="17"
                fill="url(#nd-inner-${uid})" />

          <!-- Swirl streak top-left -->
          <path d="M 20,30 Q 35,22 45,35" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.35" />
          <path d="M 55,20 Q 65,28 62,42" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.2" />

          <!-- Embossed NEE DOH logo area -->
          <rect x="22" y="58" width="56" height="24" rx="6" ry="6"
                fill="none" stroke="${c1}" stroke-width="1.2" stroke-opacity="0.55" />
          <text x="50" y="67" text-anchor="middle" dominant-baseline="middle"
                font-family="'Arial Black', 'Impact', sans-serif"
                font-size="7" font-weight="900" letter-spacing="1.5"
                fill="${c1}" opacity="0.6">NEE</text>
          <text x="50" y="76" text-anchor="middle" dominant-baseline="middle"
                font-family="'Arial Black', 'Impact', sans-serif"
                font-size="7" font-weight="900" letter-spacing="1.5"
                fill="${c1}" opacity="0.6">DOH!</text>

          <!-- Big glossy highlight top-left -->
          <ellipse cx="31" cy="27" rx="12" ry="7"
                   fill="#fff" opacity="0.45" transform="rotate(-30 31 27)" />
          <!-- Small secondary highlight -->
          <ellipse cx="70" cy="22" rx="6" ry="3.5"
                   fill="#fff" opacity="0.28" transform="rotate(-20 70 22)" />

          <!-- Bottom edge darker tint for volume -->
          <rect x="12" y="72" width="76" height="16" rx="0 0 22 22"
                fill="${c1}" opacity="0.25" />
        </svg>
      `;
    }

    // ===== SPECIAL SHAPE: Butter Block =====
    if (squishy.shape === 'butter_block') {
      const uid2 = `bt-${squishy.id || 'x'}-${Math.floor(Date.now()/100)}`;
      return `
        <svg viewBox="0 0 100 100" width="${width}" height="${height}"
             class="mallang-svg ${rarityClass}"
             style="transform: scale(${stretchX}, ${stretchY}); transform-origin: 50% 70%;"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bt-top-${uid2}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="100%" stop-color="#eab308" />
            </linearGradient>
            <linearGradient id="bt-front-${uid2}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fde047" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>
            <linearGradient id="bt-side-${uid2}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#fbbf24" />
            </linearGradient>
            <filter id="bt-shadow-${uid2}">
              <feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#78350f" flood-opacity="0.35" />
            </filter>
          </defs>

          <!-- 3D isometric butter block -->
          <!-- Shadow -->
          <ellipse cx="52" cy="92" rx="36" ry="6" fill="#92400e" opacity="0.25" />

          <!-- Side face (right) -->
          <polygon points="72,28 88,20 88,76 72,84"
                   fill="url(#bt-side-${uid2})" />

          <!-- Front face -->
          <rect x="12" y="28" width="60" height="56" rx="3"
                fill="url(#bt-front-${uid2})" filter="url(#bt-shadow-${uid2})" />

          <!-- Top face -->
          <polygon points="12,28 72,28 88,20 28,20"
                   fill="url(#bt-top-${uid2})" />

          <!-- Label area on front -->
          <rect x="14" y="38" width="56" height="34" rx="2"
                fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" />

          <!-- SALTED text -->
          <text x="42" y="50" text-anchor="middle" dominant-baseline="middle"
                font-family="'Arial', sans-serif" font-size="5.5" font-weight="bold"
                fill="#1e3a8a" letter-spacing="1.5">SALTED</text>

          <!-- BUTTER text -->
          <text x="42" y="61" text-anchor="middle" dominant-baseline="middle"
                font-family="'Arial Black', 'Impact', sans-serif" font-size="11" font-weight="900"
                fill="#1e40af" letter-spacing="0.5">BUTTER</text>

          <!-- 4oz label -->
          <text x="22" y="72" text-anchor="middle" dominant-baseline="middle"
                font-family="'Arial', sans-serif" font-size="6" font-weight="bold"
                fill="#1e3a8a">4oz.</text>

          <!-- Top highlight streak -->
          <polygon points="30,21 65,21 70,23 35,23"
                   fill="#fff" opacity="0.35" />

          <!-- Front face highlight -->
          <rect x="13" y="29" width="58" height="5" rx="2"
                fill="#fff" opacity="0.22" />
        </svg>
      `;
    }

    // Inline SVG string
    return `
      <svg viewBox="0 0 100 100" width="${width}" height="${height}" 
           class="mallang-svg ${rarityClass}" 
           style="transform: scale(${stretchX}, ${stretchY}); transform-origin: 50% 70%;"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${gradientDef}
          <!-- Shadow Filter for soft feel -->
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="${glowColor}" flood-opacity="0.35" />
          </filter>
        </defs>
        
        <!-- Main body with gradient or color -->
        <g filter="url(#soft-shadow)" fill="${fillStyle}" stroke="rgba(0,0,0,0.06)" stroke-width="1.5">
          ${bodyPath}
        </g>
        
        <!-- Face Expression -->
        <g class="mallang-face">
          ${facePath}
        </g>

        <!-- Accessory -->
        <g class="mallang-accessory">
          ${accPath}
        </g>

        <!-- Wax Shell Overlay (Hides content underneath until broken) -->
        ${waxShellHTML}
      </svg>
    `;
  }

  return {
    createSVG
  };
})();

// Export if module system exists, otherwise attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MallangRenderer;
} else {
  window.MallangRenderer = MallangRenderer;
}
