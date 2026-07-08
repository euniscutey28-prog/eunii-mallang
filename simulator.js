// simulator.js - Squishy Physics Simulator
const MallangSimulator = (() => {
  let activeSquishy = null;
  let isInteracting = false;
  let isDragging = false;

  let dragStartX = 0;
  let dragStartY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  // Spring physics variables
  let scaleX = 1.0;
  let scaleY = 1.0;
  let velX = 0.0;
  let velY = 0.0;

  const K = 300.0; // Spring constant
  const DAMPING = 8.0; // Damping constant
  let lastTime = 0;
  let animationId = null;

  function initSimulator(squishy) {
    activeSquishy = squishy || App.getOwnedMallangs()[0];
    isInteracting = false;
    isDragging = false;
    scaleX = 1.0;
    scaleY = 1.0;
    velX = 0.0;
    velY = 0.0;

    renderSimulatorUI();
    setupListeners();

    // Start physics loop
    lastTime = performance.now();
    if (animationId) cancelAnimationFrame(animationId);
    physicsLoop(lastTime);
  }

  function renderSimulatorUI() {
    const selector = document.getElementById('sim-selector');
    if (selector) {
      const owned = App.getOwnedMallangs();
      selector.innerHTML = owned.map(m => `
        <option value="${m.id}" ${m.id === activeSquishy.id ? 'selected' : ''}>
          ${m.name} (${m.rarity})
        </option>
      `).join('');
    }

    updateMallangDisplay('smile');
  }

  function updateMallangDisplay(exprOverride) {
    const container = document.getElementById('sim-canvas-container');
    if (!container || !activeSquishy) return;

    // Render the SVG
    container.innerHTML = MallangRenderer.createSVG(activeSquishy, {
      expression: exprOverride || (isInteracting ? 'squeezed' : activeSquishy.face),
      stretchX: scaleX,
      stretchY: scaleY,
      width: 250,
      height: 250
    });
  }

  function setupListeners() {
    const container = document.getElementById('sim-canvas-container');
    if (!container) return;

    // Selector Change
    const selector = document.getElementById('sim-selector');
    if (selector) {
      selector.onchange = (e) => {
        Sound.playClick();
        const id = e.target.value;
        const owned = App.getOwnedMallangs();
        const found = owned.find(m => m.id === id);
        if (found) {
          activeSquishy = found;
          initSimulator(activeSquishy);
        }
      };
    }

    // Mouse & Touch events
    container.onmousedown = (e) => startInteraction(e.clientX, e.clientY);
    window.onmousemove = (e) => moveInteraction(e.clientX, e.clientY);
    window.onmouseup = () => endInteraction();

    container.ontouchstart = (e) => {
      if (e.touches.length > 0) {
        startInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    window.ontouchmove = (e) => {
      if (e.touches.length > 0) {
        moveInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    window.ontouchend = () => endInteraction();
  }

  function startInteraction(clientX, clientY) {
    isInteracting = true;
    isDragging = true;
    dragStartX = clientX;
    dragStartY = clientY;
    currentMouseX = clientX;
    currentMouseY = clientY;

    Sound.playSqueeze();

    // Squeeze animation (squash in Y, stretch in X)
    velX = 0;
    velY = 0;
    scaleX = 1.3;
    scaleY = 0.75;

    // Trigger visual updates
    updateMallangDisplay('squeezed');
  }

  function moveInteraction(clientX, clientY) {
    if (!isInteracting || !isDragging) return;
    currentMouseX = clientX;
    currentMouseY = clientY;

    const dx = currentMouseX - dragStartX;
    const dy = currentMouseY - dragStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 15) {
      // Calculate angle and scale stretching based on drag distance
      const maxStretch = 1.6;
      const stretchAmount = Math.min(1.0 + distance / 200.0, maxStretch);
      const compressAmount = 1.0 / Math.sqrt(stretchAmount); // Conserve volume/area!

      // Stretch along the vector. Let's simplify: stretch Y if dragging vertical, X if horizontal
      if (Math.abs(dx) > Math.abs(dy)) {
        scaleX = stretchAmount;
        scaleY = compressAmount;
      } else {
        scaleX = compressAmount;
        scaleY = stretchAmount;
      }
    }
  }

  function endInteraction() {
    if (!isInteracting) return;
    isInteracting = false;
    isDragging = false;

    Sound.playPop();

    // Bounce effect: initialize velocities for recovery
    const dx = currentMouseX - dragStartX;
    const dy = currentMouseY - dragStartY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist > 15) {
      // Release from drag stretch
      velX = (1.0 - scaleX) * 20;
      velY = (1.0 - scaleY) * 20;
    } else {
      // Release from squeeze click
      velX = -30.0;
      velY = 30.0;
    }
  }

  function physicsLoop(timestamp) {
    if (!activeSquishy) return;

    const dt = Math.min((timestamp - lastTime) / 1000.0, 0.1); // cap dt at 100ms
    lastTime = timestamp;

    if (!isInteracting) {
      // Spring physics (f = -k*x - c*v)
      // For X scale
      const forceX = -K * (scaleX - 1.0) - DAMPING * velX;
      velX += forceX * dt;
      scaleX += velX * dt;

      // For Y scale
      const forceY = -K * (scaleY - 1.0) - DAMPING * velY;
      velY += forceY * dt;
      scaleY += velY * dt;

      // Snap to 1.0 if oscillation is tiny
      if (Math.abs(scaleX - 1.0) < 0.005 && Math.abs(velX) < 0.05) {
        scaleX = 1.0;
        velX = 0;
      }
      if (Math.abs(scaleY - 1.0) < 0.005 && Math.abs(velY) < 0.05) {
        scaleY = 1.0;
        velY = 0;
      }

      updateMallangDisplay(activeSquishy.face);
    } else {
      // While dragging, just keep updating screen display
      updateMallangDisplay('squeezed');
    }

    animationId = requestAnimationFrame(physicsLoop);
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    // Clean global listeners
    window.onmousemove = null;
    window.onmouseup = null;
    window.ontouchmove = null;
    window.ontouchend = null;
  }

  return {
    init: initSimulator,
    stop: stop
  };
})();

// Export if module system exists
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MallangSimulator;
} else {
  window.MallangSimulator = MallangSimulator;
}
