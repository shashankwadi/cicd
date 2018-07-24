'use strict';
import Types from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    errorInFetch: false,
    dataSource: null,
    data: {},
    deliveryDetailsObj: null, //object
    ratingReviewObj: null
};

export default function productDetailReducers(state = initialState, action) {
    switch (action.type) {
        case Types.GET_PRODUCT_DETAIL:
            return {
                ...state,
                isFetching: true,
            };
        case Types.GET_PRODUCT_DETAIL_SUCCESS:
            return addItemOnUrl(state, action.data);
        // return {
        //     ...state,
        //     isFetching: false,
        //     dataSource: action.data
        // }
        case Types.GET_PRODUCT_DETAIL_ERROR:
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            };
        case Types.GET_PDP_DELIVERY_DETAILS:
            return {
                ...state,
                deliveryDetailsObj: action.deliveryDetailsObj
            };
        case Types.CLEAR_PRODUCT_DATA:
            return clearDataOnUrl(state, action.url);

        case Types.FETCHED_RATING_REVIEWS:
            return {...state, ratingReviewObj: action.payload}
        default:
            return state;
    }
}

/**
 * better to call only through dispacthing action
 * @param {*} state is the current reducer state
 * @param {*} url is the url for which we need to remove data
 */
const clearDataOnUrl = (state, url) => {
    let {data} = state;
    let {[url]: currentData, ...updatedData} = data;
    return {
        ...state,
        data: updatedData
    }
}

//selectors functions

const addItemOnUrl = (state, params) => {
    let {data} = state;
    let {url, data: newData} = params;
    let currentData = (data[url]) ? data[url] : {};
    let updates = {...data, [url]: {...currentData, ...newData}};
    return {
        ...state,
        data: updates,
        isFetching: false,
        errorInFetch: false,
    }
}

export const getItemOnUrl = (state, url) => {
    let {data} = state;
    return data[url];
}
/**
 *
 * @param {*} product
 * this function will check if product have simples with non-zero quantity or
 * product have non-zero visible
 */
export const isOutOfStock = (product) => {
    let result = false;
    result = ((product && ((product.visible && product.visible !== 0) || (product.stockQty && product.stockQty > 0))) || hasAnySimple(product) ) ? false : true;
    return result;
}

/**
 *
 * @param {*} product
 * return true if product have any simple with non-zero quantity
 */
export const hasAnySimple = (product) => {
    let result = true;
    if (product && product.simples && product.simples.length > 0) {
        result = (product.simples.filter((item) => item.quantity !== 0).length > 0) ? true : false;
    } else {
        result = false;
    }
    return result;
}

/**
 *
 * @param {*} product
 * will return sku of 1st simple
 */
export const getDefaultSimpleSku = (product) => {
    let sku = (product.simples && product.simples.length > 0 && product.simples[0].sku) ? product.simples[0].sku : product.sku;
    return sku;
}

/**
 *
 * @param {*} cart is cart reducer
 * @param {*} product is product for which we are checking
 */
export const isAlreadyInCart = (cart, product, selectedSimple = null) => {
    if (!hasOnlyOS(product) && selectedSimple && selectedSimple.sku) {
        return cart.data.hasOwnProperty(selectedSimple.sku);
    }
    return cart.data.hasOwnProperty(getDefaultSimpleSku(product));
}

export const hasOnlyOS = (product) => {
    return (product && product.sizes && product.sizes.length && product.sizes.length === 1 && product.sizes[0] === "OS") ? true : false;
}

export const getFirstDefaultSupplier = (suppliers) => {
    var defaultSupplier = null;
    for (let i = 0; i < suppliers.length; i++) {
        let tempSupplier = suppliers[i]
        if (tempSupplier.availableQty > 0) {
            defaultSupplier = tempSupplier;
            return defaultSupplier;
        }
    }
    return defaultSupplier;
};