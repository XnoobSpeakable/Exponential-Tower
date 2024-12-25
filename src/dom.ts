const domCache = new Map<string, HTMLElement>();

/**
 * Returns the DOM element with the given id, or throws if it doesn't exist.
 * @param id Id of the element to get.
 * @throws {Error} if element with the given {@link id} doesn't exist.
 */
export default function element<T extends HTMLElement>(id: string) {
    const cachedEl = domCache.get(id)
    if (cachedEl !== undefined) return cachedEl as T;
    const element = document.getElementById(id)
    if (element === null) throw new Error(`Element ${id} is null.`)
    domCache.set(id, element)
    return element as T;
}
