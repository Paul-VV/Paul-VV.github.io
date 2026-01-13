const scene = document.querySelector(".scene");
const cabinet = document.querySelector(".cabinet");
const lights = document.querySelector(".floating-lights");
const screen = document.querySelector(".screen");
const coinButton = document.querySelector(".coin-button");
const coinDrop = coinButton ? coinButton.querySelector(".coin-drop") : null;
const coinSlot = coinButton ? coinButton.querySelector(".coin-slot") : null;
const returnButton = document.querySelector(".return-button");

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
  let isAnimating = false;

  const startZoom = () => {
    if (scene) {
      scene.classList.add("zooming");
    }

    if (cabinet) {
      const onZoomEnd = (event) => {
        if (event.animationName !== "cabinetZoom") return;
        if (scene) {
          scene.dataset.view = "next";
          scene.classList.remove("zooming");
        }
      };
      cabinet.addEventListener("animationend", onZoomEnd, { once: true });
    } else if (scene) {
      scene.dataset.view = "next";
      scene.classList.remove("zooming");
    }
  };

  coinButton.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    if (prefersReduced.matches) {
      if (scene) {
        scene.dataset.view = "next";
      }
      return;
    }

    coinButton.disabled = true;
    if (resetSceneTransforms) {
      resetSceneTransforms();
    }

    coinButton.classList.add("inserting");

    if (coinDrop) {
      coinDrop.addEventListener("animationend", startZoom, { once: true });
    } else {
      window.setTimeout(startZoom, 1000);
    }
  });
}

if (returnButton && scene && coinButton) {
  returnButton.addEventListener("click", () => {
    scene.dataset.view = "lobby";
    coinButton.classList.remove("inserting");
    coinButton.disabled = false;
  });
}

if (screen && cabinet && !prefersReduced.matches) {
  const powerCycle = () => {
    screen.classList.add("power-off");
    cabinet.classList.add("power-off");
    window.setTimeout(() => {
      screen.classList.remove("power-off");
      cabinet.classList.remove("power-off");
    }, 5000);
  };

  window.setTimeout(() => {
    powerCycle();
    window.setInterval(powerCycle, 20000);
  }, 15000);
}
