'use strict';

import React from 'react';
import Types from '../actions/actionTypes';

import {
    AsyncStorage
} from 'react-native';

import Actions from '../actions/actionTypes';
import {isEmptyString} from '../utilities/utilities';
import store from 'Wadi/src/reducers/store';
import MSDKEYS from './msdConstants'

function MSDTracker() {

    this.getTrackingObj = (trackingObj, actionType) => {
        let actionEventType = actionType;
        let msdTrackingObj = {};
        if (actionEventType === Actions.DEEP_LINK && trackingObj.eventType) {
            actionEventType = trackingObj.eventType;
        }
        switch (actionEventType) {

            //check for different event types and return objects accordingly.
            case Types.GET_PRODUCT_DETAIL_SUCCESS:
                msdTrackingObj = getProductDetailObject(trackingObj);
                break;
            case Types.ADD_TO_CART:
                msdTrackingObj = getAddToCart(trackingObj);
                break;
            case Types.REMOVE_FROM_CART:
                msdTrackingObj = removeFromCart(trackingObj);
                break;
            case Types.ON_ORDER_PLACED:
                msdTrackingObj = trackOnOrderPlaced();
                break;
            case Types.CAROUSAL_PRODUCT_CLICK:
                msdTrackingObj = carousalProductClick(trackingObj);
                break;
            case Types.CAROUSAL_SWIPE:
                msdTrackingObj = carousalSwipe(trackingObj);
                break;

            default: {

            }
                break;
        }
        return msdTrackingObj;
    }
}

const getProductDetailObject = (trackingObj) => {

    let getStore = getStoreData(),
        accountStore = getStore ? getStore.accounts : null,
        featureMapObj = getStore ? getStore.featureMapAPIReducer.featureMapObj : null;


    let msdTrackingObj = {};
    msdTrackingObj = {
        ...msdTrackingObj,
        [MSDKEYS.event]: '/pageView',
        [MSDKEYS.pageType]: 'pdp',
        [MSDKEYS.sourceProdID]: trackingObj.sku,
        [MSDKEYS.prodPrice]: trackingObj.specialPrice ? trackingObj.specialPrice : trackingObj.price,
        [MSDKEYS.userID]: accountStore ? (accountStore.userData && accountStore.userData.email ? accountStore.userData.email : '') : '',
        [MSDKEYS.sourceCatgID]: getProductCategory(trackingObj),
        [MSDKEYS.currency]: featureMapObj ? (featureMapObj.currency && featureMapObj.currency.label ? featureMapObj.currency.label : '') : '',
        [MSDKEYS.uuid]: ''      //TODO:make a native function to fetch uuid

    }


    // Object.assign(msdTrackingObj, {key: 'value'})
    return msdTrackingObj;
}

const getAddToCart = (trackingObj) => {

    let getStore = getStoreData(),
        accountStore = getStore ? getStore.accounts : null,
        featureMapObj = getStore ? getStore.featureMapAPIReducer.featureMapObj : null;

    let msdTrackingObj = {};
    msdTrackingObj = {
        ...msdTrackingObj,
        [MSDKEYS.event]: '/addToCart',
        [MSDKEYS.pageType]: 'pdp',
        [MSDKEYS.sourceProdID]: trackingObj.data.sku,
        [MSDKEYS.prodPrice]: trackingObj.data.price,
        [MSDKEYS.userID]: accountStore ? (accountStore.userData && accountStore.userData.email ? accountStore.userData.email : '') : '',
        [MSDKEYS.sourceCatgID]: getProductCategory(trackingObj.data),
        [MSDKEYS.currency]: featureMapObj ? (featureMapObj.currency && featureMapObj.currency.label ? featureMapObj.currency.label : '') : '',
        [MSDKEYS.uuid]: ''      //TODO:make a native function to fetch uuid

    }
    return msdTrackingObj;

}

const removeFromCart = (trackingObj) => {

    let getStore = getStoreData(),
        accountStore = getStore ? getStore.accounts : null,
        featureMapObj = getStore ? getStore.featureMapAPIReducer.featureMapObj : null;

    let msdTrackingObj = {};
    msdTrackingObj = {
        ...msdTrackingObj,
        [MSDKEYS.event]: '/removeFromCart',
        [MSDKEYS.pageType]: 'cart',
        [MSDKEYS.sourceProdID]: trackingObj.data.sku,
        [MSDKEYS.prodPrice]: trackingObj.data.specialPrice ? trackingObj.data.specialPrice : trackingObj.data.price,
        [MSDKEYS.userID]: accountStore ? (accountStore.userData && accountStore.userData.email ? accountStore.userData.email : '') : '',
        [MSDKEYS.sourceCatgID]: getProductCategory(trackingObj.data),
        [MSDKEYS.currency]: featureMapObj ? (featureMapObj.currency && featureMapObj.currency.label ? featureMapObj.currency.label : '') : '',
        [MSDKEYS.uuid]: ''      //TODO:make a native function to fetch uuid

    }
    return msdTrackingObj;
}

