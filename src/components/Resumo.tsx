interface ResumoProps {
  quantidade: number
  total: number
}

export default function Resumo({ quantidade, total }: ResumoProps) {
  return (
    <div className="resumo">
      <p>
        <strong>{quantidade}</strong> {quantidade === 1 ? 'bem encontrado' : 'bens encontrados'}
      </p>
      <p>
        Soma dos itens exibidos:{' '}
        <strong>
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </strong>
      </p>
    </div>
  )
}
