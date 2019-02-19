import * as index from './index.js';
describe('index', () => {
    it('exports proper public members', () => {
        expect(Object.keys(index)).toEqual([
            "h",
            "shouldUpdate",
            "useContext",
            "useEffect",
            "useRef",
            "useState",])
    })
});