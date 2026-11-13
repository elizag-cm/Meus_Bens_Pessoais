export type Ordem = 'recentes' | 'antigos' | 'maior' | 'menor' | 'nome'

export const OPCOES_ORDEM: { valor: Ordem; rotulo: string }[] = [
  { valor: 'recentes', rotulo: 'Mais recentes' },
  { valor: 'antigos', rotulo: 'Mais antigos' },
  { valor: 'maior', rotulo: 'Maior valor' },
  { valor: 'menor', rotulo: 'Menor valor' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
]
