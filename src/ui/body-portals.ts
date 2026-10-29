/**
 * Univer puts its popups into a `div` it appends to `document.body`, and removes that `div` when it is disposed.
 * A page that clears the body before (a test runner between stories, for example) makes the removal throw.
 * This keeps the `div`s Univer added and puts back the ones someone removed, right before Univer is disposed.
 */
export const watchBodyPortals = (): { readonly restore: () => void } => {
  const added = new Set<Element>()
  const observer = new MutationObserver((records) => {
    for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLDivElement && node.id === "") added.add(node)
  })
  observer.observe(document.body, { childList: true })
  return {
    restore: () => {
      observer.disconnect()
      for (const node of added) if (!node.isConnected) document.body.append(node)
    }
  }
}
