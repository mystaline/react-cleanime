import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Top from './pages/Top'
import Current from './pages/Current'
import Upcoming from './pages/Upcoming'
import AnimeDetail from './pages/AnimeDetail'
import { StaticProvider } from './features/StaticContext'
import { NSFWProvider } from './features/NSFWContext'
import { useEffect } from 'react'
import Search from './pages/Search'

function App() {
  useEffect(() => {
    const title = document.querySelector('title')
    if (title) title.textContent = 'Cleanime - Anime Explorer'
  }, [])

  return (
    <NSFWProvider>
      <StaticProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:name" element={<Search />} />
          <Route path="/top" element={<Top />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/current" element={<Current />} />
          <Route path="/upcoming" element={<Upcoming />} />
        </Routes>
      </Router>
    </StaticProvider>
    </NSFWProvider>
  )
}

export default App
