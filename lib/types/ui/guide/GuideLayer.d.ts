import type { Box } from "./target-rect.ts";
interface Props {
    /** The sheet area of the trainer: it is shaded except the target. */
    readonly area: Box | null;
    readonly target: Box | null;
}
/**
 * The shade over the sheet with a lit hole around the target. It is drawn over Univer's menus (they live in `body`),
 * so a button inside the «⋮» menu is lit too, and it lets every click through: closed buttons are closed by the guide's
 * stylesheet and command blocker, not by the shade.
 */
export declare const GuideLayer: ({ area, target }: Props) => import("react").ReactPortal | null;
export {};
