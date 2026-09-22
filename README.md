# Los Amigos Bar

Landing page de "Los Amigos Bar" (San Miguel de Tucumán): inicio, nosotros, carta,
cócteles, galería, eventos, reservas y contacto.

Sitio estático hecho con HTML, Bootstrap 5.3 y JavaScript. Sin build, sin
instalación.

## Cómo verlo

Doble clic en `index.html`. No hace falta servidor ni instalar nada.

Bootstrap, las tipografías y los iconos se cargan por CDN, así que hace
falta conexión a internet para verlo con estilos.

## Estructura

```
.
├── index.html
├── styles.css     # estilos propios
├── main.js        # animaciones
├── favicon.svg
└── img/
```

## Estilos

El maquetado usa clases de Bootstrap (`container`, `row`, `card`, `navbar`,
`carousel`, etc.). `styles.css` sólo agrega lo que Bootstrap no trae: colores
de marca, tipografía, el fondo del hero y las animaciones.

## Animaciones

`main.js` anima los elementos al entrar en pantalla y agrega un efecto
parallax en el hero, usando `IntersectionObserver`. Sin JavaScript, la página
se ve igual pero sin animar.
