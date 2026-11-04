import type { Scenario } from "../scenarios/types.ts";
import "./catalog.css";
interface Props {
    readonly scenarios: ReadonlyArray<Scenario>;
    /** Ids of solved exercises: they get a check mark. */
    readonly solved: ReadonlyArray<string>;
    /** The open exercise, highlighted. */
    readonly current?: string | undefined;
    readonly onPick: (id: string) => void;
    /** Name of the list for screen readers. */
    readonly label?: string;
}
/** The exercises as cards, grouped by grade: topic, the situation, the skills and a check mark for solved ones. */
export declare const TaskCatalog: ({ scenarios, solved, current, onPick, label }: Props) => import("react").JSX.Element;
export {};
