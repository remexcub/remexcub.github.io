/* REMEXCUB · celular: teclado numérico propio para los montos de la calculadora.
   En vez del teclado de Android (que tapa el resultado y no se puede personalizar), se muestra un
   teclado compacto, semitransparente y con el otro monto a la vista. Solo en celular (pantalla táctil
   angosta); en computadora no cambia nada. */
(function () {
    'use strict';
    var mxn = document.getElementById('mxn'), rec = document.getElementById('recibe');
    if (!mxn || !rec) return;
    var movil = window.matchMedia('(max-width: 700px) and (pointer: coarse)');
    if (!movil.matches) return;

    var activo = null, reemplazar = false, teclado, vistaEtq, vistaVal, timer = null, repite = null;

    // Se apaga el teclado de Android en estos dos campos
    mxn.setAttribute('inputmode', 'none');
    rec.setAttribute('inputmode', 'none');

    var estilo = document.createElement('style');
    estilo.textContent =
        'html.kb-abierto .wabi{display:none!important}' +
        'html.kb-abierto body{padding-bottom:var(--kb-h,300px)!important}' +
        '#rmx-teclado{position:fixed;left:0;right:0;bottom:0;z-index:90;display:none;' +
            'padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));' +
            'background:rgba(16,32,77,.80);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);' +
            'border-top:1px solid rgba(255,255,255,.18);box-shadow:0 -6px 22px rgba(10,20,50,.28);' +
            'font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;touch-action:manipulation}' +
        '#rmx-teclado .rk-vista{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 2px 10px;color:#fff}' +
        '#rmx-teclado .rk-etq{font-size:.82rem;opacity:.8;line-height:1.2}' +
        '#rmx-teclado .rk-val{font-size:1.2rem;font-weight:800;color:#f5c542;line-height:1.2}' +
        '#rmx-teclado .rk-listo{flex:none;border:0;border-radius:999px;background:#1c3faa;color:#fff;font:700 .95rem system-ui,sans-serif;padding:9px 20px}' +
        '#rmx-teclado .rk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
        '#rmx-teclado .rk-t{height:46px;border:0;border-radius:11px;background:rgba(255,255,255,.14);color:#fff;' +
            'font:600 1.35rem system-ui,sans-serif;display:flex;align-items:center;justify-content:center}' +
        '#rmx-teclado .rk-t:active,#rmx-teclado .rk-listo:active{background:rgba(255,255,255,.34)}' +
        '#rmx-teclado .rk-t.rk-borrar{background:rgba(255,255,255,.08);font-size:1.15rem}';
    document.head.appendChild(estilo);

    function boton(txt, clase, accion, etiquetaAria, repetir) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = clase;
        b.textContent = txt;
        if (etiquetaAria) b.setAttribute('aria-label', etiquetaAria);
        b.addEventListener('pointerdown', function (e) {
            e.preventDefault(); // no le quita el foco al campo
            accion();
            if (repetir) {
                clearTimeout(repite);
                repite = setTimeout(function () {
                    repite = setInterval(accion, 80);
                }, 420);
            }
        });
        return b;
    }
    function pararRepite() { clearTimeout(repite); clearInterval(repite); repite = null; }
    document.addEventListener('pointerup', pararRepite);
    document.addEventListener('pointercancel', pararRepite);

    function crear() {
        teclado = document.createElement('div');
        teclado.id = 'rmx-teclado';
        teclado.setAttribute('role', 'group');
        teclado.setAttribute('aria-label', 'Teclado numérico');
        var vista = document.createElement('div');
        vista.className = 'rk-vista';
        vista.setAttribute('aria-live', 'polite');
        var izq = document.createElement('div');
        vistaEtq = document.createElement('div'); vistaEtq.className = 'rk-etq';
        vistaVal = document.createElement('div'); vistaVal.className = 'rk-val';
        izq.appendChild(vistaEtq); izq.appendChild(vistaVal);
        vista.appendChild(izq);
        vista.appendChild(boton('Listo', 'rk-listo', cerrar));
        teclado.appendChild(vista);

        var grid = document.createElement('div');
        grid.className = 'rk-grid';
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (d) {
            grid.appendChild(boton(d, 'rk-t', function () { escribir(d); }));
        });
        grid.appendChild(boton('.', 'rk-t', function () { escribir('.'); }, 'Punto decimal'));
        grid.appendChild(boton('0', 'rk-t', function () { escribir('0'); }));
        grid.appendChild(boton('⌫', 'rk-t rk-borrar', borrar, 'Borrar', true));
        teclado.appendChild(grid);
        document.body.appendChild(teclado);
    }

    function txt(id) { var e = document.getElementById(id); return e ? e.textContent.trim() : ''; }

    function avisar(el) { el.dispatchEvent(new Event('input', { bubbles: true })); }

    function escribir(c) {
        if (!activo) return;
        var v = reemplazar ? '' : activo.value.replace(/,/g, '');
        reemplazar = false;
        if (c === '.') {
            if (v.indexOf('.') >= 0) return;
            if (v === '') v = '0';
        } else if (v === '0') {
            v = '';
        }
        if (v.replace('.', '').length >= 12) return;
        activo.value = v + c;
        avisar(activo);
        pintar();
    }

    function borrar() {
        if (!activo) return;
        var v = reemplazar ? '' : activo.value.replace(/,/g, '');
        reemplazar = false;
        activo.value = v.slice(0, -1);
        avisar(activo);
        pintar();
    }

    // Arriba del teclado: el OTRO monto, en vivo (lo calcula la página)
    function pintar() {
        if (!activo) return;
        var otro = activo === mxn ? rec : mxn;
        var moneda = txt(otro === rec ? 'recibe-moneda' : 'mxn-moneda');
        var v = otro.value.trim();
        vistaEtq.textContent = activo === mxn ? 'Reciben en Cuba' : 'Envías';
        vistaVal.textContent = v ? v + ' ' + moneda : '—';
    }

    function medir() {
        document.documentElement.style.setProperty('--kb-h', teclado.offsetHeight + 'px');
    }

    function subirCampo(el) {
        setTimeout(function () {
            var campo = el.closest('.campo') || el;
            var y = campo.getBoundingClientRect().top + window.pageYOffset;
            var enc = document.querySelector('header.top');
            var alto = enc ? enc.getBoundingClientRect().height : 0;
            window.scrollTo({ top: Math.max(0, y - alto - 8), behavior: 'smooth' });
        }, 90);
    }

    function abrir(el) {
        activo = el;
        reemplazar = true; // la primera tecla reemplaza el monto, como una calculadora
        teclado.style.display = 'block';
        document.documentElement.classList.add('kb-abierto');
        medir();
        pintar();
        subirCampo(el);
        clearInterval(timer);
        timer = setInterval(pintar, 200);
    }

    function cerrar() {
        var a = activo;
        activo = null;
        clearInterval(timer);
        pararRepite();
        teclado.style.display = 'none';
        document.documentElement.classList.remove('kb-abierto');
        if (a && document.activeElement === a) a.blur();
    }

    crear();
    [mxn, rec].forEach(function (el) {
        el.addEventListener('focus', function () { abrir(el); });
    });
    // Tocar fuera de los montos y del teclado lo cierra
    document.addEventListener('pointerdown', function (e) {
        if (!activo) return;
        if (teclado.contains(e.target) || e.target === mxn || e.target === rec) return;
        cerrar();
    });
})();
