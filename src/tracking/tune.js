'use strict';

import React from 'react';
import {
    AsyncStorage
} from 'react-native';

import Actions from '../actions/actionTypes';
import {isEmptyString, getCurrency, getStoreData, isEmptyObject} from '../utilities/utilities';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import UserHandler from "../utilities/managers/userHandler";
import {customAttributes} from "../analytics/profileAttributesConstants";

const smartwhereTuneKeys = {
    "userFirstName": "user_name_sw",
    "imageUrl": "image_url_sw",
    "productNameForTracking": "product_name_sw",
    "price": "product_mrp_sw",
    "specialPrice": "special_price_sw",
    "purchaseProductNameForTracking": "purchase_product_name_sw",
    "countryChange": "wadi_country_sw",
    "languageChange": "wadi_language_sw",

};

function TuneTracker() {

    this.getTrackingObj = (trackingObj, actionType) => {
        let actionEventType = actionType;
        let tuneTrackingObj = {};
        if (actionEventType === Actions.DEEP_LINK && trackingObj.eventType) {
            actionEventType = trackingObj.eventType;
        }
        switch (actionEventType) {

            //check for different event types and return object accordingly.

            case Actions.GET_PRODUCT_DETAIL_SUCCESS: {

                tuneTrackingObj = _createProductDetailViewEventForProduct(trackingObj);
            }
                break;

            case Actions.RESET_APP_COUNTRY_LANGUAGE: {

                tuneTrackingObj = _createLanguageAndCountrySelectionEvent(trackingObj)
            }

                break;


            case Actions.ADD_TO_CART_SUCCESS: {

                tuneTrackingObj = _createAddToCartEventWithQuantity(trackingObj, 1)
            }

                break;

            case Actions.FETCH_SEARCH_RESULT_RECEIVED: {
                let searchString = isEmptyString(trackingObj.searchText) ? '' : trackingObj.searchText;
                tuneTrackingObj = _createSearchEventForTune(searchString);
            }

                break;

            case Actions.CHECKOUT_EVENTS: {
                tuneTrackingObj = _getCheckoutEvent(trackingObj);
            }
                break;

            case Actions.PRODUCT_RECEIVED: {
                tuneTrackingObj = _getProductListViewEvent(trackingObj);
            }
                break;


            case Actions.BEGIN_CHECKOUT: {
                tuneTrackingObj = _getCheckoutIntiatedEvent(trackingObj);
            }

                break;

            case Actions.LOGIN_SUCCESS: {
                tuneTrackingObj = _getUserNameAndEmailObj(trackingObj);
            }
                break;
            default: {

            }
                break;
        }
        return tuneTrackingObj;
    }
}

const _getUserNameAndEmailObj = (trackingObj) => {

    let tuneTrackingObj = {};

    let smartwhereObj = [];
    smartwhereObj.push({
        'key': smartwhereTuneKeys.userFirstName,
        'value': !isEmptyString(trackingObj.firstName) ?  trackingObj.firstName : ""
    });
    tuneTrackingObj.smartwhere = smartwhereObj;

    let customProfileAttributes = [];
    customProfileAttributes.push({
        'key': customAttributes.kName,
        'value': !isEmptyString(trackingObj.firstName) ?  trackingObj.firstName : ""
    });
    customProfileAttributes.push({
        'key': customAttributes.kEmail,
        'value': !isEmptyString(trackingObj.email) ?  trackingObj.email : ""
    });

    tuneTrackingObj.personalised_attributes = customProfileAttributes;
    return tuneTrackingObj;
}

