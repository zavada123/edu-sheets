/**
 * Ukrainian Excel writes `2,5` for a decimal number and `;` between function arguments: `=IF(A1>1;"так";"ні")`.
 * The Univer engine reads `2.5` and `,`. These functions turn what a student typed into what the engine reads,
 * so the textbook notation works.
 */
/** `"2,5"` → `2.5`; `null` for anything else. */
export declare const ukrainianNumber: (text: string) => number | null;
/**
 * `=IF(A1>2,5;1;0)` → `=IF(A1>2.5,1,0)`. Text in quotes is left as it is.
 * A formula with `;` is in the Ukrainian notation: every comma between digits is decimal.
 * A formula without `;` (`=SUM(A1,B1)`) keeps its commas, except a decimal comma outside brackets (`=A1*2,5`).
 */
export declare const ukrainianFormula: (formula: string) => string;
