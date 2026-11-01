import { nombreSiglo } from '../lib/datos.js'

// Componente controlado: no guarda nada, enseña `filtros` y avisa a App de cada cambio
export function Filtros({ opciones, filtros, alCambiar }) {
  function cambiar(campo, valor) {
    alCambiar({ ...filtros, [campo]: valor })
  }

  return (
    <section className="filtros" aria-label="Filtros">
      <label>
        <input
          type="checkbox"
          checked={filtros.soloConImagen}
          onChange={(evento) => cambiar('soloConImagen', evento.target.checked)}
        />
        Solo con imagen
      </label>
      <label>
        Siglo
        {/* El value de un <select> es siempre un string: "" significa "Todos" */}
        <select
          value={filtros.siglo ?? ''}
          onChange={(evento) => cambiar('siglo', evento.target.value === '' ? null : Number(evento.target.value))}
        >
          <option value="">Todos</option>
          {opciones.siglos.map((siglo) => (
            <option key={siglo} value={siglo}>{nombreSiglo(siglo)}</option>
          ))}
        </select>
      </label>
      <label>
        Origen
        <select
          value={filtros.origen ?? ''}
          onChange={(evento) => cambiar('origen', evento.target.value === '' ? null : evento.target.value)}
        >
          <option value="">Todos</option>
          {opciones.origenes.map((origen) => (
            <option key={origen} value={origen}>{origen}</option>
          ))}
        </select>
      </label>
    </section>
  )
}
