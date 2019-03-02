import { h, shouldUpdate, useContext, useEffect, useRef, useState, VNODE  } from '../core/index.js';
import { render } from './render.js';

const { notifications } = IncrementalDOM;

describe('render', () => {
    afterEach(() => window.document.body.innerHTML = '');

    it('should throw exception if not function is provided as item to render', () => {
        expect(() => render(window.document.body, 1)).toThrow();
    });
    it('should render nothing if try to render object', () => {
        render(window.document.body, h`<div>${({})}</div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('is renders simple markup', () => {
        const app = (name) => h`<div>Hello ${name}</div>`;
        render(window.document.body, app('Majo'));
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should render number', () => {
        render(window.document.body, h`<div>${1}</div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should not render boolean', () => {
        render(window.document.body, h`<div>${true}${false}</div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should render functional component', () => {
        const component = (name) => () => h`<span>${name}</span>`;
        render(window.document.body, h`<div>${component('Majo')}</div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should render array of children', () => {
        render(window.document.body, h`<div>${[h`<span>Hello</span>`, h`<span>Pawel</span>`]}</div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should render empty tag', () => {
        render(window.document.body, h`<div><span></span></div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set value attribute also as property', () => {
        render(window.document.body, h`<input value="${'value'}"/>`);
        expect(window.document.body.firstElementChild.value).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set checked true attribute also as property', () => {
        render(window.document.body, h`<input checked="${true}"/>`);
        expect(window.document.body.firstElementChild.checked).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set checked false attribute also as property', () => {
        render(window.document.body, h`<input checked="${false}"/>`);
        expect(window.document.body.firstElementChild.checked).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set disabled true attribute also as property', () => {
        render(window.document.body, h`<input disabled="${true}"/>`);
        expect(window.document.body.firstElementChild.disabled).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set disabled false attribute also as property', () => {
        render(window.document.body, h`<input disabled="${false}"/>`);
        expect(window.document.body.firstElementChild.disabled).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should support reuse of dom', () => {
        let count = 0;
        notifications.nodesCreated = (nodes) => count = count + nodes.length;
        window.document.body.innerHTML = '<div>Hello<span>Majo</span></div>';
        render(window.document.body, () => h`<div>Hello<span>Majo</span></div>`);
        expect(count).toBe(0);
    });
    it('should support shouldUpdate and not rerender if value is not changed', () => {
        const markup = jest.fn(h`<span>Majo</span>`);
        markup[VNODE] = true;
        const component = () => () => {
            shouldUpdate(1);
            return markup;
        };
        render(window.document.body, component());
        render(window.document.body, component());
        expect(markup).toBeCalledTimes(1);
    });
    it('should support rerender of child component', () => {
        let setNameGlobal;
        const component = () => () => {
            const [name, setName] = useState('Majo');
            setNameGlobal = setName;
            return h`<span>${name}</span>`;
        };
        render(window.document.body, () => h`<div>
            <span>Header</span>
            ${component()}
            <span>Footer</span>
        </div>`);
        expect(window.document.body.innerHTML).toMatchSnapshot();
        setNameGlobal('Olo');
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should support dynamic and static attributes', () => {
        const component = (classe) => () => {
            return h`<span class="${classe}" style="color: blue;">Name</span>`;
        };
        render(window.document.body, component('aclasse'));
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
});