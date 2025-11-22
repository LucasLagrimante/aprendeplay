import React, { useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navigation from './components/Navigation'

// Lazy load páginas para melhor performance (code splitting)
const Home = lazy(() => import('./pages/Home'))
const Letters = lazy(() => import('./pages/Letters'))
const Numbers = lazy(() => import('./pages/Numbers'))
const Colors = lazy(() => import('./pages/Colors'))
const ColorsQuiz = lazy(() => import('./pages/ColorsQuiz'))
const SyllableGame = lazy(() => import('./pages/SyllableGame'))

// Fallback component para carregamento
const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
    <div className="text-center">
      <div className="mb-4 text-5xl">📚</div>
      <p className="text-white text-xl font-bold">Carregando...</p>
    </div>
  </div>
)

export default function App() {
  const { i18n } = useTranslation()

  // Atualizar atributo lang dinamicamente
  useEffect(() => {
    const htmlElement = document.documentElement
    const langCode = i18n.language.split('-')[0]
    const fullLangCode = langCode === 'pt' ? 'pt-BR' : langCode === 'es' ? 'es-ES' : langCode

    htmlElement.setAttribute('lang', fullLangCode)
  }, [i18n.language])

  return (
    <div className="h-screen text-white relative flex flex-col">
      <Navigation />
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/letters" element={<Letters />} />
            <Route path="/numbers" element={<Numbers />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="/colors-quiz" element={<ColorsQuiz />} />
            <Route path="/syllable-game" element={<SyllableGame />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
