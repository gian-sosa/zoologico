import { useState } from 'react'
import type { FunFact } from '../data/animals'

export default function FlipFact({ fact, accentHex, index }: { fact: FunFact; accentHex: string; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      className="relative h-40 w-full cursor-pointer text-left transition-transform duration-200 active:scale-[0.98]"
      style={{ perspective: '1000px' }}
    >
      <span
        className="absolute inset-0 grid place-items-center rounded-3xl border border-border p-6 text-center transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <span
          aria-hidden={flipped}
          className="absolute inset-0 grid place-items-center rounded-3xl bg-card p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span>
            <span
              className="grid size-10 place-items-center rounded-full font-heading text-sm font-bold"
              style={{ backgroundColor: `${accentHex}1a`, color: accentHex }}
            >
              {index + 1}
            </span>
            <span className="mt-3 block font-heading text-lg font-semibold text-foreground">{fact.title}</span>
            <span className="mt-1 block text-xs font-medium text-muted-foreground">Toca para descubrir</span>
          </span>
        </span>

        <span
          aria-hidden={!flipped}
          className="absolute inset-0 grid place-items-center rounded-3xl p-6 text-sm leading-relaxed"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: `${accentHex}14`,
            color: '#1c241e',
          }}
        >
          {fact.detail}
        </span>
      </span>
      <span className="sr-only">
        {flipped ? fact.detail : `Dato curioso: ${fact.title}. Activa para ver el detalle.`}
      </span>
    </button>
  )
}
