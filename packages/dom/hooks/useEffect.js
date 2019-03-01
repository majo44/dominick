import {getLocalContext} from '../context/localContext.js';

const USE_EFFECT_POST_UPDATE = Symbol();
const USE_EFFECT_POST_REMOVE = Symbol();

/**
 * @param {*=} value
 */
export function useEffect(value) {
    const localContext = getLocalContext(true);
    localContext[USE_EFFECT_POST_UPDATE] = value;
}

/**
 * @param {*} localContext
 */
export function handleHookUseEffectPostUpdate(localContext) {
    if (localContext && localContext[USE_EFFECT_POST_UPDATE]) {
        localContext[USE_EFFECT_POST_REMOVE] = localContext[USE_EFFECT_POST_UPDATE]();
    }
}
