import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import colors from '../data/colors.json'
import { speak } from '../utils/speak'
import { vibrate } from '../utils/vibrate'

type Color = typeof colors[0]

/**
 * Página de Quiz de Cores
 * Criança deve escolher a cor correta quando perguntado
 * Sistema infinito com pontuação e feedback visual
 */
export default function ColorsQuiz() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [targetColor, setTargetColor] = useState<Color | null>(null)
  const [options, setOptions] = useState<Color[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  const langCode = i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US'
  const colorName = (color: Color) => (color as any)[i18n.language] ?? color.pt

  /**
   * Embaralha apenas as opções mantendo a cor-alvo
   * Usado quando a criança erra para dificultar
   */
  const shuffleOptions = () => {
    setOptions((prevOptions) => [...prevOptions].sort(() => Math.random() - 0.5))
  }

  /**
   * Gera uma nova rodada do quiz
   */
  const generateNewQuiz = () => {
    const randomTarget = colors[Math.floor(Math.random() * colors.length)]
    setTargetColor(randomTarget)
    setFeedback(null)
    setIsAnswering(false)
    setShowParticles(false)

    // Gerar 4 opções aleatórias (garantir que uma é a correta)
    const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4)
    if (!shuffled.includes(randomTarget)) {
      shuffled[0] = randomTarget
    }
    setOptions(shuffled.sort(() => Math.random() - 0.5))

    // Falar a pergunta
    setTimeout(() => {
      speak(colorName(randomTarget), langCode)
    }, 300)
  }

  // Inicializar quiz
  useEffect(() => {
    generateNewQuiz()
  }, [])

  /**
   * Tratar resposta do usuário
   */
  const handleAnswerClick = (selectedColor: Color) => {
    if (isAnswering || !targetColor) return

    setIsAnswering(true)

    const isCorrect = selectedColor.id === targetColor.id

    if (isCorrect) {
      // ✅ ACERTO
      setFeedback('correct')
      setScore((prev) => prev + 10)
      setStreak((prev) => prev + 1)
      vibrate([30, 50, 30])
      setShowParticles(true)

      // Falar "certo" em vez de repetir a cor
      const correctWord = i18n.language === 'pt' ? 'certo' : i18n.language === 'es' ? 'correcto' : 'correct'
      speak(correctWord, langCode)

      // Próxima pergunta após feedback (aumentado para 2.5s para melhor visualização)
      setTimeout(() => {
        generateNewQuiz()
      }, 2500)
    } else {
      // ❌ ERRO - Mantém a mesma cor até acertar
      setFeedback('incorrect')
      vibrate([100, 50, 100, 50, 100])
      setStreak(0)

      // Falar "errado" e pronunciar a cor correta para aprendizado
      const wrongWord = i18n.language === 'pt' ? 'errado' : i18n.language === 'es' ? 'incorrecto' : 'wrong'
      speak(wrongWord, langCode)

      // Voltar para tentar novamente (NÃO gera novo quiz)
      setTimeout(() => {
        setFeedback(null)
        setIsAnswering(false)
        // Embaralhar as opções para dificultar - criança não decorar a posição
        shuffleOptions()
        // Pronuncia a cor correta quando reseta para tentar novamente
        setTimeout(() => {
          speak(colorName(targetColor), langCode)
        }, 300)
      }, 2800)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-indigo-600 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Voltar ao menu */}
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-20 left-6 px-6 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-all text-lg font-bold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← {t('common.back') || 'Voltar'}
      </motion.button>

      {/* Placar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 right-6 flex gap-8 text-center"
      >
        {/* Score */}
        <div>
          <p className="text-sm opacity-75">{t('quiz.score') || 'Pontos'}</p>
          <p className="text-4xl font-bold">{score}</p>
        </div>

        {/* Streak */}
        <div>
          <p className="text-sm opacity-75">{t('quiz.streak') || 'Sequência'}</p>
          <motion.p
            className="text-4xl font-bold text-yellow-300"
            animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {streak}
          </motion.p>
        </div>
      </motion.div>

      {/* Título */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-5xl md:text-6xl font-bold mb-12 text-center"
      >
        {t('menu.colorsQuiz') || 'Jogo de Cores'}
      </motion.h1>

      {/* Pergunta */}
      <motion.div
        key={targetColor?.id}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-12 text-center"
      >
        <p className="text-2xl mb-4 opacity-90">{t('quiz.selectColor') || 'Clique na cor:'}</p>

        {targetColor && (
          <motion.button
            onClick={() => speak(colorName(targetColor), langCode)}
            className="mx-auto w-32 h-32 rounded-full border-4 border-white shadow-2xl cursor-pointer hover:brightness-110 transition-all"
            style={{ backgroundColor: targetColor.color }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(255,255,255,0.7)',
                '0 0 0 20px rgba(255,255,255,0)',
              ],
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Texto da cor */}
        {targetColor && (
          <motion.p
            className="text-3xl font-bold mt-6"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {colorName(targetColor).toUpperCase()}
          </motion.p>
        )}
      </motion.div>

      {/* Opções de cores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8"
      >
        {options.map((option, index) => {
          const isCorrectAnswer = feedback === 'correct' && option.id === targetColor?.id
          const isWrongAnswer = feedback === 'incorrect' && option.id !== targetColor?.id

          return (
            <motion.button
              key={option.id}
              onClick={() => handleAnswerClick(option)}
              disabled={isAnswering}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isWrongAnswer ? 0.5 : 1,
                scale: isCorrectAnswer ? [1, 1.1, 1] : 1,
                x: isWrongAnswer ? [0, -5, 5, 0] : 0,
                rotate: isCorrectAnswer ? [0, -5, 5, 0] : 0,
              }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`relative w-32 h-32 rounded-2xl border-4 transition-all duration-200 ${
                isAnswering ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
              } ${isCorrectAnswer ? 'border-yellow-300 scale-110' : 'border-white/30'}`}
              style={{
                backgroundColor: option.color,
                boxShadow:
                  isCorrectAnswer
                    ? '0 0 40px rgba(253, 224, 71, 0.8)'
                    : feedback === 'incorrect' && option.id === targetColor?.id
                      ? '0 0 40px rgba(34, 197, 94, 0.6)'
                      : isWrongAnswer
                        ? 'none'
                        : '0 0 20px rgba(255, 255, 255, 0.2)',
              }}
              whileHover={!isAnswering ? { scale: 1.08 } : {}}
              whileTap={!isAnswering ? { scale: 0.95 } : {}}
            >
            {/* Indicador visual */}
            {feedback === 'correct' && option.id === targetColor?.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ✅
              </motion.div>
            )}

            {feedback === 'incorrect' && option.id === targetColor?.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ✓
              </motion.div>
            )}

            {feedback === 'incorrect' && option.id !== targetColor?.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center text-5xl opacity-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ✗
              </motion.div>
            )}
            </motion.button>
            )
        })}
      </motion.div>

      {/* Feedback de acerto/erro */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center py-4 px-8 rounded-full text-2xl font-bold ${
            feedback === 'correct'
              ? 'bg-green-500/80 text-white'
              : 'bg-red-500/80 text-white'
          }`}
        >
          {feedback === 'correct' ? (
            <>
              <span>🎉 {t('quiz.correct') || 'Parabéns!'} +10 pontos</span>
            </>
          ) : (
            <>
              <span>😅 {t('quiz.incorrect') || 'Errou!'}</span>
            </>
          )}
        </motion.div>
      )}

      {/* Partículas de confete (acerto) */}
      {showParticles && feedback === 'correct' && <Confetti />}
    </div>
  )
}

/**
 * Componente de confete/partículas para acerto
 */
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
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