const _getProductListViewEvent = (trackingObj) => {

    let tuneTrackingObj = {};
    tuneTrackingObj.name = 'plp_view';

    let responseData = (trackingObj.responseData) ? trackingObj.responseData : [];
    //let listName = _getListNameFromListData(responseData);

    //TODO: add listname
    let tags = [];
    tags.push({
        'key': 'ProductSubCatName',
        'value': (responseData.breadcrumbs && responseData.breadcrumbs.length > 0 && !isEmptyString(responseData.breadcrumbs[responseData.breadcrumbs.length - 1].name)) ? responseData.breadcrumbs[responseData.breadcrumbs.length - 1].name : ''
    })
    tags.push({
        'key': 'ProductSubCatURL',
        'value': (responseData.breadcrumbs && responseData.breadcrumbs.length > 0 && !isEmptyString(responseData.breadcrumbs[responseData.breadcrumbs.length - 1].key)) ? responseData.breadcrumbs[responseData.breadcrumbs.length - 1].key : ''
    })
    tags.push({

        'key': 'ProductSupCatName',
        'value': (responseData.breadcrumbs && responseData.breadcrumbs.length > 0 && !isEmptyString(responseData.breadcrumbs[0].name)) ? responseData.breadcrumbs[0].name : ''
    })
    tags.push({

        'key': 'ProductSupCatURL',
        'value': (responseData.breadcrumbs && responseData.breadcrumbs.length > 0 && !isEmptyString(responseData.breadcrumbs[0].key)) ? responseData.breadcrumbs[0].key : ''
    })

    tuneTrackingObj.tags = tags;
    return tuneTrackingObj;

}

const _getListNameFromListData = (productList) => {

    let categoryList = (productList.facets && productList.facets.category) ? productList.facets.category : {};
    let brandList = (productList.facets && productList.facets.brand) ? productList.facets.brand : {};

}

const _createSearchEventForTune = (searchString) => {

    let tuneTrackingObj = {};
    tuneTrackingObj.name = 'search';
    tuneTrackingObj.searchString = searchString;
    return tuneTrackingObj;
}

const _createProductDetailViewEventForProduct = (productObject) => {

    let tuneTrackingObj = {};
    tuneTrackingObj.name = 'pdp_view';

    let tuneEventItem = _createTuneEventItem(productObject);
    tuneTrackingObj.eventItems = [tuneEventItem];

    let tags = [];

    tags.push({
        'key': 'ProductName',
        'value': _getProductNameDescription(productObject)
    })
    tags.push({
        'key': 'ProductURL',
        'value': !isEmptyString(productObject.link) ? productObject.link : ''
    })
    tags.push({
        'key': 'ImageURL',
        'value': ('"https://b.wadicdn.com/product/', productObject.imageKey, '/1-product.jpg"')
    })
    tags.push({
        'key': 'MRPPrice',
        'value': productObject.price
    })
    tags.push({
        'key': 'SpecialPrice',
        'value': _getFinalPrice(productObject)
    })
    tags.push({
        'key': 'SKU',
        'value': productObject.sku
    })

    tags.push({
        'key': 'ProductSubCatName',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].name)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].name : ''
    })
    tags.push({
        'key': 'ProductSubCatURL',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key : ''
    })
    tags.push({

        'key': 'ProductSupCatName',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[0].name)) ? productObject.breadcrumbs[0].name : ''
    })
    tags.push({

        'key': 'ProductSupCatURL',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[0].key)) ? productObject.breadcrumbs[0].key : ''
    })
    tags.push({
        'key': 'ProductBrand',
        'value': (productObject.brand && !isEmptyString(productObject.brand.name)) ? productObject.brand.name : ''
    })
    tags.push({
        'key': 'ProductGender',
        'value': (productObject.attributes && !isEmptyString(productObject.attributes.gender)) ? productObject.attributes.gender : ''
    })
    tags.push({
        'key': 'ProductTag',
        'value': (productObject.ribbon && !isEmptyString(productObject.ribbon.key)) ? productObject.ribbon.key : ''
    })
    tuneTrackingObj.tags = tags;

    let customProfileAttributes = [];
    customProfileAttributes.push({
        'key': customAttributes.kLastViewedProductName,
        'value': !isEmptyObject(productObject) ? _getProductNameDescription(productObject) : ''
    })
    customProfileAttributes.push(({
        'key': customAttributes.kLastViewedProductURL,
        'value': productObject.link
    }))
    customProfileAttributes.push({
        'key': customAttributes.kLastViewedProductSKU,
        'value': !isEmptyObject(productObject) ? productObject.sku : ''
    })
    customProfileAttributes.push({
        'key': customAttributes.kLastViewedProductImgURL,
        'value': 'https://b.wadicdn.com/product/' + productObject.imageKey + '/1-product.jpg'
    })
    customProfileAttributes.push({
        'key': customAttributes.kLastViewedBrandURL,
        'value': (productObject.brand && !isEmptyString(productObject.brand.key)) ? productObject.brand.key : ''
    })
    customProfileAttributes.push(({
        'key': customAttributes.kLastViewedBrandName,
        'value': (productObject.brand && !isEmptyString(productObject.brand.name)) ? productObject.brand.name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastViewedSupCatName,
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[0].name)) ? productObject.breadcrumbs[0].name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastViewedSupCatURL,
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[0].key)) ? productObject.breadcrumbs[0].key : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastViewedSubCatName,
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].name)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastViewedSubCatURL,
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key : ''
    }))
    tuneTrackingObj.personalised_attributes = customProfileAttributes;

    return tuneTrackingObj;
}

