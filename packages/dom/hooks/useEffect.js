import {getLocalContext} from "../context/localContext.js";

const USE_EFFECT_POST_UPDATE = Symbol();
const USE_EFFECT_POST_REMOVE = Symbol();

export function useEffect(value) {
    const localContext = getLocalContext(true);
    localContext[USE_EFFECT_POST_UPDATE] = value;
}

export function handleHookUseEffectPostUpdate(localContext) {
    if (localContext && localContext[USE_EFFECT_POST_UPDATE]) {
        localContext[USE_EFFECT_POST_REMOVE] = localContext[USE_EFFECT_POST_UPDATE]();
    }
}

export function handleHookUseEffectPostRemove(localContext) {
    if (localContext && localContext[USE_EFFECT_POST_REMOVE]) {
        localContext[USE_EFFECT_POST_REMOVE]();
    }
}

