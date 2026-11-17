import { locationData } from 'agencies-data.js';

/* Locator overlay and agency filtering. */
export function initLocator({ closeOtherOverlays } = {}) {
  const panel = document.getElementById('locator');
  const openButton = document.getElementById('openLocator');
  const closeButton = document.getElementById('closeLocator');
  const citySelect = document.getElementById('locatorCity');
  const typeSelect = document.getElementById('locatorType');
  const searchInput = document.getElementById('locatorSearch');
  const results = document.getElementById('locatorResults');

  const render = () => {
    const city = citySelect.value;
    const type = typeSelect.value;
    const query = searchInput.value.trim().toLowerCase();
    const filtered = locationData.filter((item) => {
      const matchesCity = city === 'Todos' || item.dept.toLowerCase().includes(city.toLowerCase());
      const matchesType = type === 'Todos los tipos' || type === 'Agencias';
      const haystack = `${item.name} ${item.address} ${item.details}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesCity && matchesType && matchesQuery;
    });

    results.innerHTML = filtered.map((item) => `
      <li class="locator__item">
        <h4>${item.name}</h4>
        <p>Detalles: ${item.details}</p>
        <p>Dirección: ${item.address}</p>
        <p>Departamento: ${item.dept}</p>
      </li>
    `).join('') || '<li class="locator__item"><p>No se encontraron resultados.</p></li>';
  };

  const open = () => {
    if (closeOtherOverlays) closeOtherOverlays();
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    render();
  };

  const close = () => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  };

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  citySelect.addEventListener('change', render);
  searchInput.addEventListener('input', render);

  return { open, close, render };
}