const _createAddToCartEventWithQuantity = (productObject, quantity) => {

    let tuneTrackingObj = {}

    tuneTrackingObj.name = 'add_to_cart';
    tuneTrackingObj.eventItems = [_createAddToCartEventItem(productObject, quantity)];
    tuneTrackingObj.revenue = ((productObject.specialPrice) ? productObject.specialPrice : productObject.price) * quantity;
    tuneTrackingObj.currencyCode = getCurrency();

    let tags = [];

    tags.push({
        'key': 'ProductName',
        'value': _getProductNameDescription(productObject)
    })
    tags.push({
        'key': 'ProductURL',
        'value': !isEmptyString(productObject.link) ? productObject.link : ''
    })
    tags.push({
        'key': 'ImageURL',
        'value': ('"https://b.wadicdn.com/product/', productObject.imageKey, '/1-product.jpg"')
    })
    tags.push({
        'key': 'MRPPrice',
        'value': productObject.price
    })
    tags.push({
        'key': 'SpecialPrice',
        'value': _getFinalPrice(productObject)
    })
    tags.push({
        'key': 'SKU',
        'value': productObject.sku
    })

    tags.push({
        'key': 'ProductSubCatName',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].name)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].name : ''
    })
    tags.push({
        'key': 'ProductSubCatURL',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key : ''
    })
    tags.push({

        'key': 'ProductSupCatName',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[0].name)) ? productObject.breadcrumbs[0].name : ''
    })
    tags.push({

        'key': 'ProductSupCatURL',
        'value': (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[0].key)) ? productObject.breadcrumbs[0].key : ''
    })
    tags.push({
        'key': 'ProductBrand',
        'value': (productObject.brand && !isEmptyString(productObject.brand.name)) ? productObject.brand.name : ''
    })
    tags.push({
        'key': 'ProductGender',
        'value': (productObject.attributes && !isEmptyString(productObject.attributes.gender)) ? productObject.attributes.gender : ''
    })
    tags.push({
        'key': 'ProductTag',
        'value': (productObject.ribbon && !isEmptyString(productObject.ribbon.key)) ? productObject.ribbon.key : ''
    })
    tuneTrackingObj.tags = tags;

    let smartwhereObj = [];
    smartwhereObj.push({
        'key': smartwhereTuneKeys.userFirstName,
        'value': UserHandler.getUserFirstName()
    })
    smartwhereObj.push({
        'key': smartwhereTuneKeys.imageUrl,
        'value': 'https://b.wadicdn.com/product/' + productObject.imageKey + '/1-product.jpg'
    })
    smartwhereObj.push({
        'key': smartwhereTuneKeys.productNameForTracking,
        'value': _getProductNameDescription(productObject)
    })
    smartwhereObj.push({
        'key': smartwhereTuneKeys.specialPrice,
        'value': productObject.specialPrice
    })
    smartwhereObj.push({
        'key': smartwhereTuneKeys.price,
        'value': productObject.price
    })

    tuneTrackingObj.smartwhere = smartwhereObj;

    let customProfileAttributes = [];
    customProfileAttributes.push({
        'key': customAttributes.kLastAddedToCartProductImgURL,
        'value': 'https://b.wadicdn.com/product/' + productObject.imageKey + '/1-product.jpg'
    })
    customProfileAttributes.push({
        'key': customAttributes.kLastAddedToCartProductName,
        'value': _getProductNameDescription(productObject)
    })
    customProfileAttributes.push(({
        'key': customAttributes.kLastAddedToCartProductURL,
        'value': productObject.link
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastAddedToCartBrandName,
        'value': (productObject.brand && !isEmptyString(productObject.brand.name)) ? productObject.brand.name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastAddedToCartProductSpecialPrice,
        'value': productObject.specialPrice
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastAddedToCartProductMRP,
        'value': productObject.price
    }))

    tuneTrackingObj.personalised_attributes = customProfileAttributes;
    return tuneTrackingObj;
}

