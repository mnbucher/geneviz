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

/* GENEVIZ Web Application 

Version 1.0

Date: 13.05.2019
Author: Martin Juan José Bucher
Bachelor Thesis @ University of Zurich */

// Redux Store
const store = createStore<StoreState, GenevizAction, any, any>(geneviz, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <Geneviz />
    </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();