import { useEffect, useRef } from "react"
import type { GuideStep } from "../../scenarios/types.ts"
import { RichText } from "../RichText.tsx"

interface Props {
  readonly steps: ReadonlyArray<GuideStep>
  readonly index: number
}

/** The guide in the task card: done steps are ticked, the current one stands out, the next ones wait. */
export const GuideSteps = ({ steps, index }: Props) => {
  const current = useRef<HTMLLIElement>(null)
  // The card scrolls by itself on a phone; the page under it does not move.
  useEffect(() => {
    const li = current.current
    const card = li?.closest(".es-task")
    if (li === null || li === undefined || !(card instanceof HTMLElement)) return
    if (li.offsetTop < card.scrollTop || li.offsetTop + li.offsetHeight > card.scrollTop + card.clientHeight) card.scrollTop = li.offsetTop - 8
  }, [index])
  const finished = index >= steps.length
  return (
    <>
      <ol className="es-guide-steps" aria-label="Кроки з підказками">
        {steps.map((step, i) => {
          const state = i < index ? "is-done" : i === index ? "is-current" : "is-next"
          return (
            <li key={step.text} ref={i === index ? current : undefined} className={state} aria-current={i === index ? "step" : undefined}>
              <span className="es-guide-mark" aria-hidden="true">
                {i < index ? "✓" : i + 1}
              </span>
              <span>
                <RichText text={step.text} />
              </span>
            </li>
          )
        })}
      </ol>
      <p className="es-guide-status" role="status">
        {finished ? "Усі кроки зроблено! Натисни «Перевірити»." : `Крок ${index + 1} з ${steps.length}`}
      </p>
    </>
  )
}
