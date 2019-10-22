import { diffArray } from './diffArray.js';
describe('diffArray', () => {
    it('should detect array diffs', () => {
        expect(diffArray()).toBeFalsy();
        expect(diffArray([],[])).toBeFalsy();
        expect(diffArray([1],[1])).toBeFalsy();
        expect(diffArray([])).toBeTruthy();
        expect(diffArray(null, [])).toBeTruthy();
        expect(diffArray([1],[1, 2])).toBeTruthy();
        expect(diffArray([1],[2])).toBeTruthy();
    })
});