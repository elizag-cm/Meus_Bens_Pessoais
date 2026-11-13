import { IconeCaixa, IconeCifrao, IconeEtiqueta } from './Icones'

interface PainelResumoProps {
  totalBens: number
  valorTotal: number
  categoriasEmUso: number
}

export default function PainelResumo({
  totalBens,
  valorTotal,
  categoriasEmUso,
}: PainelResumoProps) {
  return (
    <section className="painel">
      <div className="painel-texto">
        <span className="painel-selo">Seu inventário</span>
        <h1>Tudo o que você tem, em ordem.</h1>
        <p>Cadastre seus bens, acompanhe o valor e encontre cada item em segundos.</p>
      </div>

      <dl className="numeros">
        <div className="numero numero-grande">
          <dt>
            <IconeCifrao tamanho={16} /> Valor total dos bens
          </dt>
          <dd>{valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</dd>
        </div>
        <div className="numero">
          <dt>
            <IconeCaixa tamanho={16} /> Bens cadastrados
          </dt>
          <dd>{totalBens}</dd>
        </div>
        <div className="numero">
          <dt>
            <IconeEtiqueta tamanho={16} /> Categorias em uso
          </dt>
          <dd>{categoriasEmUso}</dd>
        </div>
      </dl>
    </section>
  )
}
