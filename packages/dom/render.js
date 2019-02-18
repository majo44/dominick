import { handleHookShouldUpdate } from "../core/hooks/shouldUpdate.js";
import { handleHookUseEffectPostUpdate, handleHookUseEffectPostRemove } from "../core/hooks/useEffect.js";
import { handleHookUseState } from "../core/hooks/useState.js";
import { VNODE } from "../core/utils/symbols.js";
import { parseDynamicAttributes } from './attrs.js';
import { applyEvents } from './event.js';
import { getLocalContext, clearLocalContext, setLocalContext } from '../core/context/localContext.js';
import { clearGlobalContext, setGlobalContext, getGlobalContext } from '../core/context/globalContext.js';

const LOCAL_CONTEXT = Symbol();
const MARKER = '_@_@_@_';
const {
    elementOpen, text, elementClose, patch, skipNode, attributes,
    applyProp, applyAttr, currentPointer, elementVoid, notifications } = IncrementalDOM;

attributes.value = (el, name, value) => {
    applyProp(el, name, value);
    applyAttr(el, name, value);
};

attributes.disabled = attributes.checked = (el, name, value) => {
    // for boolean attrs idom passes values as '' for true and undefined for false
    const newValue = value === '';
    applyProp(el, name, newValue);
    applyAttr(el, name, value);
};

let paramsPointer = 0;
let currentComponent = undefined;
let currentContext = undefined;

/**
 * @param {Node} node
 */
function onStart(node) {
    paramsPointer = 0;
    return onChildren(node);
}

function onChildren(node) {
    if (node.childNodes.length > 0) {
        const children = Array.prototype.map.call(node.childNodes, onElement).filter(i => !!i);
        const l = children.length;
        return (params) => {
            for (let i = 0; i < l; i++) {
                children[i](params);
            }
        }
    }
}

function renderChild(child) {
    switch (typeof child) {
        case 'function': {
            if (!child[VNODE]) {
                currentComponent = child;
                const myPointer = currentPointer();
                if (myPointer) {
                    currentContext = myPointer[LOCAL_CONTEXT];
                    setLocalContext(currentContext);
                }
                child = child();
                return renderChild(child);
            } else {
                return renderChild(child({createVNode}));
            }
        }
        case 'string': return text(child);
        case 'number': return text(child.toString());
        case 'boolean':
        case 'undefined': return;
        default: {
            if (Array.isArray(child)) {
                const l = child.length;
                for (let i = 0; i < l; i++) {
                    renderChild(child[i])
                }
            } else if (child !== null) {
                throw new Error('Unsuported type of child ' + child);
            }
        }
    }
}

/**
 * @param {Element | string} element
 */
function onElement(element) {
    if (element.nodeType === 3 && element.nodeValue) {
        const parts = element.nodeValue.split(MARKER);
        if (parts.length < 2) {
            if (parts[0]) {
                return () => {
                    text(parts[0]);
                };
            } else {
                return
            }
        } else {
            const pointer = paramsPointer;
            paramsPointer = paramsPointer + parts.length - 1;
            return (params) => {
                let localPointer = pointer;
                for(let i = 0; i < parts.length; i++) {
                    if (parts[i]) {
                        text(parts[i]);
                    }
                    if (i < parts.length - 1) {
                        renderChild(params[localPointer++]);
                    }
                }
            };
        }
    }

    let tag = element.tagName,
        staticAttrs = [],
        dynamicAttrs = [];

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

    return (params) => {
        let skip = false;
        const globalContext = getGlobalContext();
        const myFComponent = currentComponent;
        const localCurrentContext = currentContext || getLocalContext();
        currentContext = undefined;
        clearLocalContext();
        if (localCurrentContext) {
            skip = !handleHookShouldUpdate(localCurrentContext);
        }
        if (!skip) {
            const {key, ref, attrs, events} = parseDynamicAttributes(dynamicAttrs, params);
            let dom;
            if (children) {
                dom = elementOpen(tag, key, null, ...staticAttrs, ...attrs);
                if (localCurrentContext) {
                    dom[LOCAL_CONTEXT] = localCurrentContext;
                }
                children(params);
                elementClose(tag);
            } else {
                dom = elementVoid(tag, key, staticAttrs, ...attrs);
                if (localCurrentContext) {
                    dom[LOCAL_CONTEXT] = localCurrentContext;
                }
            }
            events && applyEvents(dom, events);
            ref && ref(dom);
            handleHookUseEffectPostUpdate(localCurrentContext);
            handleHookUseState(localCurrentContext, () => rerender(dom, myFComponent, globalContext));
        } else {
            clearLocalContext();
            skipNode();
        }
    };
}

notifications.nodesDeleted = function(nodes) {
    nodes.forEach((node) => handleHookUseEffectPostRemove(node[LOCAL_CONTEXT]));
};

/**
 * @param {Array.<string>} literal
 */
function createVNode(literal) {
    const raw = literal.join(MARKER);
    const parser = new DOMParser();
    const parsed = parser.parseFromString(raw, 'application/xml');
    return onStart(parsed);
}

export function render(where, what, globalContext) {
    if (typeof what === "function") {
        setGlobalContext(globalContext);
        patch(where, () => renderChild(what), {createVNode});
        clearGlobalContext();
    }
}

/**
 */
function rerender(previousDom, vnode, localContext, context) {
    patch(previousDom.parentNode, () => {
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
    }, {createVNode})
}
