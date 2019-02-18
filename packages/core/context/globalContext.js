let globalContext;

export function setGlobalContext(_globalContext) {
    globalContext = _globalContext;
}

export function getGlobalContext() {
    return globalContext;
}

export function clearGlobalContext() {
    globalContext = undefined;
}
