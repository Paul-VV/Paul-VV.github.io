const scene = document.querySelector(".scene");
const cabinet = document.querySelector(".cabinet");
const lights = document.querySelector(".floating-lights");
const screen = document.querySelector(".screen");
const coinButton = document.querySelector(".coin-button");
const coinDrop = coinButton ? coinButton.querySelector(".coin-drop") : null;
const coinSlot = coinButton ? coinButton.querySelector(".coin-slot") : null;

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

let resetSceneTransforms = null;

if (scene && cabinet && lights) {
  const setTransforms = (x, y) => {
    cabinet.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
    lights.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0)`;
  };

  const handleMove = (event) => {
    if (prefersReduced.matches || scene.classList.contains("zooming")) return;
    const rect = scene.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    setTransforms(offsetX, offsetY);
  };

  const reset = () => setTransforms(0, 0);
  resetSceneTransforms = reset;

  scene.addEventListener("mousemove", handleMove);
  scene.addEventListener("mouseleave", reset);
  scene.addEventListener("blur", reset);
}

if (coinButton) {
  const target = coinButton.dataset.target || "play.html";
  let isAnimating = false;
  let isPowerOff = false;
  const coinInsertDuration = 900;
  const zoomDelay = 1000;
  const zoomDuration = 900;

  const goToTarget = () => window.location.assign(target);

  const startZoom = () => {
    if (scene) {
      scene.classList.add("zooming");
    }

    if (cabinet) {
      const onZoomEnd = (event) => {
        if (event.animationName !== "cabinetZoom") return;
        goToTarget();
      };
      cabinet.addEventListener("animationend", onZoomEnd, { once: true });
    } else if (scene) {
      goToTarget();
    }
  };

  coinButton.addEventListener("click", () => {
    if (isAnimating) return;
    if (isPowerOff || coinButton.disabled) return;
    if (cabinet && cabinet.classList.contains("power-off")) return;
    isAnimating = true;

    if (resetSceneTransforms) {
      resetSceneTransforms();
    }

    coinButton.classList.remove("inserting");
    if (scene) {
      scene.classList.remove("zooming");
      void scene.offsetWidth;
    }
    void coinButton.offsetWidth;
    coinButton.classList.add("inserting");
    coinButton.disabled = true;

    window.setTimeout(() => {
      if (screen) {
        screen.classList.add("dimmed");
      }
      startZoom();
    }, zoomDelay);
    window.setTimeout(goToTarget, zoomDelay + zoomDuration + 100);
  });

  if (screen && cabinet) {
    const powerCycle = () => {
      isPowerOff = true;
      screen.classList.add("power-off");
      cabinet.classList.add("power-off");
      coinButton.disabled = true;
      window.setTimeout(() => {
        screen.classList.remove("power-off");
        cabinet.classList.remove("power-off");
        coinButton.disabled = false;
        isPowerOff = false;
      }, 5000);
    };

    window.setTimeout(() => {
      powerCycle();
      window.setInterval(powerCycle, 20000);
    }, 15000);
  }
}

const navMenu = document.querySelector(".next-nav");
const menuButton = document.querySelector(".menu-button");

if (navMenu && menuButton) {
  const toggleMenu = (force) => {
    const shouldOpen = typeof force === "boolean" ? force : !navMenu.classList.contains("open");
    navMenu.classList.toggle("open", shouldOpen);
    menuButton.setAttribute("aria-expanded", String(shouldOpen));
  };

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", () => toggleMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleMenu(false);
    }
  });
}
