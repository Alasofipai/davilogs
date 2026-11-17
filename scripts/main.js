import { createSlider } from 'home-slider.js';
import { initSheets } from 'home-sheets.js';
import { initLocator } from 'home-map.js';

const sheets = initSheets();
const slider = createSlider({ isLocked: () => sheets.isLocked() });

initLocator({
  closeOtherOverlays: () => sheets.closeAll(),
});

/* Keep the stage geometry in sync without animation on resize. */
let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    slider.apply();
  }, 120);
});
