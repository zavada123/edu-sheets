import { StrictMode, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { scenarios } from "../scenarios/index.ts"
import { nextScenario } from "../ui/catalog-groups.ts"
import { EduSheets } from "../ui/EduSheets.tsx"
import { TaskCatalog } from "../ui/TaskCatalog.tsx"
import "./demo.css"

const SOLVED_KEY = "edu-sheets:solved"

const readSolved = (): ReadonlyArray<string> => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SOLVED_KEY) ?? "[]")
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []
  } catch {
    return []
  }
}

const Demo = () => {
  const [current, setCurrent] = useState(() => {
    const id = new URLSearchParams(location.search).get("task")
    return scenarios.find((s) => s.id === id)?.id ?? scenarios[0]?.id ?? ""
  })
  const [solved, setSolved] = useState(readSolved)
  const area = useRef<HTMLDivElement>(null)
  const scenario = scenarios.find((s) => s.id === current)
  if (scenario === undefined) return null
  const open = (id: string) => {
    setCurrent(id)
    history.replaceState(null, "", `?task=${id}`)
    area.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const markSolved = () => {
    if (solved.includes(scenario.id)) return
    const next = [...solved, scenario.id]
    setSolved(next)
    try {
      localStorage.setItem(SOLVED_KEY, JSON.stringify(next))
    } catch {
      // Storage is blocked: the mark lives until the page closes.
    }
  }
  const next = nextScenario(scenarios, solved, scenario.id)
  return (
    <div className="demo">
      <header className="demo-bar">
        <strong>Тренажер «Електронні таблиці»</strong>
      </header>
      <main className="demo-main">
        <TaskCatalog scenarios={scenarios} solved={solved} current={scenario.id} onPick={open} />
        <div ref={area} className="demo-trainer">
          <EduSheets scenario={scenario} onCheck={(ok) => ok && markSolved()} onNext={next === undefined ? undefined : () => open(next.id)} />
        </div>
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
