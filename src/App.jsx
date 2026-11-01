import { useState } from 'react'
import { useObras } from './hooks/useObras.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { filtrarObras, opcionesDeFiltro } from './lib/datos.js'
import { Buscador } from './components/Buscador.jsx'
import { Pestanas } from './components/Pestanas.jsx'
import { Filtros } from './components/Filtros.jsx'
import { EstadoBusqueda } from './components/EstadoBusqueda.jsx'
import { Estadisticas } from './components/Estadisticas.jsx'
import { Galeria } from './components/Galeria.jsx'

const SIN_FILTROS = { soloConImagen: false, siglo: null, origen: null }

function App() {
  // Estado mínimo: lo que busca el usuario, lo que elige y lo que guarda
  const [consulta, setConsulta] = useState('')
  const [filtros, setFiltros] = useState(SIN_FILTROS)
  const [vista, setVista] = useState('busqueda') // 'busqueda' | 'sala'
  const [sala, setSala] = useLocalStorage('museo-de-bolsillo:sala', [])
  const { estado, obras, desdeCache, error, reintentar } = useObras(consulta)

  // Valores derivados: se recalculan en cada render, nunca se guardan en otro useState
  const visibles = filtrarObras(obras, filtros)
  const idsSala = new Set(sala.map((obra) => obra.id))
  const estadoVista = estado === 'ok' && visibles.length === 0 ? 'sin-coincidencias' : estado

  // Una búsqueda nueva empieza sin filtros y en la pestaña de resultados (en el evento, no en un efecto)
  function buscar(texto) {
    setConsulta(texto)
    setFiltros(SIN_FILTROS)
    setVista('busqueda')
  }

  // Se guarda la obra entera: «Mi sala» se ve sin volver a pedir nada a la API
  function alternarSala(obra) {
    setSala((actual) =>
      actual.some(({ id }) => id === obra.id) ? actual.filter(({ id }) => id !== obra.id) : [...actual, obra],
    )
  }

  return (
    <>
      <header>
        <h1>Museo de bolsillo</h1>
        <p>Tu propia sala con obras del Art Institute of Chicago.</p>
      </header>

      <main>
        <Buscador alBuscar={buscar} />
        <Pestanas vista={vista} totalSala={sala.length} alCambiar={setVista} />

        {vista === 'busqueda' ? (
          <>
            {estado === 'ok' && (
              <Filtros opciones={opcionesDeFiltro(obras)} filtros={filtros} alCambiar={setFiltros} />
            )}
            <EstadoBusqueda estado={estadoVista} consulta={consulta} error={error} alReintentar={reintentar} />
            {visibles.length > 0 && (
              <>
                <Estadisticas titulo="Estas obras en cifras" obras={visibles} />
                <Galeria
                  obras={visibles}
                  resumen={`Mostrando ${visibles.length} de ${obras.length} obras${desdeCache ? ' · desde la caché' : ''}`}
                  idsSala={idsSala}
                  alAlternarSala={alternarSala}
                />
              </>
            )}
          </>
        ) : sala.length === 0 ? (
          <p className="estado vacio">Tu sala está vacía. Pulsa ☆ en una obra para colgarla aquí.</p>
        ) : (
          <>
            <Estadisticas titulo="Tu sala en cifras" obras={sala} />
            <Galeria
              obras={sala}
              resumen={`${sala.length} ${sala.length === 1 ? 'obra colgada' : 'obras colgadas'} · se guardan en este navegador`}
              idsSala={idsSala}
              alAlternarSala={alternarSala}
            />
          </>
        )}
      </main>
    </>
  )
}

export default App
