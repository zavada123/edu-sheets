import { type IStyleData, type IWorkbookData } from "@univerjs/core";
import { type CellStyle, type WorkbookState } from "./workbook.ts";
export declare const styleToUniver: (style: CellStyle) => IStyleData;
/** Univer writes colors as `#RGB`, `#RRGGBB` or `rgb(r,g,b)`; goals compare `#rrggbb`. */
export declare const normalizeColor: (color: unknown) => string | undefined;
/** Univer style → our style; only what is set. */
export declare const styleFromUniver: (s: IStyleData | null | undefined) => CellStyle | undefined;
/** Sheet ids are positions: `s1`, `s2`. Names stay as the student set them. */
export declare const sheetId: (index: number) => string;
/** Our workbook → the data Univer opens. */
export declare const toUniverData: (workbook: WorkbookState, id?: string) => Partial<IWorkbookData>;
