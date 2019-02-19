let localContext;

export function getLocalContext(init) {
    if (!localContext && init) {
        localContext = {};
    }
    return localContext;
}

export function setLocalContext(_localContext) {
    localContext = _localContext;
}


export function clearLocalContext() {
    localContext = undefined;
}
