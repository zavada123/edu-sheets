import { c as checkGoals, i as toUniverData, n as styleFromUniver, p as buildWorkbook, v as cellName, x as colName } from "./univer-data-B7OObZVX.js";
import { CommandType, LOCALE_META } from "@univerjs/core";
import { UniverSheetsConditionalFormattingPreset } from "@univerjs/preset-sheets-conditional-formatting";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import { UniverSheetsFilterPreset } from "@univerjs/preset-sheets-filter";
import { UniverSheetsSortPreset } from "@univerjs/preset-sheets-sort";
import { createUniver, mergeLocales } from "@univerjs/presets";
import { useCallback, useEffect, useRef, useState } from "react";
import cfEnUS from "@univerjs/preset-sheets-conditional-formatting/locales/en-US";
import coreEnUS from "@univerjs/preset-sheets-core/locales/en-US";
import filterEnUS from "@univerjs/preset-sheets-filter/locales/en-US";
import sortEnUS from "@univerjs/preset-sheets-sort/locales/en-US";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "@univerjs/preset-sheets-core/lib/index.css";
import "@univerjs/preset-sheets-sort/lib/index.css";
import "@univerjs/preset-sheets-filter/lib/index.css";
import "@univerjs/preset-sheets-conditional-formatting/lib/index.css";
// src/ui/locale/uk-UA.ts
/**
* Ukrainian for the Univer interface, with the words of the Ukrainian Excel the textbooks use: клітинка, аркуш, межі.
* Keys are paths in Univer's locale tree. A key that is missing here stays in English.
* Not translated on purpose: function help (English names, as in Excel), protection and sharing (the trainer has no users),
* the document editor (only the sheet is used).
*/
var ukFlat = {
	"design.Accessibility.closeBadge": "Закрити позначку",
	"design.Accessibility.close": "Закрити",
	"design.Accessibility.menu": "Меню",
	"design.Accessibility.previous": "Попереднє",
	"design.Accessibility.next": "Наступне",
	"design.Accessibility.imageGallery": "Галерея зображень",
	"design.Accessibility.image": "Зображення {0} з {1}",
	"design.Accessibility.zoomIn": "Збільшити",
	"design.Accessibility.zoomOut": "Зменшити",
	"design.Accessibility.resetZoom": "Скинути масштаб",
	"design.Accessibility.increment": "Збільшити значення",
	"design.Accessibility.decrement": "Зменшити значення",
	"design.Confirm.cancel": "Скасувати",
	"design.Confirm.confirm": "ОК",
	"design.CascaderList.empty": "Немає",
	"design.Calendar.year": "Рік",
	"design.Calendar.weekDays.0": "Нд",
	"design.Calendar.weekDays.1": "Пн",
	"design.Calendar.weekDays.2": "Вт",
	"design.Calendar.weekDays.3": "Ср",
	"design.Calendar.weekDays.4": "Чт",
	"design.Calendar.weekDays.5": "Пт",
	"design.Calendar.weekDays.6": "Сб",
	"design.Calendar.months.0": "Січень",
	"design.Calendar.months.1": "Лютий",
	"design.Calendar.months.2": "Березень",
	"design.Calendar.months.3": "Квітень",
	"design.Calendar.months.4": "Травень",
	"design.Calendar.months.5": "Червень",
	"design.Calendar.months.6": "Липень",
	"design.Calendar.months.7": "Серпень",
	"design.Calendar.months.8": "Вересень",
	"design.Calendar.months.9": "Жовтень",
	"design.Calendar.months.10": "Листопад",
	"design.Calendar.months.11": "Грудень",
	"design.Calendar.ariaLabels.previousMonth": "Попередній місяць",
	"design.Calendar.ariaLabels.nextMonth": "Наступний місяць",
	"design.Calendar.ariaLabels.selectYear": "Вибрати рік",
	"design.Calendar.ariaLabels.selectMonth": "Вибрати місяць",
	"design.ColorPicker.more": "Інші кольори",
	"design.ColorPicker.cancel": "Скасувати",
	"design.ColorPicker.confirm": "ОК",
	"design.GradientColorPicker.linear": "лінійний",
	"design.GradientColorPicker.radial": "радіальний",
	"design.GradientColorPicker.angular": "кутовий",
	"design.GradientColorPicker.diamond": "ромбоподібний",
	"design.GradientColorPicker.offset": "зсув",
	"design.GradientColorPicker.angle": "кут",
	"design.GradientColorPicker.delete": "видалити",
	"design.GradientColorPicker.transparency": "прозорість",
	"docs-ui.pasteOptions.special": "Спеціальне вставлення",
	"docs-ui.pasteOptions.title": "Параметри вставлення",
	"docs-ui.pasteOptions.source": "Зберегти початкове форматування",
	"docs-ui.pasteOptions.destination": "Використати форматування місця вставлення",
	"docs-ui.pasteOptions.text": "Зберегти лише текст",
	"docs-ui.pasteOptions.useKeyboard": "Немає доступу до буфера обміну. Встав за допомогою {0}, а потім зміни формат у параметрах вставлення.",
	"docs-ui.pasteOptions.useSystemPaste": "Немає доступу до буфера обміну. Встав засобами пристрою або клавіатури, а потім зміни формат у параметрах вставлення.",
	"docs-ui.pasteOptions.failed": "Не вдалося змінити формат вставлення.",
	"sheets.tabs.sheetCopy": "(Копія{0})",
	"sheets.tabs.sheet": "Аркуш",
	"sheets.info.overlappingSelections": "Цю команду не можна застосувати до виділень, що перетинаються",
	"sheets.info.acrossMergedCell": "Через об'єднану клітинку",
	"sheets.info.partOfCell": "Виділено лише частину об'єднаної клітинки",
	"sheets.info.hideSheet": "Якщо приховати цей аркуш, не залишиться жодного видимого аркуша",
	"sheets.definedName.nameEmpty": "Ім'я не може бути порожнім",
	"sheets.definedName.nameDuplicate": "Таке ім'я вже є",
	"sheets.definedName.nameInvalid": "Неприпустиме ім'я",
	"sheets.definedName.nameSheetConflict": "Ім'я збігається з назвою аркуша",
	"sheets.definedName.formulaOrRefStringEmpty": "Формула або посилання не може бути порожнім",
	"sheets.definedName.nameConflict": "Ім'я збігається з назвою функції",
	"sheets.definedName.defaultName": "Ім'я",
	"sheets.autoFill.copy": "Копіювати клітинки",
	"sheets.autoFill.series": "Заповнити ряд",
	"sheets.autoFill.formatOnly": "Лише формат",
	"sheets.autoFill.noFormat": "Без форматування",
	"sheets.merge.confirm.title": "Після об'єднання залишиться лише значення верхньої лівої клітинки, інші буде видалено. Продовжити?",
	"sheets.merge.confirm.cancel": "Скасувати об'єднання",
	"sheets.merge.confirm.confirm": "Об'єднати",
	"sheets.merge.confirm.warning": "Попередження",
	"sheets-formula.progress.analyzing": "Аналіз формул…",
	"sheets-formula.progress.calculating": "Обчислення формул…",
	"sheets-formula.progress.array-analysis": "Аналіз формул масиву…",
	"sheets-formula.progress.array-calculation": "Обчислення формул масиву…",
	"sheets-formula.progress.done": "Готово",
	"sheets-formula-ui.calculation.circularTitle": "Циклічне посилання",
	"sheets-formula-ui.calculation.title": "Параметри обчислень",
	"sheets-formula-ui.calculation.enable": "Увімкнути ітеративні обчислення",
	"sheets-formula-ui.calculation.iterations": "Найбільше ітерацій (1–{0})",
	"sheets-formula-ui.calculation.change": "Найбільша зміна",
	"sheets-formula-ui.calculation.workbook": "Параметри стосуються поточної книги.",
	"sheets-formula-ui.calculation.invalidIterations": "Кількість ітерацій має бути цілим числом від 1 до {0}.",
	"sheets-formula-ui.calculation.invalidChange": "Найбільша зміна має бути додатним числом.",
	"sheets-formula-ui.calculation.cancel": "Скасувати",
	"sheets-formula-ui.calculation.confirm": "ОК",
	"sheets-formula-ui.calculation.circular": "Формула посилається сама на себе (циклічне посилання). Перевір адреси у формулі.",
	"sheets-formula-ui.calculation.action": "Ітеративні обчислення",
	"sheets-formula-ui.shortcut.quick-sum": "Автосума",
	"sheets-formula-ui.insert.tooltip": "Функції",
	"sheets-formula-ui.insert.common": "Часто вживані функції",
	"sheets-formula-ui.prompt.helpExample": "ПРИКЛАД",
	"sheets-formula-ui.prompt.helpAbstract": "ОПИС",
	"sheets-formula-ui.prompt.required": "Обов'язковий.",
	"sheets-formula-ui.prompt.optional": "Необов'язковий.",
	"sheets-formula-ui.error.title": "Помилка",
	"sheets-formula-ui.error.divByZero": "Ділення на нуль",
	"sheets-formula-ui.error.name": "Невідоме ім'я: перевір назву функції або адресу",
	"sheets-formula-ui.error.value": "Неправильний тип значення: можливо, у клітинці текст замість числа",
	"sheets-formula-ui.error.num": "Помилка в числі",
	"sheets-formula-ui.error.na": "Значення недоступне",
	"sheets-formula-ui.error.cycle": "Циклічне посилання",
	"sheets-formula-ui.error.ref": "Неправильне посилання на клітинку",
	"sheets-formula-ui.error.spill": "Діапазон для результату не порожній",
	"sheets-formula-ui.error.calc": "Помилка обчислення",
	"sheets-formula-ui.error.error": "Помилка",
	"sheets-formula-ui.error.connect": "Отримання даних",
	"sheets-formula-ui.error.null": "Діапазони не перетинаються",
	"sheets-formula-ui.functionType.financial": "Фінансові",
	"sheets-formula-ui.functionType.date": "Дата й час",
	"sheets-formula-ui.functionType.math": "Математичні",
	"sheets-formula-ui.functionType.statistical": "Статистичні",
	"sheets-formula-ui.functionType.lookup": "Пошук і посилання",
	"sheets-formula-ui.functionType.database": "Бази даних",
	"sheets-formula-ui.functionType.text": "Текстові",
	"sheets-formula-ui.functionType.logical": "Логічні",
	"sheets-formula-ui.functionType.information": "Інформаційні",
	"sheets-formula-ui.functionType.engineering": "Інженерні",
	"sheets-formula-ui.functionType.cube": "Куб",
	"sheets-formula-ui.functionType.compatibility": "Сумісність",
	"sheets-formula-ui.functionType.web": "Веб",
	"sheets-formula-ui.functionType.array": "Масиви",
	"sheets-formula-ui.functionType.univer": "Univer",
	"sheets-formula-ui.functionType.user": "Користувацькі",
	"sheets-formula-ui.functionType.definedname": "Імена",
	"sheets-formula-ui.moreFunctions.confirm": "Вставити",
	"sheets-formula-ui.moreFunctions.prev": "Назад",
	"sheets-formula-ui.moreFunctions.next": "Далі",
	"sheets-formula-ui.moreFunctions.searchFunctionPlaceholder": "Пошук функції",
	"sheets-formula-ui.moreFunctions.allFunctions": "Усі функції",
	"sheets-formula-ui.moreFunctions.syntax": "СИНТАКСИС",
	"sheets-formula-ui.mobileFunction.title": "Вставити функцію",
	"sheets-formula-ui.mobileFunction.recommended": "Рекомендовані",
	"sheets-formula-ui.mobileFunction.recent": "Нещодавні",
	"sheets-formula-ui.mobileFunction.details": "Докладніше",
	"sheets-formula-ui.mobileFunction.insert": "Вставити функцію",
	"sheets-formula-ui.mobileFunction.empty": "Функцій немає",
	"sheets-formula-ui.mobileFunction.close": "Закрити",
	"sheets-formula-ui.operation.copyFormulaOnly": "Копіювати лише формулу",
	"sheets-formula-ui.operation.pasteFormula": "Вставити формулу",
	"sheets-formula-ui.rangeSelector.title": "Вибери діапазон даних",
	"sheets-formula-ui.rangeSelector.addAnotherRange": "Додати діапазон",
	"sheets-formula-ui.rangeSelector.buttonTooltip": "Вибрати діапазон даних",
	"sheets-formula-ui.rangeSelector.placeHolder": "Виділи діапазон або введи його адресу.",
	"sheets-formula-ui.rangeSelector.confirm": "ОК",
	"sheets-formula-ui.rangeSelector.cancel": "Скасувати",
	"sheets-numfmt-ui.title": "Формат числа",
	"sheets-numfmt-ui.numfmtType": "Числові формати",
	"sheets-numfmt-ui.cancel": "Скасувати",
	"sheets-numfmt-ui.confirm": "ОК",
	"sheets-numfmt-ui.general": "Загальний",
	"sheets-numfmt-ui.accounting": "Фінансовий",
	"sheets-numfmt-ui.text": "Текстовий",
	"sheets-numfmt-ui.number": "Числовий",
	"sheets-numfmt-ui.percent": "Відсотковий",
	"sheets-numfmt-ui.scientific": "Експоненційний",
	"sheets-numfmt-ui.currency": "Грошовий",
	"sheets-numfmt-ui.date": "Дата",
	"sheets-numfmt-ui.time": "Час",
	"sheets-numfmt-ui.thousandthPercentile": "Розділювач груп розрядів",
	"sheets-numfmt-ui.dateTime": "Дата й час",
	"sheets-numfmt-ui.decimalLength": "Кількість десяткових знаків",
	"sheets-numfmt-ui.currencyType": "Позначення валюти",
	"sheets-numfmt-ui.moreFmt": "Інші формати",
	"sheets-numfmt-ui.financialValue": "Фінансове значення",
	"sheets-numfmt-ui.roundingCurrency": "Округлення валюти",
	"sheets-numfmt-ui.timeDuration": "Тривалість",
	"sheets-numfmt-ui.currencyDes": "Грошовий формат показує суми грошей. Фінансовий формат вирівнює значення в стовпці за десятковою комою.",
	"sheets-numfmt-ui.accountingDes": "Фінансовий формат вирівнює значення в стовпці за позначенням валюти й десятковою комою.",
	"sheets-numfmt-ui.dateType": "Вигляд дати",
	"sheets-numfmt-ui.dateDes": "Формат дати показує число як дату й час.",
	"sheets-numfmt-ui.negType": "Вигляд від'ємних чисел",
	"sheets-numfmt-ui.generalDes": "Загальний формат не задає особливого вигляду числа.",
	"sheets-numfmt-ui.thousandthPercentileDes": "Числовий формат показує звичайні числа. Для грошових сум є грошовий і фінансовий формати.",
	"sheets-numfmt-ui.addDecimal": "Збільшити розрядність",
	"sheets-numfmt-ui.subtractDecimal": "Зменшити розрядність",
	"sheets-numfmt-ui.customFormat": "Власний формат",
	"sheets-numfmt-ui.customFormatDes": "Створи власний числовий формат на основі наявного.",
	"sheets-numfmt-ui.info.error": "Помилка",
	"sheets-numfmt-ui.info.forceStringInfo": "Число збережено як текст",
	"sheets-numfmt-ui.info.convertToNumber": "Перетворити на число",
	"sheets-ui.toolbar.formatPainter": "Формат за зразком",
	"sheets-ui.toolbar.font": "Шрифт",
	"sheets-ui.toolbar.fontSize": "Розмір шрифту",
	"sheets-ui.toolbar.fontSizeIncrease": "Збільшити розмір шрифту",
	"sheets-ui.toolbar.fontSizeDecrease": "Зменшити розмір шрифту",
	"sheets-ui.toolbar.bold": "Жирний",
	"sheets-ui.toolbar.italic": "Курсив",
	"sheets-ui.toolbar.strikethrough": "Закреслений",
	"sheets-ui.toolbar.underline": "Підкреслений",
	"sheets-ui.toolbar.textColor.main": "Колір тексту",
	"sheets-ui.toolbar.resetColor": "Скинути",
	"sheets-ui.toolbar.fillColor.main": "Колір заливки",
	"sheets-ui.toolbar.border.main": "Межі",
	"sheets-ui.toolbar.mergeCell.main": "Об'єднати клітинки",
	"sheets-ui.toolbar.horizontalAlignMode.main": "Вирівнювання по горизонталі",
	"sheets-ui.toolbar.verticalAlignMode.main": "Вирівнювання по вертикалі",
	"sheets-ui.toolbar.textWrapMode.main": "Перенесення тексту",
	"sheets-ui.toolbar.shrinkToFit": "Автодобір ширини",
	"sheets-ui.toolbar.textRotateMode.main": "Орієнтація тексту",
	"sheets-ui.toolbar.toggleGridlines": "Сітка",
	"sheets-ui.toolbar.zoom": "Масштаб",
	"sheets-ui.toolbar.fullscreen": "На весь екран",
	"sheets-ui.align.left": "Ліворуч",
	"sheets-ui.align.center": "По центру",
	"sheets-ui.align.right": "Праворуч",
	"sheets-ui.align.top": "Угорі",
	"sheets-ui.align.middle": "Посередині",
	"sheets-ui.align.bottom": "Унизу",
	"sheets-ui.button.confirm": "ОК",
	"sheets-ui.button.cancel": "Скасувати",
	"sheets-ui.borderStyle.thin": "Тонка",
	"sheets-ui.borderStyle.hair": "Найтонша",
	"sheets-ui.borderStyle.dotted": "Крапкова",
	"sheets-ui.borderStyle.dashed": "Штрихова",
	"sheets-ui.borderStyle.dashDot": "Штрихпунктирна",
	"sheets-ui.borderStyle.dashDotDot": "Штрихпунктирна з двома крапками",
	"sheets-ui.borderStyle.medium": "Середня",
	"sheets-ui.borderStyle.mediumDashed": "Середня штрихова",
	"sheets-ui.borderStyle.mediumDashDot": "Середня штрихпунктирна",
	"sheets-ui.borderStyle.mediumDashDotDot": "Середня штрихпунктирна з двома крапками",
	"sheets-ui.borderStyle.thick": "Товста",
	"sheets-ui.borderStyle.double": "Подвійна",
	"sheets-ui.borderLine.borderTop": "Верхня межа",
	"sheets-ui.borderLine.borderBottom": "Нижня межа",
	"sheets-ui.borderLine.borderLeft": "Ліва межа",
	"sheets-ui.borderLine.borderRight": "Права межа",
	"sheets-ui.borderLine.borderNone": "Без меж",
	"sheets-ui.borderLine.borderAll": "Усі межі",
	"sheets-ui.borderLine.borderOutside": "Зовнішні межі",
	"sheets-ui.borderLine.borderInside": "Внутрішні межі",
	"sheets-ui.borderLine.borderHorizontal": "Горизонтальні межі",
	"sheets-ui.borderLine.borderVertical": "Вертикальні межі",
	"sheets-ui.borderLine.borderTlbr": "Діагональна межа вниз",
	"sheets-ui.borderLine.borderTlbcTlmr": "Подвійна діагональна межа вниз",
	"sheets-ui.borderLine.borderTlbrTlbcTlmr": "Потрійна діагональна межа вниз",
	"sheets-ui.borderLine.borderBlTr": "Діагональна межа вгору",
	"sheets-ui.borderLine.borderMltrBctr": "Подвійна діагональна межа вгору",
	"sheets-ui.merge.all": "Об'єднати все",
	"sheets-ui.merge.vertical": "Об'єднати по вертикалі",
	"sheets-ui.merge.horizontal": "Об'єднати по горизонталі",
	"sheets-ui.merge.cancel": "Скасувати об'єднання",
	"sheets-ui.merge.confirm.warning": "Попередження",
	"sheets-ui.merge.confirm.dismantleMergeCellWarning": "Це роз'єднає об'єднані клітинки. Продовжити?",
	"sheets-ui.filter.confirm.error": "Цю дію не можна виконати",
	"sheets-ui.filter.confirm.notAllowedToInsertRange": "Цю дію не можна виконати: у діапазоні є відфільтровані рядки.",
	"sheets-ui.textWrap.overflow": "Виходити за межі",
	"sheets-ui.textWrap.wrap": "Переносити",
	"sheets-ui.textWrap.clip": "Обрізати",
	"sheets-ui.textRotate.none": "Без повороту",
	"sheets-ui.textRotate.angleUp": "Нахилити вгору",
	"sheets-ui.textRotate.angleDown": "Нахилити вниз",
	"sheets-ui.textRotate.vertical": "Вертикально",
	"sheets-ui.textRotate.rotationUp": "Повернути вгору",
	"sheets-ui.textRotate.rotationDown": "Повернути вниз",
	"sheets-ui.mobile.insert": "Вставлення",
	"sheets-ui.mobile.operation": "Дії",
	"sheets-ui.mobile.style": "Формат",
	"sheets-ui.mobile.openTools": "Відкрити інструменти",
	"sheets-ui.mobile.closeTools": "Закрити інструменти",
	"sheets-ui.mobile.addSheet": "Додати аркуш",
	"sheets-ui.mobile.sheetMenu": "Меню аркуша",
	"sheets-ui.mobile.borderColor": "Колір меж",
	"sheets-ui.mobile.borderStyle": "Вигляд меж",
	"sheets-ui.mobile.recentColors": "Нещодавні кольори",
	"sheets-ui.mobile.customColor": "Свій колір",
	"sheets-ui.mobile.applyColor": "Застосувати колір",
	"sheets-ui.mobile.back": "Назад",
	"sheets-ui.mobile.formula": "Формула",
	"sheets-ui.mobile.collapseEditor": "Згорнути редактор",
	"sheets-ui.mobile.confirm": "ОК",
	"sheets-ui.mobile.customFormatDescription": "Створи власний числовий формат на основі наявного.",
	"sheets-ui.sheetConfig.sheetTabs": "Ярлики аркушів",
	"sheets-ui.sheetConfig.delete": "Видалити",
	"sheets-ui.sheetConfig.copy": "Копіювати",
	"sheets-ui.sheetConfig.rename": "Перейменувати",
	"sheets-ui.sheetConfig.changeColor": "Колір ярлика",
	"sheets-ui.sheetConfig.hide": "Приховати",
	"sheets-ui.sheetConfig.unhide": "Показати",
	"sheets-ui.sheetConfig.sheetNameErrorTitle": "Помилка",
	"sheets-ui.sheetConfig.sheetNameSpecCharError": "Назва має бути не довшою за 31 символ, не може починатися чи закінчуватися знаком ' і не може містити: [ ] : \\ ? * /",
	"sheets-ui.sheetConfig.sheetNameCannotIsEmptyError": "Назва аркуша не може бути порожньою.",
	"sheets-ui.sheetConfig.sheetNameAlreadyExistsError": "Аркуш із такою назвою вже є. Введи іншу назву.",
	"sheets-ui.sheetConfig.deleteSheet": "Видалити аркуш",
	"sheets-ui.sheetConfig.deleteSheetContent": "Видалити цей аркуш?",
	"sheets-ui.sheetConfig.deleteLargeSheetContent": "Видалений аркуш не можна буде відновити. Видалити його?",
	"sheets-ui.sheetConfig.addProtectSheet": "Захистити аркуш",
	"sheets-ui.sheetConfig.removeProtectSheet": "Зняти захист аркуша",
	"sheets-ui.sheetConfig.changeSheetPermission": "Змінити дозволи аркуша",
	"sheets-ui.sheetConfig.viewAllProtectArea": "Усі захищені області",
	"sheets-ui.rightClick.copy": "Копіювати",
	"sheets-ui.rightClick.cut": "Вирізати",
	"sheets-ui.rightClick.paste": "Вставити",
	"sheets-ui.rightClick.copySpecial": "Спеціальне копіювання",
	"sheets-ui.rightClick.pasteSpecial": "Спеціальне вставлення",
	"sheets-ui.rightClick.pasteValue": "Вставити лише значення",
	"sheets-ui.rightClick.pasteFormat": "Вставити лише формат",
	"sheets-ui.rightClick.pasteColWidth": "Вставити ширину стовпця",
	"sheets-ui.rightClick.pasteBesidesBorder": "Вставити без меж",
	"sheets-ui.rightClick.pasteFormula": "Вставити лише формулу",
	"sheets-ui.rightClick.insert": "Вставити",
	"sheets-ui.rightClick.insertRow": "Вставити рядок",
	"sheets-ui.rightClick.insertRowBefore": "Вставити рядок вище",
	"sheets-ui.rightClick.insertRowsAfter": "Вставити",
	"sheets-ui.rightClick.insertRowsAbove": "Вставити",
	"sheets-ui.rightClick.insertRowsAfterSuffix": "рядків нижче",
	"sheets-ui.rightClick.insertRowsAboveSuffix": "рядків вище",
	"sheets-ui.rightClick.insertColumn": "Вставити стовпець",
	"sheets-ui.rightClick.insertColumnBefore": "Вставити стовпець ліворуч",
	"sheets-ui.rightClick.insertColsLeft": "Вставити",
	"sheets-ui.rightClick.insertColsRight": "Вставити",
	"sheets-ui.rightClick.insertColsLeftSuffix": "стовпців ліворуч",
	"sheets-ui.rightClick.insertColsRightSuffix": "стовпців праворуч",
	"sheets-ui.rightClick.delete": "Видалити",
	"sheets-ui.rightClick.deleteSelectedRow": "Видалити рядок",
	"sheets-ui.rightClick.deleteSelectedColumn": "Видалити стовпець",
	"sheets-ui.rightClick.hideSelectedRow": "Приховати рядок",
	"sheets-ui.rightClick.showHideRow": "Показати приховані рядки",
	"sheets-ui.rightClick.rowHeight": "Висота рядка",
	"sheets-ui.rightClick.hideSelectedColumn": "Приховати стовпець",
	"sheets-ui.rightClick.showHideColumn": "Показати приховані стовпці",
	"sheets-ui.rightClick.columnWidth": "Ширина стовпця",
	"sheets-ui.rightClick.moveLeft": "Зі зсувом ліворуч",
	"sheets-ui.rightClick.moveUp": "Зі зсувом угору",
	"sheets-ui.rightClick.moveRight": "Зі зсувом праворуч",
	"sheets-ui.rightClick.moveDown": "Зі зсувом униз",
	"sheets-ui.rightClick.clearSelection": "Очистити",
	"sheets-ui.rightClick.clearContent": "Очистити вміст",
	"sheets-ui.rightClick.clearFormat": "Очистити формат",
	"sheets-ui.rightClick.clearAll": "Очистити все",
	"sheets-ui.rightClick.fitContent": "Автодобір за вмістом",
	"sheets-ui.rightClick.freeze": "Закріпити",
	"sheets-ui.rightClick.freezeCell": "Закріпити до активної клітинки (рядок {0}, стовпець {1})",
	"sheets-ui.rightClick.freezeCol": "Закріпити до стовпця {0}",
	"sheets-ui.rightClick.freezeRow": "Закріпити до рядка {0}",
	"sheets-ui.rightClick.freezeFirstCol": "Закріпити перший стовпець",
	"sheets-ui.rightClick.freezeFirstRow": "Закріпити перший рядок",
	"sheets-ui.rightClick.cancelFreeze": "Зняти закріплення",
	"sheets-ui.rightClick.deleteAllRowsAlert": "Не можна видалити всі рядки аркуша",
	"sheets-ui.rightClick.deleteAllColumnsAlert": "Не можна видалити всі стовпці аркуша",
	"sheets-ui.rightClick.hideAllRowsAlert": "Не можна приховати всі рядки аркуша",
	"sheets-ui.rightClick.hideAllColumnsAlert": "Не можна приховати всі стовпці аркуша",
	"sheets-ui.rightClick.protectRange": "Захистити діапазон",
	"sheets-ui.rightClick.editProtectRange": "Змінити захищений діапазон",
	"sheets-ui.rightClick.removeProtectRange": "Зняти захист діапазону",
	"sheets-ui.rightClick.turnOnProtectRange": "Увімкнути захист діапазону",
	"sheets-ui.rightClick.viewAllProtectArea": "Усі захищені області",
	"sheets-ui.rightClick.textToNumber": "Перетворити текст на число",
	"sheets-ui.info.problem": "Виникла проблема",
	"sheets-ui.info.error": "Помилка",
	"sheets-ui.info.forceStringInfo": "Число збережено як текст",
	"sheets-ui.info.convertToNumber": "Перетворити на число",
	"sheets-ui.info.overwriteCellContent": "У цих клітинках уже є дані, їх буде замінено. Продовжити?",
	"sheets-ui.clipboard.paste.exceedMaxCells": "Забагато клітинок для вставлення",
	"sheets-ui.clipboard.paste.overlappingMergedCells": "Місце вставлення перетинається з об'єднаними клітинками",
	"sheets-ui.clipboard.shortCutNotify.title": "Встав за допомогою клавіш Ctrl+V.",
	"sheets-ui.clipboard.shortCutNotify.useShortCutInstead": "Скопійовано вміст з Excel. Встав його клавішами Ctrl+V.",
	"sheets-ui.statusbar.sum": "Сума",
	"sheets-ui.statusbar.average": "Середнє",
	"sheets-ui.statusbar.min": "Мінімум",
	"sheets-ui.statusbar.max": "Максимум",
	"sheets-ui.statusbar.count": "Кількість чисел",
	"sheets-ui.statusbar.countA": "Кількість",
	"sheets-ui.shortcut.sheet-view": "Перегляд аркуша",
	"sheets-ui.shortcut.sheet-edit": "Редагування аркуша",
	"sheets-ui.shortcut.sheet.zoom-in": "Збільшити",
	"sheets-ui.shortcut.sheet.zoom-out": "Зменшити",
	"sheets-ui.shortcut.sheet.reset-zoom": "Скинути масштаб",
	"sheets-ui.shortcut.sheet.select-below-cell": "Клітинка нижче",
	"sheets-ui.shortcut.sheet.select-up-cell": "Клітинка вище",
	"sheets-ui.shortcut.sheet.select-left-cell": "Клітинка ліворуч",
	"sheets-ui.shortcut.sheet.select-right-cell": "Клітинка праворуч",
	"sheets-ui.shortcut.sheet.select-next-cell": "Наступна клітинка",
	"sheets-ui.shortcut.sheet.select-previous-cell": "Попередня клітинка",
	"sheets-ui.shortcut.sheet.select-up-value-cell": "Найближча заповнена клітинка вище",
	"sheets-ui.shortcut.sheet.select-below-value-cell": "Найближча заповнена клітинка нижче",
	"sheets-ui.shortcut.sheet.select-left-value-cell": "Найближча заповнена клітинка ліворуч",
	"sheets-ui.shortcut.sheet.select-right-value-cell": "Найближча заповнена клітинка праворуч",
	"sheets-ui.shortcut.sheet.expand-selection-down": "Розширити виділення вниз",
	"sheets-ui.shortcut.sheet.expand-selection-up": "Розширити виділення вгору",
	"sheets-ui.shortcut.sheet.expand-selection-left": "Розширити виділення ліворуч",
	"sheets-ui.shortcut.sheet.expand-selection-right": "Розширити виділення праворуч",
	"sheets-ui.shortcut.sheet.expand-selection-to-left-gap": "Розширити виділення ліворуч до порожньої клітинки",
	"sheets-ui.shortcut.sheet.expand-selection-to-below-gap": "Розширити виділення вниз до порожньої клітинки",
	"sheets-ui.shortcut.sheet.expand-selection-to-right-gap": "Розширити виділення праворуч до порожньої клітинки",
	"sheets-ui.shortcut.sheet.expand-selection-to-up-gap": "Розширити виділення вгору до порожньої клітинки",
	"sheets-ui.shortcut.sheet.select-all": "Виділити все",
	"sheets-ui.shortcut.sheet.toggle-editing": "Почати або закінчити редагування",
	"sheets-ui.shortcut.sheet.delete-and-start-editing": "Очистити й почати редагування",
	"sheets-ui.shortcut.sheet.abort-editing": "Скасувати редагування",
	"sheets-ui.shortcut.sheet.break-line": "Новий рядок у клітинці",
	"sheets-ui.shortcut.sheet.set-bold": "Жирний",
	"sheets-ui.shortcut.sheet.start-editing": "Почати редагування",
	"sheets-ui.shortcut.sheet.repeat-last-action": "Повторити останню дію",
	"sheets-ui.shortcut.sheet.set-italic": "Курсив",
	"sheets-ui.shortcut.sheet.set-underline": "Підкреслений",
	"sheets-ui.shortcut.sheet.set-strike-through": "Закреслений",
	"sheets-ui.definedName.managerTitle": "Диспетчер імен",
	"sheets-ui.definedName.managerDescription": "Виділи клітинки або напиши формулу й дай їм ім'я в текстовому полі.",
	"sheets-ui.definedName.addButton": "Додати ім'я",
	"sheets-ui.definedName.featureTitle": "Імена",
	"sheets-ui.definedName.ratioRange": "Діапазон",
	"sheets-ui.definedName.ratioFormula": "Формула",
	"sheets-ui.definedName.confirm": "ОК",
	"sheets-ui.definedName.cancel": "Скасувати",
	"sheets-ui.definedName.scopeWorkbook": "Книга",
	"sheets-ui.definedName.inputNamePlaceholder": "Введи ім'я (без пропусків)",
	"sheets-ui.definedName.inputCommentPlaceholder": "Введи примітку",
	"sheets-ui.definedName.formulaOrRefStringInvalid": "Неправильна формула або посилання",
	"sheets-ui.definedName.defaultName": "Ім'я",
	"sheets-ui.definedName.updateButton": "Оновити",
	"sheets-ui.definedName.deleteButton": "Видалити",
	"sheets-ui.definedName.deleteConfirmText": "Видалити це ім'я?",
	"sheets-ui.data-validation.alert.ok": "ОК",
	"sheets-ui.data-validation.list.edit": "Змінити",
	"sheets-ui.data-validation.list.dropdown": "Вибери значення",
	"sheets-ui.data-validation.listMultiple.dropdown": "Вибери значення",
	"ui.clearFormatting": "Очистити формат",
	"ui.formatPainter": "Формат за зразком",
	"ui.accessibility.menu": "Меню",
	"ui.accessibility.zoom": "Масштаб",
	"ui.accessibility.zoomIn": "Збільшити",
	"ui.accessibility.zoomOut": "Зменшити",
	"ui.accessibility.resetZoom": "Скинути масштаб",
	"ui.featureSearch.title": "Пошук команд",
	"ui.featureSearch.placeholder": "Введи назву команди або меню…",
	"ui.featureSearch.empty": "Нічого не знайдено",
	"ui.featureSearch.ribbon": "Стрічка",
	"ui.featureSearch.contextMenu": "Контекстне меню",
	"ui.symbolPicker.mathematics": "Математичні",
	"ui.symbolPicker.greek": "Грецькі літери",
	"ui.symbolPicker.common": "Загальні",
	"ui.toolbar.heading.1": "Заголовок 1",
	"ui.toolbar.heading.2": "Заголовок 2",
	"ui.toolbar.heading.3": "Заголовок 3",
	"ui.toolbar.heading.4": "Заголовок 4",
	"ui.toolbar.heading.5": "Заголовок 5",
	"ui.toolbar.heading.normal": "Звичайний текст",
	"ui.toolbar.heading.title": "Назва",
	"ui.toolbar.heading.subTitle": "Підзаголовок",
	"ui.ribbon.start": "Основне",
	"ui.ribbon.startDesc": "Найпотрібніші команди: шрифт, вирівнювання, формат чисел.",
	"ui.ribbon.insert": "Вставлення",
	"ui.ribbon.insertDesc": "Рядки, стовпці та інші об'єкти.",
	"ui.ribbon.formulas": "Формули",
	"ui.ribbon.formulasDesc": "Функції й формули для обчислень.",
	"ui.ribbon.data": "Дані",
	"ui.ribbon.dataDesc": "Сортування, фільтр і умовне форматування.",
	"ui.ribbon.view": "Вигляд",
	"ui.ribbon.viewDesc": "Масштаб, сітка, закріплення областей.",
	"ui.ribbon.others": "Інше",
	"ui.ribbon.othersDesc": "Інші команди й параметри.",
	"ui.ribbon.more": "Ще",
	"ui.fontFamily.not-supported": "Такого шрифту немає на цьому пристрої, тому показано звичайний шрифт.",
	"ui.shortcut-panel.title": "Сполучення клавіш",
	"ui.shortcut.undo": "Скасувати",
	"ui.shortcut.redo": "Повторити",
	"ui.shortcut.cut": "Вирізати",
	"ui.shortcut.copy": "Копіювати",
	"ui.shortcut.paste": "Вставити",
	"ui.shortcut.shortcut-panel": "Показати сполучення клавіш",
	"ui.common-edit": "Основні команди редагування",
	"ui.toggle-shortcut-panel": "Показати сполучення клавіш",
	"ui.navigation.back": "Назад",
	"ui.navigation.previous": "Попереднє",
	"ui.navigation.next": "Наступне",
	"ui.sidebar.panel": "Бічна панель",
	"ui.sidebar.resize": "Змінити ширину бічної панелі",
	"ui.sidebar.close": "Закрити бічну панель",
	"ui.beforeClose.title": "Деякі зміни не збережено",
	"ui.clipboard.authentication.title": "Немає доступу",
	"ui.clipboard.authentication.content": "Дозволь сторінці доступ до буфера обміну.",
	"ui.rangeSelector.cancel": "Скасувати",
	"ui.global-shortcut": "Сполучення клавіш",
	"ui.row": "Рядок",
	"ui.column": "Стовпець",
	"sheets-sort-ui.general.sort": "Сортування",
	"sheets-sort-ui.general.sort-asc": "За зростанням",
	"sheets-sort-ui.general.sort-desc": "За спаданням",
	"sheets-sort-ui.general.sort-custom": "Настроюване сортування",
	"sheets-sort-ui.general.sort-asc-ext": "За зростанням (уся таблиця)",
	"sheets-sort-ui.general.sort-desc-ext": "За спаданням (уся таблиця)",
	"sheets-sort-ui.general.sort-asc-cur": "За зростанням",
	"sheets-sort-ui.general.sort-desc-cur": "За спаданням",
	"sheets-sort-ui.error.merge-size": "У діапазоні є об'єднані клітинки різного розміру, тому його не можна впорядкувати.",
	"sheets-sort-ui.error.empty": "У діапазоні немає даних, тому його не можна впорядкувати.",
	"sheets-sort-ui.error.single": "У діапазоні лише один рядок, тому його не можна впорядкувати.",
	"sheets-sort-ui.error.formula-array": "У діапазоні є формула масиву, тому його не можна впорядкувати.",
	"sheets-sort-ui.dialog.sort-reminder": "Сортування",
	"sheets-sort-ui.dialog.sort-reminder-desc": "Поруч із виділенням є дані. Розширити виділення, щоб рядки не перемішалися?",
	"sheets-sort-ui.dialog.sort-reminder-ext": "Розширити виділення",
	"sheets-sort-ui.dialog.sort-reminder-no": "Сортувати лише виділене",
	"sheets-sort-ui.dialog.first-row-check": "Перший рядок — заголовки, їх не сортувати",
	"sheets-sort-ui.dialog.add-condition": "Додати рівень",
	"sheets-sort-ui.dialog.delete-condition": "Видалити рівень",
	"sheets-sort-ui.dialog.cancel": "Скасувати",
	"sheets-sort-ui.dialog.confirm": "ОК",
	"sheets-sort-ui.info.tooltip": "Підказка",
	"sheets-filter.command.not-valid-filter-range": "У виділенні лише один рядок, для фільтра цього замало.",
	"sheets-filter.msg.filter-header-forbidden": "Рядок заголовків фільтра не можна переміщувати.",
	"sheets-filter-ui.toolbar.smart-toggle-filter-tooltip": "Фільтр",
	"sheets-filter-ui.toolbar.clear-filter-criteria": "Очистити умови фільтра",
	"sheets-filter-ui.toolbar.re-calc-filter-conditions": "Застосувати фільтр повторно",
	"sheets-filter-ui.shortcut.smart-toggle-filter": "Фільтр",
	"sheets-filter-ui.permission.filterErr": "Немає дозволу на фільтр.",
	"sheets-filter-ui.panel.clear-filter": "Очистити фільтр",
	"sheets-filter-ui.panel.cancel": "Скасувати",
	"sheets-filter-ui.panel.confirm": "ОК",
	"sheets-filter-ui.panel.mobile.resize": "Змінити розмір панелі фільтра",
	"sheets-filter-ui.panel.mobile.back": "Назад",
	"sheets-filter-ui.panel.mobile.column": "Стовпець {0}",
	"sheets-filter-ui.panel.mobile.previous-column": "Попередній стовпець",
	"sheets-filter-ui.panel.mobile.next-column": "Наступний стовпець",
	"sheets-filter-ui.panel.by-values": "За значеннями",
	"sheets-filter-ui.panel.by-colors": "За кольором",
	"sheets-filter-ui.panel.filter-by-cell-fill-color": "За кольором заливки",
	"sheets-filter-ui.panel.filter-by-cell-text-color": "За кольором тексту",
	"sheets-filter-ui.panel.filter-by-color-none": "У цьому стовпці лише один колір",
	"sheets-filter-ui.panel.by-conditions": "За умовою",
	"sheets-filter-ui.panel.filter-only": "Лише це",
	"sheets-filter-ui.panel.search-placeholder": "Пошук (слова через пропуск)",
	"sheets-filter-ui.panel.select-all": "Виділити все",
	"sheets-filter-ui.panel.input-values-placeholder": "Введи значення",
	"sheets-filter-ui.panel.and": "І",
	"sheets-filter-ui.panel.or": "АБО",
	"sheets-filter-ui.panel.empty": "(порожні)",
	"sheets-filter-ui.panel.?": "Знак «?» означає один будь-який символ.",
	"sheets-filter-ui.panel.*": "Знак «*» означає будь-яку кількість символів.",
	"sheets-filter-ui.conditions.none": "Немає",
	"sheets-filter-ui.conditions.empty": "Порожня",
	"sheets-filter-ui.conditions.not-empty": "Не порожня",
	"sheets-filter-ui.conditions.text-contains": "Текст містить",
	"sheets-filter-ui.conditions.does-not-contain": "Текст не містить",
	"sheets-filter-ui.conditions.starts-with": "Починається з",
	"sheets-filter-ui.conditions.ends-with": "Закінчується на",
	"sheets-filter-ui.conditions.equals": "Дорівнює",
	"sheets-filter-ui.conditions.greater-than": "Більше ніж",
	"sheets-filter-ui.conditions.greater-than-or-equal": "Більше або дорівнює",
	"sheets-filter-ui.conditions.less-than": "Менше ніж",
	"sheets-filter-ui.conditions.less-than-or-equal": "Менше або дорівнює",
	"sheets-filter-ui.conditions.equal": "Дорівнює",
	"sheets-filter-ui.conditions.not-equal": "Не дорівнює",
	"sheets-filter-ui.conditions.between": "Між",
	"sheets-filter-ui.conditions.not-between": "Не між",
	"sheets-filter-ui.conditions.custom": "Своя умова",
	"sheets-filter-ui.date.1": "Січень",
	"sheets-filter-ui.date.2": "Лютий",
	"sheets-filter-ui.date.3": "Березень",
	"sheets-filter-ui.date.4": "Квітень",
	"sheets-filter-ui.date.5": "Травень",
	"sheets-filter-ui.date.6": "Червень",
	"sheets-filter-ui.date.7": "Липень",
	"sheets-filter-ui.date.8": "Серпень",
	"sheets-filter-ui.date.9": "Вересень",
	"sheets-filter-ui.date.10": "Жовтень",
	"sheets-filter-ui.date.11": "Листопад",
	"sheets-filter-ui.date.12": "Грудень",
	"sheets-conditional-formatting.iconSet.direction": "Напрямок",
	"sheets-conditional-formatting.iconSet.shape": "Фігури",
	"sheets-conditional-formatting.iconSet.mark": "Позначки",
	"sheets-conditional-formatting.iconSet.rank": "Оцінки",
	"sheets-conditional-formatting-ui.title": "Умовне форматування",
	"sheets-conditional-formatting-ui.menu.manageConditionalFormatting": "Керування правилами",
	"sheets-conditional-formatting-ui.menu.createConditionalFormatting": "Створити правило",
	"sheets-conditional-formatting-ui.menu.clearRangeRules": "Видалити правила з виділених клітинок",
	"sheets-conditional-formatting-ui.menu.clearWorkSheetRules": "Видалити правила з усього аркуша",
	"sheets-conditional-formatting-ui.form.lessThan": "Значення має бути менше за {0}",
	"sheets-conditional-formatting-ui.form.lessThanOrEqual": "Значення має бути не більше за {0}",
	"sheets-conditional-formatting-ui.form.greaterThan": "Значення має бути більше за {0}",
	"sheets-conditional-formatting-ui.form.greaterThanOrEqual": "Значення має бути не менше за {0}",
	"sheets-conditional-formatting-ui.iconSet.direction": "Напрямок",
	"sheets-conditional-formatting-ui.iconSet.shape": "Фігури",
	"sheets-conditional-formatting-ui.iconSet.rank": "Оцінки",
	"sheets-conditional-formatting-ui.iconSet.rule": "Правило",
	"sheets-conditional-formatting-ui.iconSet.icon": "Значок",
	"sheets-conditional-formatting-ui.iconSet.type": "Тип",
	"sheets-conditional-formatting-ui.iconSet.value": "Значення",
	"sheets-conditional-formatting-ui.iconSet.reverseIconOrder": "Зворотний порядок значків",
	"sheets-conditional-formatting-ui.iconSet.and": "і",
	"sheets-conditional-formatting-ui.iconSet.when": "Коли",
	"sheets-conditional-formatting-ui.iconSet.onlyShowIcon": "Лише значок",
	"sheets-conditional-formatting-ui.iconSet.noCellIcon": "Без значка",
	"sheets-conditional-formatting-ui.panel.createRule": "Створити правило",
	"sheets-conditional-formatting-ui.panel.clear": "Видалити всі правила",
	"sheets-conditional-formatting-ui.panel.range": "Застосувати до діапазону",
	"sheets-conditional-formatting-ui.panel.styleType": "Тип правила",
	"sheets-conditional-formatting-ui.panel.submit": "ОК",
	"sheets-conditional-formatting-ui.panel.cancel": "Скасувати",
	"sheets-conditional-formatting-ui.panel.rankAndAverage": "Перші/останні/середнє",
	"sheets-conditional-formatting-ui.panel.styleRule": "Формат",
	"sheets-conditional-formatting-ui.panel.isNotBottom": "Перші",
	"sheets-conditional-formatting-ui.panel.isBottom": "Останні",
	"sheets-conditional-formatting-ui.panel.greaterThanAverage": "Вище середнього",
	"sheets-conditional-formatting-ui.panel.lessThanAverage": "Нижче середнього",
	"sheets-conditional-formatting-ui.panel.medianValue": "Медіана",
	"sheets-conditional-formatting-ui.panel.fillType": "Заливка",
	"sheets-conditional-formatting-ui.panel.pureColor": "Суцільна",
	"sheets-conditional-formatting-ui.panel.gradient": "Градієнтна",
	"sheets-conditional-formatting-ui.panel.colorSet": "Кольори",
	"sheets-conditional-formatting-ui.panel.positive": "Додатні",
	"sheets-conditional-formatting-ui.panel.native": "Від'ємні",
	"sheets-conditional-formatting-ui.panel.workSheet": "Увесь аркуш",
	"sheets-conditional-formatting-ui.panel.selectedRange": "Виділений діапазон",
	"sheets-conditional-formatting-ui.panel.managerRuleSelect": "Правила для: {0}",
	"sheets-conditional-formatting-ui.panel.onlyShowDataBar": "Лише гістограма",
	"sheets-conditional-formatting-ui.preview.describe.beginsWith": "Починається з {0}",
	"sheets-conditional-formatting-ui.preview.describe.endsWith": "Закінчується на {0}",
	"sheets-conditional-formatting-ui.preview.describe.containsText": "Містить текст {0}",
	"sheets-conditional-formatting-ui.preview.describe.notContainsText": "Не містить тексту {0}",
	"sheets-conditional-formatting-ui.preview.describe.equal": "Дорівнює {0}",
	"sheets-conditional-formatting-ui.preview.describe.notEqual": "Не дорівнює {0}",
	"sheets-conditional-formatting-ui.preview.describe.containsBlanks": "Порожні клітинки",
	"sheets-conditional-formatting-ui.preview.describe.notContainsBlanks": "Непорожні клітинки",
	"sheets-conditional-formatting-ui.preview.describe.containsErrors": "Клітинки з помилками",
	"sheets-conditional-formatting-ui.preview.describe.notContainsErrors": "Клітинки без помилок",
	"sheets-conditional-formatting-ui.preview.describe.greaterThan": "Більше ніж {0}",
	"sheets-conditional-formatting-ui.preview.describe.greaterThanOrEqual": "Більше або дорівнює {0}",
	"sheets-conditional-formatting-ui.preview.describe.lessThan": "Менше ніж {0}",
	"sheets-conditional-formatting-ui.preview.describe.lessThanOrEqual": "Менше або дорівнює {0}",
	"sheets-conditional-formatting-ui.preview.describe.notBetween": "Не між {0} і {1}",
	"sheets-conditional-formatting-ui.preview.describe.between": "Між {0} і {1}",
	"sheets-conditional-formatting-ui.preview.describe.yesterday": "Учора",
	"sheets-conditional-formatting-ui.preview.describe.tomorrow": "Завтра",
	"sheets-conditional-formatting-ui.preview.describe.last7Days": "Останні 7 днів",
	"sheets-conditional-formatting-ui.preview.describe.thisMonth": "Цей місяць",
	"sheets-conditional-formatting-ui.preview.describe.lastMonth": "Минулий місяць",
	"sheets-conditional-formatting-ui.preview.describe.nextMonth": "Наступний місяць",
	"sheets-conditional-formatting-ui.preview.describe.thisWeek": "Цей тиждень",
	"sheets-conditional-formatting-ui.preview.describe.lastWeek": "Минулий тиждень",
	"sheets-conditional-formatting-ui.preview.describe.nextWeek": "Наступний тиждень",
	"sheets-conditional-formatting-ui.preview.describe.today": "Сьогодні",
	"sheets-conditional-formatting-ui.preview.describe.topN": "Перші {0}",
	"sheets-conditional-formatting-ui.preview.describe.bottomN": "Останні {0}",
	"sheets-conditional-formatting-ui.preview.describe.topNPercent": "Перші {0}%",
	"sheets-conditional-formatting-ui.preview.describe.bottomNPercent": "Останні {0}%",
	"sheets-conditional-formatting-ui.operator.beginsWith": "Починається з",
	"sheets-conditional-formatting-ui.operator.endsWith": "Закінчується на",
	"sheets-conditional-formatting-ui.operator.containsText": "Містить текст",
	"sheets-conditional-formatting-ui.operator.notContainsText": "Не містить тексту",
	"sheets-conditional-formatting-ui.operator.equal": "Дорівнює",
	"sheets-conditional-formatting-ui.operator.notEqual": "Не дорівнює",
	"sheets-conditional-formatting-ui.operator.containsBlanks": "Порожні клітинки",
	"sheets-conditional-formatting-ui.operator.notContainsBlanks": "Непорожні клітинки",
	"sheets-conditional-formatting-ui.operator.containsErrors": "Клітинки з помилками",
	"sheets-conditional-formatting-ui.operator.notContainsErrors": "Клітинки без помилок",
	"sheets-conditional-formatting-ui.operator.greaterThan": "Більше ніж",
	"sheets-conditional-formatting-ui.operator.greaterThanOrEqual": "Більше або дорівнює",
	"sheets-conditional-formatting-ui.operator.lessThan": "Менше ніж",
	"sheets-conditional-formatting-ui.operator.lessThanOrEqual": "Менше або дорівнює",
	"sheets-conditional-formatting-ui.operator.notBetween": "Не між",
	"sheets-conditional-formatting-ui.operator.between": "Між",
	"sheets-conditional-formatting-ui.operator.yesterday": "Учора",
	"sheets-conditional-formatting-ui.operator.tomorrow": "Завтра",
	"sheets-conditional-formatting-ui.operator.last7Days": "Останні 7 днів",
	"sheets-conditional-formatting-ui.operator.thisMonth": "Цей місяць",
	"sheets-conditional-formatting-ui.operator.lastMonth": "Минулий місяць",
	"sheets-conditional-formatting-ui.operator.nextMonth": "Наступний місяць",
	"sheets-conditional-formatting-ui.operator.thisWeek": "Цей тиждень",
	"sheets-conditional-formatting-ui.operator.lastWeek": "Минулий тиждень",
	"sheets-conditional-formatting-ui.operator.nextWeek": "Наступний тиждень",
	"sheets-conditional-formatting-ui.operator.today": "Сьогодні",
	"sheets-conditional-formatting-ui.ruleType.highlightCell": "Виділення клітинок",
	"sheets-conditional-formatting-ui.ruleType.dataBar": "Гістограма",
	"sheets-conditional-formatting-ui.ruleType.colorScale": "Колірна шкала",
	"sheets-conditional-formatting-ui.ruleType.formula": "Формула",
	"sheets-conditional-formatting-ui.ruleType.iconSet": "Набір значків",
	"sheets-conditional-formatting-ui.subRuleType.uniqueValues": "Унікальні значення",
	"sheets-conditional-formatting-ui.subRuleType.duplicateValues": "Повторювані значення",
	"sheets-conditional-formatting-ui.subRuleType.text": "Текст",
	"sheets-conditional-formatting-ui.subRuleType.timePeriod": "Дата",
	"sheets-conditional-formatting-ui.subRuleType.number": "Число",
	"sheets-conditional-formatting-ui.subRuleType.average": "Середнє",
	"sheets-conditional-formatting-ui.valueType.num": "Число",
	"sheets-conditional-formatting-ui.valueType.min": "Мінімум",
	"sheets-conditional-formatting-ui.valueType.max": "Максимум",
	"sheets-conditional-formatting-ui.valueType.percent": "Відсоток",
	"sheets-conditional-formatting-ui.valueType.percentile": "Процентиль",
	"sheets-conditional-formatting-ui.valueType.formula": "Формула",
	"sheets-conditional-formatting-ui.valueType.none": "Немає",
	"sheets-conditional-formatting-ui.errorMessage.notBlank": "Умова не може бути порожньою",
	"sheets-conditional-formatting-ui.errorMessage.formulaError": "Помилка у формулі",
	"sheets-conditional-formatting-ui.errorMessage.rangeError": "Неправильний діапазон"
};
/** `{ "a.b": "x" }` → `{ a: { b: "x" } }`, the shape Univer reads. */
var unflatten = (flat) => {
	const tree = {};
	for (const [path, text] of Object.entries(flat)) {
		const keys = path.split(".");
		let node = tree;
		keys.slice(0, -1).forEach((key) => {
			node = node[key] ??= {};
		});
		node[keys.at(-1) ?? ""] = text;
	}
	return tree;
};
var uk = unflatten(ukFlat);
// src/ui/locale/index.ts
/** Univer has no Ukrainian; the trainer adds its own under this name. */
var UK_LOCALE = "ukUA";
LOCALE_META[UK_LOCALE] = {
	name: "Українська",
	tag: "uk-UA",
	direction: "ltr"
};
/** English as the base (function help and anything not translated yet), Ukrainian over it. */
var ukLocales = { [UK_LOCALE]: mergeLocales(coreEnUS, sortEnUS, filterEnUS, cfEnUS, uk) };
// src/ui/TaskPanel.tsx
/** The task card: what to do, the "Перевірити" button and the result of each condition. */
var TaskPanel = ({ scenario, results, open, checking, selfCheck, onToggle, onCheck, onReset }) => {
	const solved = results !== null && results.length > 0 && results.every((r) => r.ok);
	return /* @__PURE__ */ jsxs("div", {
		className: `es-task ${open ? "is-open" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "es-task-head",
			children: [
				scenario.grade > 0 && /* @__PURE__ */ jsxs("span", {
					className: "es-grade",
					children: [scenario.grade, " клас"]
				}),
				/* @__PURE__ */ jsx("h2", { children: scenario.title }),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "es-task-toggle",
					"aria-expanded": open,
					"aria-label": open ? "Сховати завдання" : "Показати завдання",
					onClick: onToggle,
					children: open ? "▴" : "▾"
				})
			]
		}), open && /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("ol", {
				className: "es-task-steps",
				children: scenario.task.map((step) => /* @__PURE__ */ jsx("li", { children: step }, step))
			}),
			/* @__PURE__ */ jsx("p", {
				className: "es-touch-hint",
				children: "На телефоні: торкнися клітинки, щоб вибрати її, і двічі, щоб уводити текст."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "es-task-actions",
				children: [selfCheck && /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "es-check",
					onClick: onCheck,
					disabled: checking,
					children: checking ? "Перевіряю…" : "Перевірити"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "es-reset",
					onClick: onReset,
					children: "Почати спочатку"
				})]
			}),
			results !== null && /* @__PURE__ */ jsxs("div", {
				className: `es-results ${solved ? "is-solved" : ""}`,
				role: "status",
				children: [/* @__PURE__ */ jsx("p", {
					className: "es-results-head",
					children: solved ? "🎉 Молодець! Усе виконано." : `Виконано ${results.filter((r) => r.ok).length} з ${results.length}`
				}), /* @__PURE__ */ jsx("ul", { children: results.map((r) => /* @__PURE__ */ jsxs("li", {
					className: r.ok ? "is-ok" : "is-bad",
					children: [
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							children: r.ok ? "✅" : "❌"
						}),
						" ",
						r.text,
						!r.ok && r.hint !== "" && /* @__PURE__ */ jsx("small", { children: r.hint })
					]
				}, r.text)) })]
			})
		] })]
	});
};
// src/ui/touch-keyboard.ts
/** Univer's hidden cell editor: it keeps focus all the time so that typing on a computer starts editing at once. */
var CELL_EDITOR = "#__editor___INTERNAL_EDITOR__DOCS_NORMAL";
/** Two taps closer than this in time and in distance are a double tap. */
var DOUBLE_TAP_MS = 400;
var DOUBLE_TAP_PX = 30;
/** A phone or tablet: no physical keyboard is assumed. */
var isTouchDevice = () => typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches === true;
var setKeyboard = (container, shown, refocus) => {
	const editor = container.querySelector(CELL_EDITOR);
	if (editor === null) return;
	editor.setAttribute("inputmode", shown ? "text" : "none");
	if (refocus && document.activeElement === editor) {
		editor.blur();
		editor.focus();
	}
};
/**
* On a touch screen the always-focused cell editor opens the on-screen keyboard after every tap, and it covers half
* of the table. Here the keyboard stays hidden while the student selects cells and shows up only when they edit a
* cell (double tap). The formula bar is a separate field and opens the keyboard as usual.
*/
var keepKeyboardForEditing = (api, container) => {
	setKeyboard(container, false, false);
	const observer = new MutationObserver(() => {
		const editor = container.querySelector(CELL_EDITOR);
		if (editor !== null && !editor.hasAttribute("inputmode")) setKeyboard(container, false, false);
	});
	observer.observe(container, {
		childList: true,
		subtree: true
	});
	let lastTap = {
		time: 0,
		x: 0,
		y: 0
	};
	const onTap = (event) => {
		if (event.pointerType !== "touch") return;
		if (!(event.target instanceof HTMLCanvasElement) || !event.target.id.startsWith("univer-sheet-main")) return;
		const isDouble = event.timeStamp - lastTap.time < DOUBLE_TAP_MS && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < DOUBLE_TAP_PX;
		lastTap = isDouble ? {
			time: 0,
			x: 0,
			y: 0
		} : {
			time: event.timeStamp,
			x: event.clientX,
			y: event.clientY
		};
		if (isDouble) api.getActiveWorkbook()?.startEditing();
	};
	container.addEventListener("pointerup", onTap);
	const started = api.addEvent(api.Event.SheetEditStarted, () => setKeyboard(container, true, true));
	const ended = api.addEvent(api.Event.SheetEditEnded, () => setKeyboard(container, false, true));
	return { dispose: () => {
		observer.disconnect();
		container.removeEventListener("pointerup", onTap);
		started.dispose();
		ended.dispose();
	} };
};
// src/core/notation.ts
/**
* Ukrainian Excel writes `2,5` for a decimal number and `;` between function arguments: `=IF(A1>1;"так";"ні")`.
* The Univer engine reads `2.5` and `,`. These functions turn what a student typed into what the engine reads,
* so the textbook notation works.
*/
var NUMBER_WITH_COMMA = /^\s*([+-]?\d+),(\d+)\s*$/;
/** `"2,5"` → `2.5`; `null` for anything else. */
var ukrainianNumber = (text) => {
	const m = NUMBER_WITH_COMMA.exec(text);
	return m === null ? null : Number(`${m[1]}.${m[2]}`);
};
/** Commas between digits outside any brackets: `=A1*2,5`. Inside brackets a comma may separate arguments: `=ROUND(2,5)`. */
var topLevelDecimals = (code) => {
	let depth = 0;
	let out = "";
	for (let i = 0; i < code.length; i++) {
		const ch = code[i] ?? "";
		if (ch === "(") depth++;
		if (ch === ")") depth--;
		const decimal = ch === "," && depth === 0 && /\d/.test(code[i - 1] ?? "") && /\d/.test(code[i + 1] ?? "");
		out += decimal ? "." : ch;
	}
	return out;
};
/**
* `=IF(A1>2,5;1;0)` → `=IF(A1>2.5,1,0)`. Text in quotes is left as it is.
* A formula with `;` is in the Ukrainian notation: every comma between digits is decimal.
* A formula without `;` (`=SUM(A1,B1)`) keeps its commas, except a decimal comma outside brackets (`=A1*2,5`).
*/
var ukrainianFormula = (formula) => {
	if (!formula.startsWith("=")) return formula;
	const parts = formula.split(/("[^"]*")/);
	const ukrainian = parts.some((part, i) => i % 2 === 0 && part.includes(";"));
	return parts.map((part, i) => {
		if (i % 2 === 1) return part;
		return ukrainian ? part.replace(/(\d),(\d)/g, "$1.$2").replace(/;/g, ",") : topLevelDecimals(part);
	}).join("");
};
// src/ui/univer-bridge.ts
/** Univer keeps typed text either as `v` or, after rich editing, as a small document `p`. */
var plainText = (cell) => {
	const stream = cell.p?.body?.dataStream;
	return typeof stream === "string" ? stream.replace(/[\r\n]+$/, "") : void 0;
};
var resolveStyle = (s, styles) => {
	if (s === null || s === void 0) return void 0;
	return typeof s === "string" ? styles?.[s] ?? void 0 : s;
};
var inputOf = (cell, formula) => {
	if (formula !== "") return formula;
	const v = cell.v;
	if (typeof v === "number" || typeof v === "boolean") return v;
	if (typeof v === "string") return v;
	return plainText(cell);
};
/** What the student has in the table now, in the package's own format. */
var readWorkbook = (api) => {
	const book = api.getActiveWorkbook();
	if (book === null) return { sheets: [] };
	const data = book.save();
	return { sheets: book.getSheets().map((ws) => {
		const sheetData = data.sheets[ws.getSheetId()];
		const cells = {};
		for (const [r, line] of Object.entries(sheetData?.cellData ?? {})) for (const [c, cell] of Object.entries(line ?? {})) {
			if (cell === null || cell === void 0) continue;
			const row = Number(r);
			const col = Number(c);
			const input = inputOf(cell, cell.f || cell.si ? ws.getRange(row, col).getFormula() : "");
			const style = styleFromUniver(resolveStyle(cell.s, data.styles));
			if ((input === void 0 || input === "") && style === void 0) continue;
			cells[cellName({
				row,
				col
			})] = {
				input: input ?? "",
				...style === void 0 ? {} : { style }
			};
		}
		const defaultWidth = sheetData?.defaultColumnWidth;
		const widths = {};
		for (const [c, column] of Object.entries(sheetData?.columnData ?? {})) {
			const w = column?.w;
			if (typeof w === "number" && w !== defaultWidth) widths[colName(Number(c))] = Math.round(w);
		}
		return {
			name: ws.getSheetName(),
			cells,
			...Object.keys(widths).length === 0 ? {} : { widths }
		};
	}) };
};
/**
* After the student finishes typing in a cell: `2,5` becomes the number 2.5, and a formula in the textbook notation
* (`=IF(A1>2,5;"так";"ні")`) becomes one the engine computes.
*/
var fixUkrainianInput = (api, sheetId, row, column) => {
	const ws = api.getActiveWorkbook()?.getSheetBySheetId(sheetId);
	if (ws === void 0 || ws === null) return;
	const range = ws.getRange(row, column);
	const formula = range.getFormula();
	if (formula !== "") {
		const fixed = ukrainianFormula(formula);
		if (fixed !== formula) range.setValue(fixed);
		return;
	}
	const value = range.getValue();
	const number = typeof value === "string" ? ukrainianNumber(value) : null;
	if (number !== null) range.setValue(number);
};
// src/ui/EduSheets.tsx
/** Protection belongs to shared documents with owners; a student's own table has none. */
var HIDDEN_MENUS = {
	"sheet.command.add-range-protection-from-toolbar": { hidden: true },
	"sheet.contextMenu.permission": { hidden: true }
};
/** Typing fires many changes; the page hears about the table once the student pauses. */
var CHANGE_DELAY_MS = 400;
/** The spreadsheet trainer for one scenario. Can be embedded into any React page. */
var EduSheets = ({ scenario, onCheck, onChange, initialWorkbook, selfCheck = true }) => {
	const host = useRef(null);
	const api = useRef(null);
	const [results, setResults] = useState(null);
	const [checking, setChecking] = useState(false);
	const [taskOpen, setTaskOpen] = useState(true);
	const [round, setRound] = useState(0);
	const changed = useRef(onChange);
	changed.current = onChange;
	const checked = useRef(onCheck);
	checked.current = onCheck;
	const initial = useRef(initialWorkbook);
	useEffect(() => {
		if (host.current === null) return;
		const container = document.createElement("div");
		container.className = "es-univer";
		host.current.append(container);
		const { univer, univerAPI } = createUniver({
			locale: UK_LOCALE,
			locales: ukLocales,
			presets: [
				UniverSheetsCorePreset({
					container,
					menu: HIDDEN_MENUS
				}),
				UniverSheetsSortPreset(),
				UniverSheetsFilterPreset(),
				UniverSheetsConditionalFormattingPreset()
			]
		});
		const start = round === 0 && initial.current !== void 0 ? initial.current : buildWorkbook(scenario.start);
		univerAPI.createWorkbook(toUniverData(start));
		api.current = univerAPI;
		let timer;
		let last = JSON.stringify(readWorkbook(univerAPI));
		const report = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				const table = readWorkbook(univerAPI);
				const text = JSON.stringify(table);
				if (text === last) return;
				last = text;
				changed.current?.(table);
			}, CHANGE_DELAY_MS);
		};
		const onCommand = univerAPI.addEvent(univerAPI.Event.CommandExecuted, (event) => {
			if (event.type !== CommandType.MUTATION) return;
			setResults(null);
			report();
		});
		const onEditEnd = univerAPI.addEvent(univerAPI.Event.SheetEditEnded, (event) => {
			if (!event.isConfirm) return;
			const sheetId = event.worksheet.getSheetId();
			setTimeout(() => fixUkrainianInput(univerAPI, sheetId, event.row, event.column), 0);
		});
		const keyboard = isTouchDevice() ? keepKeyboardForEditing(univerAPI, container) : null;
		return () => {
			clearTimeout(timer);
			onCommand.dispose();
			onEditEnd.dispose();
			keyboard?.dispose();
			api.current = null;
			setTimeout(() => {
				univer.dispose();
				container.remove();
			}, 0);
		};
	}, [scenario, round]);
	const check = useCallback(async () => {
		const current = api.current;
		if (current === null) return;
		setChecking(true);
		try {
			const found = await checkGoals(buildWorkbook(scenario.start), readWorkbook(current), scenario.goals);
			setResults(found);
			checked.current?.(found.length > 0 && found.every((r) => r.ok));
		} finally {
			setChecking(false);
		}
	}, [scenario]);
	const reset = useCallback(() => {
		setResults(null);
		setRound((n) => n + 1);
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "es-root",
		children: /* @__PURE__ */ jsxs("div", {
			className: "es-body",
			children: [/* @__PURE__ */ jsx(TaskPanel, {
				scenario,
				results,
				open: taskOpen,
				checking,
				selfCheck,
				onToggle: () => setTaskOpen((v) => !v),
				onCheck: () => void check(),
				onReset: reset
			}), /* @__PURE__ */ jsx("div", {
				className: "es-sheet",
				ref: host
			})]
		})
	});
};
export { EduSheets };
