// Solo habla con la API del Art Institute of Chicago: fetch, response.ok y errores. Nada de DOM.

const URL_BASE = 'https://api.artic.edu/api/v1/artworks/search'
const URL_IIIF = 'https://www.artic.edu/iiif/2'

// Pedimos solo los campos que vamos a usar: la respuesta es mucho más ligera
const CAMPOS = [
  'id',
  'title',
  'artist_title',
  'date_start',
  'date_display',
  'place_of_origin',
  'image_id',
]

const POR_PAGINA = 30 // la API rechaza límites altos (con 1000 da 403)
const TIEMPO_MAXIMO = 10000 // ms; si la API no responde, abortamos

// `signal` (opcional) viene del AbortController del hook useObras: si el usuario
// lanza otra búsqueda o el componente se desmonta, esta petición se cancela.
export async function buscarObras(texto, signal) {
  const parametros = new URLSearchParams({
    q: texto,
    limit: POR_PAGINA,
    fields: CAMPOS.join(','),
  })

  // Se aborta por lo que pase antes: el tiempo máximo o la cancelación desde React
  const senales = [AbortSignal.timeout(TIEMPO_MAXIMO)]
  if (signal) senales.push(signal)

  let respuesta
  try {
    respuesta = await fetch(`${URL_BASE}?${parametros}`, {
      signal: AbortSignal.any(senales),
    })
  } catch (error) {
    // Cancelada a propósito: no es un error para el usuario; quien llamó lo ignora
    if (error.name === 'AbortError') throw error
    // fetch solo lanza si no llega a haber respuesta: sin red, CORS o tiempo agotado
    if (error.name === 'TimeoutError') {
      throw new Error('El museo tarda demasiado en responder. Inténtalo de nuevo.')
    }
    if (!navigator.onLine) {
      throw new Error('Sin conexión a internet. Revisa tu conexión.')
    }
    // Con red, también llega aquí si el cortafuegos del museo rechaza la búsqueda
    // (p. ej., texto que parece HTML): responde 403 sin CORS y fetch lo ve como fallo de red
    throw new Error('No se ha podido contactar con el museo. Revisa tu conexión o prueba con otra búsqueda.')
  }

  // Un 404 o un 500 NO hacen saltar el catch: hay que comprobarlo a mano
  if (!respuesta.ok) {
    throw new Error(`El museo ha respondido con un error (${respuesta.status}).`)
  }

  let json
  try {
    json = await respuesta.json()
  } catch {
    // Un 200 que no es JSON (p. ej., una página HTML de error)
    throw new Error('El museo ha devuelto datos con un formato inesperado.')
  }

  if (!Array.isArray(json?.data)) {
    throw new Error('El museo ha devuelto datos con un formato inesperado.')
  }

  return json.data
}

export function urlImagen(imageId, ancho = 843) {
  if (!imageId) return null
  return `${URL_IIIF}/${imageId}/full/${ancho},/0/default.jpg`
}
