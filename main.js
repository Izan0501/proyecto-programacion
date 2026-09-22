/* ==========================================================================
   LOS AMIGOS BAR - main.js
   ==========================================================================
   Animaciones de entrada, parallax del hero y contadores.

   Por que existe este archivo: antes las animaciones se hacian 100% en CSS
   con "animation-timeline: view()" (scroll-driven animations). Eso sirve en
   Chrome 115+, pero Safari y Firefox no lo soportan, asi que en esos
   navegadores no se veia absolutamente ningun movimiento.

   Aca se rehacen con IntersectionObserver + transiciones CSS, que funcionan
   en todos los navegadores modernos. Todo es mejora progresiva:
   - sin JS, el HTML se ve completo y estatico (nada queda invisible);
   - con "reducir movimiento" activado, se muestra todo sin animar.
   ========================================================================== */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealables = document.querySelectorAll('[data-reveal]');
    var i;

    /* ----------------------------------------------------------------------
       1. Aparicion al entrar en pantalla
       ---------------------------------------------------------------------- */
    function revealAll() {
        for (var k = 0; k < revealables.length; k++) {
            revealables[k].classList.add('is-revealed');
        }
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
        // Sin animacion: se muestra todo de una.
        revealAll();
    } else {
        // Escalonado: los elementos de una misma fila entran uno detras del
        // otro, no todos de golpe. Se topea a 5 para que el ultimo de una
        // grilla larga no tarde una eternidad.
        var groups = new Map();
        for (i = 0; i < revealables.length; i++) {
            var el = revealables[i];
            var key = el.closest('.row') || el.parentNode;
            var idx = groups.get(key) || 0;
            el.style.setProperty('--reveal-delay', Math.min(idx, 5) * 90 + 'ms');
            groups.set(key, idx + 1);
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                startCounters(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            // threshold 0 a proposito: con un umbral mayor, un elemento mas
            // alto que la ventana nunca llega a ese porcentaje visible y se
            // quedaria invisible para siempre. El rootMargin negativo es el
            // que hace que la animacion arranque un poco antes del borde.
            threshold: 0,
            rootMargin: '0px 0px -12% 0px'
        });

        for (i = 0; i < revealables.length; i++) {
            observer.observe(revealables[i]);
        }
    }

    /* ----------------------------------------------------------------------
       2. Parallax del hero
       Se mueve con la posicion de scroll y se desvanece, en un rAF para no
       tocar el layout en cada evento de scroll.
       ---------------------------------------------------------------------- */
    var parallaxEls = document.querySelectorAll('[data-parallax]');

    if (!reduceMotion && parallaxEls.length) {
        var ticking = false;

        var updateParallax = function () {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            var vh = window.innerHeight;

            for (var k = 0; k < parallaxEls.length; k++) {
                var node = parallaxEls[k];
                var amount = parseFloat(node.getAttribute('data-parallax')) || 0.15;

                // El contenido queda "atras" del scroll y se apaga de a poco.
                node.style.transform = 'translate3d(0,' + (y * amount).toFixed(1) + 'px,0)';
                node.style.opacity = Math.max(0, 1 - y / (vh * 0.75)).toFixed(3);
            }

            ticking = false;
        };

        var onScroll = function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateParallax);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        updateParallax();
    }

    /* ----------------------------------------------------------------------
       3. Navbar compacta al bajar
       ---------------------------------------------------------------------- */
    var navbar = document.querySelector('.navbar');

    if (navbar) {
        var navTicking = false;

        var updateNav = function () {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            navbar.classList.toggle('is-scrolled', y > 40);
            navTicking = false;
        };

        window.addEventListener('scroll', function () {
            if (navTicking) return;
            navTicking = true;
            window.requestAnimationFrame(updateNav);
        }, { passive: true });

        updateNav();
    }

    /* ----------------------------------------------------------------------
       4. Contadores de la seccion "Nosotros"
       ---------------------------------------------------------------------- */
    function startCounters(scope) {
        var nums = scope.querySelectorAll('[data-count]');

        for (var k = 0; k < nums.length; k++) {
            (function (node) {
                if (node.dataset.counted) return;
                node.dataset.counted = '1';

                var target = parseInt(node.getAttribute('data-count'), 10) || 0;
                var prefix = node.getAttribute('data-count-prefix') || '';

                if (reduceMotion) {
                    node.textContent = prefix + target;
                    return;
                }

                var duration = 1100;
                var started = null;

                var step = function (now) {
                    if (started === null) started = now;
                    var p = Math.min(1, (now - started) / duration);
                    // easeOutCubic: arranca rapido y frena al final
                    var eased = 1 - Math.pow(1 - p, 3);
                    node.textContent = prefix + Math.round(target * eased);
                    if (p < 1) window.requestAnimationFrame(step);
                };

                window.requestAnimationFrame(step);
            })(nums[k]);
        }
    }

    // Si no hubo observer (reduce motion / sin soporte), igual se completan.
    if (reduceMotion || !('IntersectionObserver' in window)) {
        startCounters(document);
    }

    /* ----------------------------------------------------------------------
       5. Red de seguridad
       Ningun contenido puede quedar invisible por culpa de una animacion.
       Si al terminar de cargar quedo algo sin revelar que ya esta en pantalla,
       se muestra igual.
       ---------------------------------------------------------------------- */
    window.addEventListener('load', function () {
        window.setTimeout(function () {
            for (var k = 0; k < revealables.length; k++) {
                var node = revealables[k];
                if (node.classList.contains('is-revealed')) continue;
                if (node.getBoundingClientRect().top < window.innerHeight) {
                    node.classList.add('is-revealed');
                    startCounters(node);
                }
            }
        }, 300);
    });
})();
