import {
    SHOULD_UPDATE_HOOK, USE_CONTEXT_HOOK, USE_EFFECT_HOOK, USE_REF_HOOK, USE_STATE_HOOK
} from './symbols.js';

/**
 * @typedef {typeof SHOULD_UPDATE_HOOK | typeof USE_CONTEXT_HOOK |
 *      typeof USE_EFFECT_HOOK | typeof USE_REF_HOOK | typeof USE_STATE_HOOK} HookType type of hook
 * @typedef {function(...*): *} HookHandle
 */

/**
 * @type {?HookHandle}
 */
let currentHandle;

/**
 * @template T
 * @param {function(): T} fn
 * @param {HookHandle} handle
 * @return {T}
 */
export function executeInHandleContext(fn, handle) {
    currentHandle = handle;
    const res = fn();
    currentHandle = null;
    return res;
}

/**
 * @param {HookType} hook
 * @param {...*=} params
 */
export function handleHook(hook, ...params) {
    if (currentHandle) {
        return currentHandle(hook, ...params);
    }
    throw new Error('You tried use hook outside of component code.');
}

/**
 * @template T
 * @param {T=} initState
 * @return {[T, function(T): void]}
 */
export function useState(initState) {
    return handleHook(USE_STATE_HOOK, initState);
}

/**
 * @return {function(Element): void & {current: Element}}
 */
export function useRef() {
    return handleHook(USE_REF_HOOK);
}

/**
 * Hook which will execute side effect callback after every time where component wil be updated
 * @param {function():void} effect
 * @return {*}
 */
export function useEffect(effect) {
    return handleHook(USE_EFFECT_HOOK, effect);
}

/**
 * Hook for delivering global render context.
 * @return {any}
 */
export function useContext() {
    return handleHook(USE_CONTEXT_HOOK);
}

/**
 * Hook for preventing functional component rendering if provided values doesn't changed,
 * from the previous rendering time.
 * @param {Array.<any>} values values used to comparision, or just function which will be called and should return false
 *  if component should be not rerendered
 */
export function shouldUpdate(...values) {
    return handleHook(SHOULD_UPDATE_HOOK, ...values);
}
