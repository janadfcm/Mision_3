import { useState } from 'react'

// El texto del input es estado local: a App solo le importa la consulta cuando se envía
export function Buscador({ alBuscar }) {
  const [texto, setTexto] = useState('')

  function enviar(evento) {
    evento.preventDefault() // sin esto, el formulario recarga la página
    alBuscar(texto.trim())
  }

  return (
    <form className="buscador" role="search" onSubmit={enviar}>
      <label htmlFor="busqueda">¿Qué tema quieres ver?</label>
      <input
        id="busqueda"
        type="search"
        placeholder="cat, sea, night…"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      <button type="submit">Buscar</button>
      <p className="ayuda">Busca en inglés: los datos del museo están en inglés.</p>
    </form>
  )
}
