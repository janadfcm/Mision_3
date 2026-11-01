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

## Autopsia
