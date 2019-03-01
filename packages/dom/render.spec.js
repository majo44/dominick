import { h } from '../core/index.js';
import { render } from './render.js';

describe('render', () => {
    it('should throw exception if not function is provided as item to render', () => {
        expect(() => render(window.document.body, 1)).toThrow();
    });
    it('should throw exception if try to render object', () => {
        expect(() => render(window.document.body, h`<div>${({})}</div>`)).toThrow();
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
        render(window.document.body, h`<input type="checkbox" value="${'value'}" checked="${true}"/>`);
        expect(window.document.body.firstElementChild.checked).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set checked false attribute also as property', () => {
        render(window.document.body, h`<input type="checkbox" value="${'value'}" checked="${false}"/>`);
        expect(window.document.body.firstElementChild.checked).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set disabled true attribute also as property', () => {
        render(window.document.body, h`<input value="${'value'}" disabled="${true}"/>`);
        expect(window.document.body.firstElementChild.disabled).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });
    it('should properly set disabled false attribute also as property', () => {
        render(window.document.body, h`<input value="${'value'}" disabled="${false}"/>`);
        expect(window.document.body.firstElementChild.disabled).toMatchSnapshot();
        expect(window.document.body.innerHTML).toMatchSnapshot();
    });

});