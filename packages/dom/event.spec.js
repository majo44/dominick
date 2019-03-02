import { normalizeEventName, applyEvents } from './event.js';

function getClickEvent() {
    const evt = window.document.createEvent('MouseEvent');
    evt.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
    return evt;
}

describe('event', () => {
    describe('normalizeEventName', () => {
        it ('should properly normalize the events', () => {
            expect(normalizeEventName('onClick')).toEqual({capture: false, name: 'click'});
            expect(normalizeEventName('onKeyUpCapture')).toEqual({capture: true, name: 'keyup'});
        })
    });
    describe('applyEvents', () => {
        it('should properly apply events listeners to dom', () => {
            const dom = window.document.createElement('div');
            const listener = jest.fn();
            applyEvents(dom, {click: {listener}});
            dom.dispatchEvent(getClickEvent());
            expect(listener).toBeCalledTimes(1);
        });
        it('should properly remove events listeners from dom', () => {
            const dom = window.document.createElement('div');
            const listener = jest.fn();
            applyEvents(dom, {click: {listener}});
            applyEvents(dom, {});
            dom.dispatchEvent(getClickEvent());
            expect(listener).toBeCalledTimes(0);
        });
        it('should properly replace events listeners in dom', () => {
            const dom = window.document.createElement('div');
            const listener1 = jest.fn();
            const listener2 = jest.fn();
            applyEvents(dom, {click: {listener: listener1}});
            dom.dispatchEvent(getClickEvent());
            applyEvents(dom, {click: {listener: listener2}});
            dom.dispatchEvent(getClickEvent());
            expect(listener1).toBeCalledTimes(1);
            expect(listener2).toBeCalledTimes(1);
        });
    })
});