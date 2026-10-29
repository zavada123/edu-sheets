/**
 * Univer puts its popups into a `div` it appends to `document.body`, and removes that `div` when it is disposed.
 * A page that clears the body before (a test runner between stories, for example) makes the removal throw.
 * This keeps the `div`s Univer added and puts back the ones someone removed, right before Univer is disposed.
 */
export declare const watchBodyPortals: () => {
    readonly restore: () => void;
};
