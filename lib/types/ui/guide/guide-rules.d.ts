import type { GuideStep } from "../../scenarios/types.ts";
/** Undo and redo always work: a student who pressed the wrong thing takes it back. */
export declare const ALWAYS_OPEN: ReadonlyArray<string>;
/** Commands the student may use in a step: its own list, the target button, undo and redo. */
export declare const openCommands: (step: GuideStep) => ReadonlyArray<string>;
/** `"sheet.command.numfmt.*"` opens every command with that start; any other entry opens one command. */
export declare const isOpen: (id: string, open: ReadonlyArray<string>) => boolean;
/** The ribbon tab a step needs: the one it points at or waits for. */
export declare const stepTab: (step: GuideStep) => string | undefined;
/**
 * The stylesheet that greys out the closed buttons. Univer draws its menus outside the trainer (in `body`), so the
 * rules are not scoped to the trainer; they live only while a guide step runs. Tabs other than the open one (or the one
 * the step needs) are closed too.
 */
export declare const lockCss: (open: ReadonlyArray<string>, tab: string | undefined) => string;
/** The first and last cell of `"A1:C1"` or `"B2"`, upper case and without `$`; `null` for a wrong address. */
export declare const rangeCorners: (range: string) => {
    readonly first: string;
    readonly last: string;
} | null;
/** `"a1:c1"` is the same range as `"A1:C1"`, and `"B2"` as `"B2:B2"`. */
export declare const sameRange: (a: string, b: string) => boolean;
