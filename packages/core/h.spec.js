import { h } from './h.js';
describe('h', () => {
    it('create vnode', () => {
        const vnode = h`abc${1}def`;
        const node = jest.fn((a) => () => null);
        const createVNode = jest.fn((a) => node);
        vnode({createVNode});
        vnode({createVNode});
        expect(createVNode).toHaveBeenCalledTimes(1);
        expect(node).toHaveBeenCalledTimes(2);
        expect(node).toHaveBeenCalledWith([1]);
    })
});