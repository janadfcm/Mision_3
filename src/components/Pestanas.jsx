// Cambia entre los resultados de la búsqueda y «Mi sala» (las favoritas guardadas)
export function Pestanas({ vista, totalSala, alCambiar }) {
  return (
    <nav className="pestanas" aria-label="Vistas">
      <button type="button" aria-pressed={vista === 'busqueda'} onClick={() => alCambiar('busqueda')}>
        Resultados
      </button>
      <button type="button" aria-pressed={vista === 'sala'} onClick={() => alCambiar('sala')}>
        Mi sala ({totalSala})
      </button>
    </nav>
  )
}
