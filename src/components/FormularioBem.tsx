import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Bem, NovoBem, ResultadoCategoria } from '../types/Bem'

interface FormularioBemProps {
  bemEmEdicao: Bem | null
  categorias: string[]
  aoSalvar: (dados: NovoBem) => void // filho -> pai
  aoCancelar: () => void
  aoNovaCategoria: (nome: string) => ResultadoCategoria
}

export default function FormularioBem({
  bemEmEdicao,
  categorias,
  aoSalvar,
  aoCancelar,
  aoNovaCategoria,
}: FormularioBemProps) {
  const editando = bemEmEdicao !== null

  // O formulário é montado só quando o modal abre, então já nasce preenchido
  const [nome, setNome] = useState(bemEmEdicao?.nome ?? '')
  const [comodo, setComodo] = useState(bemEmEdicao?.comodo ?? '')
  const [categoria, setCategoria] = useState(bemEmEdicao?.categoria ?? '')
  const [valor, setValor] = useState(bemEmEdicao ? String(bemEmEdicao.valor) : '')
  const [tentouEnviar, setTentouEnviar] = useState(false)

  const [criandoCategoria, setCriandoCategoria] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')
  const [erroCategoria, setErroCategoria] = useState('')
  const [sucessoCategoria, setSucessoCategoria] = useState('')

  // Validação: todos os campos são obrigatórios
  const erros = {
    nome: nome.trim() ? '' : 'Informe o nome do bem.',
    comodo: comodo.trim() ? '' : 'Informe onde o bem está guardado.',
    categoria: categoria ? '' : 'Escolha uma categoria.',
    valor:
      valor === ''
        ? 'Informe o valor do bem.'
        : Number(valor) < 0
          ? 'O valor não pode ser negativo.'
          : '',
  }
  const temErro = Object.values(erros).some(Boolean)
  const mostrar = (campo: keyof typeof erros) => (tentouEnviar ? erros[campo] : '')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTentouEnviar(true)
    if (temErro) return

    aoSalvar({
      nome: nome.trim(),
      comodo: comodo.trim(),
      categoria,
      valor: Number(valor),
    })
  }

  function criarCategoria() {
    const resultado = aoNovaCategoria(novaCategoria)
    if (!resultado.ok || !resultado.nome) {
      setErroCategoria(resultado.mensagem)
      setSucessoCategoria('')
      return
    }
    setCategoria(resultado.nome)
    setSucessoCategoria(resultado.mensagem)
    setErroCategoria('')
    setNovaCategoria('')
    setCriandoCategoria(false)
  }

  // Enter no campo de categoria cria a categoria (sem enviar o formulário)
  function handleTeclaCategoria(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      criarCategoria()
    }
  }

  function cancelarNovaCategoria() {
    setCriandoCategoria(false)
    setNovaCategoria('')
    setErroCategoria('')
  }

  return (
    <form className="formulario" onSubmit={handleSubmit} noValidate>
      <div className="formulario-cabecalho">
        <h2 id="titulo-modal">{editando ? 'Editar bem' : 'Adicionar bem'}</h2>
        <p>
          {editando
            ? 'Atualize as informações do bem.'
            : 'Preencha todos os campos para cadastrar um novo bem.'}
        </p>
      </div>

      {tentouEnviar && temErro && (
        <div className="banner-erro" role="alert">
          Preencha todos os campos para {editando ? 'salvar as alterações' : 'adicionar o bem'}.
        </div>
      )}

      <label className="campo linha-inteira">
        Nome do bem
        <input
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Notebook"
          aria-invalid={!!mostrar('nome')}
          className={mostrar('nome') ? 'invalido' : ''}
        />
        {mostrar('nome') && <span className="erro">{mostrar('nome')}</span>}
      </label>

      <label className="campo">
        Onde está guardado
        <input
          value={comodo}
          onChange={(e) => setComodo(e.target.value)}
          placeholder="Ex.: Escritório"
          aria-invalid={!!mostrar('comodo')}
          className={mostrar('comodo') ? 'invalido' : ''}
        />
        {mostrar('comodo') && <span className="erro">{mostrar('comodo')}</span>}
      </label>

      <label className="campo">
        Valor (R$)
        <input
          type="number"
          min="0"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          aria-invalid={!!mostrar('valor')}
          className={mostrar('valor') ? 'invalido' : ''}
        />
        {mostrar('valor') && <span className="erro">{mostrar('valor')}</span>}
      </label>

      <div className="campo linha-inteira">
        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value)
            setSucessoCategoria('')
          }}
          aria-invalid={!!mostrar('categoria')}
          className={mostrar('categoria') ? 'invalido' : ''}
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {mostrar('categoria') && <span className="erro">{mostrar('categoria')}</span>}
        {sucessoCategoria && <span className="sucesso">{sucessoCategoria}</span>}

        {!criandoCategoria ? (
          <button
            type="button"
            className="botao-link"
            onClick={() => setCriandoCategoria(true)}
          >
            + Nova categoria
          </button>
        ) : (
          <div className="nova-categoria">
            <input
              autoFocus
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyDown={handleTeclaCategoria}
              placeholder="Nome da categoria"
              aria-label="Nome da nova categoria"
            />
            <button type="button" className="botao-pequeno" onClick={criarCategoria}>
              Criar
            </button>
            <button type="button" className="botao-link" onClick={cancelarNovaCategoria}>
              Cancelar
            </button>
            {erroCategoria && <span className="erro linha-inteira">{erroCategoria}</span>}
          </div>
        )}
      </div>

      <div className="acoes-formulario">
        <button type="button" className="botao-contorno" onClick={aoCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao-principal">
          {editando ? 'Salvar alterações' : 'Adicionar bem'}
        </button>
      </div>
    </form>
  )
}
