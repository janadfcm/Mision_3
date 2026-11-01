// Custom hook: como useState, pero el valor sobrevive a recargar la página.
import { useEffect, useState } from 'react'

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave)
    if (guardado === null) return valorInicial
    const valor = JSON.parse(guardado)
    // Si alguien lo ha tocado a mano y ya no tiene la forma esperada, empezamos de cero
    return Array.isArray(valorInicial) && !Array.isArray(valor) ? valorInicial : valor
  } catch {
    // JSON roto o localStorage bloqueado (modo privado): sin persistencia, sin romper la app
    return valorInicial
  }
}

export function useLocalStorage(clave, valorInicial) {
  // Función en useState: localStorage se lee solo en el primer render, no en cada uno
  const [valor, setValor] = useState(() => leer(clave, valorInicial))

  // Cada vez que cambia el valor, se copia a localStorage (sincronizar con algo externo)
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      // Sin espacio o bloqueado: seguimos solo en memoria
    }
  }, [clave, valor])

  return [valor, setValor]
}
