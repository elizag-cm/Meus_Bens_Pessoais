import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  CATEGORIAS_PADRAO,
  type Bem,
  type NovoBem,
  type ResultadoCategoria,
} from '../types/Bem'

// 1. Ações possíveis (union type)
type Acao =
  | { type: 'adicionar'; bem: Bem }
  | { type: 'editar'; bem: Bem }
  | { type: 'remover'; id: number }

// 2. Reducer: centraliza TODA a lógica de atualização da lista de bens
function bensReducer(estado: Bem[], acao: Acao): Bem[] {
  switch (acao.type) {
    case 'adicionar':
      return [...estado, acao.bem]
    case 'editar':
      return estado.map((bem) => (bem.id === acao.bem.id ? acao.bem : bem))
    case 'remover':
      return estado.filter((bem) => bem.id !== acao.id)
    default:
      throw new Error('Ação desconhecida')
  }
}

interface BensContextValor {
  bens: Bem[]
  categorias: string[]
  adicionar: (novo: NovoBem) => void
  editar: (bem: Bem) => void
  remover: (id: number) => void
  adicionarCategoria: (nome: string) => ResultadoCategoria
}

const BensContext = createContext<BensContextValor | null>(null)

function carregarBens(): Bem[] {
  try {
    const salvo = localStorage.getItem('bens')
    return salvo ? (JSON.parse(salvo) as Bem[]) : []
  } catch {
    return []
  }
}

export function BensProvider({ children }: { children: ReactNode }) {
  const [bens, dispatch] = useReducer(bensReducer, [], carregarBens)
  const [categorias, setCategorias] = useLocalStorage<string[]>(
    'categorias',
    CATEGORIAS_PADRAO,
  )

  useEffect(() => {
    localStorage.setItem('bens', JSON.stringify(bens))
  }, [bens])

  // useCallback: referências estáveis para o React.memo dos filhos
  const adicionar = useCallback((novo: NovoBem) => {
    dispatch({ type: 'adicionar', bem: { ...novo, id: Date.now() } })
  }, [])

  const editar = useCallback((bem: Bem) => {
    dispatch({ type: 'editar', bem })
  }, [])

  const remover = useCallback((id: number) => {
    dispatch({ type: 'remover', id })
  }, [])

  const adicionarCategoria = useCallback(
    (nomeBruto: string): ResultadoCategoria => {
      const nome = nomeBruto.trim()
      if (!nome) return { ok: false, mensagem: 'Digite o nome da categoria.' }
      if (categorias.some((c) => c.toLowerCase() === nome.toLowerCase())) {
        return { ok: false, mensagem: 'Essa categoria já existe.' }
      }
      setCategorias((atual) => [...atual, nome])
      return { ok: true, mensagem: `Categoria "${nome}" criada.`, nome }
    },
    [categorias, setCategorias],
  )

  return (
    <BensContext.Provider
      value={{ bens, categorias, adicionar, editar, remover, adicionarCategoria }}
    >
      {children}
    </BensContext.Provider>
  )
}

export function useBens() {
  const contexto = useContext(BensContext)
  if (!contexto) throw new Error('useBens deve ser usado dentro de BensProvider')
  return contexto
}
