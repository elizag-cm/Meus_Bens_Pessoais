import { BensProvider } from './context/BensContext'
import Home from './pages/Home'

export default function App() {
  return (
    <BensProvider>
      <Home />
    </BensProvider>
  )
}
