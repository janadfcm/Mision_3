import { calcularEstadisticas } from '../lib/datos.js'

// Las cifras se calculan en cada render a partir de las obras: no son estado
export function Estadisticas({ titulo, obras }) {
  const estadisticas = calcularEstadisticas(obras)
  if (estadisticas === null) return null

  const { total, conImagen, porSiglo, artistaTop, masAntigua } = estadisticas

  return (
    <section className="estadisticas">
      <h2>{titulo}</h2>
      <ul className="datos">
        <li><strong>Obras: </strong>{total} ({conImagen} con imagen)</li>
        <li>
          <strong>Artista más repetido: </strong>
          {artistaTop ? `${artistaTop[0]} (${artistaTop[1]})` : 'Ninguno identificado'}
        </li>
        <li>
          <strong>Obra más antigua: </strong>
          {masAntigua ? `${masAntigua.titulo} (${masAntigua.fecha})` : 'Sin fechas conocidas'}
        </li>
      </ul>
      <h3>Obras por siglo</h3>
      <BarrasPorSiglo porSiglo={porSiglo} />
    </section>
  )
}

function BarrasPorSiglo({ porSiglo }) {
  const maximo = Math.max(...porSiglo.map(({ cantidad }) => cantidad))

  return (
    <ul className="barras">
      {/* El nombre del siglo no se repite dentro de la lista: sirve como key estable */}
      {porSiglo.map(({ siglo, cantidad }) => (
        <li key={siglo}>
          <span className="etiqueta">{siglo}</span>
          <span className="barra" style={{ width: `${(cantidad / maximo) * 100}%` }} />
          <span>{cantidad}</span>
        </li>
      ))}
    </ul>
  )
}
