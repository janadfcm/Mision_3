// Custom hook: dada una consulta, trae las obras de la API y dice en qué estado está la búsqueda.
// Es el único sitio de la app que habla con el exterior, por eso aquí vive el useEffect.
import { useEffect, useState } from 'react'
import { buscarObras } from '../lib/api.js'
import { prepararObras } from '../lib/datos.js'

export function useObras(consulta) {
  const [obras, setObras] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  // Cada pulsación de «Reintentar» suma 1: cambia una dependencia y el efecto se repite
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (consulta === '') return

    // Si la consulta cambia antes de que llegue la respuesta, el cleanup aborta la petición vieja:
    // así nunca pinta una respuesta antigua encima de la nueva (en la M2 lo hacía el contador ultimaBusqueda)
    const controlador = new AbortController()
    setObras([])
    setError(null)
    setCargando(true)

    buscarObras(consulta, controlador.signal)
      .then((obrasApi) => setObras(prepararObras(obrasApi)))
      .catch((error) => {
        if (error.name === 'AbortError') return // la cancelamos nosotros: no es un error
        setError(error.message)
      })
      .finally(() => {
        // Si se abortó, ya hay otra petición en marcha que es la que manda
        if (!controlador.signal.aborted) setCargando(false)
      })

    return () => controlador.abort()
  }, [consulta, intento])

  // El estado de la búsqueda se deriva de los tres valores anteriores; no es otro useState
  let estado
  if (consulta === '') estado = 'inactivo'
  else if (cargando) estado = 'cargando'
  else if (error !== null) estado = 'error'
  else if (obras.length === 0) estado = 'vacio'
  else estado = 'ok'

  return { estado, obras, error, reintentar: () => setIntento((n) => n + 1) }
}
