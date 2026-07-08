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
    `
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

    const gradId = `mallang-grad-${squishy.id || 'default'}`;
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
