import { memo } from 'react'
import type { Bem } from '../types/Bem'
import { IconeCalendario, IconeLapis, IconeLixeira, IconePino } from './Icones'

interface BemCardProps {
  bem: Bem
  aoEditar: (bem: Bem) => void
  aoRemover: (id: number) => void
}

// React.memo + funções estáveis (useCallback no pai) = menos re-renderizações
const BemCard = memo(function BemCard({ bem, aoEditar, aoRemover }: BemCardProps) {
  // O id é gerado com Date.now(), então ele também guarda a data de cadastro
  const data = new Date(bem.id).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <li className="card">
      <div className="card-topo">
        <span className="chip">{bem.categoria}</span>
        <div className="card-acoes">
          <button
            className="botao-icone"
            onClick={() => aoEditar(bem)}
            aria-label={`Editar ${bem.nome}`}
            title="Editar"
          >
            <IconeLapis tamanho={16} />
          </button>
          <button
            className="botao-icone perigo"
            onClick={() => aoRemover(bem.id)}
            aria-label={`Remover ${bem.nome}`}
            title="Remover"
          >
            <IconeLixeira tamanho={16} />
          </button>
        </div>
      </div>

      <h3>{bem.nome}</h3>
      <p className="card-local">
        <IconePino tamanho={14} />
        {bem.comodo}
      </p>

      <div className="card-rodape">
        <strong className="card-valor">
          {bem.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </strong>
        <span className="card-data">
          <IconeCalendario tamanho={14} />
          {data}
        </span>
      </div>
    </li>
  )
})

export default BemCard
