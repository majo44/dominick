# @dominick
Small library for html rendering by using tagged string templates & virtual dom.
*This code is experimental*

### The assumptions
* No custom DSL, plain string literals and javascript
* No compilation/transpiration requirement  
* Support SSR 
* Support lazy load
* Simple functional computerisation with support of lifecycle hooks
* Minimal size, efficient render, minimal memory consumption  
* ...

##### Rendering html
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

render(document.body, () => h`<div>Hello my friend</div>`);
```

##### Handling events
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

const onclick = (event) => alert('Clicked');
render(document.body, () => h`<div onclick="${onclick}">Hello my friend</div>`);
```

##### Component
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

const app = (name) => () => h`<div>Hello ${name}</div>`;
render(document.body, app('my friend'));
```

##### Nested component
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

const nestedComponent = (name) => () => h`<b>${name}</b>`;
const app = (name) => () =>
    h`<div>Hello ${nestedComponent(name)}</div>`;
render(document.body, app('my friend'));
```

##### Optimised component 
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

const nestedComponent = (name) => () => {
    // the component will be not reentered if name will be not changed 
    shouldUpdate(name);
    return h`<b>${name}</b>`;
};
const app = (name) => () => h`<div>Hello ${nestedComponent(name)}</div>`;
render(document.body, app('my friend'));
```

##### Static component 
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

const nestedComponent = (name) => () => {
    // the component will be rendered only once
    shouldUpdate(1);
    return h`<b>${name}</b>`;
};
const app = (name) => () => h`<div>Hello ${nestedComponent(name)}</div>`;
render(document.body, app('my friend'));
```

##### Component with state
```javascript
import {h} from '@dominic/core';
import {render} from '@dominic/dom';

const counter = (start) => () => {
    const [count, setCount] = useState(start);
    return h`<button onclick="${() => setCount(count + 1)}">${count}</button>`;
};
const app = (start) => () => h`<div>${counter(start)}</div>`;
render(document.body, app('my friend'));
```

### Todo
* Coverage
* Example with routing
* Example with I18n
