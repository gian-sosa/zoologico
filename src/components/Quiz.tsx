import { useState } from 'react'
import type { QuizQuestion } from '../data/animals'
import { CheckIcon, RefreshIcon, XIcon } from './icons'

interface Props {
  questions: QuizQuestion[]
  accentHex: string
}

export default function Quiz({ questions, accentHex }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[current]

  function handleSelect(index: number) {
    if (selected !== null) return
    setSelected(index)
    if (index === question.correctIndex) setScore((s) => s + 1)
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center">
        <p className="font-heading text-4xl font-bold" style={{ color: accentHex }}>
          {score}/{questions.length}
        </p>
        <p className="mt-2 font-heading text-lg font-semibold text-foreground">
          {score === questions.length
            ? '¡Perfecto! Eres un experto del zoológico.'
            : score > questions.length / 2
              ? '¡Muy bien! Ya sabes bastante.'
              : 'Buen intento. ¡Vuelve a la infografía y reinténtalo!'}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mx-auto mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          style={{ backgroundColor: accentHex }}
        >
          <RefreshIcon />
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span aria-live="polite">
          Pregunta {current + 1} de {questions.length}
        </span>
        <span>Aciertos: {score}</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((current + (selected !== null ? 1 : 0)) / questions.length) * 100}%`, backgroundColor: accentHex }}
        />
      </div>

      <h4 className="mt-6 font-heading text-xl font-semibold text-foreground">{question.question}</h4>

      <div role="group" aria-label="Opciones de respuesta" className="mt-5 grid gap-3">
        {question.options.map((option, i) => {
          const chosen = selected === i
          const correct = selected !== null && i === question.correctIndex
          const wrong = chosen && !correct

          let cls = 'border-border bg-background hover:bg-muted'
          if (correct) cls = 'border-green-600 bg-green-50'
          else if (wrong) cls = 'border-red-400 bg-red-50 opacity-90'
          else if (chosen) cls = 'border-border bg-muted'

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-medium text-foreground transition-colors duration-200 disabled:cursor-default ${cls}`}
            >
              {option}
              {correct && <CheckIcon className="size-5 shrink-0 text-green-700" />}
              {wrong && <XIcon className="size-5 shrink-0 text-red-500" />}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {question.explanation}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="shrink-0 cursor-pointer rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            style={{ backgroundColor: accentHex }}
          >
            {current + 1 < questions.length ? 'Siguiente' : 'Ver resultado'}
          </button>
        </div>
      )}
    </div>
  )
}
