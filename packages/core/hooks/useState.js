import { getLocalContext } from "../context/localContext.js";

const USE_STATE = Symbol();

export function useState(initState) {
    const localContext = getLocalContext(true);
    localContext[USE_STATE] = localContext[USE_STATE] || {};

    const setState = function(value) {
        if (value !== localContext[USE_STATE].value) {
            localContext[USE_STATE].value = value;
            localContext[USE_STATE].rerender();
        }
    };
    const value = localContext[USE_STATE].value || initState;
    return [value, setState];
}


export function handleHookUseState(localContext, rerender) {
    if (localContext && localContext[USE_STATE]) {
        localContext[USE_STATE].rerender = rerender;
    }
}
