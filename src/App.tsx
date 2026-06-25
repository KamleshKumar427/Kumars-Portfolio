import { Route, Routes } from 'react-router-dom'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { ScrollToTop } from './components/ScrollToTop'
import { Portfolio } from './Portfolio'
import { StartupsPage } from './StartupsPage'

function App() {
  return (
    <SmoothScrollProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/startups" element={<StartupsPage />} />
      </Routes>
    </SmoothScrollProvider>
  )
}

export default App
