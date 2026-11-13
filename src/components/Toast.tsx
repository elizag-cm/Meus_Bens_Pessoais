import type { AvisoMensagem } from '../types/Aviso'

interface ToastProps {
  aviso: AvisoMensagem | null
  aoFechar: () => void
}

// Feedback visual após uma ação (adicionar, editar, remover)
export default function Toast({ aviso, aoFechar }: ToastProps) {
  if (!aviso) return null

  return (
    <div
      className={`toast toast-${aviso.tipo}`}
      role={aviso.tipo === 'erro' ? 'alert' : 'status'}
    >
      <span>{aviso.texto}</span>
      <button type="button" onClick={aoFechar}>
        Fechar
      </button>
    </div>
  )
}
