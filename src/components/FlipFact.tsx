import { useState } from 'react'
import type { FunFact } from '../data/animals'

export default function FlipFact({ fact, accentHex, index }: { fact: FunFact; accentHex: string; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      className="relative h-40 w-full cursor-pointer text-left perspective-[1000px] transition-transform duration-200 active:scale-[0.98]"
    >
      <span
        className="absolute inset-0 grid transform-3d place-items-center rounded-3xl border border-border p-6 text-center transition-transform duration-500"
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <span
          aria-hidden={flipped}
          className="absolute inset-0 grid place-items-center rounded-3xl bg-card p-6 backface-hidden"
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
          className="absolute inset-0 grid place-items-center rounded-3xl p-6 text-sm leading-relaxed text-foreground backface-hidden [transform:rotateY(180deg)]"
          style={{
            backgroundColor: `${accentHex}14`,
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
