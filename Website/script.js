const scene = document.querySelector(".scene");
const cabinet = document.querySelector(".cabinet");
const lights = document.querySelector(".floating-lights");
const screen = document.querySelector(".screen");

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

if (scene && cabinet && lights) {
  const setTransforms = (x, y) => {
    cabinet.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
    lights.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0)`;
  };

  const handleMove = (event) => {
    if (prefersReduced.matches) return;
    const rect = scene.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    setTransforms(offsetX, offsetY);
  };

  const reset = () => setTransforms(0, 0);

  scene.addEventListener("mousemove", handleMove);
  scene.addEventListener("mouseleave", reset);
  scene.addEventListener("blur", reset);
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
