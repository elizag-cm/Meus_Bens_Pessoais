import type { Bem } from '../types/Bem'
import BemCard from './BemCard'
import { IconeCaixa } from './Icones'

interface ListaDeBensProps {
  bens: Bem[]
  temFiltro: boolean
  aoEditar: (bem: Bem) => void
  aoRemover: (id: number) => void
  aoNovo: () => void
  aoLimparFiltros: () => void
}

export default function ListaDeBens({
  bens,
  temFiltro,
  aoEditar,
  aoRemover,
  aoNovo,
  aoLimparFiltros,
}: ListaDeBensProps) {
  // Renderização condicional: cada situação vazia indica o próximo passo
  if (bens.length === 0) {
    return (
      <div className="vazio">
        <span className="vazio-icone">
          <IconeCaixa tamanho={24} />
        </span>
        {temFiltro ? (
          <>
            <strong>Nenhum bem encontrado</strong>
            <p>Nenhum bem corresponde à busca ou aos filtros escolhidos.</p>
            <button className="botao-contorno" onClick={aoLimparFiltros}>
              Limpar filtros
            </button>
          </>
        ) : (
          <>
            <strong>Você ainda não cadastrou nenhum bem</strong>
            <p>Comece adicionando o primeiro item da sua lista.</p>
            <button className="botao-principal" onClick={aoNovo}>
              Adicionar primeiro bem
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <ul className="grade">
      {/* Renderização de listas com .map() e key única */}
      {bens.map((bem) => (
        <BemCard key={bem.id} bem={bem} aoEditar={aoEditar} aoRemover={aoRemover} />
      ))}
    </ul>
  )
}
