/**
 * Utilitário para gerenciar sons do jogo
 * Usa Web Audio API para efeitos sonoros
 */

// Cache de áudio para evitar múltiplas instâncias
let backgroundMusic: HTMLAudioElement | null = null
let correctSound: HTMLAudioElement | null = null
let wrongSound: HTMLAudioElement | null = null

// URLs de sons (usando sons livres de royalty)
const SOUNDS = {
  // Música ambiente calma para crianças
  background: 'https://assets.mixkit.co/music/preview/mixkit-kids-fun-12.mp3',
  // Som de acerto
  correct: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  // Som de erro
  wrong: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
}

/**
 * Inicializa e toca música de fundo
 */
export function playBackgroundMusic(volume: number = 0.3): void {
  try {
    if (!backgroundMusic) {
      backgroundMusic = new Audio(SOUNDS.background)
      backgroundMusic.loop = true
      backgroundMusic.volume = volume
    }

    if (backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {
        // Ignora erro se autoplay bloqueado
      })
    }
  } catch (error) {
    console.warn('Erro ao tocar música de fundo:', error)
  }
}

/**
 * Para música de fundo
 */
export function stopBackgroundMusic(): void {
  if (backgroundMusic) {
    backgroundMusic.pause()
    backgroundMusic.currentTime = 0
  }
}

/**
 * Ajusta volume da música de fundo
 */
export function setBackgroundMusicVolume(volume: number): void {
  if (backgroundMusic) {
    backgroundMusic.volume = Math.max(0, Math.min(1, volume))
  }
}

/**
 * Toca som de resposta correta
 */
export function playCorrectSound(volume: number = 0.5): void {
  try {
    if (!correctSound) {
      correctSound = new Audio(SOUNDS.correct)
    }
    correctSound.volume = volume
    correctSound.currentTime = 0
    correctSound.play().catch(() => {
      // Ignora erro se autoplay bloqueado
    })
  } catch (error) {
    console.warn('Erro ao tocar som de acerto:', error)
  }
}

/**
 * Toca som de resposta errada
 */
export function playWrongSound(volume: number = 0.5): void {
  try {
    if (!wrongSound) {
      wrongSound = new Audio(SOUNDS.wrong)
    }
    wrongSound.volume = volume
    wrongSound.currentTime = 0
    wrongSound.play().catch(() => {
      // Ignora erro se autoplay bloqueado
    })
  } catch (error) {
    console.warn('Erro ao tocar som de erro:', error)
  }
}

/**
 * Limpa todos os recursos de áudio
 */
export function cleanupSounds(): void {
  stopBackgroundMusic()
  backgroundMusic = null
  correctSound = null
  wrongSound = null
}