const _createLanguageAndCountrySelectionEvent = (trackingObj) => {

    let tuneTrackingObj = {}

    tuneTrackingObj.name = 'locale_selection';
    tuneTrackingObj.attribute1 = trackingObj.selectedCountry.name;
    tuneTrackingObj.attribute2 = trackingObj.selectedLanguage;

    let smartwhereObj = [];
    smartwhereObj.push({
        'key': smartwhereTuneKeys.countryChange,
        'value': trackingObj.selectedCountry.name
    });
    smartwhereObj.push({
        'key': smartwhereTuneKeys.languageChange,
        'value': trackingObj.selectedLanguage
    });
    tuneTrackingObj.smartwhere = smartwhereObj;

    let customProfileAttributes = [];
    customProfileAttributes.push({
        'key': customAttributes.kCountry,
        'value': trackingObj.selectedCountry.name
    });
    customProfileAttributes.push({
        'key': customAttributes.kLanguage,
        'value': trackingObj.selectedLanguage
    })
    tuneTrackingObj.personalised_attributes = customProfileAttributes;

    return tuneTrackingObj;
}

const _getProductNameDescription = (productObject) => {

    let productNameDesc = '';
    if (productObject.name_desc && !isEmptyString(productObject.name_desc.name)) {

        productNameDesc = productObject.name_desc.name;
    }
    return productNameDesc;
}

const _createAddToCartEventItem = (productObject, quantity) => {

    let tuneEventItem = {};

    if (productObject.name_desc && !isEmptyString(productObject.name_desc.name)) {

        tuneEventItem.name = productObject.name_desc.name;
    }

    tuneEventItem.unitPrice = _getFinalPrice(productObject);
    tuneEventItem.quantity = quantity;
    tuneEventItem.revenue = ((productObject.specialPrice) ? productObject.specialPrice : productObject.price) * quantity;
    tuneEventItem.attribute1 = (!isEmptyString(productObject.sku)) ? productObject.sku : '';
    tuneEventItem.attribute2 = (productObject.brand && !isEmptyString(productObject.brand.key)) ? productObject.brand.key : '';
    tuneEventItem.attribute3 = (productObject.brand && !isEmptyString(productObject.brand.name)) ? productObject.brand.name : '';
    tuneEventItem.attribute4 = (productObject.selectedColor && !isEmptyString(productObject.selectedColor.key)) ? productObject.selectedColor.key : '';
    tuneEventItem.attribute5 = (!isEmptyString(productObject.category)) ? productObject.category : '';

    return tuneEventItem;
}

const _createTuneEventItem = (productObject) => {

    let tuneEventItem = {};

    if (productObject.name_desc && !isEmptyString(productObject.name_desc.name)) {

        tuneEventItem.name = productObject.name_desc.name;
    }

    tuneEventItem.unitPrice = _getFinalPrice(productObject);
    tuneEventItem.quantity = 1;
    tuneEventItem.revenue = (productObject.specialPrice) ? productObject.specialPrice : productObject.price;
    tuneEventItem.attribute1 = (!isEmptyString(productObject.sku)) ? productObject.sku : '';
    tuneEventItem.attribute2 = (!isEmptyString(productObject.specialPrice)) ? productObject.specialPrice : '';
    tuneEventItem.attribute3 = (!isEmptyString(productObject.link)) ? productObject.link : '';
    tuneEventItem.attribute4 = (productObject.brand && !isEmptyString(productObject.brand.name)) ? productObject.brand.name : '';
    tuneEventItem.attribute5 = (!isEmptyString(productObject.category)) ? productObject.category : '';

    return tuneEventItem;

}

const _getFinalPrice = (productObject) => {
    return (productObject.specialPrice) ? productObject.specialPrice : productObject.price;
}

