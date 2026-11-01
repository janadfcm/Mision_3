import { useState } from 'react'
import { urlImagen } from '../lib/api.js'

// Imagen de la obra; si no tiene o el servidor de imágenes falla, enseña un hueco con el aviso
export function ImagenObra({ obra }) {
  const [fallo, setFallo] = useState(false)

  if (obra.imageId === null || fallo) return <div className="sin-imagen">Sin imagen</div>

  return (
    <img
      src={urlImagen(obra.imageId)}
      alt={`${obra.titulo}, de ${obra.artista}`}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  )
}
