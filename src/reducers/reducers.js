/**
 * This file includes all the reducers under reducers directory,
 * Import all and add to combineReducers to use any among whole app
 *
 * ***/

import {combineReducers} from 'redux';

import accounts from './accounts';
import productList from './productListReducer';

import productDetailReducers, {
    getDefaultSimpleSku,
    getFirstDefaultSupplier,
    getItemOnUrl,
    hasAnySimple,
    hasOnlyOS,
    isAlreadyInCart,
    isOutOfStock
} from './productDetailReducers';
import homePageReducers from './homePageReducers';
import cart from './cart';
import navigatorReducer, {currentScreen, firtsLaunch} from './navigatorReducer';
import filter from './filter';
import menus from './menus';
import searchReducer from './searchReducer';
import configAPIReducer, {getCountryFlag} from './configAPIReducer';
import featureMapAPIReducer from './featureMapAPIReducer';

const reducers = combineReducers({
    accounts,
    productList,
    homePageReducers,
    productDetailReducers,
    cart,
    filter,
    navigatorReducer,
    menus,
    searchReducer,
    configAPIReducer,
    featureMapAPIReducer,
    navigation: navigatorReducer,
    currentScreen,
    firtsLaunch
});

export default reducers;


/**
 * selector can be used to retrive data from states at component/container level
 * selector are just for retriving small info from deep level states, they can't be used to update data as actions
 */
export const selectors ={
    //for pdp
    isOutOfStock,
    hasAnySimple,
    hasOnlyOS,
    getDefaultSimpleSku,
    getFirstDefaultSupplier,
    isAlreadyInCart,
    getItemOnUrl,           //can be used for home, pdp and othe data structure saved on url
    getCountryFlag,
    //for home page
    //getHomeOnUrl,


};