const _getCheckoutEvent = (trackingObj) => {

    if (!trackingObj) {
        return
    }
    let tuneTrackingObj = {};
    switch (trackingObj.eventType) {

        case GLOBAL.API_URL.CHECKOUT_TRACKORDER: {
            tuneTrackingObj = _getTunePurchaseEvent(trackingObj);
        }
            break;

        case GLOBAL.API_URL.CHECKOUT_SUCCESS_PAYMENT: {
            tuneTrackingObj = _getTunePaymentEvent(trackingObj);
        }
            break;

        case GLOBAL.API_URL.CHECKOUT_TRACK_CITY: {
            tuneTrackingObj = _getTunePurchaseTrackCityEvent(trackingObj);
        }
            break;
        default: {

        }
            break;
    }
    return tuneTrackingObj;
}

const _getTunePurchaseTrackCityEvent = (trackingObj) => {

    let tuneTrackingObj = {};
    let shippingObj = !isEmptyObject(trackingObj) && !isEmptyObject(trackingObj.order) && !isEmptyObject(trackingObj.order.order) && !isEmptyObject(trackingObj.order.order.addresses) && !isEmptyObject(trackingObj.order.order.addresses.shipping) ? trackingObj.order.order.addresses.shipping : {};
    let city = !isEmptyObject(shippingObj) && !isEmptyString(shippingObj.city) ? shippingObj.city : '';
    let area = !isEmptyObject(shippingObj) && !isEmptyString(shippingObj.area) ? shippingObj.area :'';

    let customProfileAttributes = [];
    customProfileAttributes.push({
        'key': customAttributes.kCityOfLastOrder,
        'value': city
    });
    customProfileAttributes.push({
        'key': customAttributes.kAreaOfLastOrder,
        'value': area
    });
    tuneTrackingObj.personalised_attributes = customProfileAttributes;

    return tuneTrackingObj;

}

const _getTunePaymentEvent = (trackingObj) => {
    let tuneTrackingObj = {};
    tuneTrackingObj.name = 'added_payment_info';
    let paymentMethod = (trackingObj.order && trackingObj.order.order && trackingObj.order.order.payment && !isEmptyString(trackingObj.order.order.payment.method)) ? trackingObj.order.order.payment.method : '';
    tuneTrackingObj.attribute1 = paymentMethod;
    return tuneTrackingObj;
}

const _getCheckoutIntiatedEvent = (trackingObj) => {

    let tuneTrackingObj = {};
    tuneTrackingObj.name = 'checkout_initiated';
    let tuneCartEventItems = _getCartProductEventItems();
    tuneTrackingObj.eventItems = tuneCartEventItems;
    //TODO: Add revenue
    tuneTrackingObj.currencyCode = getCurrency();

    return tuneTrackingObj;
}

