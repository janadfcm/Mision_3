import { ImagenObra } from './ImagenObra.jsx'

const URL_FICHA = 'https://www.artic.edu/artworks'

export function TarjetaObra({ obra, enSala, alAlternarSala }) {
  return (
    <article className="obra">
      <button
        type="button"
        className="favorita"
        aria-pressed={enSala}
        aria-label={enSala ? `Quitar «${obra.titulo}» de tu sala` : `Colgar «${obra.titulo}» en tu sala`}
        onClick={() => alAlternarSala(obra)}
      >
        {enSala ? '★' : '☆'}
      </button>
      <ImagenObra obra={obra} />
      <h3>
        <a href={`${URL_FICHA}/${obra.id}`} target="_blank" rel="noopener noreferrer">{obra.titulo}</a>
      </h3>
      <p className="artista">{obra.artista}</p>
      <p className="detalle">{obra.fecha} · {obra.origen}</p>
    </article>
  )
}
