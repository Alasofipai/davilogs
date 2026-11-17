/* Vertical stage controller for the home page. */
export function createSlider({ isLocked }) {
  const track = document.getElementById('stageTrack');
  const panels = Array.from(document.querySelectorAll('.panel'));
  const railItems = Array.from(document.querySelectorAll('[data-rail]'));
  const railButtons = Array.from(document.querySelectorAll('[data-slide-to]'));
  let index = 0;
  let lastWheel = 0;
  let touchStartY = null;

  const apply = () => {
    track.style.transform = `translate3d(0, -${index * 100}vh, 0)`;
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
      panel.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    railItems.forEach((item) => {
      item.classList.toggle('is-active', Number(item.dataset.rail) === index);
    });
  };

  const goTo = (nextIndex) => {
    const next = Math.max(0, Math.min(panels.length - 1, nextIndex));
    if (next === index) return;
    index = next;
    apply();
  };

  railButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isLocked()) return;
      goTo(Number(button.dataset.slideTo));
    });
  });

  window.addEventListener('wheel', (event) => {
    if (isLocked()) return;
    if (event.target.closest('.catalogSheet, .portalSheet, .offMenu, .locator, .deepFooter')) return;
    if (Math.abs(event.deltaY) < 12) return;
    event.preventDefault();
    const now = Date.now();
    if (now - lastWheel < 850) return;
    lastWheel = now;
    goTo(index + (event.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  window.addEventListener('touchstart', (event) => {
    if (isLocked()) return;
    if (event.target.closest('.catalogSheet, .portalSheet, .offMenu, .locator, .deepFooter')) return;
    touchStartY = event.touches[0] ? event.touches[0].clientY : null;
  }, { passive: true });

  window.addEventListener('touchend', (event) => {
    if (isLocked() || touchStartY === null) {
      touchStartY = null;
      return;
    }
    const endY = event.changedTouches[0] ? event.changedTouches[0].clientY : touchStartY;
    const delta = touchStartY - endY;
    touchStartY = null;
    if (Math.abs(delta) < 45) return;
    if (event.target.closest('.catalogSheet, .portalSheet, .offMenu, .locator, .deepFooter')) return;
    goTo(index + (delta > 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (isLocked()) return;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(panels.length - 1);
    }
  });

  apply();

  return {
    apply,
    goTo,
    get index() {
      return index;
    },
  };
}
