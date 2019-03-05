import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Geneviz from './containers/Geneviz';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { GenevizAction } from './actions';
import { geneviz } from './reducers/index';
import { StoreState } from './types/index';
import './index.css';

// Initialize Redux Store
const store = createStore<StoreState, GenevizAction, any, any>(geneviz, {
    sfcp: {
        vnffgd: {},
        nsd: {},
    },
    vnfs: [],
});

const unsubscribe = store.subscribe(() => {
    console.log("Subsription in index.tsx is called!");
    console.log((store.getState()).vnfs)
});

ReactDOM.render(
    <Provider store={store}>
        <Geneviz />
    </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
