# Museo de bolsillo (React)

## Descripción

Buscador de obras del [Art Institute of Chicago](https://api.artic.edu/docs/) hecho con **React 19 + Vite**. Es la app de la misión anterior (Async Odyssey), reconstruida en componentes: la UI se deriva del estado en lugar de pintarse a mano en el DOM.

Qué se puede hacer:
- Buscar obras por tema (en inglés: `cat`, `sea`, `night`…), con estados de carga, error con «Reintentar» y «sin resultados».
- Filtrar los resultados por imagen, siglo y origen, sin volver a llamar a la API.
- Ver las cifras de lo que se muestra: total, artista más repetido, obra más antigua y obras por siglo.
- **Mi sala**: marcar obras con ☆ para colgarlas en una sala propia que se guarda en el navegador y sigue ahí al recargar.

Estructura:

```
src/
├── App.jsx                 estado de la app: consulta, filtros, vista y sala; lo demás se deriva
├── components/
│   ├── Buscador.jsx        formulario de búsqueda (el texto es estado local)
│   ├── Pestanas.jsx        Resultados / Mi sala
│   ├── Filtros.jsx         componente controlado: imagen, siglo y origen
│   ├── EstadoBusqueda.jsx  mensajes de cargando, error, vacío y sin coincidencias
│   ├── Estadisticas.jsx    cifras y barras por siglo
│   ├── Galeria.jsx         rejilla de obras (key = id de la obra)
│   ├── TarjetaObra.jsx     cartela de una obra y botón de Mi sala
│   └── ImagenObra.jsx      imagen con hueco si no hay o falla
├── hooks/
│   ├── useObras.js         petición a la API: único useEffect de datos, cancelación con AbortController
│   └── useLocalStorage.js  useState que persiste en localStorage (Mi sala)
└── lib/
    ├── api.js              fetch, response.ok y mensajes de error
    └── datos.js            funciones puras: normalizar, filtrar y estadísticas
```

## Cómo ejecutarlo

Requisitos: Node 22 LTS (o superior) y conexión a internet.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente http://localhost:5173).

Otros comandos:
- `npm run build`: versión de producción en `dist/`
- `npm run preview`: sirve esa versión para probarla
- `npm run lint`: revisa el código con oxlint

## Uso de IA

**Herramienta:** Claude Code (en la terminal, sobre el repositorio).

**Qué delegué:** La migración de la M2 a React (componentes,
`useObras`, `useLocalStorage`), el CSS adaptado de la M2 y el diagnóstico del
error de CORS. Yo decidí qué app hacer (reconstruir el Museo de bolsillo con
«Mi sala»), qué simplificar y qué descartar, y probé cada paso en Chrome.

**Prompts reales:**
- «habria alguna forma de simplificarlo lo maximo posible pero que sigue
  cumpliendo con requisitos de la rubrica»: la IA propuso quitar la caché, la
  miniatura difuminada, la sincronización entre pestañas y cambiar `useObras`
  al patrón clásico. Acepté las cuatro, pero tuve que deshacer la última.
- Le pegué el error de la consola: «Access to fetch at 'https://api.artic.edu/…'
  from origin 'http://localhost:5173' has been blocked by CORS policy…».

**Cómo lo verifiqué:**
- En Chrome: búsqueda, filtros (incluida una combinación sin resultados),
  «Mi sala» tras recargar con F5 y dos búsquedas seguidas (solo queda la última).
- `npm run lint` sin avisos. El linter cazó un error de la IA: el patrón clásico
  de `useObras` hacía `setState` síncrono dentro del efecto
  (`react(set-state-in-effect)`), así que lo revertí (ver Autopsia).
- El «error de CORS» no era de CORS: repitiendo la petición con y sin cabecera
  `Referer` vimos que el cortafuegos del museo responde 403 (sin cabecera CORS)
  cuando el `Referer` es `localhost`. Arreglo: `<meta name="referrer"
  content="no-referrer">` en `index.html`.

## Autopsia

1. **`cargando` calculado con una «clave», no guardado en un `useState`.**
   Cada respuesta se guarda con la búsqueda que la pidió (`consulta#intento`).
   Si no coincide con la actual, la app está cargando.
   *Alternativa descartada:* el patrón clásico con `obras`, `error` y `cargando`
   en tres `useState`, que se lee mejor, pero obliga a hacer `setState` dentro
   del efecto (lo marca el linter) y duplica estado que se puede derivar.

2. **«Mi sala» guarda la obra entera en `localStorage`, no solo su `id`.**
   La sala se ve al instante y sin conexión, sin volver a pedir nada a la API.
   *Alternativa descartada:* guardar solo los ids y pedir las obras a la API al
   abrir «Mi sala». Ocupa menos y los datos estarían siempre al día, pero
   necesita otra petición y otro estado de carga.
