import { VNODE } from './utils/symbols.js';
export { shouldUpdate } from './hooks/shouldUpdate.js';

const literalsCache = new WeakMap();

/**
 * String template tag function which creates virtual node, based on provided
 * string literal and parameters.
 * @param {Array.<string>} literal string template literal
 * @param {Array.<*>} params string template parameters values
 * @return
 */
export function h(literal, ...params) {
    /**
     *
     * @param createVNode
     */
    const vnode = ({createVNode}) => {
        if (!literalsCache.has(literal)) {
            literalsCache.set(literal, createVNode(literal));
        }
        literalsCache.get(literal)(params);
    };
    vnode[VNODE] = true;
    return vnode;
}