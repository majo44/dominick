import { normalizeEventName } from './event.js';

/**
 * @typedef {import('./event.js').ResolvedEventsMap} ResolvedEventsMap
 * @typedef {{key: string, ref: function(Element):void, attrs: Array.<*>, events: ResolvedEventsMap}} ResolvedAttributes
 */

/**
 * Set of most popular simple attributes.
 * @type {Object.<string, boolean>}
 */
const standardAttrs = {
    class: true,
    id: true,
    type: true,
    value: true
};

/**
 * @param {string} str
 * @return {string}
 */
function camelToDash(str) {
    return str.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());
}

/**
 * @param {string} lcName
 * @return {string | undefined}
 */
function specialCases(lcName) {
    /**
     * @type {Object.<string, string>}
     */
    const transformation = {
        classname: 'class',
        htmlfor: 'for',
        xlinkactuate: 'xlink:actuate',
        xlinkarcrole: 'xlink:arcrole',
        xlinkhref: 'xlink:href',
        xlinkrole: 'xlink:role',
        xlinkshow: 'xlink:show',
        xlinktitle: 'xlink:title',
        xlinktype: 'xlink:type',
        xmlbase: 'xml:base',
        xmllang: 'xml:lang',
        xmlspace: 'xml:space'
    };
    return transformation[lcName];
}

/**
 * @param {Array.<{name: string, pointer: number}>} dynamicAttrs
 * @param {Array.<*>} params
 * @return {ResolvedAttributes}
 */
export function parseDynamicAttributes(dynamicAttrs, params) {
    /** @type {string} */
    let key;
    /** @type {Array.<string>} **/
    let attrs = [];
    /** @type {ResolvedEventsMap} */
    let events;
    /** @type {function(Element):void} **/
    let ref;
    for (let i = 0; i < dynamicAttrs.length; i++) {
        let attributeName = dynamicAttrs[i].name;
        let value = params[dynamicAttrs[i].pointer];
        if (value === false) {
            value = undefined;
        } else if (value === true) {
            value = '';
        }
        // this is performance optimized statement, please think twice befor refactor :)
        if (standardAttrs[attributeName]) {
            // as standardAttrs are 80% cases when we are setting the attribute
            // there is no need for future calculation
            attrs.push(attributeName, value);
        } else if (attributeName.charAt(0) === 'o' && attributeName.charAt(1) === 'n') {
            // events
            if (typeof value === 'string') {
                attrs.push(attributeName, value);
            } else {
                const {name, capture} = normalizeEventName(attributeName);
                if (!events) {
                    events = {};
                }
                events[name] = {listener: value, capture};
            }
        } else {
            const lcAttributeName = attributeName.toLowerCase();
            switch (lcAttributeName) {
                case 'key': {
                    // key attribute is used by incremental-dom
                    key = value;
                    break;
                }
                case 'ref': {
                    // ref is used for referencing children
                    ref = value;
                    break;
                }
                default: {
                    if (specialCases(lcAttributeName)) {
                        attributeName = specialCases(lcAttributeName);
                    } else if (lcAttributeName !== attributeName) {
                        if (typeof value === 'undefined' || typeof value === 'number' || typeof value === 'string') {
                            // for primitives if name is camelCase we will change the name to dashCase
                            attributeName = camelToDash(attributeName);
                        }
                    }
                    attrs.push(attributeName, value);
                }
            }
        }
    }

    return {key, ref, attrs, events};
}
