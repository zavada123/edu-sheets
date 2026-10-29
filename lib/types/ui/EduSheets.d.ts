import { type WorkbookState } from "../core/workbook.ts";
import type { Scenario } from "../scenarios/types.ts";
import "@univerjs/preset-sheets-core/lib/index.css";
import "@univerjs/preset-sheets-sort/lib/index.css";
import "@univerjs/preset-sheets-filter/lib/index.css";
import "@univerjs/preset-sheets-conditional-formatting/lib/index.css";
import "./sheets.css";
interface Props {
    /** To show another scenario, give the component a new `key`, for example the scenario id. */
    readonly scenario: Scenario;
    /** Called after every check; `solved` is true when all conditions are met. */
    readonly onCheck?: (solved: boolean) => void;
    /**
     * Called with the whole table each time the student changes it. A page that checks answers on its server
     * sends this table and grades it there with `grade` from the core.
     */
    readonly onChange?: (workbook: WorkbookState) => void;
    /** A table saved earlier: the trainer starts with it instead of the scenario start. */
    readonly initialWorkbook?: WorkbookState;
    /** `false` hides «Перевірити» when the page checks the answer itself. */
    readonly selfCheck?: boolean;
}
/** The spreadsheet trainer for one scenario. Can be embedded into any React page. */
export declare const EduSheets: ({ scenario, onCheck, onChange, initialWorkbook, selfCheck }: Props) => import("react").JSX.Element;
export {};
