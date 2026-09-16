import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from './icons'

interface Props {
  src: string
  label: string
  accentHex: string
}

/** Botón reproducir/pausar para el sonido de un animal. Solo se muestra si hay audio. */
export default function AnimalSound({ src, label, accentHex }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  // Al cambiar de animal (o desmontar), detener el audio anterior.
  useEffect(() => {
    setPlaying(false)
    return () => {
      audioRef.current?.pause()
    }
  }, [src])

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }

  return (
    <span className="mt-4 inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pausar: ${label}` : `Reproducir: ${label}`}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity duration-200 hover:opacity-90"
        style={{ backgroundColor: accentHex }}
      >
        {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        {playing ? 'Pausar sonido' : 'Escuchar sonido'}
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
      />
    </span>
  )
}
