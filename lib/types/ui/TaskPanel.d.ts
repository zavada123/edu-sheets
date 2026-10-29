import type { GoalResult } from "../core/goals.ts";
import type { Scenario } from "../scenarios/types.ts";
interface Props {
    readonly scenario: Scenario;
    readonly results: ReadonlyArray<GoalResult> | null;
    readonly open: boolean;
    readonly checking: boolean;
    readonly selfCheck: boolean;
    readonly onToggle: () => void;
    readonly onCheck: () => void;
    readonly onReset: () => void;
}
/** The task card: what to do, the "Перевірити" button and the result of each condition. */
export declare const TaskPanel: ({ scenario, results, open, checking, selfCheck, onToggle, onCheck, onReset }: Props) => import("react").JSX.Element;
export {};