const _getTunePurchaseEvent = (trackingObj) => {

    let tuneTrackingObj = {};
    tuneTrackingObj.name = 'purchase';
    let subCategoriesUrls = '';
    let brandUrls = '';
    let prodIds = '';
    let genders = '';
    let tuneEventItems = [];
    let store = !isEmptyObject(getStoreData()) ? getStoreData() : {};
    let cartData = store.cart && !isEmptyObject(store.cart.data) ? store.cart.data : [];
    let firstProduct = !isEmptyObject(cartData) ? cartData[Object.keys(cartData)[0]] : {};
    var productKeys = Object.keys(cartData);
    productKeys.forEach(key => {

        let productObject = cartData[key];
        tuneEventItems.push(_createAddToCartEventItem(productObject, productObject.quantity));
        subCategoriesUrls += (productObject.breadcrumbs && productObject.breadcrumbs.length > 0 && !isEmptyString(productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key)) ? productObject.breadcrumbs[productObject.breadcrumbs.length - 1].key : '', ' ';
        brandUrls += (productObject.brand && !isEmptyString(productObject.brand.key)) ? productObject.brand.key : '', ' ';
        prodIds += productObject.sku, ' ';
        genders += (productObject.attributes && !isEmptyString(productObject.attributes.gender)) ? productObject.attributes.gender : '', ' ';
    });

    tuneTrackingObj.eventItems = tuneEventItems;
    tuneTrackingObj.refId = trackingObj.transactionId;
    tuneTrackingObj.revenue = (trackingObj.revenue) / 100;
    tuneTrackingObj.currencyCode = trackingObj.currency;

    let paymentMethod = (trackingObj.order && trackingObj.order.order && trackingObj.order.order.payment && !isEmptyString(trackingObj.order.order.payment.method)) ? trackingObj.order.order.payment.method : '';
    tuneTrackingObj.attribute1 = paymentMethod;

    let tags = [];

    tags.push({
        'key': 'PurchaseCategory',
        'value': subCategoriesUrls
    })

    tags.push({
        'key': 'PurchaseBrand',
        'value': brandUrls
    })

    tags.push({
        'key': 'PurchseProductID',
        'value': prodIds
    })

    tags.push({
        'key': 'PurchaseProductGender',
        'value': genders
    })

    tags.push({
        'key': 'PurchasePaymentMode',
        'value': (paymentMethod.toUpperCase() === 'COD') ? 'cod' : 'prepaid'
    })
    tuneTrackingObj.tags = tags;

    let smartwhereObj = [];

    smartwhereObj.push({
        'key': smartwhereTuneKeys.purchaseProductNameForTracking,
        'value': !isEmptyObject(firstProduct) ? _getProductNameDescription(firstProduct) : ''
    })
    tuneTrackingObj.smartwhere = smartwhereObj;

    let customProfileAttributes = [];
    customProfileAttributes.push({
        'key': customAttributes.kLastPurchasedProductName,
        'value': !isEmptyObject(firstProduct) ? _getProductNameDescription(firstProduct) : ''
    })
    customProfileAttributes.push(({
        'key': customAttributes.kLastPurchasedProductURL,
        'value': !isEmptyObject(firstProduct) && !isEmptyString(firstProduct.link) ? firstProduct.link : ''
    }))
    customProfileAttributes.push({
        'key': customAttributes.kLastPurchasedProductSKU,
        'value': !isEmptyObject(firstProduct) ? firstProduct.sku : ''
    })
    customProfileAttributes.push({
        'key': customAttributes.kLastPurchasedProductImgURL,
        'value': 'https://b.wadicdn.com/product/' + firstProduct.imageKey + '/1-product.jpg'
    })
    customProfileAttributes.push({
        'key': customAttributes.kLastPurchasedBrandURL,
        'value': (firstProduct.brand && !isEmptyString(firstProduct.brand.key)) ? firstProduct.brand.key : ''
    })
    customProfileAttributes.push(({
        'key': customAttributes.kLastPurchasedBrandName,
        'value': (firstProduct.brand && !isEmptyString(firstProduct.brand.name)) ? firstProduct.brand.name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastPurchasedSupCatName,
        'value': (firstProduct.breadcrumbs && firstProduct.breadcrumbs.length > 0 && !isEmptyString(firstProduct.breadcrumbs[0].name)) ? firstProduct.breadcrumbs[0].name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastPurchasedSupCatURL,
        'value': (firstProduct.breadcrumbs && firstProduct.breadcrumbs.length > 0 && !isEmptyString(firstProduct.breadcrumbs[0].key)) ? firstProduct.breadcrumbs[0].key : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastPurchasedSubCatName,
        'value': (firstProduct.breadcrumbs && firstProduct.breadcrumbs.length > 0 && !isEmptyString(firstProduct.breadcrumbs[firstProduct.breadcrumbs.length - 1].name)) ? firstProduct.breadcrumbs[firstProduct.breadcrumbs.length - 1].name : ''
    }))
    customProfileAttributes.push(({
        'key': customAttributes.kLastPurchasedSubCatURL,
        'value': (firstProduct.breadcrumbs && firstProduct.breadcrumbs.length > 0 && !isEmptyString(firstProduct.breadcrumbs[firstProduct.breadcrumbs.length - 1].key)) ? firstProduct.breadcrumbs[firstProduct.breadcrumbs.length - 1].key : ''
    }))
    tuneTrackingObj.personalised_attributes = customProfileAttributes;

    return tuneTrackingObj;

}

const _getCartProductEventItems = () => {

    let store = !isEmptyObject(getStoreData()) ? getStoreData() : {};
    let cartData = store.cart && !isEmptyObject(store.cart.data) ? store.cart.data : [];
    let tuneEventItems = [];
    var productKeys = Object.keys(cartData)
    productKeys.forEach(key => {

        let productObject = cartData[key];
        tuneEventItems.push(_createAddToCartEventItem(productObject, productObject.quantity))
    })
    return tuneEventItems;
}


const TuneTracker = new TuneTracker();
export default TuneTracker;
