/**
 * @type {*}
 */
let localContext;

/**
 * @param {boolean=} init
 * @return {*}
 */
export function getLocalContext(init) {
    if (!localContext && init) {
        localContext = {};
    }
    return localContext;
}

/**
 * @param {*} _localContext
 * @return {void}
 *
 */
export function setLocalContext(_localContext) {
    localContext = _localContext;
}

/**
 * @return {void}
 */
export function clearLocalContext() {
    localContext = undefined;
}
