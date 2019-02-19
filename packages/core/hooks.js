import {
    SHOULD_UPDATE_HOOK, USE_CONTEXT_HOOK, USE_EFFECT_HOOK, USE_REF_HOOK, USE_STATE_HOOK
} from "./symbols.js";

let currentHandle;

export function executeInHandleContext(fn, handle) {
    currentHandle = handle;
    const res = fn();
    currentHandle = null;
    return res;
}

export function handleHook(hook, ...params) {
    if (currentHandle) {
        return currentHandle(hook, ...params);
    }
    throw new Error('You tried use hook outside of component code.');
}


export function useState(initState) {
    return handleHook(USE_STATE_HOOK, initState);
}

export function useRef() {
    return handleHook(USE_REF_HOOK);
}

export function useEffect(effct) {
    return handleHook(USE_EFFECT_HOOK, effct);
}
export function useContext() {
    return handleHook(USE_CONTEXT_HOOK);
}
/**
 * Hook for preventing functional component rendering if provided values doesn't changed,
 * from the previous rendering time.
 * @param values values used to comparision
 */
export function shouldUpdate(...values) {
    return handleHook(SHOULD_UPDATE_HOOK, ...values);
}
