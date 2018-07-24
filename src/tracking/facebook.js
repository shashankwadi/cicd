'use strict';

import store from 'Wadi/src/reducers/store';
import Actions from '../actions/actionTypes';
import { isEmptyString } from '../utilities/utilities';
import trackingEnum from './trackingEnum';

function FacebookTracking() {
    this.getTrackingObj = (trackingObj, actionType) => {
        let actionEventType = actionType;
        let fbTrackingObj = {};
        if (actionEventType === Actions.DEEP_LINK && trackingObj.eventType) {
            actionEventType = trackingObj.eventType;
        }
        switch (actionEventType) {

            //check for different event types and return objects accordingly.

            case Actions.GET_PRODUCT_DETAIL_SUCCESS: {
                fbTrackingObj = _createProductDetailViewEventForProduct(trackingObj);
                break;
            }
            

            case Actions.FETCH_SEARCH_RESULT_RECEIVED: {
                fbTrackingObj = _createSearchedEvent(trackingObj);
                break;
            }

            case Actions.ADD_TO_CART_SUCCESS: {
                fbTrackingObj = _addToCartEvent(trackingObj);
                break;
            }
            //TODO: Add checkout initiated and purchase event.
            default: {

            }
        }
        return fbTrackingObj;
    }
}

const _createProductDetailViewEventForProduct = (productObject) => {
    let pdpEventData = {};
    pdpEventData.name = 'fb_mobile_content_view';
    pdpEventData.isPurchaseEvent = false;
    pdpEventData.FBSDKAppEventParameterNameDescription = productObject.name;
    pdpEventData.FBSDKAppEventParameterNameContentType = _getProductCategory(productObject.breadcrumbs);
    pdpEventData.FBSDKAppEventParameterNameContentID = productObject.sku;
    pdpEventData.FBSDKAppEventParameterNameCurrency = store.getState().featureMapAPIReducer.featureMapObj.currency.label;
    
    return pdpEventData;
}

const _getProductCategory = (breadcrumbs) => {
    let category = '';
    if (breadcrumbs
            && breadcrumbs.length>0) {
        breadcrumbs.forEach(element => {
            category = category.concat(element.key, '/');
        });
    }
    return category;
}

const _createSearchedEvent = (data) => {
    let pdpEventData = {};
    pdpEventData.name = 'fb_mobile_search';
    pdpEventData.isPurchaseEvent = false;
    pdpEventData.FBSDKAppEventParameterNameSearchString = data.searchText;
    return pdpEventData;
}


const _addToCartEvent = (cartProduct) => {
    let pdpEventData = {};
    pdpEventData.name = 'fb_mobile_add_to_cart';
    pdpEventData.isPurchaseEvent = false;
    pdpEventData.FBSDKAppEventParameterNameDescription = cartProduct.name;
    pdpEventData.FBSDKAppEventParameterNameContentType = _getProductCategory(cartProduct.breadcrumbs);
    pdpEventData.FBSDKAppEventParameterNameContentID = cartProduct.sku;
    pdpEventData.FBSDKAppEventParameterNameCurrency = store.getState().featureMapAPIReducer.featureMapObj.currency.label;
    return pdpEventData;
}


const _checkoutInitiatedEvent = () => {
    let pdpEventData = {};
    cart = store.getState().cart;
    pdpEventData.name = 'fb_mobile_initiated_checkout';
    pdpEventData.isPurchaseEvent = false;
    pdpEventData.FBSDKAppEventParameterNameContentType = "product";
    pdpEventData.FBSDKAppEventParameterNameContentID = _getProductsSkuList(cart);
    pdpEventData.FBSDKAppEventParameterNameNumItems = cart.itemsCount;
    pdpEventData.FBSDKAppEventParameterNamePaymentInfoAvailable = 0;
    pdpEventData.FBSDKAppEventParameterNameCurrency = store.getState().featureMapAPIReducer.featureMapObj.currency.label;
    return pdpEventData;
}


const _purchaseEvent = () => {
    let pdpEventData = {};
    cart = store.getState().cart;
    pdpEventData.name = 'fb_mobile_purchase';
    pdpEventData.isPurchaseEvent = true;
    pdpEventData.FBSDKAppEventParameterNameContentType = "product";
    pdpEventData.FBSDKAppEventParameterNameContentID = _getProductsSkuList(cart);
    pdpEventData.FBSDKAppEventParameterNameNumItems = cart.itemsCount;
    pdpEventData.FBSDKAppEventParameterNamePaymentInfoAvailable = 0;
    pdpEventData.FBSDKAppEventParameterNameCurrency = store.getState().featureMapAPIReducer.featureMapObj.currency.label;
    return pdpEventData;
}

const _getProductsSkuList = (cart) => {
    var skus = "";
    const products = cart.data;
    skus = skus.concat("[");
    for (var sku in products) {
        skus.concat("'" + sku + "'");
        if (i != products.length - 1) {
            skus.concat(",");
        }
    }
    skus.concat("]");
    return skus;
}
const FacebookTracking = new FacebookTracking();
export default FacebookTracking;