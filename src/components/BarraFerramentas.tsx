import { useRef } from 'react'
import { IconeBusca, IconeOrdenar } from './Icones'
import { OPCOES_ORDEM, type Ordem } from '../types/Ordem'

interface BarraFerramentasProps {
  busca: string
  aoMudarBusca: (valor: string) => void
  categorias: string[]
  contagem: Record<string, number>
  totalBens: number
  categoriaSel: string
  aoMudarCategoria: (valor: string) => void
  comodos: string[]
  comodoSel: string
  aoMudarComodo: (valor: string) => void
  ordem: Ordem
  aoMudarOrdem: (valor: Ordem) => void
  temFiltro: boolean
  aoLimpar: () => void
}

export default function BarraFerramentas({
  busca,
  aoMudarBusca,
  categorias,
  contagem,
  totalBens,
  categoriaSel,
  aoMudarCategoria,
  comodos,
  comodoSel,
  aoMudarComodo,
  ordem,
  aoMudarOrdem,
  temFiltro,
  aoLimpar,
}: BarraFerramentasProps) {
  // useRef: devolve o foco para a busca depois de limpar os filtros
  const campoBusca = useRef<HTMLInputElement>(null)

  function limpar() {
    aoLimpar()
    campoBusca.current?.focus()
  }

  return (
    <section className="ferramentas">
      <div className="ferramentas-linha">
        <label className="busca">
          <IconeBusca tamanho={18} />
          <input
            ref={campoBusca}
            type="text"
            value={busca}
            onChange={(e) => aoMudarBusca(e.target.value)}
            placeholder="Buscar por nome, cômodo ou categoria"
            aria-label="Buscar bens"
          />
        </label>

        <label className="seletor">
          <span>Cômodo</span>
          <select value={comodoSel} onChange={(e) => aoMudarComodo(e.target.value)}>
            <option value="">Todos</option>
            {comodos.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="seletor">
          <IconeOrdenar tamanho={16} />
          <span>Ordenar</span>
          <select value={ordem} onChange={(e) => aoMudarOrdem(e.target.value as Ordem)}>
            {OPCOES_ORDEM.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chips" role="group" aria-label="Filtrar por categoria">
        <button
          type="button"
          className={categoriaSel === '' ? 'chip-filtro ativo' : 'chip-filtro'}
          aria-pressed={categoriaSel === ''}
          onClick={() => aoMudarCategoria('')}
        >
          Todas <span>{totalBens}</span>
        </button>

        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={categoriaSel === c ? 'chip-filtro ativo' : 'chip-filtro'}
            aria-pressed={categoriaSel === c}
            onClick={() => aoMudarCategoria(c)}
          >
            {c} <span>{contagem[c] ?? 0}</span>
          </button>
        ))}

        {temFiltro && (
          <button type="button" className="botao-link" onClick={limpar}>
            Limpar filtros
          </button>
        )}
      </div>
    </section>
  )
}
