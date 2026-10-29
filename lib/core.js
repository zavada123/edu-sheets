import { C as parseCell, S as functionsIn, _ as compute, a as ANY, b as colIndex, c as checkGoals, d as DEFAULT_SHEET, f as LIMITS, g as withInputs, h as parseWorkbook, i as toUniverData, l as describeGoal, m as isFormula, n as styleFromUniver, o as DEFAULT_WIDTH, p as buildWorkbook, r as styleToUniver, s as allMet, t as normalizeColor, u as formatValue, v as cellName, w as refsIn, x as colName, y as cellsOf } from "./univer-data-B7OObZVX.js";
// src/core/grade.ts
/**
* Grades a handed-in workbook on the server: every formula is computed again here,
* so values sent by the page are never trusted.
*/
var grade = async (scenario, answer) => {
	const final = parseWorkbook(answer);
	if (final === null) return { status: "invalid" };
	const results = await checkGoals(buildWorkbook(scenario.start), final, scenario.goals);
	return {
		status: "checked",
		solved: allMet(results),
		results
	};
};
var scenarios = [
	{
		id: "g6-fair-cookies",
		grade: 6,
		title: "Печиво для ярмарку",
		task: [
			"У стовпці D порахуй вартість кожного виду печива: ціна × кількість.",
			"У клітинку D2 запиши формулу =B2*C2 і натисни Enter. Так само заповни D3 і D4.",
			"У клітинці D5 порахуй, скільки коштує все печиво разом."
		],
		start: [{
			cells: {
				A1: {
					input: "Печиво",
					style: { bold: true }
				},
				B1: {
					input: "Ціна, грн",
					style: { bold: true }
				},
				C1: {
					input: "Кількість",
					style: { bold: true }
				},
				D1: {
					input: "Вартість, грн",
					style: { bold: true }
				},
				A2: "Вівсяне",
				B2: 12,
				C2: 6,
				A3: "Шоколадне",
				B3: 15,
				C3: 4,
				A4: "Пряник",
				B4: 20,
				C4: 3,
				A5: {
					input: "Разом",
					style: { bold: true }
				}
			},
			widths: {
				A: 120,
				D: 110
			}
		}],
		goals: [
			{
				type: "formula",
				cells: "D2:D4",
				text: "У D2:D4 формули, а не готові числа"
			},
			{
				type: "value",
				cells: "D2:D4",
				equals: [
					72,
					60,
					60
				],
				text: "Вартість кожного печива правильна"
			},
			{
				type: "recalc",
				cells: "D2",
				set: { B2: 10 },
				equals: 60,
				text: "Якщо змінити ціну, вартість перерахується сама"
			},
			{
				type: "formula",
				cells: "D5"
			},
			{
				type: "value",
				cells: "D5",
				equals: 192,
				text: "Загальна вартість у D5 правильна"
			}
		]
	},
	{
		id: "g6-reading-marathon",
		grade: 6,
		title: "Читацький марафон",
		task: [
			"У клітинках A2:A8 мають бути номери днів від 1 до 7. Введи 1 і 2, виділи обидві клітинки й потягни маркер заповнення вниз.",
			"Зроби заголовки A1:C1 жирними, залий їх будь-яким кольором і вирівняй по центру.",
			"Розшир стовпець B, щоб назви книжок було видно повністю."
		],
		start: [{ cells: {
			A1: "День",
			B1: "Книжка",
			C1: "Сторінок",
			B2: "Всеволод Нестайко. Тореадори з Васюківки",
			C2: 24,
			C3: 31,
			C4: 18,
			C5: 40,
			C6: 27,
			C7: 35,
			C8: 22
		} }],
		goals: [
			{
				type: "value",
				cells: "A2:A8",
				equals: [
					1,
					2,
					3,
					4,
					5,
					6,
					7
				],
				text: "Дні пронумеровано від 1 до 7"
			},
			{
				type: "style",
				cells: "A1:C1",
				style: {
					bold: true,
					fill: "*",
					align: "center"
				}
			},
			{
				type: "width",
				column: "B",
				min: 250
			}
		]
	},
	{
		id: "g6-hike-shopping",
		grade: 6,
		title: "Покупки для походу",
		task: [
			"У D2 запиши формулу вартості: ціна × кількість.",
			"Скопіюй її в D3:D6: потягни маркер заповнення (квадратик у куті клітинки) вниз.",
			"У D7 порахуй загальну вартість функцією SUM.",
			"У B8 знайди найвищу ціну функцією MAX."
		],
		start: [{
			cells: {
				A1: {
					input: "Товар",
					style: { bold: true }
				},
				B1: {
					input: "Ціна, грн",
					style: { bold: true }
				},
				C1: {
					input: "Кількість",
					style: { bold: true }
				},
				D1: {
					input: "Вартість, грн",
					style: { bold: true }
				},
				A2: "Хліб",
				B2: 28,
				C2: 3,
				A3: "Сир",
				B3: 95,
				C3: 2,
				A4: "Яблука",
				B4: 32,
				C4: 4,
				A5: "Вода",
				B5: 18,
				C5: 6,
				A6: "Печиво",
				B6: 41,
				C6: 2,
				A7: {
					input: "Разом",
					style: { bold: true }
				},
				A8: "Найвища ціна"
			},
			widths: {
				A: 120,
				D: 110
			}
		}],
		goals: [
			{
				type: "formula",
				cells: "D2:D6",
				text: "У D2:D6 формули"
			},
			{
				type: "value",
				cells: "D2:D6",
				equals: [
					84,
					190,
					128,
					108,
					82
				],
				text: "Вартість кожного товару правильна"
			},
			{
				type: "formula",
				cells: "D7",
				functions: ["SUM"]
			},
			{
				type: "value",
				cells: "D7",
				equals: 592
			},
			{
				type: "recalc",
				cells: "D7",
				set: { C3: 1 },
				equals: 497,
				text: "Сума перераховується, коли змінюється кількість"
			},
			{
				type: "formula",
				cells: "B8",
				functions: ["MAX"]
			},
			{
				type: "value",
				cells: "B8",
				equals: 95
			}
		]
	},
	{
		id: "g8-trip-budget",
		grade: 8,
		title: "Кошторис поїздки в Карпати",
		task: [
			"Ціни подано в євро, курс — у клітинці B1.",
			"У C4 запиши формулу ціни в гривнях так, щоб курс брався завжди з B1: =B4*$B$1.",
			"Скопіюй формулу в C5:C7.",
			"У C8 порахуй загальну суму."
		],
		start: [{
			cells: {
				A1: "Курс євро, грн",
				B1: 45,
				A3: {
					input: "Витрати",
					style: { bold: true }
				},
				B3: {
					input: "Євро",
					style: { bold: true }
				},
				C3: {
					input: "Гривні",
					style: { bold: true }
				},
				A4: "Проживання",
				B4: 60,
				A5: "Канатна дорога",
				B5: 12,
				A6: "Екскурсія",
				B6: 8,
				A7: "Харчування",
				B7: 35,
				A8: {
					input: "Разом",
					style: { bold: true }
				}
			},
			widths: { A: 140 }
		}],
		goals: [
			{
				type: "formula",
				cells: "C4:C7"
			},
			{
				type: "value",
				cells: "C4:C7",
				equals: [
					2700,
					540,
					360,
					1575
				],
				text: "Ціни в гривнях правильні"
			},
			{
				type: "recalc",
				cells: "C4:C7",
				set: { B1: 50 },
				equals: [
					3e3,
					600,
					400,
					1750
				],
				text: "Якщо змінити курс у B1, усі ціни перерахуються"
			},
			{
				type: "formula",
				cells: "C8",
				functions: ["SUM"]
			},
			{
				type: "value",
				cells: "C8",
				equals: 5175
			}
		]
	},
	{
		id: "g8-steps-if",
		grade: 8,
		title: "Кроковий челендж",
		task: [
			"Норма — 8000 кроків на день.",
			"У C2 запиши формулу з функцією IF: «так», якщо кроків не менше за норму, інакше «ні». Наприклад: =IF(B2>=8000;\"так\";\"ні\").",
			"Скопіюй формулу в C3:C8.",
			"У B9 порахуй середню кількість кроків функцією AVERAGE."
		],
		start: [{
			cells: {
				A1: {
					input: "День",
					style: { bold: true }
				},
				B1: {
					input: "Кроки",
					style: { bold: true }
				},
				C1: {
					input: "Норма?",
					style: { bold: true }
				},
				A2: "Понеділок",
				B2: 8450,
				A3: "Вівторок",
				B3: 6200,
				A4: "Середа",
				B4: 8e3,
				A5: "Четвер",
				B5: 9100,
				A6: "П'ятниця",
				B6: 7300,
				A7: "Субота",
				B7: 12050,
				A8: "Неділя",
				B8: 5400,
				A9: "Середнє"
			},
			widths: { A: 110 }
		}],
		goals: [
			{
				type: "formula",
				cells: "C2:C8",
				functions: ["IF"]
			},
			{
				type: "value",
				cells: "C2:C8",
				equals: [
					"так",
					"ні",
					"так",
					"так",
					"ні",
					"так",
					"ні"
				],
				text: "Для кожного дня правильна відповідь"
			},
			{
				type: "recalc",
				cells: "C3",
				set: { B3: 8e3 },
				equals: "так",
				text: "Рівно 8000 кроків теж виконує норму"
			},
			{
				type: "formula",
				cells: "B9",
				functions: ["AVERAGE"]
			},
			{
				type: "value",
				cells: "B9",
				equals: 8071.428571428572,
				tolerance: .01
			}
		]
	},
	{
		id: "g8-sports-sort",
		grade: 8,
		title: "Результати стрибків",
		task: [
			"Упорядкуй таблицю за результатом від найбільшого до найменшого.",
			"Клацни будь-яку клітинку зі стрибком у стовпці C.",
			"Відкрий вкладку «Дані», кнопку сортування і вибери «За спаданням (уся таблиця)».",
			"Рядки мають переміщуватися цілими: ім'я разом зі своїм результатом."
		],
		start: [{
			cells: {
				A1: {
					input: "Учень",
					style: { bold: true }
				},
				B1: {
					input: "Клас",
					style: { bold: true }
				},
				C1: {
					input: "Стрибок, см",
					style: { bold: true }
				},
				A2: "Остап",
				B2: "8-А",
				C2: 172,
				A3: "Соломія",
				B3: "8-Б",
				C3: 181,
				A4: "Марко",
				B4: "8-А",
				C4: 165,
				A5: "Дарина",
				B5: "8-В",
				C5: 190,
				A6: "Богдан",
				B6: "8-Б",
				C6: 158,
				A7: "Ярина",
				B7: "8-В",
				C7: 176
			},
			widths: { A: 110 }
		}],
		goals: [{
			type: "sorted",
			range: "A2:C7",
			by: "C",
			order: "desc"
		}]
	}
];
// src/scenarios/solutions.ts
/** What a student types to solve each scenario (first sheet), by scenario id. Tests check that it meets every goal. */
var referenceInputs = {
	"g6-fair-cookies": {
		D2: "=B2*C2",
		D3: "=B3*C3",
		D4: "=B4*C4",
		D5: "=SUM(D2:D4)"
	},
	"g6-reading-marathon": {
		A2: 1,
		A3: 2,
		A4: 3,
		A5: 4,
		A6: 5,
		A7: 6,
		A8: 7
	},
	"g6-hike-shopping": {
		D2: "=B2*C2",
		D3: "=B3*C3",
		D4: "=B4*C4",
		D5: "=B5*C5",
		D6: "=B6*C6",
		D7: "=SUM(D2:D6)",
		B8: "=MAX(B2:B6)"
	},
	"g8-trip-budget": {
		C4: "=B4*$B$1",
		C5: "=B5*$B$1",
		C6: "=B6*$B$1",
		C7: "=B7*$B$1",
		C8: "=SUM(C4:C7)"
	},
	"g8-steps-if": {
		C2: "=IF(B2>=8000,\"так\",\"ні\")",
		C3: "=IF(B3>=8000,\"так\",\"ні\")",
		C4: "=IF(B4>=8000,\"так\",\"ні\")",
		C5: "=IF(B5>=8000,\"так\",\"ні\")",
		C6: "=IF(B6>=8000,\"так\",\"ні\")",
		C7: "=IF(B7>=8000,\"так\",\"ні\")",
		C8: "=IF(B8>=8000,\"так\",\"ні\")",
		B9: "=AVERAGE(B2:B8)"
	},
	"g8-sports-sort": {
		A2: "Дарина",
		B2: "8-В",
		C2: 190,
		A3: "Соломія",
		B3: "8-Б",
		C3: 181,
		A4: "Ярина",
		B4: "8-В",
		C4: 176,
		A5: "Остап",
		B5: "8-А",
		C5: 172,
		A6: "Марко",
		B6: "8-А",
		C6: 165,
		A7: "Богдан",
		B7: "8-Б",
		C7: 158
	}
};
/** Formatting and widths a solution needs besides the typed inputs, by scenario id. */
var referenceFormatting = { "g6-reading-marathon": {
	styles: Object.fromEntries([
		"A1",
		"B1",
		"C1"
	].map((a) => [a, {
		bold: true,
		fill: "#fff2cc",
		align: "center"
	}])),
	widths: { B: 300 }
} };
/** The table a student hands in when they solve the scenario: an example answer for authors and tests. */
var referenceWorkbook = (scenario) => {
	const book = withInputs(buildWorkbook(scenario.start), void 0, referenceInputs[scenario.id] ?? {});
	const extra = referenceFormatting[scenario.id];
	const [first, ...rest] = book.sheets;
	if (extra === void 0 || first === void 0) return book;
	const cells = { ...first.cells };
	for (const [address, style] of Object.entries(extra.styles)) cells[address] = {
		input: cells[address]?.input ?? "",
		style: {
			...cells[address]?.style,
			...style
		}
	};
	return { sheets: [{
		...first,
		cells,
		widths: {
			...first.widths,
			...extra.widths
		}
	}, ...rest] };
};
export { ANY, DEFAULT_SHEET, DEFAULT_WIDTH, LIMITS, allMet, buildWorkbook, cellName, cellsOf, checkGoals, colIndex, colName, compute, describeGoal, formatValue, functionsIn, grade, isFormula, normalizeColor, parseCell, parseWorkbook, referenceInputs, referenceWorkbook, refsIn, scenarios, styleFromUniver, styleToUniver, toUniverData, withInputs };
