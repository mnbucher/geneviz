import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Geneviz from './containers/Geneviz';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import { GenevizAction } from './actions';
import { geneviz } from './reducers/index';
import { StoreState } from './types/index';

const store = createStore<StoreState, GenevizAction, any, any>(geneviz, {
    sfcp: {
        vnffgd: {},
        nsd: {},
    },
    vnfs: [],
});

ReactDOM.render(
    <Provider store={store}>
        <Geneviz />
    </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
