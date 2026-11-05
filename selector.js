/* REMEXCUB · celular: selector propio (hoja desde abajo) en lugar del menú nativo de Android.
   El <select> real sigue ahí y es el que manda: aquí solo se cambia su valor y se avisa con "change",
   así la calculadora, las tasas y el mensaje de WhatsApp funcionan igual. Solo en celular. */
(function () {
    'use strict';
    var movil = window.matchMedia('(max-width: 700px) and (pointer: coarse)');
    if (!movil.matches) return;
    var ids = ['producto', 'pago'];
    var selects = ids.map(function (i) { return document.getElementById(i); }).filter(Boolean);
    if (!selects.length) return;

    var estilo = document.createElement('style');
    estilo.textContent =
        '.rk-selwrap{position:relative}' +
        '.rk-selwrap select{pointer-events:none}' +
        '.rk-selbtn{position:absolute;inset:0;width:100%;height:100%;opacity:0;border:0;background:transparent;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
        'html.rk-hoja{overflow:hidden}' +
        '#rk-scrim{position:fixed;inset:0;z-index:99;background:rgba(10,20,50,.55);opacity:0;transition:opacity .22s;display:none}' +
        '#rk-hoja{position:fixed;left:0;right:0;bottom:0;z-index:100;display:none;max-height:78vh;flex-direction:column;background:#fff;' +
            'border-radius:20px 20px 0 0;box-shadow:0 -8px 30px rgba(10,20,50,.3);transform:translateY(100%);transition:transform .25s ease;' +
            'font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#10204d;padding-bottom:env(safe-area-inset-bottom,0px)}' +
        '#rk-hoja.rk-ver{transform:translateY(0)}#rk-scrim.rk-ver{opacity:1}' +
        '#rk-hoja .rk-cab{flex:none;padding:10px 20px 6px;touch-action:none}' +
        '#rk-hoja .rk-asa{width:42px;height:5px;border-radius:3px;background:#cdd5ea;margin:0 auto 12px}' +
        '#rk-hoja .rk-tit{font-weight:800;font-size:1.05rem;padding-bottom:8px}' +
        '#rk-hoja .rk-lista{overflow-y:auto;overscroll-behavior:contain;padding:0 12px 14px;-webkit-overflow-scrolling:touch}' +
        '#rk-hoja .rk-grupo{font-size:.78rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#6b78a0;padding:14px 8px 6px}' +
        '#rk-hoja .rk-op{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;text-align:left;border:0;background:transparent;' +
            'min-height:52px;padding:10px 12px;border-radius:12px;font:600 1rem system-ui,sans-serif;color:#10204d}' +
        '#rk-hoja .rk-op:active{background:#eef3ff}' +
        '#rk-hoja .rk-op.rk-sel{background:#eef3ff;color:#1c3faa;font-weight:800}' +
        '#rk-hoja .rk-ok{flex:none;width:22px;height:22px}';
    document.head.appendChild(estilo);

    var scrim = document.createElement('div'); scrim.id = 'rk-scrim';
    var hoja = document.createElement('div'); hoja.id = 'rk-hoja';
    hoja.setAttribute('role', 'dialog'); hoja.setAttribute('aria-modal', 'true');
    var cab = document.createElement('div'); cab.className = 'rk-cab';
    var asa = document.createElement('div'); asa.className = 'rk-asa';
    var tit = document.createElement('div'); tit.className = 'rk-tit';
    cab.appendChild(asa); cab.appendChild(tit);
    var lista = document.createElement('div'); lista.className = 'rk-lista';
    hoja.appendChild(cab); hoja.appendChild(lista);
    document.body.appendChild(scrim); document.body.appendChild(hoja);

    var actual = null, cerrando = null;

    var CHECK = '<svg class="rk-ok" viewBox="0 0 24 24" fill="none" stroke="#1c3faa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

    function fila(opt, sel) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rk-op' + (opt.value === sel.value ? ' rk-sel' : '');
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', opt.value === sel.value ? 'true' : 'false');
        var s = document.createElement('span'); s.textContent = opt.textContent;
        b.appendChild(s);
        if (opt.value === sel.value) b.insertAdjacentHTML('beforeend', CHECK);
        b.addEventListener('click', function () {
            if (sel.value !== opt.value) {
                sel.value = opt.value;
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
            cerrar();
        });
        return b;
    }

    function abrir(sel) {
        clearTimeout(cerrando);
        actual = sel;
        var lbl = document.querySelector('label[for="' + sel.id + '"]');
        tit.textContent = lbl ? lbl.textContent.trim() : '';
        lista.innerHTML = '';
        Array.prototype.forEach.call(sel.children, function (n) {
            if (n.tagName === 'OPTGROUP') {
                var g = document.createElement('div'); g.className = 'rk-grupo'; g.textContent = n.label;
                lista.appendChild(g);
                Array.prototype.forEach.call(n.children, function (o) { lista.appendChild(fila(o, sel)); });
            } else if (n.tagName === 'OPTION') {
                lista.appendChild(fila(n, sel));
            }
        });
        scrim.style.display = 'block'; hoja.style.display = 'flex';
        document.documentElement.classList.add('rk-hoja');
        hoja.style.transform = '';
        void hoja.offsetHeight;
        hoja.classList.add('rk-ver'); scrim.classList.add('rk-ver');
        var s = lista.querySelector('.rk-sel');
        if (s) lista.scrollTop = Math.max(0, s.offsetTop - lista.clientHeight / 2 + s.offsetHeight / 2);
    }

    function cerrar() {
        actual = null;
        hoja.style.transform = '';
        hoja.classList.remove('rk-ver'); scrim.classList.remove('rk-ver');
        document.documentElement.classList.remove('rk-hoja');
        clearTimeout(cerrando);
        cerrando = setTimeout(function () { scrim.style.display = 'none'; hoja.style.display = 'none'; }, 260);
    }

    scrim.addEventListener('click', cerrar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && actual) cerrar(); });

    // Deslizar hacia abajo desde la cabecera para cerrar
    var y0 = null, dy = 0;
    cab.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; hoja.style.transition = 'none'; });
    cab.addEventListener('pointermove', function (e) {
        if (y0 == null) return;
        dy = Math.max(0, e.clientY - y0);
        hoja.style.transform = 'translateY(' + dy + 'px)';
    });
    function soltar() {
        if (y0 == null) return;
        hoja.style.transition = '';
        var cerrarla = dy > 70;
        y0 = null;
        if (cerrarla) cerrar(); else hoja.style.transform = '';
    }
    cab.addEventListener('pointerup', soltar);
    cab.addEventListener('pointercancel', soltar);

    // El botón invisible encima de cada select recibe el toque; el select real no abre su menú nativo
    selects.forEach(function (sel) {
        var wrap = document.createElement('div');
        wrap.className = 'rk-selwrap';
        sel.parentNode.insertBefore(wrap, sel);
        wrap.appendChild(sel);
        sel.setAttribute('tabindex', '-1');
        var lbl = document.querySelector('label[for="' + sel.id + '"]');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rk-selbtn';
        b.setAttribute('aria-haspopup', 'dialog');
        b.setAttribute('aria-label', (lbl ? lbl.textContent.trim() + ': ' : '') + (sel.selectedOptions[0] ? sel.selectedOptions[0].textContent : ''));
        b.addEventListener('click', function () { abrir(sel); });
        sel.addEventListener('change', function () {
            b.setAttribute('aria-label', (lbl ? lbl.textContent.trim() + ': ' : '') + (sel.selectedOptions[0] ? sel.selectedOptions[0].textContent : ''));
        });
        wrap.appendChild(b);
        if (lbl) lbl.addEventListener('click', function (e) { e.preventDefault(); abrir(sel); });
    });
})();
