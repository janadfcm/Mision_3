// Custom hook: dada una consulta, trae las obras de la API y dice en qué estado está la búsqueda.
// Es el único sitio de la app que habla con el exterior, por eso aquí vive el useEffect.
import { useEffect, useState } from 'react'
import { buscarObras } from '../lib/api.js'
import { prepararObras } from '../lib/datos.js'

export function useObras(consulta) {
  // Cada pulsación de «Reintentar» suma 1 y obliga a repetir la petición con la misma consulta
  const [intento, setIntento] = useState(0)
  // Última respuesta recibida, marcada con la búsqueda a la que pertenece
  const [respuesta, setRespuesta] = useState(null) // { clave, obras, error }

  const clave = `${consulta}#${intento}`

  useEffect(() => {
    if (consulta === '') return

    // Si la consulta cambia antes de que llegue la respuesta, el cleanup aborta la petición vieja:
    // así nunca pinta una respuesta antigua encima de la nueva (en la M2 lo hacía el contador ultimaBusqueda)
    const controlador = new AbortController()

    async function cargar() {
      try {
        const obrasApi = await buscarObras(consulta, controlador.signal)
        setRespuesta({ clave, obras: prepararObras(obrasApi), error: null })
      } catch (error) {
        if (error.name === 'AbortError') return // la cancelamos nosotros: no es un error
        setRespuesta({ clave, obras: [], error: error.message })
      }
    }

    cargar()
    return () => controlador.abort()
  }, [consulta, clave])

  // Todo lo demás se deriva: si la respuesta guardada no es de la búsqueda actual, aún está cargando
  const vigente = respuesta?.clave === clave ? respuesta : null

  let estado
  if (consulta === '') estado = 'inactivo'
  else if (vigente === null) estado = 'cargando'
  else if (vigente.error !== null) estado = 'error'
  else if (vigente.obras.length === 0) estado = 'vacio'
  else estado = 'ok'

  return {
    estado,
    obras: vigente?.obras ?? [],
    error: vigente?.error ?? null,
    reintentar: () => setIntento((n) => n + 1),
  }
}
