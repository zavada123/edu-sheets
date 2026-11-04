import type { Scenario } from "../scenarios/types.ts"
import { gradeGroups, summaryOf, topicName, topicOf } from "./catalog-groups.ts"
import "./catalog.css"

interface Props {
  readonly scenarios: ReadonlyArray<Scenario>
  /** Ids of solved exercises: they get a check mark. */
  readonly solved: ReadonlyArray<string>
  /** The open exercise, highlighted. */
  readonly current?: string | undefined
  readonly onPick: (id: string) => void
  /** Name of the list for screen readers. */
  readonly label?: string
}

const percent = (done: number, total: number): number => (total === 0 ? 0 : Math.round((done / total) * 100))

/** The exercises as cards, grouped by grade: topic, the situation, the skills and a check mark for solved ones. */
export const TaskCatalog = ({ scenarios, solved, current, onPick, label = "Вправи з електронних таблиць" }: Props) => {
  const groups = gradeGroups(scenarios, solved)
  const done = groups.reduce((n, g) => n + g.done, 0)
  let number = 0
  return (
    <nav className="es-cat" aria-label={label}>
      <div className="es-cat-top">
        <p className="es-cat-count" aria-live="polite">
          Виконано <b>{done}</b> з {scenarios.length}
        </p>
        <span className="es-cat-bar" aria-hidden="true">
          <span style={{ width: `${percent(done, scenarios.length)}%` }} />
        </span>
      </div>
      {groups.map((g) => (
        <section key={g.grade} className="es-cat-group" aria-labelledby={`es-cat-grade-${g.grade}`}>
          <div className="es-cat-head">
            <h3 id={`es-cat-grade-${g.grade}`}>{g.grade > 0 ? `${g.grade} клас` : "Вправи"}</h3>
            <span className="es-cat-progress">
              {g.done} з {g.items.length}
            </span>
          </div>
          <div className="es-cat-grid">
            {g.items.map((s) => {
              number += 1
              const isSolved = solved.includes(s.id)
              const isCurrent = s.id === current
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`es-cat-card${isCurrent ? " is-current" : ""}${isSolved ? " is-solved" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  onClick={() => onPick(s.id)}
                >
                  <span className="es-cat-meta">
                    <span className="es-cat-num" aria-hidden="true">
                      {number}
                    </span>
                    <span className={`es-cat-topic es-cat-topic-${topicOf(s)}`}>{topicName(s)}</span>
                    {isSolved && (
                      <span className="es-cat-done" role="img" aria-label="виконано">
                        ✓
                      </span>
                    )}
                  </span>
                  <b className="es-cat-title">{s.title}</b>
                  <small className="es-cat-summary">{summaryOf(s)}</small>
                  {s.skills !== undefined && s.skills.length > 0 && (
                    <span className="es-cat-skills">
                      {s.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </nav>
  )
}
