// Mensajes de cada estado de la búsqueda; con estado 'ok' no pinta nada
export function EstadoBusqueda({ estado, consulta, error, alReintentar }) {
  return (
    <section className="estado" aria-live="polite">
      {estado === 'inactivo' && <p className="vacio">Escribe un tema para empezar (por ejemplo, «cat»).</p>}
      {estado === 'cargando' && <p className="cargando">Buscando «{consulta}» en el museo…</p>}
      {estado === 'error' && (
        <>
          <p className="error">{error}</p>
          <button type="button" onClick={alReintentar}>Reintentar</button>
        </>
      )}
      {estado === 'vacio' && (
        <p className="vacio">No hay obras sobre «{consulta}». Prueba con otra palabra en inglés.</p>
      )}
      {estado === 'sin-coincidencias' && <p className="vacio">Ninguna obra cumple estos filtros.</p>}
    </section>
  )
}
