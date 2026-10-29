var CELL = /^\$?([A-Za-z]{1,2})\$?(\d{1,5})$/;
/** `A` → 0, `Z` → 25, `AA` → 26. */
var colIndex = (letters) => [...letters.toUpperCase()].reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
/** 0 → `A`, 26 → `AA`. */
var colName = (index) => {
	let n = index + 1;
	let name = "";
	while (n > 0) {
		const rest = (n - 1) % 26;
		name = String.fromCharCode(65 + rest) + name;
		n = Math.floor((n - 1) / 26);
	}
	return name;
};
/** `B2` → `{ row: 1, col: 1 }`; `null` for anything else. `$` signs are allowed. */
var parseCell = (address) => {
	const m = CELL.exec(address.trim());
	if (m === null) return null;
	const col = colIndex(m[1] ?? "");
	const row = Number(m[2]) - 1;
	if (row < 0 || row >= 1e4 || col >= 702) return null;
	return {
		row,
		col
	};
};
var cellName = ({ row, col }) => `${colName(col)}${row + 1}`;
/** `B2:C3` → `B2 C2 B3 C3` (row by row); one cell → itself; `[]` for a wrong range. */
var cellsOf = (range) => {
	const [from, to = from] = range.split(":");
	const a = parseCell(from ?? "");
	const b = parseCell(to ?? "");
	if (a === null || b === null) return [];
	const cells = [];
	for (let row = Math.min(a.row, b.row); row <= Math.max(a.row, b.row); row++) for (let col = Math.min(a.col, b.col); col <= Math.max(a.col, b.col); col++) cells.push(cellName({
		row,
		col
	}));
	return cells;
};
/** Text in quotes is not code: `="B2"` names no cell. */
var withoutStrings = (formula) => formula.replace(/"[^"]*"/g, "\"\"");
var REF = /(?<![A-Za-z0-9_$.])(\$?[A-Za-z]{1,2}\$?\d{1,5})(?::(\$?[A-Za-z]{1,2}\$?\d{1,5}))?(?![A-Za-z0-9_(])/g;
/** Every cell the formula reads, ranges opened: `=SUM(B2:B4)*$C$1` → `B2 B3 B4 C1`. */
var refsIn = (formula) => {
	const refs = /* @__PURE__ */ new Set();
	for (const m of withoutStrings(formula).matchAll(REF)) {
		const range = m[2] === void 0 ? m[1] ?? "" : `${m[1]}:${m[2]}`;
		for (const cell of cellsOf(range.replace(/\$/g, ""))) refs.add(cell);
	}
	return refs;
};
/** Function names in a formula, upper case: `=sum(B2:B4)+Max(C1;2)` → `SUM MAX`. */
var functionsIn = (formula) => new Set([...withoutStrings(formula).matchAll(/([A-Za-z][A-Za-z0-9.]*)\s*\(/g)].map((m) => (m[1] ?? "").toUpperCase()));
// src/core/compute.ts
/**
* Computes every formula of the workbook with the Univer formula engine, without a page.
* The engine loads on the first call, so a page that only shows tasks or edits them does not download it.
*/
var compute = async (workbook) => (await import("./engine-DtvWskUy.js")).computeNow(workbook);
// src/core/workbook.ts
var DEFAULT_SHEET = "Аркуш1";
var sheetSpecName = (spec, index) => spec.name ?? `Аркуш${index + 1}`;
var isCellState = (value) => typeof value === "object";
/** The start workbook of a task. */
var buildWorkbook = (specs) => ({ sheets: (specs.length === 0 ? [{ cells: {} }] : specs).map((spec, i) => ({
	name: sheetSpecName(spec, i),
	cells: Object.fromEntries(Object.entries(spec.cells).map(([address, value]) => [address.toUpperCase(), isCellState(value) ? value : { input: value }])),
	...spec.widths === void 0 ? {} : { widths: spec.widths }
})) });
var isFormula = (input) => typeof input === "string" && input.startsWith("=") && input.length > 1;
var findSheet = (workbook, name) => name === void 0 ? workbook.sheets[0] : workbook.sheets.find((s) => s.name === name);
var cellOf = (sheet, address) => sheet?.cells[address.toUpperCase()];
/** A copy of the workbook with new inputs in some cells: `{ B2: 100 }`. Formatting stays. */
var withInputs = (workbook, sheetName, inputs) => {
	const target = findSheet(workbook, sheetName);
	return { sheets: workbook.sheets.map((sheet) => sheet !== target ? sheet : {
		...sheet,
		cells: {
			...sheet.cells,
			...Object.fromEntries(Object.entries(inputs).map(([address, input]) => [address.toUpperCase(), {
				...sheet.cells[address.toUpperCase()],
				input
			}]))
		}
	}) };
};
/** Limits for a handed-in workbook. A school task needs far less; the server refuses more. */
var LIMITS = {
	sheets: 10,
	cells: 5e3,
	input: 2e3
};
var COLOR = /^#[0-9a-f]{6}$/i;
var validStyle = (style) => {
	if (style === void 0) return true;
	if (typeof style !== "object" || style === null) return false;
	const s = style;
	const flags = [
		"bold",
		"italic",
		"underline",
		"strike",
		"wrap"
	].every((k) => s[k] === void 0 || typeof s[k] === "boolean");
	const colors = ["color", "fill"].every((k) => s[k] === void 0 || typeof s[k] === "string" && COLOR.test(s[k]));
	const align = s.align === void 0 || s.align === "left" || s.align === "center" || s.align === "right";
	const size = s.fontSize === void 0 || typeof s.fontSize === "number" && s.fontSize > 0 && s.fontSize <= 400;
	const format = s.format === void 0 || typeof s.format === "string" && s.format.length <= 100;
	return flags && colors && align && size && format;
};
var validInput = (input) => typeof input === "string" && input.length <= LIMITS.input || typeof input === "number" && Number.isFinite(input) || typeof input === "boolean";
/** Checks a workbook that came from outside (a saved answer) before the server reads it. */
var parseWorkbook = (data) => {
	if (typeof data !== "object" || data === null) return null;
	const sheets = data.sheets;
	if (!Array.isArray(sheets) || sheets.length === 0 || sheets.length > LIMITS.sheets) return null;
	let total = 0;
	for (const sheet of sheets) {
		if (typeof sheet !== "object" || sheet === null) return null;
		const { name, cells, widths } = sheet;
		if (typeof name !== "string" || name.length === 0 || name.length > 100) return null;
		if (typeof cells !== "object" || cells === null) return null;
		for (const [address, cell] of Object.entries(cells)) {
			total++;
			if (total > LIMITS.cells || parseCell(address) === null || cellName(parseCell(address) ?? {
				row: 0,
				col: 0
			}) !== address) return null;
			if (typeof cell !== "object" || cell === null) return null;
			const { input, style } = cell;
			if (!validInput(input) || !validStyle(style)) return null;
		}
		if (widths !== void 0) {
			if (typeof widths !== "object" || widths === null) return null;
			for (const [col, w] of Object.entries(widths)) if (!/^[A-Z]{1,2}$/.test(col) || typeof w !== "number" || !(w > 0 && w <= 2e3)) return null;
		}
	}
	return data;
};
/** Column letter of an address or a range start: `C7` → `C`. */
var columnOf = (address) => address.replace(/[^A-Za-z]/g, "").toUpperCase();
/** All cells of the ranges in a goal: `"B2:B6"` or `["B2", "D2:D3"]`. */
var cellsIn = (ranges) => (typeof ranges === "string" ? [ranges] : ranges).flatMap((r) => cellsOf(r));
// src/core/goals.ts
var listOf = (cells) => typeof cells === "string" ? [cells] : cells;
var isOneCell = (cells) => listOf(cells).length === 1 && !(listOf(cells)[0] ?? "").includes(":");
var cellsLabel = (cells) => `${isOneCell(cells) ? "клітинці" : "клітинках"} ${listOf(cells).join(", ")}`;
var cellsLabelNom = (cells) => `${isOneCell(cells) ? "Клітинка" : "Клітинки"} ${listOf(cells).join(", ")}`;
var formatValue = (value) => {
	if (value === null) return "порожньо";
	if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
	if (typeof value === "number") return String(Math.round(value * 1e9) / 1e9).replace(".", ",");
	return `«${value}»`;
};
var STYLE_WORDS = [
	["bold", () => "жирний шрифт"],
	["italic", () => "курсив"],
	["underline", () => "підкреслення"],
	["strike", () => "закреслення"],
	["color", () => "колір тексту"],
	["fill", () => "колір заливки"],
	["align", (s) => ({
		left: "вирівнювання ліворуч",
		center: "вирівнювання по центру",
		right: "вирівнювання праворуч"
	})[s.align ?? "left"]],
	["wrap", () => "перенесення тексту"],
	["fontSize", (s) => `розмір шрифту ${s.fontSize}`],
	["format", (s) => `формат чисел ${s.format}`]
];
var styleWords = (style) => STYLE_WORDS.filter(([key]) => style[key] !== void 0 && style[key] !== false).map(([, word]) => word(style)).join(", ");
/** Default wording of a goal for the task list. */
var describeGoal = (goal) => {
	if (goal.text !== void 0) return goal.text;
	switch (goal.type) {
		case "value": return typeof goal.equals === "object" && goal.equals !== null ? `У ${cellsLabel(goal.cells)} правильні значення` : `У ${cellsLabel(goal.cells)} значення ${formatValue(goal.equals)}`;
		case "formula": return `У ${cellsLabel(goal.cells)} ${isOneCell(goal.cells) ? "формула" : "формули"}${goal.functions?.length ? ` з функцією ${goal.functions.join(", ")}` : ""}`;
		case "recalc": return `Формули в ${cellsLabel(goal.cells)} перераховуються, коли змінюються дані`;
		case "style": return `${cellsLabelNom(goal.cells)}: ${styleWords(goal.style)}`;
		case "filled": return `${cellsLabelNom(goal.cells)} заповнено`;
		case "sorted": return `Рядки ${goal.range} упорядковано за стовпцем ${goal.by} ${goal.order === "desc" ? "за спаданням" : "за зростанням"}`;
		case "width": return `Стовпець ${goal.column} досить широкий, щоб усе було видно`;
		case "sheet": return `Є аркуш «${goal.name}»`;
	}
};
var sameValue = (actual, expected, tolerance = 0) => {
	if (typeof expected === "number") {
		if (typeof actual !== "number") return false;
		return Math.abs(actual - expected) <= Math.max(tolerance, 1e-9 * Math.max(1, Math.abs(expected)));
	}
	if (typeof expected === "string") return typeof actual === "string" && actual.trim().toLowerCase() === expected.trim().toLowerCase();
	return actual === expected;
};
var expectedAt = (equals, index) => Array.isArray(equals) ? equals[index] ?? null : equals;
/** The first cell whose value is wrong, as a hint; `null` when all are right. */
var wrongValue = (computed, goal) => {
	const cells = cellsIn(goal.cells);
	for (const [i, cell] of cells.entries()) {
		const actual = computed.value(cell, goal.sheet);
		if (!sameValue(actual, expectedAt(goal.equals, i), goal.tolerance)) return `У ${cell} зараз ${formatValue(actual)}.`;
	}
	return cells.length === 0 ? "Завдання вказує неправильні клітинки." : null;
};
var wrongFormula = (book, goal) => {
	const sheet = findSheet(book, goal.sheet);
	for (const cell of cellsIn(goal.cells)) {
		const input = cellOf(sheet, cell)?.input;
		if (input === void 0 || input === "") return `Клітинка ${cell} порожня.`;
		if (!isFormula(input)) return `У ${cell} записано значення, а потрібна формула. Формула починається зі знака =.`;
		if (goal.refs !== false && refsIn(input).size === 0) return `Формула в ${cell} не використовує адрес клітинок, тому не перерахується, коли зміняться дані.`;
		const used = functionsIn(input);
		const missing = (goal.functions ?? []).find((f) => !used.has(f.toUpperCase()));
		if (missing !== void 0) return `У формулі в ${cell} немає функції ${missing}.`;
	}
	return null;
};
/** In a style goal, `color: "*"` or `fill: "*"` accepts any color the student chose. */
var ANY = "*";
var wrongStyle = (book, goal) => {
	const sheet = findSheet(book, goal.sheet);
	for (const cell of cellsIn(goal.cells)) {
		const style = cellOf(sheet, cell)?.style ?? {};
		for (const key of Object.keys(goal.style)) {
			const want = goal.style[key];
			const have = style[key] ?? (typeof want === "boolean" ? false : void 0);
			if (!(want === "*" ? have !== void 0 : typeof want === "string" && typeof have === "string" ? want.toLowerCase() === have.toLowerCase() : want === have)) return `У ${cell} ще немає: ${styleWords({ [key]: want })}.`;
		}
	}
	return null;
};
var compareCells = (a, b) => {
	if (typeof a === "number" && typeof b === "number") return a - b;
	if (a === null) return b === null ? 0 : 1;
	if (b === null) return -1;
	if (typeof a === "number") return -1;
	if (typeof b === "number") return 1;
	return String(a).localeCompare(String(b), "uk");
};
var rowsOf = (computed, range, sheet) => {
	const cells = cellsIn(range);
	const columns = new Set(cells.map(columnOf)).size;
	const rows = [];
	cells.forEach((cell, i) => {
		if (i % columns === 0) rows.push([]);
		rows.at(-1)?.push(computed.value(cell, sheet));
	});
	return rows;
};
var rowKey = (row) => JSON.stringify(row);
var wrongOrder = (start, final, goal) => {
	const firstCol = columnOf(goal.range.split(":")[0] ?? "");
	const by = [...new Set(cellsIn(goal.range).map(columnOf))].indexOf(goal.by.toUpperCase());
	if (by < 0 || firstCol === "") return "Завдання вказує стовпець поза таблицею.";
	const rows = rowsOf(final, goal.range, goal.sheet);
	const sign = goal.order === "desc" ? -1 : 1;
	for (let i = 1; i < rows.length; i++) if (sign * compareCells(rows[i - 1]?.[by] ?? null, rows[i]?.[by] ?? null) > 0) return `Рядок ${i + 1} таблиці стоїть не на своєму місці.`;
	const before = rowsOf(start, goal.range, goal.sheet).map(rowKey).sort();
	const after = rows.map(rowKey).sort();
	if (before.join("|") !== after.join("|")) return "Дані в рядках перемішалися: упорядковуй усю таблицю, а не один стовпець.";
	return null;
};
/** Default Univer column width; a goal on width counts a column the student never touched as this wide. */
var DEFAULT_WIDTH = 88;
/** Checks every goal on the final table. `start` is the task's start table (for goals that compare with it). */
var checkGoals = async (start, final, goals) => {
	const computed = await compute(final);
	const startComputed = goals.some((g) => g.type === "sorted") ? await compute(start) : computed;
	const results = [];
	for (const goal of goals) {
		const problem = await problemOf(goal, final, computed, startComputed);
		results.push({
			goal,
			ok: problem === null,
			text: describeGoal(goal),
			hint: goal.hint ?? problem ?? ""
		});
	}
	return results;
};
var problemOf = async (goal, final, computed, startComputed) => {
	switch (goal.type) {
		case "value": return wrongValue(computed, goal);
		case "formula": return wrongFormula(final, goal);
		case "recalc": {
			const formulas = wrongFormula(final, {
				type: "formula",
				cells: goal.cells,
				...goal.sheet === void 0 ? {} : { sheet: goal.sheet }
			});
			if (formulas !== null) return formulas;
			const wrong = wrongValue(await compute(withInputs(final, goal.sheet, goal.set)), goal);
			const data = Object.entries(goal.set).map(([cell, v]) => `${cell} = ${formatValue(v)}`).join(", ");
			return wrong === null ? null : `Якщо ${data}, формула дає неправильний результат. ${wrong}`;
		}
		case "style": return wrongStyle(final, goal);
		case "filled": {
			const empty = cellsIn(goal.cells).find((cell) => computed.value(cell, goal.sheet) === null);
			return empty === void 0 ? null : `Клітинка ${empty} порожня.`;
		}
		case "sorted": return wrongOrder(startComputed, computed, goal);
		case "width": return (findSheet(final, goal.sheet)?.widths?.[goal.column.toUpperCase()] ?? 88) >= goal.min ? null : `Розшир стовпець ${goal.column}: перетягни праву межу його заголовка.`;
		case "sheet": return final.sheets.some((s) => s.name.trim() === goal.name) ? null : `Аркуша «${goal.name}» немає. Двічі клацни на назві аркуша внизу, щоб її змінити.`;
	}
};
var allMet = (results) => results.length > 0 && results.every((r) => r.ok);
// src/core/univer-data.ts
var BooleanNumber = { TRUE: 1 };
var CellValueType = {
	STRING: 1,
	NUMBER: 2,
	BOOLEAN: 3
};
var HorizontalAlign = {
	LEFT: 1,
	CENTER: 2,
	RIGHT: 3
};
var WrapStrategy = { WRAP: 3 };
/** Default Univer sizes: the grid the student sees at the start. */
var ROWS = 100;
var COLS = 26;
var ALIGN_TO_UNIVER = {
	left: HorizontalAlign.LEFT,
	center: HorizontalAlign.CENTER,
	right: HorizontalAlign.RIGHT
};
var styleToUniver = (style) => ({
	...style.bold === true ? { bl: BooleanNumber.TRUE } : {},
	...style.italic === true ? { it: BooleanNumber.TRUE } : {},
	...style.underline === true ? { ul: { s: BooleanNumber.TRUE } } : {},
	...style.strike === true ? { st: { s: BooleanNumber.TRUE } } : {},
	...style.color === void 0 ? {} : { cl: { rgb: style.color } },
	...style.fill === void 0 ? {} : { bg: { rgb: style.fill } },
	...style.align === void 0 ? {} : { ht: ALIGN_TO_UNIVER[style.align] },
	...style.wrap === true ? { tb: WrapStrategy.WRAP } : {},
	...style.fontSize === void 0 ? {} : { fs: style.fontSize },
	...style.format === void 0 ? {} : { n: { pattern: style.format } }
});
/** Univer writes colors as `#RGB`, `#RRGGBB` or `rgb(r,g,b)`; goals compare `#rrggbb`. */
var normalizeColor = (color) => {
	if (typeof color !== "string") return void 0;
	const c = color.trim().toLowerCase();
	const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(c);
	if (short !== null) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
	if (/^#[0-9a-f]{6}$/.test(c)) return c;
	const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
	if (rgb === null) return void 0;
	return `#${[
		rgb[1],
		rgb[2],
		rgb[3]
	].map((n) => Math.min(255, Number(n)).toString(16).padStart(2, "0")).join("")}`;
};
var ALIGN_FROM_UNIVER = {
	[HorizontalAlign.LEFT]: "left",
	[HorizontalAlign.CENTER]: "center",
	[HorizontalAlign.RIGHT]: "right"
};
/** Univer style → our style; only what is set. */
var styleFromUniver = (s) => {
	if (s === null || s === void 0) return void 0;
	const color = normalizeColor(s.cl?.rgb);
	const fill = normalizeColor(s.bg?.rgb);
	const align = s.ht === null || s.ht === void 0 ? void 0 : ALIGN_FROM_UNIVER[s.ht];
	const style = {
		...s.bl === BooleanNumber.TRUE ? { bold: true } : {},
		...s.it === BooleanNumber.TRUE ? { italic: true } : {},
		...s.ul?.s === BooleanNumber.TRUE ? { underline: true } : {},
		...s.st?.s === BooleanNumber.TRUE ? { strike: true } : {},
		...color === void 0 ? {} : { color },
		...fill === void 0 ? {} : { fill },
		...align === void 0 ? {} : { align },
		...s.tb === WrapStrategy.WRAP ? { wrap: true } : {},
		...typeof s.fs === "number" ? { fontSize: s.fs } : {},
		...typeof s.n?.pattern === "string" && s.n.pattern !== "" ? { format: s.n.pattern } : {}
	};
	return Object.keys(style).length === 0 ? void 0 : style;
};
var cellToUniver = (input, style) => {
	const s = style === void 0 ? {} : { s: styleToUniver(style) };
	if (isFormula(input)) return {
		f: input,
		...s
	};
	if (typeof input === "number") return {
		v: input,
		t: CellValueType.NUMBER,
		...s
	};
	if (typeof input === "boolean") return {
		v: input,
		t: CellValueType.BOOLEAN,
		...s
	};
	return input === "" ? s : {
		v: input,
		t: CellValueType.STRING,
		...s
	};
};
/** Sheet ids are positions: `s1`, `s2`. Names stay as the student set them. */
var sheetId = (index) => `s${index + 1}`;
/** Our workbook → the data Univer opens. */
var toUniverData = (workbook, id = "edu-sheets") => {
	const sheets = workbook.sheets.map((sheet, index) => {
		const cellData = {};
		let rows = ROWS;
		let cols = COLS;
		for (const [address, cell] of Object.entries(sheet.cells)) {
			const pos = parseCell(address);
			if (pos === null) continue;
			const row = cellData[pos.row] ??= {};
			row[pos.col] = cellToUniver(cell.input, cell.style);
			rows = Math.max(rows, pos.row + 1);
			cols = Math.max(cols, pos.col + 1);
		}
		const columnData = Object.fromEntries(Object.entries(sheet.widths ?? {}).map(([col, w]) => [colIndex(col), { w }]));
		return {
			id: sheetId(index),
			name: sheet.name,
			cellData,
			columnData,
			rowCount: rows,
			columnCount: cols
		};
	});
	return {
		id,
		name: "Таблиця",
		sheetOrder: sheets.map((s) => s.id),
		sheets: Object.fromEntries(sheets.map((s) => [s.id, s]))
	};
};
export { parseCell as C, functionsIn as S, compute as _, ANY as a, colIndex as b, checkGoals as c, DEFAULT_SHEET as d, LIMITS as f, withInputs as g, parseWorkbook as h, toUniverData as i, describeGoal as l, isFormula as m, styleFromUniver as n, DEFAULT_WIDTH as o, buildWorkbook as p, styleToUniver as r, allMet as s, normalizeColor as t, formatValue as u, cellName as v, refsIn as w, colName as x, cellsOf as y };
