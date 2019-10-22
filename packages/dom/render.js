import {VNODE, executeInHandleContext} from '@dominick/core/index.js';
import {handleHookShouldUpdate} from './hooks/shouldUpdate.js';
import {handleHookUseEffectPostUpdate} from './hooks/useEffect.js';
import {handleHookUseState} from './hooks/useState.js';
import {parseDynamicAttributes} from './attrs.js';
import {applyEvents} from './event.js';
import {getLocalContext, clearLocalContext, setLocalContext} from './context/localContext.js';
import {clearGlobalContext, setGlobalContext, getGlobalContext} from './context/globalContext.js';
import {hookHandle} from './hooks/hookHandle.js';

/* global IncrementalDOM */

/**
 * @typedef {import('../core/h.js').VNode} VNode
 * @typedef {Element & {[LOCAL_CONTEXT]: *}} AugmentedElement
 * @typedef {VNode | (function & {[VNODE]: boolean})|string|number|undefined|null} PrimitiveVNodeChild
 * @typedef {PrimitiveVNodeChild|Array.<PrimitiveVNodeChild>} VNodeChild
 */

const LOCAL_CONTEXT = Symbol();
const MARKER = '_@_@_@_';

const {
    elementOpen, text, elementClose, patch, skipNode, attributes,
    applyProp, applyAttr, currentPointer, elementVoid
} = IncrementalDOM;

/**
 * @param {Element} el
 * @param {string} name
 * @param {string} value
 */
attributes.value = (el, name, value) => {
    applyProp(el, name, value);
    applyAttr(el, name, value);
};

/**
 * @param {Element} el
 * @param {string} name
 * @param {string} value
 */
attributes.disabled = attributes.checked = (el, name, value) => {
    // for boolean attrs idom passes values as '' for true and undefined for false
    const newValue = value === '';
    applyProp(el, name, newValue);
    applyAttr(el, name, value);
};

/**
 * @type {number}
 */
let paramsPointer = 0;

/**
 * @param {Node} node
 */
function onStart(node) {
    paramsPointer = 0;
    return onChildren(node);
}

/**
 * @param {Node} node
 * @return {(function(Array.<*>): *)}
 */
function onChildren(node) {
    if (node.childNodes.length > 0) {
        const children = Array.prototype
            .map.call(node.childNodes, onElement)
            .filter(/** @param {*} i */ (i) => !!i);
        const count = children.length;
        if (count === 1) {
            const child = children[0];
            return (params) => [child(params)];
        } else {
            return function (params) {
                let res = [];
                for (let i = 0; i < count; i++) {
                    res[i] = children[i](params);
                }
                return res;
            };
        }
    } else {
        return undefined;
    }
}

/**
 * @param {*} child
 * @return {*}
 */
function renderChild(child) {
    switch (typeof child) {
        case 'function': {
            if (!child[VNODE]) {
                try {
                    const myPointer = /** @type {AugmentedElement} */ (currentPointer());
                    let skip = false;
                    let currentLocalContext = myPointer ? myPointer[LOCAL_CONTEXT] : undefined;
                    setLocalContext(currentLocalContext);
                    const nextChild = /** @type {VNodeChild} */ (executeInHandleContext(child, hookHandle));
                    currentLocalContext = getLocalContext();
                    if (currentLocalContext) {
                        skip = !handleHookShouldUpdate(currentLocalContext);
                    }
                    if (!skip) {
                        const [dom] = /** @type {Array.<AugmentedElement>} */ (renderChild(nextChild));
                        dom[LOCAL_CONTEXT] = currentLocalContext;
                        handleHookUseEffectPostUpdate(currentLocalContext);
                        handleHookUseState(currentLocalContext, () => rerender(dom, child, getGlobalContext()));
                        return dom;
                    } else {
                        skipNode();
                        return myPointer;
                    }
                } finally {
                    clearLocalContext();
                }
            } else {
                return child({createVNode, hookHandle});
            }
        }
        case 'string':
            return text(child);
        case 'number':
            return text(child.toString());
        case 'boolean':
        case 'undefined':
            return;
        default: {
            if (Array.isArray(child)) {
                const count = child.length;
                const res = [];
                for (let i = 0; i < count; i++) {
                    res[i] = renderChild(child[i]);
                }
                return res;
            } else {
                return;
            }
        }
    }
}

/**
 * @param {Element} element
 */
function onElement(element) {
    if (element.nodeType === 3 && element.nodeValue) {
        const parts = element.nodeValue.split(MARKER);
        if (parts.length < 2) {
            return () => {
                return text(parts[0]);
            };
        } else {
            const pointer = paramsPointer;
            paramsPointer = paramsPointer + parts.length - 1;
            return (
                /**
                 * @param {Array.<*>} params
                 */
                (params) => {
                    let localPointer = pointer;
                    let result = [];
                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i]) {
                            result.push(text(parts[i]));
                        }
                        if (i < parts.length - 1) {
                            result.push(renderChild(params[localPointer++]));
                        }
                    }
                    return result;
                });
        }
    }

    /**
     * @type {string}
     */
    let tag = element.tagName;
    /**
     * @type {Array.<string>}
     */
    let staticAttrs = [];
    /**
     * @type {Array.<{name: string, pointer: number}>}
     */
    let dynamicAttrs = [];

    Array.prototype.forEach.call(element.attributes,
        /**
         * @param {Attr} attr
         */
        (attr) => {
            if (attr.value === MARKER) {
                dynamicAttrs.push(({name: attr.name, pointer: paramsPointer++}));
            } else {
                staticAttrs.push(attr.name);
                staticAttrs.push(attr.value);
            }
        });

    const children = onChildren(element);

    return (
        /**
         * @param {Array.<*>} params
         */
        (params) => {
            const {key, ref, attrs, events} = parseDynamicAttributes(dynamicAttrs, params);
            /**
             * @type {AugmentedElement}
             */
            let dom;
            if (children) {
                dom = /** @type {AugmentedElement} **/ (elementOpen(tag, key, undefined, ...staticAttrs, ...attrs));
                children(params);
                elementClose(tag);
            } else {
                dom = /** @type {AugmentedElement} **/ (elementVoid(tag, key, staticAttrs, ...attrs));
            }
            events && applyEvents(dom, events);
            ref && ref(dom);
            return dom;
        });
}

/**
 * @param {Array.<string>} literal
 */
function createVNode(literal) {
    const raw = literal.join(MARKER);
    const parser = new DOMParser();
    const parsed = parser.parseFromString(raw, 'application/xml');
    return onStart(parsed);
}

/**
 * @param {Element} previousDom
 * @param {function} vnode
 * @param {*} context
 */
function rerender(previousDom, vnode, context) {
    patch(previousDom.parentElement, () => {
        const len = previousDom.parentNode.childNodes.length;
        for (let i = 0; i < len; i++) {
            if (currentPointer() !== previousDom) {
                skipNode();
            } else {
                setGlobalContext(context);
                renderChild(vnode);
                clearGlobalContext();
            }
        }
    }, {createVNode});
}


/**
 * Renders markup under provided parent node.
 * @param {Element} where the target of rendering
 * @param {VNode | function():VNode } what markup which have to be rendered
 * @param {*?} globalContext the custom global context which is available
 *      within the functional component by use getContext hook
 */
export function render(where, what, globalContext) {
    if (typeof what === 'function') {
        setGlobalContext(globalContext);
        patch(where, () => renderChild(what), {createVNode});
        clearGlobalContext();
    } else {
        throw new Error('Illegal argument exception.');
    }
}