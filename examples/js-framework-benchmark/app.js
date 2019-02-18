import { h, shouldUpdate, useEffect, useState } from '../../packages/core/index.js';
import { render } from '../../packages/dom/index.js';


const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let _nextId = 1;
function buildData(count) {
    const data = [];

    for (let i = 0; i < count; i++) {
        data.push({
            id: "" + _nextId++,
            label: `${ADJECTIVES[_random(ADJECTIVES.length)]} ${COLOURS[_random(COLOURS.length)]} ${NOUNS[_random(NOUNS.length)]}`,
        });
    }

    return data;
}

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

class Store {

    constructor() {
        this.data = [];
    }

    run() {
        this.data = buildData(1000);
    }

    runLots() {
        this.data = buildData(10000);
    }

    add() {
        this.data = this.data.concat(buildData(1000));
    }

    update() {
        this.data = this.data.map((val, i) => {
            if (i % 10 === 0) {
                return {...val, label: val.label + " !!!"};
            } else {
                return val;
            }
        });
        this.selected = null;
    }

    clear() {
        this.data = [];
        this.selected = null;
    }

    swapRows() {
        if (this.data.length > 998) {
            const a = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = a;
            this.data = [...this.data];
        }
    }

    delete(id) {
        this.data = this.data.filter((d) => d.id !== id);
    }

    select(id) {
        this.data = this.data.map((val) => {
            if (val.selected && val.id !== id) {
                return {...val, selected: false};
            } else if (val.id === id) {
                return {...val, selected: true}
            } else {
                return val;
            }
        });
    }
}

const store = new Store();

const action = (action, id) => {
    const predata  = store.data;
    const preselected = store.selected;
    switch (action) {
        case "run":
            store.run();
            break;
        case "runlots":
            store.runLots();
            break;
        case "add":
            store.add();
            break;
        case "update": {
            store.update();
            break;
        }
        case "clear":
            store.clear();
            break;
        case "swaprows": {
            store.swapRows();
            break;
        }
        case "delete": {
            store.delete(id);
            break;
        }
        case "select": {
            store.select(id);
            break;
        }
    }

    if (store.data !== predata || store.selected !== preselected) {
        renderApp();
    }
};


const benchmarkMenuButton = (id, label, action) => () => {
    shouldUpdate(1);
    return h`<div class="col-sm-6 smallpad">
        <button type="button" class="btn btn-primary btn-block" id="${id}" onclick="${() => action(id)}">${label}</button>
    </div>`;
};

const benchmarkTableRow = (data) => () => {
    shouldUpdate(data);
    return h`<tr class="${data.selected ? 'danger' : ''}">
        <td class="col-md-1">${data.id}</td>
        <td class="col-md-4"><a data-id="${data.id}" data-action="select">${data.label}</a></td>
        <td class="col-md-1">
            <a><span class="glyphicon glyphicon-remove" aria-hidden="true" data-id="${data.id}" data-action="delete"></span></a>
        </td>
        <td class="col-md-6"/>
    </tr>`;
};

const tableClickListener = (e) => {
    let id = e.target.getAttribute('data-id');
    let actionType = e.target.getAttribute('data-action');
    if (id && action) {
        action(actionType, id);
    }
};

const benchmarkTable = (data) => () => {
    shouldUpdate(data);
    return h`<table class="table table-hover table-striped test-data" onclick="${tableClickListener}">
            ${data.length > 0 ?
                h`<tbody>${data.map(benchmarkTableRow)}</tbody>` : 
                h`<tbody></tbody>`}
        </table>`;
};

const jumbotron = () => () => {
    shouldUpdate(1);
    return h`
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6"><h1>dote</h1></div>
                <div class="col-md-6">
                    <div class="row">
                        ${benchmarkMenuButton('run', 'Create 1,000 rows', action)}
                        ${benchmarkMenuButton('runlots', 'Create 10,000 rows', action)}
                        ${benchmarkMenuButton('add', 'Append 1,000 rows', action)}
                        ${benchmarkMenuButton('update', 'Update every 10th row', action)}
                        ${benchmarkMenuButton('clear', 'Clear', action)}
                        ${benchmarkMenuButton('swaprows', 'Swap Rows', action)}
                    </div>
                </div>
            </div>
        </div>`;
};

const appFormFactory = (value) => () => {
    const [count, setCount] = useState(0);
    useEffect(() => () => console.log('removing'));
    return h`<button onclick="${() => setCount(count + 1)}">${value} - ${count}</button>`
};

let conter = 0;

const benchmarkApp = (data) => () => {
    return h`<div id="main">
        <div class="container">
            ${jumbotron()}
            ${benchmarkTable(data)}
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
        </div>
    </div>`
};

const target = document.createElement('div');
document.body.append(target);

const renderApp = () => {
    render(target, benchmarkApp(store.data), 'abc');
};

renderApp();
