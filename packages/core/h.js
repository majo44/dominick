import { VNODE } from './symbols.js';

/**
 * @typedef {function(Array.<*>): void} VNodeFactory
 * @typedef  {function(Array.<string>): VNodeFactory} VNodeFactoryFactory
 * @typedef {{createVNode: VNodeFactoryFactory}} VNodeContext
 * @typedef {function(VNodeContext): void} VNode
 */

/**
 * @type {WeakMap<object, VNodeFactory>}
 */
const literalsCache = new WeakMap();

/**
 * String template tag function which creates virtual node, based on provided
 * string literal and parameters.
 * @param {Array.<string>} literal string template literal
 * @param {Array.<*>} params string template parameters values
 * @return {VNode}
 */
export function h(literal, ...params) {
    /**
     * @type {*}
     * @param {VNodeContext} context
     */
    const vnode = function(context) {
        if (!literalsCache.has(literal)) {
            literalsCache.set(literal, context.createVNode(literal));
        }
        return literalsCache.get(literal)(params);
    };

    vnode[VNODE] = true;
    return vnode;
}
