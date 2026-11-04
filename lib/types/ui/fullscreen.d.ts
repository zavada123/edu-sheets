/** While the trainer covers the page, the page under it does not scroll and keeps no space for a scrollbar. */
export declare const PAGE_FULL_CLASS = "es-page-full";
/**
 * Full screen for the trainer. The trainer covers the page (a fixed layer), so it works on an iPhone too, and where
 * the browser can, the whole page goes to the browser's full screen. Not the trainer alone: Univer shows its menus
 * and tooltips in `document.body`, outside the trainer, and they must stay visible. Esc or the button leaves it.
 */
export declare const useFullScreen: () => Readonly<{
    full: boolean;
    toggle: () => void;
}>;
