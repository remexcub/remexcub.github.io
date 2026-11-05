/* REMEXCUB · app instalable (PWA): botón "Instalar app" + conteo de instalaciones y aperturas. */
(function () {
    'use strict';

    // URL (termina en /exec) de la implementación del Apps Script "instalaciones.gs".
    // Mientras esté vacía, los eventos solo se mandan a Google (gtag).
    var TRACK_URL = 'https://script.google.com/macros/s/AKfycbwzb8e6UNSN8MMeBTfRGAUi9wHVsR3XbalQKJrX3FzP62UfjwbOqLVJOowsLUAfjIf70Q/exec';

    var esApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                window.navigator.standalone === true ||
                /[?&]source=app\b/.test(location.search);

    // ID anónimo por celular, para contar equipos distintos y no solo eventos.
    var id = '';
    try {
        id = localStorage.getItem('rmx_id') || '';
        if (!id) {
            id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
            localStorage.setItem('rmx_id', id);
        }
    } catch (e) { id = 'sin-id'; }

    function registrar(evento) {
        try { if (typeof window.gtag === 'function') window.gtag('event', 'pwa_' + evento, { event_category: 'app' }); } catch (e) {}
        if (!TRACK_URL) return;
        try {
            var q = '?e=' + encodeURIComponent(evento) + '&id=' + encodeURIComponent(id) +
                    '&app=' + (esApp ? 1 : 0) + '&t=' + Date.now();
            fetch(TRACK_URL + q, { mode: 'no-cors', keepalive: true, cache: 'no-store' }).catch(function () {});
        } catch (e) {}
    }

    // Service worker (necesario para que Chrome ofrezca instalar la app)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
    }

    // Apertura desde el ícono de la app (una vez por sesión)
    if (esApp) {
        try {
            if (!sessionStorage.getItem('rmx_abierta')) {
                sessionStorage.setItem('rmx_abierta', '1');
                registrar('apertura');
            }
        } catch (e) { registrar('apertura'); }
        return; // ya está dentro de la app: no mostrar botón de instalar
    }

    // Botón "Instalar app" (solo cuando el navegador permite instalar)
    var evento = null, boton = null, caja = null;

    function crearBoton() {
        if (boton) return;
        boton = document.createElement('button');
        boton.type = 'button';
        boton.textContent = '📲 Instalar app';
        boton.setAttribute('aria-label', 'Instalar la app de REMEXCUB');
        boton.style.cssText = 'background:#10204d;color:#fff;border:2px solid #e2b53c;border-radius:999px;' +
            'padding:9px 16px;font:700 .9rem system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;' +
            'box-shadow:0 6px 18px rgba(16,32,77,.3)';
        boton.addEventListener('click', function () {
            if (!evento) return;
            registrar('clic_instalar');
            evento.prompt();
            evento.userChoice.then(function (r) {
                registrar(r && r.outcome === 'accepted' ? 'acepto' : 'rechazo');
                evento = null;
                ocultarBoton();
            }).catch(function () {});
        });

        // Arriba a la izquierda, justo debajo del encabezado (debajo del logo), alineado con él.
        // No es flotante: se va con la página, así no choca con Wabi.
        caja = document.createElement('div');
        caja.className = 'wrap';
        caja.style.cssText = 'padding-top:10px;padding-bottom:0;text-align:left';
        caja.appendChild(boton);
        var enc = document.querySelector('header.top');
        if (enc && enc.parentNode) enc.parentNode.insertBefore(caja, enc.nextSibling);
        else document.body.insertBefore(caja, document.body.firstChild);
    }

    function ocultarBoton() {
        if (caja) caja.style.display = 'none';
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        evento = e;
        if (document.body) crearBoton();
        else document.addEventListener('DOMContentLoaded', crearBoton);
    });

    window.addEventListener('appinstalled', function () {
        registrar('instalada');
        evento = null;
        ocultarBoton();
    });
})();
