import { TarjetaObra } from './TarjetaObra.jsx'

// Rejilla de obras; sirve igual para los resultados y para «Mi sala»
export function Galeria({ obras, resumen, idsSala, alAlternarSala }) {
  return (
    <section>
      <p className="resumen">{resumen}</p>
      <div className="rejilla">
        {/* key = id de la obra en el museo: estable y único (el índice cambiaría al filtrar) */}
        {obras.map((obra) => (
          <TarjetaObra key={obra.id} obra={obra} enSala={idsSala.has(obra.id)} alAlternarSala={alAlternarSala} />
        ))}
      </div>
    </section>
  )
}
