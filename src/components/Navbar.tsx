import { IconeCaixa, IconeMais } from './Icones'

interface NavbarProps {
  aoNovoBem: () => void
}

export default function Navbar({ aoNovoBem }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-conteudo">
        <div className="logo">
          <span className="logo-icone">
            <IconeCaixa tamanho={20} />
          </span>
          <span>Meus Bens</span>
        </div>
        <button className="botao-principal" onClick={aoNovoBem}>
          <IconeMais tamanho={16} />
          Adicionar bem
        </button>
      </div>
    </nav>
  )
}
