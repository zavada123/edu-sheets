import { createPortal } from "react-dom"
import type { Box } from "./target-rect.ts"

/** Space between the lit target and the edge of the light. */
const PAD = 6

interface Props {
  /** The sheet area of the trainer: it is shaded except the target. */
  readonly area: Box | null
  readonly target: Box | null
}

/**
 * The shade over the sheet with a lit hole around the target. It is drawn over Univer's menus (they live in `body`),
 * so a button inside the «⋮» menu is lit too, and it lets every click through: closed buttons are closed by the guide's
 * stylesheet and command blocker, not by the shade.
 */
export const GuideLayer = ({ area, target }: Props) => {
  if (area === null || target === null) return null
  const hole = {
    left: target.x - PAD,
    top: target.y - PAD,
    width: target.width + PAD * 2,
    height: target.height + PAD * 2
  }
  return createPortal(
    <div className="es-guide-layer" aria-hidden="true">
      <div className="es-guide-shade" style={{ left: area.x, top: area.y, width: area.width, height: area.height }}>
        <div className="es-guide-hole" style={{ left: hole.left - area.x, top: hole.top - area.y, width: hole.width, height: hole.height }} />
      </div>
    </div>,
    document.body
  )
}
