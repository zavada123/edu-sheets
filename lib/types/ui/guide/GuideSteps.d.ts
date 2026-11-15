import type { GuideStep } from "../../scenarios/types.ts";
interface Props {
    readonly steps: ReadonlyArray<GuideStep>;
    readonly index: number;
}
/** The guide in the task card: done steps are ticked, the current one stands out, the next ones wait. */
export declare const GuideSteps: ({ steps, index }: Props) => import("react").JSX.Element;
export {};
