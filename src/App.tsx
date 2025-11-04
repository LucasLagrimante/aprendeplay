import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Letters from './pages/Letters'
import Numbers from './pages/Numbers'
import Colors from './pages/Colors'
import ColorsQuiz from './pages/ColorsQuiz'
import Navigation from './components/Navigation'

export default function App() {
  return (
    <div className="min-h-screen text-white relative flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/numbers" element={<Numbers />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/colors-quiz" element={<ColorsQuiz />} />
        </Routes>
      </main>
    </div>
  )
}
