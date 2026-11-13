export const CATEGORIAS_PADRAO: string[] = [
  'Eletrônicos',
  'Móveis',
  'Roupas',
  'Livros',
  'Outros',
]

export interface Bem {
  id: number
  nome: string
  categoria: string
  comodo: string
  valor: number
}

// Dados para criar um bem (o id é gerado pelo sistema)
export type NovoBem = Omit<Bem, 'id'>

// Resposta ao tentar criar uma categoria (para dar feedback ao usuário)
export interface ResultadoCategoria {
  ok: boolean
  mensagem: string
  nome?: string
}
