import type { SheetsAPI } from "./univer-bridge.ts";
/** A phone or tablet: no physical keyboard is assumed. */
export declare const isTouchDevice: () => boolean;
/**
 * On a touch screen the always-focused cell editor opens the on-screen keyboard after every tap, and it covers half
 * of the table. Here the keyboard stays hidden while the student selects cells and shows up only when they edit a
 * cell (double tap). The formula bar is a separate field and opens the keyboard as usual.
 */
export declare const keepKeyboardForEditing: (api: SheetsAPI, container: HTMLElement) => {
    dispose: () => void;
};
