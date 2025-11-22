import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import words from '../data/words.json'
import { speak } from '../utils/speak'
import { vibrate } from '../utils/vibrate'
import { playBackgroundMusic, stopBackgroundMusic, playCorrectSound, playWrongSound } from '../utils/sounds'
import SEO from '../components/SEO'

type Word = typeof words[0]

const getLanguageCode = (lang: string): string => {
  const langMap: { [key: string]: string } = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
  }
  return langMap[lang] || 'pt-BR'
}

/**
 * Gera a fala fonética de uma sílaba
 * Ex: "BO" → "Bê com Ó, BÓ"
 */
const getPhoneticSpeech = (syllable: string): string => {
  const consonantNames: { [key: string]: string } = {
    'B': 'Bê', 'C': 'Cê', 'D': 'Dê', 'F': 'Éfe', 'G': 'Guê',
    'H': 'Agá', 'J': 'Jota', 'K': 'Cá', 'L': 'Éle', 'M': 'Ême',
    'N': 'Êne', 'P': 'Pê', 'Q': 'Quê', 'R': 'Érre', 'S': 'Ésse',
    'T': 'Tê', 'V': 'Vê', 'W': 'Dábliu', 'X': 'Xis', 'Z': 'Zê'
  }

  const vowels = ['A', 'E', 'I', 'O', 'U', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ã', 'Õ', 'Â', 'Ê', 'Ô']
  const upper = syllable.toUpperCase()

  const parts: string[] = []

  for (const char of upper) {
    if (consonantNames[char]) {
      parts.push(consonantNames[char])
    } else if (vowels.includes(char)) {
      parts.push(char)
    }
  }

  if (parts.length === 0) return syllable
  if (parts.length === 1) return `${parts[0]}, ${syllable}`

  return `${parts.join(' com ')}, ${syllable}`
}

/**
 * Jogo de Sílabas e Palavras
 * Criança toca nas sílabas na ordem correta para formar palavras
 */
export default function SyllableGame() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [syllables, setSyllables] = useState<string[]>([])
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([])
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'complete' | null>(null)
  const [showParticles, setShowParticles] = useState(false)

  const langCode = getLanguageCode(i18n.language)

  const getSyllables = (word: Word): string[] => {
    const lang = i18n.language
    if (lang === 'en') return word.syllables_en
    if (lang === 'es') return word.syllables_es
    return word.syllables_pt
  }

  const getWordName = (word: Word): string => {
    const lang = i18n.language
    if (lang === 'en') return word.en
    if (lang === 'es') return word.es
    return word.pt
  }

  /**
   * Gera uma nova rodada com nova palavra
   */
  const generateNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    const wordSyllables = getSyllables(randomWord)

    setCurrentWord(randomWord)
    setSyllables(wordSyllables)
    setShuffledSyllables([...wordSyllables].sort(() => Math.random() - 0.5))
    setSelectedSyllables([])
    setCurrentIndex(0)
    setFeedback(null)
    setShowParticles(false)

    // Falar a palavra completa
    setTimeout(() => {
      speak(getWordName(randomWord), langCode)
    }, 500)
  }

  // Inicializar jogo
  useEffect(() => {
    generateNewWord()
    playBackgroundMusic(0.3)

    return () => {
      stopBackgroundMusic()
    }
  }, [])

  // Atualizar quando idioma mudar
  useEffect(() => {
    if (currentWord) {
      const wordSyllables = getSyllables(currentWord)
      setSyllables(wordSyllables)
      setShuffledSyllables([...wordSyllables].sort(() => Math.random() - 0.5))
      setSelectedSyllables([])
      setCurrentIndex(0)
    }
  }, [i18n.language])

  /**
   * Tratar clique em sílaba
   */
  const handleSyllableClick = (syllable: string, index: number) => {
    if (feedback === 'complete') return

    const correctSyllable = syllables[currentIndex]

    if (syllable === correctSyllable) {
      // Acertou a sílaba - falar de forma fonética
      const phoneticText = getPhoneticSpeech(syllable)
      speak(phoneticText, langCode)
      vibrate([30])

      const newSelected = [...selectedSyllables, syllable]
      setSelectedSyllables(newSelected)

      // Remover da lista embaralhada
      const newShuffled = [...shuffledSyllables]
      newShuffled.splice(index, 1)
      setShuffledSyllables(newShuffled)

      if (newSelected.length === syllables.length) {
        // Completou a palavra!
        setFeedback('complete')
        setScore(prev => prev + 10)
        setStreak(prev => prev + 1)
        vibrate([30, 50, 30])
        setShowParticles(true)
        playCorrectSound(0.5)

        // Falar a palavra completa
        setTimeout(() => {
          speak(getWordName(currentWord!), langCode)
        }, 300)

        // Próxima palavra
        setTimeout(() => {
          generateNewWord()
        }, 2500)
      } else {
        setCurrentIndex(prev => prev + 1)
        setFeedback('correct')
        setTimeout(() => setFeedback(null), 300)
      }
    } else {
      // Errou
      setFeedback('incorrect')
      vibrate([100, 50, 100])
      setStreak(0)
      playWrongSound(0.3)

      setTimeout(() => {
        setFeedback(null)
      }, 500)
    }
  }

  /**
   * Ouvir a palavra novamente
   */
  const handleListenWord = () => {
    if (currentWord) {
      speak(getWordName(currentWord), langCode)
    }
  }

  return (
    <>
      <SEO
        title={t('menu.syllableGame')}
        description="Jogo de Sílabas - Aprenda a formar palavras tocando nas sílabas na ordem correta. Educativo para crianças."
        keywords="sílabas, palavras, alfabetização, educação infantil, aprender a ler"
        path="/syllable-game"
      />
      <div className="relative h-screen bg-gradient-to-b from-purple-500 to-pink-600 flex flex-col items-center justify-start p-3 sm:p-6 text-white overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 w-full bg-gradient-to-b from-black/10 to-transparent">
          <motion.button
            onClick={() => navigate('/')}
            className="px-3 sm:px-6 py-1 sm:py-2 bg-white/20 rounded-full hover:bg-white/30 transition-all text-xs sm:text-lg font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← {t('common.back')}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 sm:gap-8 text-center"
          >
            <div>
              <p className="text-xs sm:text-sm opacity-75">{t('quiz.score')}</p>
              <p className="text-2xl sm:text-4xl font-bold">{score}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm opacity-75">{t('quiz.streak')}</p>
              <motion.p
                className="text-2xl sm:text-4xl font-bold text-yellow-300"
                animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {streak}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-col items-center justify-center flex-1 w-full pt-20 sm:pt-24">
          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 text-center"
          >
            {t('menu.syllableGame')}
          </motion.h1>

          {/* Imagem da palavra */}
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 sm:mb-6 text-center"
            >
              <motion.button
                onClick={handleListenWord}
                className="mb-2 p-4 sm:p-6 bg-white/20 rounded-3xl hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/${currentWord.icon}.svg`}
                  alt={getWordName(currentWord)}
                  className="w-20 h-20 sm:w-32 sm:h-32"
                />
              </motion.button>
              <p className="text-sm sm:text-lg opacity-75">{t('syllable.tapToHear')}</p>
            </motion.div>
          )}

          {/* Sílabas selecionadas (palavra sendo formada) */}
          <div className="mb-4 sm:mb-6 min-h-[60px] sm:min-h-[80px] flex items-center justify-center">
            <motion.div
              className="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-white/20 rounded-2xl min-w-[200px] sm:min-w-[300px] justify-center"
              animate={feedback === 'complete' ? { scale: [1, 1.1, 1] } : {}}
            >
              {selectedSyllables.length === 0 ? (
                <span className="text-white/50 text-lg sm:text-2xl">{t('syllable.buildWord')}</span>
              ) : (
                selectedSyllables.map((syl, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl sm:text-4xl font-bold text-yellow-300"
                  >
                    {syl}
                  </motion.span>
                ))
              )}
            </motion.div>
          </div>

          {/* Sílabas embaralhadas para escolher */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {shuffledSyllables.map((syllable, index) => (
              <motion.button
                key={`${syllable}-${index}`}
                onClick={() => handleSyllableClick(syllable, index)}
                className={`px-6 sm:px-8 py-4 sm:py-6 rounded-2xl text-xl sm:text-3xl font-bold transition-all ${
                  feedback === 'incorrect'
                    ? 'bg-red-500/80'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {syllable}
              </motion.button>
            ))}
          </motion.div>

          {/* Feedback */}
          {feedback === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2 sm:py-4 px-4 sm:px-8 rounded-full text-sm sm:text-2xl font-bold bg-green-500/80 text-white"
            >
              🎉 {t('quiz.correct')} +10 pontos
            </motion.div>
          )}

          {/* Confete */}
          {showParticles && <Confetti count={15 + streak * 5} />}
        </div>
      </div>
    </>
  )
}

/**
 * Componente de confete
 * Quantidade aumenta progressivamente com a sequência
 */
function Confetti({ count = 15 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'][
              Math.floor(Math.random() * 4)
            ],
          }}
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: 0,
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
