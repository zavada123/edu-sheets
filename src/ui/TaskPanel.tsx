import type { GoalResult } from "../core/goals.ts"
import type { Scenario } from "../scenarios/types.ts"

interface Props {
  readonly scenario: Scenario
  readonly results: ReadonlyArray<GoalResult> | null
  readonly open: boolean
  readonly checking: boolean
  readonly selfCheck: boolean
  readonly full: boolean
  readonly onToggleFull: () => void
  readonly onNext: (() => void) | undefined
  readonly onToggle: () => void
  readonly onCheck: () => void
  readonly onReset: () => void
}

const ExpandIcon = ({ full }: { readonly full: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {full ? <path d="M8 3v5H3M12 3v5h5M8 17v-5H3M12 17v-5h5" /> : <path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" />}
  </svg>
)

/** The task card: what to do, the "Перевірити" button and the result of each condition. */
export const TaskPanel = ({ scenario, results, open, checking, selfCheck, full, onToggleFull, onNext, onToggle, onCheck, onReset }: Props) => {
  const solved = results !== null && results.length > 0 && results.every((r) => r.ok)
  // Not a landmark (aside, header): a page can show several trainers, and their landmarks would have the same name.
  return (
    <div className={`es-task ${open ? "is-open" : ""}`}>
      <div className="es-task-head">
        {scenario.grade > 0 && <span className="es-grade">{scenario.grade} клас</span>}
        <h2>{scenario.title}</h2>
        <button
          type="button"
          className="es-full-btn"
          aria-pressed={full}
          aria-label={full ? "Вийти з повного екрана" : "На весь екран"}
          title={full ? "Вийти з повного екрана (Esc)" : "На весь екран"}
          onClick={onToggleFull}
        >
          <ExpandIcon full={full} />
        </button>
        <button type="button" className="es-task-toggle" aria-expanded={open} aria-label={open ? "Сховати завдання" : "Показати завдання"} onClick={onToggle}>
          {open ? "▴" : "▾"}
        </button>
      </div>
      {open && (
        <>
          <ol className="es-task-steps">
            {scenario.task.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="es-touch-hint">На телефоні: торкнися клітинки, щоб вибрати її, і двічі, щоб уводити текст.</p>
          <div className="es-task-actions">
            {selfCheck && (
              <button type="button" className="es-check" onClick={onCheck} disabled={checking}>
                {checking ? "Перевіряю…" : "Перевірити"}
              </button>
            )}
            <button type="button" className="es-reset" onClick={onReset}>
              Почати спочатку
            </button>
          </div>
          {results !== null && (
            <div className={`es-results ${solved ? "is-solved" : ""}`} role="status">
              <p className="es-results-head">{solved ? "🎉 Молодець! Усе виконано." : `Виконано ${results.filter((r) => r.ok).length} з ${results.length}`}</p>
              <ul>
                {results.map((r) => (
                  <li key={r.text} className={r.ok ? "is-ok" : "is-bad"}>
                    <span aria-hidden="true">{r.ok ? "✅" : "❌"}</span> {r.text}
                    {!r.ok && r.hint !== "" && <small>{r.hint}</small>}
                  </li>
                ))}
              </ul>
              {solved && onNext !== undefined && (
                <button type="button" className="es-next" onClick={onNext}>
                  Наступна вправа →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
