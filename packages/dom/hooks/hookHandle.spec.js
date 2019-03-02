import { hookHandle } from './hookHandle.js';
import {
    SHOULD_UPDATE_HOOK, USE_STATE_HOOK, USE_REF_HOOK, USE_EFFECT_HOOK, USE_CONTEXT_HOOK }
from '../../core/index.js';
import { shouldUpdate } from './shouldUpdate.js';
import { useState } from './useState.js';
import { useRef } from './useRef.js';
import { useEffect } from './useEffect.js';
import { useContext } from './useContext.js';

jest.mock('./shouldUpdate.js');
jest.mock('./useState.js');
jest.mock('./useRef.js');
jest.mock('./useEffect.js');
jest.mock('./useContext.js');

describe('hookHandle', () => {
    it('should properly map hooks', () => {
        hookHandle(SHOULD_UPDATE_HOOK);
        expect(shouldUpdate).toBeCalledTimes(1);
        hookHandle(USE_STATE_HOOK);
        expect(useState).toBeCalledTimes(1);
        hookHandle(USE_REF_HOOK);
        expect(useRef).toBeCalledTimes(1);
        hookHandle(USE_EFFECT_HOOK);
        expect(useEffect).toBeCalledTimes(1);
        hookHandle(USE_CONTEXT_HOOK);
        expect(useContext).toBeCalledTimes(1);
    });
});
