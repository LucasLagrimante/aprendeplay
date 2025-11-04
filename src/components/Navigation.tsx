import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Language {
  code: string
  flag: string
  name: string
}

const languages: Language[] = [
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
]

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const links = [
    { path: '/', label: t('menu.home') || 'Início' },
    { path: '/colors', label: t('menu.colors') || 'Cores' },
    { path: '/colors-quiz', label: t('menu.colorsQuiz') || 'Jogo de Cores' },
    { path: '/letters', label: t('menu.letters') || 'Letras' },
    { path: '/numbers', label: t('menu.numbers') || 'Números' },
  ]

  const isActive = (path: string) => location.pathname === path

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsLanguageOpen(false)
  }

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
    }

    if (isOpen || isLanguageOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isLanguageOpen])

  // Fechar menu ao mudar de página
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <nav className="relative bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo/Home link */}
        <Link
          to="/"
          className="font-bold text-xl text-white hover:text-purple-400 transition-colors flex-shrink-0"
        >
          <img src="/assets/logo-horizontal.png" alt="AprendePlay" className="h-7 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center flex-1 justify-center">
          {links.slice(1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold transition-all relative ${
                isActive(link.path)
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Selector */}
          <div ref={languageRef} className="relative">
            <motion.button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-700 text-white font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{currentLanguage.flag}</span>
              <motion.span
                animate={{ rotate: isLanguageOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm hidden sm:inline"
              >
                ▼
              </motion.span>
            </motion.button>

            {/* Language Dropdown */}
            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-max"
                >
                  {languages.map((language, index) => (
                    <motion.button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`w-full px-4 py-2.5 flex items-center gap-2 text-left text-sm font-semibold transition-all ${
                        currentLanguage.code === language.code
                          ? 'bg-slate-700 text-white'
                          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      whileHover={{ paddingLeft: '1.25rem' }}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                      {currentLanguage.code === language.code && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 relative z-50"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 11 } : { rotate: 0, y: 0 }}
              className="w-5 h-1 bg-white rounded-full origin-center"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-1 bg-white rounded-full"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -11 } : { rotate: 0, y: 0 }}
              className="w-5 h-1 bg-white rounded-full origin-center"
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-slate-800 border-t border-slate-700"
          >
            <div className="px-4 py-2 flex flex-col gap-2">
              {links.slice(1).map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation
