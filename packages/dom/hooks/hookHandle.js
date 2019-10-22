import {
    SHOULD_UPDATE_HOOK, USE_CONTEXT_HOOK, USE_EFFECT_HOOK, USE_REF_HOOK, USE_STATE_HOOK
} from '../../core/index.js';
import {shouldUpdate} from './shouldUpdate.js';
import {useContext} from './useContext.js';
import {useEffect} from './useEffect.js';
import {useRef} from './useRef.js';
import {useState} from './useState.js';

/**
 * @typedef {import('../../core/hooks.js').HookType} HookType
 */

/**
 *
 * @param {HookType} hook
 * @param {...*} params
 * @return {*}
 */
export function hookHandle(hook, ...params) {
    switch (hook) {
        case SHOULD_UPDATE_HOOK:
            return shouldUpdate(...params);
        case USE_CONTEXT_HOOK:
            return useContext();
        case USE_EFFECT_HOOK:
            return useEffect(...params);
        case USE_REF_HOOK:
            return useRef();
        case USE_STATE_HOOK:
            return useState(...params);
    }
}