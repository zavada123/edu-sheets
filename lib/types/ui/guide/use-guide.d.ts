import type { WorkbookState } from "../../core/workbook.ts";
import type { GuideStep } from "../../scenarios/types.ts";
import { type SheetsAPI } from "../univer-bridge.ts";
import { type Box } from "./target-rect.ts";
/** Where the guide is now: the step, the box to light and the trainer area to shade around it. */
export interface GuideView {
    readonly index: number;
    readonly target: Box | null;
    readonly area: Box | null;
}
interface Options {
    readonly api: SheetsAPI | null;
    /** The trainer's sheet area: Univer lives inside it, the shade covers it. */
    readonly sheet: HTMLElement | null;
    readonly steps: ReadonlyArray<GuideStep>;
    readonly on: boolean;
    /** The table at the start of the exercise: goals compare the student's table with it. */
    readonly start: WorkbookState;
}
/**
 * Runs a guide over one Univer: closes the buttons a step does not need (they turn grey and their shortcuts do
 * nothing), follows the step's target on the screen and moves on when the step is done. A new Univer (another
 * exercise, «Почати спочатку») starts the guide from the first step.
 */
export declare const useGuide: ({ api, sheet, steps, on, start }: Options) => GuideView;
export {};
