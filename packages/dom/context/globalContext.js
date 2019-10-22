/**
 * @type {*}
 */
let globalContext;

/**
 * @param {*} _globalContext
 * @return {void}
 */
export function setGlobalContext(_globalContext) {
    globalContext = _globalContext;
}

/**
 * @return {*}
 */
export function getGlobalContext() {
    return globalContext;
}

/**
 * @return {void}
 */
export function clearGlobalContext() {
    globalContext = undefined;
}
