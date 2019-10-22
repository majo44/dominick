import { getLocalContext } from '../context/localContext.js';
import { diffArray } from '../utils/diffArray.js';
const SHOULD_UPDATE = Symbol();

/**
 * Hook for preventing functional component rendering if provided values doesn't changed,
 * from the previous rendering time.
 * @param {...*} values values used to comparision
 */
export function shouldUpdate(...values) {
    const localContext = getLocalContext(true);
    localContext[SHOULD_UPDATE] = localContext[SHOULD_UPDATE] || {};
    localContext[SHOULD_UPDATE].previous = localContext[SHOULD_UPDATE].current;
    localContext[SHOULD_UPDATE].current = values;
}

/**
 * @param {*} localContext
 * @return {boolean} should component be rerendered
 */
export function handleHookShouldUpdate(localContext) {
    if (localContext && localContext[SHOULD_UPDATE]) {
        if (localContext[SHOULD_UPDATE].current.length === 1 &&
            typeof localContext[SHOULD_UPDATE].current[0] === 'function') {
            return localContext[SHOULD_UPDATE].current[0]();
        } else if (localContext) {
            return diffArray(localContext[SHOULD_UPDATE].current, localContext[SHOULD_UPDATE].previous);
        }
    }
    return true;
}

