import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBens } from '../context/BensContext'
import BarraFerramentas from '../components/BarraFerramentas'
import FormularioBem from '../components/FormularioBem'
import ListaDeBens from '../components/ListaDeBens'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import PainelResumo from '../components/PainelResumo'
import Resumo from '../components/Resumo'
import Toast from '../components/Toast'
import type { AvisoMensagem } from '../types/Aviso'
import type { Bem, NovoBem } from '../types/Bem'
import type { Ordem } from '../types/Ordem'

export default function Home() {
  const { bens, categorias, adicionar, editar, remover, adicionarCategoria } = useBens()

  const [busca, setBusca] = useState('')
  const [categoriaSel, setCategoriaSel] = useState('')
  const [comodoSel, setComodoSel] = useState('')
  const [ordem, setOrdem] = useState<Ordem>('recentes')

  const [modalAberto, setModalAberto] = useState(false)
  const [bemEmEdicao, setBemEmEdicao] = useState<Bem | null>(null)
  const [aviso, setAviso] = useState<AvisoMensagem | null>(null)

  // O aviso some sozinho depois de 4 segundos
  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(null), 4000)
    return () => clearTimeout(timer)
  }, [aviso])

  const abrirNovo = useCallback(() => {
    setBemEmEdicao(null)
    setModalAberto(true)
  }, [])

  const iniciarEdicao = useCallback((bem: Bem) => {
    setBemEmEdicao(bem)
    setModalAberto(true)
  }, [])

  const fecharModal = useCallback(() => {
    setModalAberto(false)
    setBemEmEdicao(null)
  }, [])

  function salvar(dados: NovoBem) {
    if (bemEmEdicao) {
      editar({ ...dados, id: bemEmEdicao.id })
      setAviso({ tipo: 'sucesso', texto: `"${dados.nome}" foi atualizado.` })
    } else {
      adicionar(dados)
      setAviso({ tipo: 'sucesso', texto: `"${dados.nome}" foi adicionado.` })
    }
    fecharModal()
  }

  const removerBem = useCallback(
    (id: number) => {
      remover(id)
      setAviso({ tipo: 'sucesso', texto: 'Bem removido.' })
    },
    [remover],
  )

  const limparFiltros = useCallback(() => {
    setBusca('')
    setCategoriaSel('')
    setComodoSel('')
  }, [])

  // Números gerais do inventário (painel e chips)
  const estatisticas = useMemo(() => {
    const contagem: Record<string, number> = {}
    let valorTotal = 0
    for (const bem of bens) {
      contagem[bem.categoria] = (contagem[bem.categoria] ?? 0) + 1
      valorTotal += bem.valor
    }
    return { contagem, valorTotal, categoriasEmUso: Object.keys(contagem).length }
  }, [bens])

  // Lista de cômodos já usados, para o filtro
  const comodos = useMemo(
    () => [...new Set(bens.map((b) => b.comodo))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [bens],
  )
  // Se o cômodo filtrado deixou de existir (bem removido/editado), ignora o filtro
  const comodoAtivo = comodos.includes(comodoSel) ? comodoSel : ''

  // useMemo: filtra e ordena só quando algo relevante muda
  const bensVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const filtrados = bens.filter(
      (b) =>
        (!categoriaSel || b.categoria === categoriaSel) &&
        (!comodoAtivo || b.comodo === comodoAtivo) &&
        (!termo ||
          b.nome.toLowerCase().includes(termo) ||
          b.comodo.toLowerCase().includes(termo) ||
          b.categoria.toLowerCase().includes(termo)),
    )

    return filtrados.sort((a, b) => {
      switch (ordem) {
        case 'antigos':
          return a.id - b.id
        case 'maior':
          return b.valor - a.valor
        case 'menor':
          return a.valor - b.valor
        case 'nome':
          return a.nome.localeCompare(b.nome, 'pt-BR')
        default:
          return b.id - a.id
      }
    })
  }, [bens, busca, categoriaSel, comodoAtivo, ordem])

  const totalVisivel = useMemo(
    () => bensVisiveis.reduce((soma, b) => soma + b.valor, 0),
    [bensVisiveis],
  )

  const temFiltro = busca.trim() !== '' || categoriaSel !== '' || comodoAtivo !== ''

  return (
    <>
      <Navbar aoNovoBem={abrirNovo} />

      <main className="container">
        <PainelResumo
          totalBens={bens.length}
          valorTotal={estatisticas.valorTotal}
          categoriasEmUso={estatisticas.categoriasEmUso}
        />

        <BarraFerramentas
          busca={busca}
          aoMudarBusca={setBusca}
          categorias={categorias}
          contagem={estatisticas.contagem}
          totalBens={bens.length}
          categoriaSel={categoriaSel}
          aoMudarCategoria={setCategoriaSel}
          comodos={comodos}
          comodoSel={comodoAtivo}
          aoMudarComodo={setComodoSel}
          ordem={ordem}
          aoMudarOrdem={setOrdem}
          temFiltro={temFiltro}
          aoLimpar={limparFiltros}
        />

        <section className="resultados">
          <Resumo quantidade={bensVisiveis.length} total={totalVisivel} />
          <ListaDeBens
            bens={bensVisiveis}
            temFiltro={temFiltro}
            aoEditar={iniciarEdicao}
            aoRemover={removerBem}
            aoNovo={abrirNovo}
            aoLimparFiltros={limparFiltros}
          />
        </section>
      </main>

      {modalAberto && (
        <Modal aoFechar={fecharModal}>
          <FormularioBem
            bemEmEdicao={bemEmEdicao}
            categorias={categorias}
            aoSalvar={salvar}
            aoCancelar={fecharModal}
            aoNovaCategoria={adicionarCategoria}
          />
        </Modal>
      )}

      <Toast aviso={aviso} aoFechar={() => setAviso(null)} />
    </>
  )
}
