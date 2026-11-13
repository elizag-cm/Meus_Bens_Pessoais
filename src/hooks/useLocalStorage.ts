import { useEffect, useState } from 'react'

// Custom hook: sempre prefixado com "use" e tipado com genérico.
export function useLocalStorage<T>(chave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo ? (JSON.parse(salvo) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  // useEffect com dependências controladas: só roda quando chave/valor mudam
  useEffect(() => {
    localStorage.setItem(chave, JSON.stringify(valor))
  }, [chave, valor])

  return [valor, setValor] as const
}
