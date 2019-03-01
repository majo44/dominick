import { getLocalContext } from '../context/localContext.js';

const USE_STATE = Symbol();

/**
 * @template T
 * @param {T=} initState
 * @return {[T, function(T): void]}
 */
export function useState(initState) {
    const localContext = getLocalContext(true);
    localContext[USE_STATE] = localContext[USE_STATE] || {};
    /**
     * @param {T} value
     */
    const setState = function(value) {
        if (value !== localContext[USE_STATE].value) {
            localContext[USE_STATE].value = value;
            localContext[USE_STATE].rerender();
        }
    };
    const value = localContext[USE_STATE].value || initState;
    return [value, setState];
}

/**
 * @param {*} localContext
 * @param {*} rerender
 */
export function handleHookUseState(localContext, rerender) {
    if (localContext && localContext[USE_STATE]) {
        localContext[USE_STATE].rerender = rerender;
    }
}
