/** Entry `edu-sheets/core`: workbook, formulas, goals and grading. No React and no page, so a server can use it. */
export * from "./core/index.ts";
export { scenarios } from "./scenarios/index.ts";
export { referenceInputs, referenceWorkbook } from "./scenarios/solutions.ts";
export { TOPIC_NAMES } from "./scenarios/types.ts";
export type { Scenario, ScenarioTopic } from "./scenarios/types.ts";
