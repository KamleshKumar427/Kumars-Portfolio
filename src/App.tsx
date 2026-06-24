import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { Portfolio } from './Portfolio'

function App() {
  return (
    <SmoothScrollProvider>
      <Portfolio />
    </SmoothScrollProvider>
  )
}

export default App
