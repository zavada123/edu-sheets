import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { scenarios } from "../scenarios/index.ts"
import { EduSheets } from "../ui/EduSheets.tsx"
import "./demo.css"

const Demo = () => {
  const [index, setIndex] = useState(() => {
    const id = new URLSearchParams(location.search).get("task")
    return Math.max(
      0,
      scenarios.findIndex((s) => s.id === id)
    )
  })
  const scenario = scenarios[index] ?? scenarios[0]
  if (scenario === undefined) return null
  return (
    <div className="demo">
      <header className="demo-bar">
        <strong>Тренажер «Електронні таблиці»</strong>
        <select
          aria-label="Завдання"
          value={index}
          onChange={(e) => {
            const next = Number(e.target.value)
            setIndex(next)
            history.replaceState(null, "", `?task=${scenarios[next]?.id ?? ""}`)
          }}
        >
          {scenarios.map((s, i) => (
            <option key={s.id} value={i}>
              {s.grade} кл. — {s.title}
            </option>
          ))}
        </select>
      </header>
      <main className="demo-main">
        <EduSheets key={scenario.id} scenario={scenario} />
      </main>
    </div>
  )
}

const root = document.getElementById("root")
if (root !== null)
  createRoot(root).render(
    <StrictMode>
      <Demo />
    </StrictMode>
  )
