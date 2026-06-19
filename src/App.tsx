import { Route, Routes } from 'react-router-dom'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { SiteLayout } from './components/SiteLayout'
import { Landing } from './pages/Landing'
import { ExperiencePage } from './pages/ExperiencePage'
import { StartupPage } from './pages/StartupPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { AboutPage } from './pages/AboutPage'

function App() {
  return (
    <SmoothScrollProvider>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/startup" element={<StartupPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </SmoothScrollProvider>
  )
}

export default App
