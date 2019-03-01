/**
 * @typedef {Element & {[EVENTS_KEY]: *}} AugmentedElement/**
 * @typedef {Object.<string, {listener: function(Event): void, capture: boolean}>} ResolvedEventsMap
 */

const EVENTS_KEY = Symbol();

// https://www.w3.org/TR/html5/webappapis.html#events
// paragraph 7.1.5.2.1 Global and DocumentAndElementEventHandles tables
const lowerCaseEvents =  [
    'abort',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'click',
    'close',
    'copy',
    'cuechange',
    'cut',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'dragstart',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'paste',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'show',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'toggle',
    'volumechange',
    'waiting',
    'wheel'
];

/**
 * Caching for do not slice each time.
 * @type {Object.<string,{name: string, capture: boolean}>}
 */
let normalizedEventsCache = {};

/**
 * Turn attribute name to event name and capture flag
 * onClick -> click, false
 * onClickCapture -> click, true
 * onMouseMove -> mousemove, false
 * onMyEvent -> myEvent, false
 * @param {string} attrName
 * @return {{name: string, capture: boolean}}
 */
export function normalizeEventName(attrName) {
    return normalizedEventsCache[attrName] ||
        (normalizedEventsCache[attrName] = calculateNormalizeEventName(attrName));
}

/**
 * @param {string} attrName
 * @return {{name: string, capture: boolean}}
 */
function calculateNormalizeEventName(attrName) {
    let name = attrName.substr(2); // remove on
    let capture = false;
    if (name.slice(-7) === 'Capture') { // remove Capture
        capture = true;
        name = name.slice(0, -7);
    }
    const lcAttrName = name.toLowerCase();
    name = lowerCaseEvents.indexOf(lcAttrName) !== -1
        ? lcAttrName
        : lcAttrName[0] + name.substr(1); // turn first letter to lowercase
    return {name, capture};
}

/**
 * @param {Element} dom
 * @param {ResolvedEventsMap} events
 */
export function applyEvents(dom, events) {
    // apply events handlers
    const oldEvents = /** @type {AugmentedElement} */ (dom)[EVENTS_KEY];

    if (events) {
        const eventsNames = Object.keys(events);
        const count = eventsNames.length;
        for (let i = 0; i < count; i++) {
            const name = eventsNames[i];
            const {listener, capture} = events[name];
            const oldEvent = oldEvents && oldEvents[name];
            // adding handler only for new events, this prevents to attach handlers more the once
            // if element is rerendered multiple times
            if (!oldEvent || oldEvent.capture !== capture || oldEvent.listener !== listener) {
                dom.addEventListener(name, listener, capture);
                // if there was an old event, then remove it
                if (oldEvent) {
                    dom.removeEventListener(name, oldEvent.listener, oldEvent.capture);
                }
            }
            // remove processed event from old events list
            if (oldEvents) {
                delete oldEvents[name];
            }
        }
    }

    if (oldEvents) {
        const eventsNames = Object.keys(oldEvents);
        const count = eventsNames.length;
        for (let i = 0; i < count; i++) {
            const name = eventsNames[i];
            const oldEvent = oldEvents[name];
            dom.removeEventListener(name, oldEvent.listener, oldEvent.capture);
        }
    }

    /** @type {AugmentedElement} */ (dom)[EVENTS_KEY] = events;
}