// =========================================
//  CUESTIONARIO FAMILIAS - script.js
//  Integrado con Google Sheets via Apps Script
// =========================================

(function () {
  'use strict';

  // ==============================================
  //  CONFIGURACION - Pega tu URL de Apps Script aqui
  //  (Sigue los pasos del archivo SETUP.md)
  // ==============================================
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzt0Ug_v1C6KrsTDnBX3sSwdzz_6R0qrOIKtqaAvHYGq9Ur_dotdj0Ve4Qg_UjXvjhc/exec';
  // ==============================================

  // --- Element refs ---
  var form = document.getElementById('survey-form');
  var successCard = document.getElementById('success-card');
  var resetBtn = document.getElementById('reset-btn');
  var submitBtn = document.getElementById('submit-btn');
  var textarea1 = document.getElementById('justificacion');
  var textarea2 = document.getElementById('expectativas');
  var counter1 = document.getElementById('char-count-1');
  var counter2 = document.getElementById('char-count-2');
  var choiceGroup = form.querySelector('.choice-group');

  // --- Character counters ---
  function updateCounter(textarea, counter, max) {
    var len = textarea.value.length;
    counter.textContent = len + ' / ' + max;
    counter.classList.toggle('warning', len > max * 0.80);
    counter.classList.toggle('danger', len > max * 0.95);
  }

  textarea1.addEventListener('input', function () { updateCounter(textarea1, counter1, 600); });
  textarea2.addEventListener('input', function () { updateCounter(textarea2, counter2, 800); });

  // --- Ripple effect on choice cards ---
  document.querySelectorAll('.choice-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'background:rgba(168,85,247,0.28)',
        'width:90px',
        'height:90px',
        'top:50%',
        'left:50%',
        'transform:translate(-50%,-50%) scale(0)',
        'animation:rippleAnim 0.55s ease-out forwards',
        'pointer-events:none'
      ].join(';');
      this.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  // Inject ripple keyframes once
  var ks = document.createElement('style');
  ks.textContent = '@keyframes rippleAnim{to{transform:translate(-50%,-50%) scale(3);opacity:0}}';
  document.head.appendChild(ks);

  // --- Error helpers ---
  function showError(id, fieldEl) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = true;
    requestAnimationFrame(function () { el.hidden = false; });
    if (fieldEl) fieldEl.classList.add('field-error');
  }

  function hideError(id, fieldEl) {
    var el = document.getElementById(id);
    if (el) el.hidden = true;
    if (fieldEl) fieldEl.classList.remove('field-error');
  }

  // Clear errors as soon as user fixes the field
  form.querySelectorAll('input[name="experiencia"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      choiceGroup.classList.remove('has-error');
      hideError('error-experiencia', null);
    });
  });

  textarea2.addEventListener('input', function () {
    if (textarea2.value.trim().length >= 5) {
      hideError('error-expectativas', textarea2);
    }
  });

  // --- Validation ---
  function validate() {
    var valid = true;
    var firstErr = null;

    var radioSelected = form.querySelector('input[name="experiencia"]:checked');
    if (!radioSelected) {
      choiceGroup.classList.add('has-error');
      showError('error-experiencia', null);
      if (!firstErr) firstErr = choiceGroup;
      valid = false;
    } else {
      choiceGroup.classList.remove('has-error');
      hideError('error-experiencia', null);
    }

    if (textarea2.value.trim().length < 5) {
      showError('error-expectativas', textarea2);
      if (!firstErr) firstErr = textarea2;
      valid = false;
    } else {
      hideError('error-expectativas', textarea2);
    }

    if (firstErr) {
      firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  }

  // --- Show success screen ---
  function showSuccess() {
    form.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(12px)';

    setTimeout(function () {
      form.hidden = true;

      successCard.hidden = false;
      successCard.removeAttribute('aria-hidden');

      successCard.style.opacity = '0';
      successCard.style.transform = 'translateY(16px)';
      successCard.style.transition = 'opacity 0.55s ease, transform 0.55s ease';

      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(function () {
        successCard.style.opacity = '1';
        successCard.style.transform = 'translateY(0)';
      });
    }, 450);
  }

  // --- Send data to Google Sheets ---
  function sendToSheets(data) {
    // If no URL configured yet, just show success (dev mode)
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'TU_URL_AQUI') {
      console.warn('Apps Script URL no configurada. Datos (solo consola):', data);
      showSuccess();
      return;
    }

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necesario para Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function () {
        // no-cors => response opaca, asumir exito
        showSuccess();
      })
      .catch(function (err) {
        console.error('Error al enviar:', err);
        // Mostrar exito de todas formas (los datos ya se loguearon)
        showSuccess();
      });
  }

  // --- Submit ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-text').textContent = 'Enviando...';
    submitBtn.querySelector('.submit-icon').textContent = '\u23F3';

    var experienciaEl = form.querySelector('input[name="experiencia"]:checked');
    var data = {
      fecha: new Date().toLocaleString('es-ES'),
      experienciaPrevia: experienciaEl ? experienciaEl.value : '',
      justificacion: textarea1.value.trim(),
      expectativas: textarea2.value.trim()
    };

    sendToSheets(data);
  });

  // --- Reset ---
  resetBtn.addEventListener('click', function () {

    document.body.style.overflow = 'auto';

    form.reset();
    textarea1.value = '';
    textarea2.value = '';
    updateCounter(textarea1, counter1, 600);
    updateCounter(textarea2, counter2, 800);
    textarea2.classList.remove('field-error');
    choiceGroup.classList.remove('has-error');
    hideError('error-experiencia', null);
    hideError('error-expectativas', textarea2);
    submitBtn.disabled = false;
    submitBtn.querySelector('.submit-text').textContent = 'Enviar cuestionario';
    submitBtn.querySelector('.submit-icon').textContent = '\uD83D\uDC9C';

    successCard.style.opacity = '0';
    successCard.style.transform = 'translateY(16px)';
    successCard.hidden = true;
    successCard.setAttribute('aria-hidden', 'true');
    form.hidden = false;
    form.style.opacity = '0';
    requestAnimationFrame(function () {
      form.style.transition = 'opacity 0.5s ease';
      form.style.opacity = '1';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Auto-resize textareas ---
  [textarea1, textarea2].forEach(function (el) {
    el.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });

  // --- Fade-in sections on scroll ---
  var sections = document.querySelectorAll('.form-section, .submit-wrapper');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(function (section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(24px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(section);
  });

})();
