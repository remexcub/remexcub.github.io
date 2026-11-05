/* REMEXCUB · celular: que el teclado no tape el resultado de la calculadora.
   1) Al tocar un monto, la pantalla sube para que se vean los dos campos.
   2) Mientras el teclado está abierto, una barrita pegada encima muestra el otro monto en vivo. */
(function () {
    'use strict';
    var mxn = document.getElementById('mxn'), rec = document.getElementById('recibe');
    if (!mxn || !rec || !window.visualViewport) return;
    var vv = window.visualViewport, activo = null, barra = null, timer = null;

    function esCel() { return window.matchMedia('(max-width: 700px)').matches; }
    function txt(id) { var e = document.getElementById(id); return e ? e.textContent.trim() : ''; }

    function crear() {
        barra = document.createElement('div');
        barra.setAttribute('aria-live', 'polite');
        barra.style.cssText = 'position:fixed;left:0;right:0;z-index:90;display:none;align-items:center;' +
            'justify-content:space-between;gap:12px;padding:10px 18px;background:#10204d;color:#fff;' +
            'font:600 .95rem system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 -2px 10px rgba(0,0,0,.25)';
        document.body.appendChild(barra);
    }

    function tecladoAbierto() { return window.innerHeight - vv.height > 120; }

    function pintar() {
        if (!barra) return;
        if (!activo || !esCel() || !tecladoAbierto()) {
            barra.style.display = 'none';
            document.documentElement.classList.remove('kb-abierto');
            return;
        }
        var otro = activo === mxn ? rec : mxn;
        var etiqueta = activo === mxn ? 'Reciben en Cuba' : 'Envías';
        var moneda = txt(otro === rec ? 'recibe-moneda' : 'mxn-moneda');
        var valor = otro.value.trim() || '—';
        barra.innerHTML = '<span style="opacity:.85">' + etiqueta + '</span>' +
            '<span style="color:#f5c542;font-weight:800;font-size:1.1rem">' + valor +
            (otro.value.trim() ? ' ' + moneda : '') + '</span>';
        barra.style.display = 'flex';
        barra.style.bottom = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)) + 'px';
        document.documentElement.classList.add('kb-abierto');
    }

    function subirCampo(el) {
        // Espera a que termine de abrir el teclado y sube el campo (con su etiqueta) al tope
        setTimeout(function () {
            var campo = el.closest('.campo') || el;
            var y = campo.getBoundingClientRect().top + window.pageYOffset;
            var enc = document.querySelector('header.top');
            var alto = enc ? enc.getBoundingClientRect().height : 0;
            window.scrollTo({ top: Math.max(0, y - alto - 8), behavior: 'smooth' });
        }, 320);
    }

    function alEnfocar(e) {
        if (!esCel()) return;
        activo = e.target;
        subirCampo(activo);
        clearInterval(timer);
        timer = setInterval(pintar, 200); // el otro monto lo calcula la página: lo leemos en vivo
        setTimeout(pintar, 350);
    }
    function alSalir() {
        activo = null;
        clearInterval(timer);
        pintar();
    }

    // El estilo para esconder a Wabi mientras el teclado está abierto
    var st = document.createElement('style');
    st.textContent = 'html.kb-abierto .wabi{display:none!important}';
    document.head.appendChild(st);

    crear();
    [mxn, rec].forEach(function (el) {
        el.addEventListener('focus', alEnfocar);
        el.addEventListener('blur', alSalir);
        el.addEventListener('input', function () { setTimeout(pintar, 0); });
    });
    vv.addEventListener('resize', pintar);
    vv.addEventListener('scroll', pintar);
})();
