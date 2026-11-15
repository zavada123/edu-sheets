import type { GuideTarget } from "../../scenarios/types.ts";
import type { SheetsAPI } from "../univer-bridge.ts";
/** A box on the screen, in viewport pixels. */
export interface Box {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
/** Where the target of a step is now; `null` while it is not on the screen. */
export declare const targetBox: (root: Element, api: SheetsAPI, target: GuideTarget) => Box | null;
export declare const sameBox: (a: Box | null, b: Box | null) => boolean;
/** The part of the sheet area inside the trainer: a page may give the trainer less room than the sheet needs. */
export declare const visibleBox: (sheet: Element) => Box;
/** The ribbon tab that is open now. */
export declare const openTab: (root: Element) => string | null;
