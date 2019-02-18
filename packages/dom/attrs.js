import { normalizeEventName } from './event.js'

/**
 * Set of most popular simple attributes.
 */
const standardAttrs = {
    class: true,
    id: true,
    type: true,
    value: true
};

function camelToDash(str) {
    return str.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());
}

function specialCases(lcName) {
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
 * @return {{key: string, ref: function(e: Element):void, attrs: Array.<*>, events}}
 */
export function parseDynamicAttributes(dynamicAttrs, params) {
    let key, ref, attrs = [], events;
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
            // as standarAttrs are 80% cases when we are setting the attribute
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
                case 'key':
                    // key attribute is used by incremental-dom
                    key = value;
                    break;
                case 'ref':
                    // ref is used for referencing children
                    ref = value;
                    break;
                default:
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

    return {key, ref, attrs, events}
}
