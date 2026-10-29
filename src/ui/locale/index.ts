import { LOCALE_META, type LocaleType } from "@univerjs/core"
import { mergeLocales } from "@univerjs/presets"
import cfEnUS from "@univerjs/preset-sheets-conditional-formatting/locales/en-US"
import coreEnUS from "@univerjs/preset-sheets-core/locales/en-US"
import filterEnUS from "@univerjs/preset-sheets-filter/locales/en-US"
import sortEnUS from "@univerjs/preset-sheets-sort/locales/en-US"
import { uk } from "./uk-UA.ts"

/** Univer has no Ukrainian; the trainer adds its own under this name. */
export const UK_LOCALE = "ukUA" as LocaleType

// Univer looks up the language tag of the current locale (dates, numbers); without this entry some commands fail.
;(LOCALE_META as Record<string, (typeof LOCALE_META)[LocaleType]>)[UK_LOCALE] = { name: "Українська", tag: "uk-UA", direction: "ltr" }

/** English as the base (function help and anything not translated yet), Ukrainian over it. */
export const ukLocales = { [UK_LOCALE]: mergeLocales(coreEnUS, sortEnUS, filterEnUS, cfEnUS, uk) }
