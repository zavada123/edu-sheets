/**
 * Univer puts its popups (menus, tooltips) into `div`s it appends to `document.body`. Its `dispose` does not take all
 * of them away, so a tooltip open at that moment would stay on the page over the next exercise. And a page that
 * clears the body before (a test runner between stories, for example) makes Univer's own removal throw.
 *
 * This keeps the `div`s one Univer added: `stop` ends the watch (before the next Univer starts, so its `div`s are not
 * taken), `restore` puts back the ones someone removed right before Univer is disposed, and `clear` removes what is
 * left after it.
 */
export const watchBodyPortals = (): { readonly stop: () => void; readonly restore: () => void; readonly clear: () => void } => {
  const added = new Set<Element>()
  const note = (records: ReadonlyArray<MutationRecord>) => {
    for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLDivElement && node.id === "") added.add(node)
  }
  const observer = new MutationObserver(note)
  observer.observe(document.body, { childList: true })
  const stop = () => {
    note(observer.takeRecords())
    observer.disconnect()
  }
  return {
    stop,
    restore: () => {
      stop()
      for (const node of added) if (!node.isConnected) document.body.append(node)
    },
    clear: () => {
      for (const node of added) node.remove()
      added.clear()
    }
  }
}
