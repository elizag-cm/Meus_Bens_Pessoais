import { useEffect, type ReactNode } from 'react'
import { IconeX } from './Icones'

interface ModalProps {
  aoFechar: () => void
  children: ReactNode
}

export default function Modal({ aoFechar, children }: ModalProps) {
  // useEffect com cleanup: fecha com Esc e trava a rolagem da página
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aoFechar])

  return (
    <div
      className="modal-fundo"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) aoFechar()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
        <button className="modal-fechar" onClick={aoFechar} aria-label="Fechar janela">
          <IconeX tamanho={18} />
        </button>
        {children}
      </div>
    </div>
  )
}
