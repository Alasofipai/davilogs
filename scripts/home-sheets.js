/* Overlay controllers: catalog, portal, compact menu and deep footer. */
export function initSheets() {
  const body = document.body;
  const catalog = document.getElementById('catalogSheet');
  const catalogToggle = document.getElementById('catalogToggle');
  const portal = document.getElementById('portalSheet');
  const openPortal = document.getElementById('openPortal');
  const closePortal = document.getElementById('closePortal');
  const offMenu = document.getElementById('offMenu');
  const hamburger = document.getElementById('hamburger');
  const offMenuEnter = document.getElementById('offMenuEnter');
  const deepFooter = document.getElementById('deepFooter');
  const deepToggle = document.getElementById('deepFooterToggle');
  const closeDeep = document.getElementById('closeDeepFooter');
  const locator = document.getElementById('locator');

  const setCatalog = (open) => {
    catalog.classList.toggle('is-open', open);
    catalog.setAttribute('aria-hidden', open ? 'false' : 'true');
    catalogToggle.classList.toggle('is-open', open);
    catalogToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const setPortal = (open) => {
    body.classList.toggle('is-portalOpen', open);
    portal.setAttribute('aria-hidden', open ? 'false' : 'true');
    openPortal.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const setOffMenu = (open) => {
    offMenu.classList.toggle('is-open', open);
    offMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const setDeepFooter = (open) => {
    deepFooter.classList.toggle('is-open', open);
    deepFooter.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  const closeAll = () => {
    setCatalog(false);
    setPortal(false);
    setOffMenu(false);
    setDeepFooter(false);
    if (locator) {
      locator.classList.remove('is-open');
      locator.setAttribute('aria-hidden', 'true');
    }
  };

  const isLocked = () => (
    catalog.classList.contains('is-open')
    || body.classList.contains('is-portalOpen')
    || offMenu.classList.contains('is-open')
    || deepFooter.classList.contains('is-open')
    || (locator && locator.classList.contains('is-open'))
  );

  catalogToggle.addEventListener('click', () => {
    const open = !catalog.classList.contains('is-open');
    setPortal(false);
    setOffMenu(false);
    setDeepFooter(false);
    if (locator) {
      locator.classList.remove('is-open');
      locator.setAttribute('aria-hidden', 'true');
    }
    setCatalog(open);
  });

  openPortal.addEventListener('click', () => {
    setCatalog(false);
    setOffMenu(false);
    setDeepFooter(false);
    if (locator) {
      locator.classList.remove('is-open');
      locator.setAttribute('aria-hidden', 'true');
    }
    setPortal(true);
  });

  closePortal.addEventListener('click', () => setPortal(false));

  hamburger.addEventListener('click', () => {
    const open = !offMenu.classList.contains('is-open');
    setCatalog(false);
    setPortal(false);
    setDeepFooter(false);
    if (locator) {
      locator.classList.remove('is-open');
      locator.setAttribute('aria-hidden', 'true');
    }
    setOffMenu(open);
  });

  offMenuEnter.addEventListener('click', () => {
    setOffMenu(false);
    setPortal(true);
  });

  deepToggle.addEventListener('click', () => {
    const open = !deepFooter.classList.contains('is-open');
    setCatalog(false);
    setPortal(false);
    setOffMenu(false);
    if (locator) {
      locator.classList.remove('is-open');
      locator.setAttribute('aria-hidden', 'true');
    }
    setDeepFooter(open);
  });

  closeDeep.addEventListener('click', () => setDeepFooter(false));

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#"]');
    if (link) event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (locator && locator.classList.contains('is-open')) {
      locator.classList.remove('is-open');
      locator.setAttribute('aria-hidden', 'true');
      return;
    }
    if (deepFooter.classList.contains('is-open')) {
      setDeepFooter(false);
      return;
    }
    if (body.classList.contains('is-portalOpen')) {
      setPortal(false);
      return;
    }
    if (offMenu.classList.contains('is-open')) {
      setOffMenu(false);
      return;
    }
    if (catalog.classList.contains('is-open')) {
      setCatalog(false);
    }
  });

  return { isLocked, closeAll, setCatalog, setPortal, setOffMenu };
}
