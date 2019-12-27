/* eslint-disable import/default */
import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import MyRoute from './MyRoute';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore.dev';

const store = configureStore();

render(
    <Provider store={store}>
        <MyRoute />
    </Provider>,
    document.getElementById('app')
);