const trackOnOrderPlaced = () => {

    let getStore = getStoreData(),
        accountStore = getStore ? getStore.accounts : null,
        featureMapObj = getStore ? getStore.featureMapAPIReducer.featureMapObj : null,
        cartData = getStore ? getStore.cart.data : null;

    var sourceProduct = {};
    if (cartData) {
        var productKeys = Object.keys(cartData)
        productKeys.forEach(item => {
            let data = cartData[item];
            let price = data.specialPrice ? data.specialPrice : data.price;

            sourceProduct = {
                ...sourceProduct,
                skuIds: sourceProduct.skuIds ? [...sourceProduct.skuIds, data.sku] : [data.sku],
                prices: sourceProduct.prices ? [...sourceProduct.prices, price] : [price],
                prodCategory: sourceProduct.prodCategory ? [...sourceProduct.prodCategory, getProductCategory(data)] : [getProductCategory(data)],
                prodQuantity: sourceProduct.prodQuantity ? [...sourceProduct.prodQuantity, data.quantity] : [data.quantity],
            }

        })

    }
    let msdTrackingObj = {};
    msdTrackingObj = {
        ...msdTrackingObj,
        [MSDKEYS.event]: '/placeOrder',
        [MSDKEYS.pageType]: 'checkout',
        [MSDKEYS.sourceProdID]: sourceProduct ? (sourceProduct.skuIds ? sourceProduct.skuIds.join("_") : '') : '',
        [MSDKEYS.prodPrice]: sourceProduct ? (sourceProduct.prices ? sourceProduct.prices.join("_") : '') : '',
        [MSDKEYS.userID]: accountStore ? (accountStore.userData && accountStore.userData.email ? accountStore.userData.email : '') : '',
        [MSDKEYS.sourceCatgID]: sourceProduct ? (sourceProduct.prodCategory ? sourceProduct.prodCategory.join("_") : '') : '',
        [MSDKEYS.currency]: featureMapObj ? (featureMapObj.currency && featureMapObj.currency.label ? featureMapObj.currency.label : '') : '',
        [MSDKEYS.uuid]: '',      //TODO:make a native function to fetch uuid
        [MSDKEYS.prodQty]: sourceProduct ? (sourceProduct.prodQuantity ? sourceProduct.prodQuantity.join("_") : '') : ''


    }
    return msdTrackingObj

}

const carousalProductClick = (trackingObj) => {

    let getStore = getStoreData(),
        accountStore = getStore ? getStore.accounts : null,
        featureMapObj = getStore ? getStore.featureMapAPIReducer.featureMapObj : null;

    let msdTrackingObj = {};

    msdTrackingObj = {
        ...msdTrackingObj,
        [MSDKEYS.event]: '/carouselClick',
        [MSDKEYS.pageType]: 'pdp',
        [MSDKEYS.sourceProdID]: trackingObj.parentData.sku,
        [MSDKEYS.prodPrice]: trackingObj.parentData.specialPrice ? `${trackingObj.parentData.specialPrice}` : `${trackingObj.parentData.price}`,
        [MSDKEYS.userID]: accountStore ? (accountStore.userData && accountStore.userData.email ? accountStore.userData.email : '') : '',
        [MSDKEYS.sourceCatgID]: getProductCategory(trackingObj.parentData),
        [MSDKEYS.currency]: featureMapObj ? (featureMapObj.currency && featureMapObj.currency.label ? featureMapObj.currency.label : '') : '',
        [MSDKEYS.uuid]: '',      //TODO:make a native function to fetch uuid
        [MSDKEYS.widgetID]: '0',
        [MSDKEYS.posOfReco]: trackingObj.posOfReco,
        [MSDKEYS.destProdID]: trackingObj.data.sku,
        [MSDKEYS.destCatgID]: getProductCategory(trackingObj.data),
        [MSDKEYS.destProdPrice]: trackingObj.data.specialPrice ? `${trackingObj.data.specialPrice}` : `${trackingObj.data.price}`,


    }
    return msdTrackingObj;
}

const carousalSwipe = (trackingObj) => {

    let getStore = getStoreData(),
        accountStore = getStore ? getStore.accounts : null,
        featureMapObj = getStore ? getStore.featureMapAPIReducer.featureMapObj : null;

    let msdTrackingObj = {};
    msdTrackingObj = {
        ...msdTrackingObj,
        [MSDKEYS.event]: '/carouselSwipe',
        [MSDKEYS.pageType]: 'pdp',
        [MSDKEYS.sourceProdID]: trackingObj.data.sku,
        [MSDKEYS.prodPrice]: trackingObj.data.specialPrice ? trackingObj.data.specialPrice : trackingObj.data.price,
        [MSDKEYS.userID]: accountStore ? (accountStore.userData && accountStore.userData.email ? accountStore.userData.email : '') : '',
        [MSDKEYS.sourceCatgID]: getProductCategory(trackingObj.data),
        [MSDKEYS.currency]: featureMapObj ? (featureMapObj.currency && featureMapObj.currency.label ? featureMapObj.currency.label : '') : '',
        [MSDKEYS.uuid]: ''      //TODO:make a native function to fetch uuid

    }


    // Object.assign(msdTrackingObj, {key: 'value'})
    return msdTrackingObj;

}

const getProductCategory = (data) => {

    if (data.breadcrumbs && data.breadcrumbs.length > 0)
        return data.breadcrumbs[0].name
    else
        return "";
}

const getStoreData = () => {
    return store ? store.getState() : null
}

const MSDTracker = new MSDTracker();
export default MSDTracker;
