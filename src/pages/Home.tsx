import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import SEO from '../components/SEO'

interface MenuButtonProps {
  to: string
  label: string
  icon: string
  color: string
  gradient: string
}

interface MenuCategory {
  title: string
  icon: string
  buttons: MenuButtonProps[]
}

const MenuButton: React.FC<MenuButtonProps> = ({ to, label, icon, color, gradient }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Link
        to={to}
        className={`relative flex items-center justify-center w-full h-24 sm:h-24 md:h-40 px-2 sm:px-4 md:px-8 rounded-2xl sm:rounded-3xl font-bold text-xs sm:text-sm md:text-2xl text-white text-center transition-all duration-300 overflow-hidden group`}
        style={{
          background: gradient,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Efeito de brilho sutil (antes do hover) */}
        <motion.div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}40, transparent 70%)`,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Efeito de hover com overlay brilhante */}
        <motion.div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}60, transparent 70%)`,
          }}
          transition={{
            duration: 0.3,
          }}
        />

        {/* Conteúdo */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-0 sm:gap-1 md:gap-3"
          initial={{ y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-3xl sm:text-2xl md:text-5xl">{icon}</span>
          <span className="hidden sm:block">{label}</span>
          <span className="block sm:hidden text-[11px]">{label.split(' ')[0]}</span>
        </motion.div>

        {/* Sombra de hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 0 rgba(255, 255, 255, 0)',
          }}
          whileHover={{
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 0 0 3px rgba(255, 255, 255, 0.2)',
          }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  )
}

const CategorySection: React.FC<{ category: MenuCategory; index: number }> = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="w-full flex-shrink-0"
    >
      {/* Category Header */}
      <div className="mb-1 sm:mb-2 md:mb-4 flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
        <motion.div
          className="flex-shrink-0 flex items-center justify-center"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xl sm:text-2xl md:text-4xl">{category.icon}</span>
        </motion.div>
        <h2 className="text-sm sm:text-lg md:text-4xl font-bold text-white">{category.title}</h2>
      </div>

      {/* Category Buttons */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-2 md:gap-4">
        {category.buttons.map((button, buttonIndex) => (
          <motion.div
            key={button.to}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.1 + buttonIndex * 0.08,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <MenuButton {...button} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { t } = useTranslation()

  const categories: MenuCategory[] = [
    {
      title: t('menu.learn') || 'Aprenda',
      icon: '📚',
      buttons: [
        {
          to: '/colors',
          label: t('menu.colors'),
          icon: '🎨',
          color: '#10B981',
          gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
        },
        {
          to: '/letters',
          label: t('menu.letters'),
          icon: '🔤',
          color: '#EC4899',
          gradient: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
        },
        {
          to: '/numbers',
          label: t('menu.numbers'),
          icon: '🔢',
          color: '#3B82F6',
          gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        },
      ]
    },
    {
      title: t('menu.play') || 'Jogue',
      icon: '🎮',
      buttons: [
        {
          to: '/colors-quiz',
          label: t('menu.colorsQuiz'),
          icon: '🎯',
          color: '#F59E0B',
          gradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
        },
        {
          to: '/syllable-game',
          label: t('menu.syllableGame'),
          icon: '🔠',
          color: '#8B5CF6',
          gradient: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        },
      ]
    }
  ]

  return (
    <>
      <SEO
        title="AprendePlay - Aprenda Brincando"
        description="Plataforma educativa interativa para aprender cores, letras e números em 8 idiomas. Perfeito para crianças!"
        keywords="educação infantil, cores, letras, números, aprender brincando, kids learning, educational games"
        path="/"
      />
      <div className="h-screen md:min-h-screen flex flex-col items-center justify-start text-white p-2 sm:p-4 md:p-6 overflow-hidden md:overflow-auto">
        {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-2 sm:mt-2 md:mt-4 mb-2 sm:mb-2 md:mb-3 flex-shrink-0"
      >
        <img src={logo} alt="AprendePlay" className="h-28 sm:h-28 md:h-40 w-auto" />
      </motion.div>

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-2 sm:mb-4 md:mb-6 flex-shrink-0"
      >
        <h1 className="text-3xl sm:text-3xl md:text-6xl font-bold mb-1 sm:mb-1 md:mb-2">{t('home.title')}</h1>
        <p className="text-xs sm:text-base md:text-xl opacity-90">{t('home.subtitle')}</p>
      </motion.div>

      {/* Categories */}
      <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-8 flex-shrink-0 px-2">
        {categories.map((category, index) => (
          <CategorySection key={category.title} category={category} index={index} />
        ))}
      </div>
      </div>
    </>
  )
}
