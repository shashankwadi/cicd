'use strict';


import {applyMiddleware, createStore} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger'

import reducers from 'Wadi/src/reducers/reducers';
import analyticsLogger from 'Wadi/src/analytics/analytics.js'
import epicSearchMiddleware from 'Wadi/src/utilities/epicAutocompleteMiddleware.js'
import {isDebug} from "../utilities/namespaces/config";

const epicMiddleware = createEpicMiddleware(epicSearchMiddleware);
const loggerMiddleware = createLogger();
let debugMiddlewares = [];
if (isDebug) {
    debugMiddlewares = [...debugMiddlewares, loggerMiddleware];
}
const store = createStore(
    reducers,
    applyMiddleware(
        //sagaMiddleware,
        thunkMiddleware, // lets us dispatch() functions
        analyticsLogger, // All the analytics recording
        //screenLogger, //Screen tracking now we are tracking screen withour redux
        epicMiddleware,
        ...debugMiddlewares,
    )
);

export default store;

/**
 * This function dispatches
 * @param arg
 */
export function fallbackActionDispatcher(arg) {
    if (typeof arg === "function")
        store.dispatch(arg())
    else
        store.dispatch(arg);
}