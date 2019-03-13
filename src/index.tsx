import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Geneviz from './components/Geneviz/Geneviz';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { GenevizAction } from './actions';
import { geneviz } from './reducers/index';
import { StoreState } from './types/index';
import thunk from 'redux-thunk';
import './index.css';

// Redux Store
const store = createStore<StoreState, GenevizAction, any, any>(geneviz, applyMiddleware(thunk));

store.subscribe(() => {
    console.log("Subscription in index.tsx is called!");
    console.log((store.getState()))
});

ReactDOM.render(
    <Provider store={store}>
        <Geneviz />
    </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
