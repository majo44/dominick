import { shouldUpdate, h, useState, useRef } from '../../packages/core/index.js';
import { render } from '../../packages/dom/index.js';

const itemComponent = (item, done, remove) => () => {
    shouldUpdate(item);
    return h`<tr>
        <td>
            ${item.done ? h`<s>${item.title}</s>` : item.title}
        </td>
        <td><button onclick='${() => done(item)}'>${item.done ? 'undone' : 'done'}</button></td>
        <td><button onclick='${() => remove(item)}'>remove</button></td>        
    </tr>`;
};

const form = (create) => () => {
    const [name, setName] = useState('');
    const input = useRef();
    const onkeyup = (e) => {
        const newValue = input.current.value;
        if (e.key === 'Enter') {
            create(newValue);
            setName('');
        } else if (newValue !== name) {
            setName(newValue);
        }
    };
    return h`<input ref='${input}' onkeyup='${onkeyup}' value='${name}'/>`;
};

const app = (items, create, done, remove) => () =>
    h`<div>
        <h1>Todo app</h1>
        ${form(create)}
        <table>
            ${items.map(i => itemComponent(i, done, remove))}
        </table>
    </div>`;

let items = [];

const create = (title) => {
    items = [{title},...items];
    renderApp();
};

const done = (item) => {
    items = items.map((i) => {
        if (i === item) {
            return { ...i, done: !i.done };
        } else {
            return i;
        }
    });
    renderApp();
};


const remove = (item) => {
    items = items.filter((i) => i !== item);
    renderApp();
};

const renderApp = () => {
    render(document.body, app(items, create, done, remove));
};

renderApp();