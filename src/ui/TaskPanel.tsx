import type { GoalResult } from "../core/goals.ts"
import type { Scenario } from "../scenarios/types.ts"

interface Props {
  readonly scenario: Scenario
  readonly results: ReadonlyArray<GoalResult> | null
  readonly open: boolean
  readonly checking: boolean
  readonly selfCheck: boolean
  readonly onToggle: () => void
  readonly onCheck: () => void
  readonly onReset: () => void
}

/** The task card: what to do, the "Перевірити" button and the result of each condition. */
export const TaskPanel = ({ scenario, results, open, checking, selfCheck, onToggle, onCheck, onReset }: Props) => {
  const solved = results !== null && results.length > 0 && results.every((r) => r.ok)
  // Not a landmark (aside, header): a page can show several trainers, and their landmarks would have the same name.
  return (
    <div className={`es-task ${open ? "is-open" : ""}`}>
      <div className="es-task-head">
        {scenario.grade > 0 && <span className="es-grade">{scenario.grade} клас</span>}
        <h2>{scenario.title}</h2>
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
            </div>
          )}
        </>
      )}
    </div>
  )
}
