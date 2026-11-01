import { useState } from 'react'
import { urlImagen } from '../lib/api.js'

// Imagen de la obra; si no tiene o el servidor IIIF falla, enseña el hueco
export function ImagenObra({ obra }) {
  const [fallo, setFallo] = useState(false)

  if (obra.imageId === null || fallo) return <SinImagen miniatura={obra.miniatura} />

  return (
    <img
      src={urlImagen(obra.imageId)}
      alt={`${obra.titulo}, de ${obra.artista}`}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  )
}

// Si hay miniatura (lqip de 8×5 px), se ve ampliada y difuminada detrás del aviso
function SinImagen({ miniatura }) {
  if (miniatura === null) return <div className="sin-imagen">Sin imagen</div>

  return (
    <div className="sin-imagen con-miniatura">
      <img className="miniatura" src={miniatura} alt="" />
      <span>Imagen no disponible</span>
    </div>
  )
}
