'use strict';
import {Alert} from 'react-native';
import Types from './actionTypes';
import ApiHandler from '../utilities/ApiHandler';
import CartManager from '../utilities/managers/cartHandler';
import TrackingEnum from '../tracking/trackingEnum';
import * as GLOBAL from '../utilities/constants'

var client = new ApiHandler();
var CartHandler = new CartManager();
const BASE_URL_TYPE = "PROD";
export const getProductReview = (params) => {
    return (dispatch, getState) => {
        dispatch(beginFetchingProductReview());
        var headers = {};
        let url = `checkout/order/review?${getProductReviewUrl(params.data, params.itemToBeDeletedSku, getState, params.slot)}`;
        //let url = 'checkout/order/review' //mockable
        //let url = `checkout/order/review?${getProductReviewUrl(params.data)}`;
        //let finalUrl = url + '?' + getProductReviewUrl();
        let state = getState();
        if(state && state.accounts && state.accounts.userData && state.accounts.userData.cookie){
            headers['cookie'] = `identity=${state.accounts.userData.cookie}`;
        }
        client.getRequest(url, headers, BASE_URL_TYPE)
            .then(response => {
                if (response.status === 200 && response.ok) {
                    dispatch(productReviewSuccess(response.data));
                } else {
                    dispatch(productReviewSuccess(response.data));
                }
            }).catch(error => {
                dispatch(productReviewFailure(error));
            });
    }
}


export const getCartItemData =({sku})=>{
    return dispatch =>{
        let productSku = sku.split("-")[0];
        let url = GLOBAL.API_URL.WADI_SAWA_PREFIX + `product/${productSku}`;
        var headers = {};
        client.getRequest(url, headers, BASE_URL_TYPE)
            .then(response => {
                let data = (response.data && response.data.data) ? response.data.data : null;
                if(data){
                    dispatch({
                        type:Types.UPDATE_CART_ITEM_DATA,
                        data:{...data, sku:sku, productSku:data.sku},
                    });
                }
                    
            })
            .catch(error => {
               
            });
    }
    
}


/**
 *
 * @param {*} sku - 1st simple or product sku
 * @param {*} product - data of the product with {...product, sku:sku} //sku should be selected simple's sku
 * @param {*} tracking - object for tracking
 */
export const addToCart = ({sku, product, tracking, changeInQuantity}) => {
    return dispatch => {
        dispatch({
            type: Types.ADD_TO_CART,
            tracking: {
                data: (tracking) ? tracking : product,
                logType: TrackingEnum.TrackingType.ALL
            }
        });
        try {
            CartHandler.addProductToCart(sku, product)
                .then(response => {
                    dispatch(addToCartSuccess({sku, product, increase: true, changeInQuantity: changeInQuantity}));
                })
                .catch(error => {
                    dispatch(productReviewFailure(error));
                });
        } catch (error) {
            dispatch(productReviewFailure(error));
        }
    }
}
export const removeProductsFromCart = (items) => {
    return dispatch => {
        try {
            CartHandler.deleteMultipleProducts(items)
                .then(response => {
                    dispatch({ type: Types.REMOVE_PRODUCTS_FROM_CART, data: items });
                })
                .catch(error => {
                    dispatch(productReviewFailure(error));
                })
        } catch (error) {
            dispatch(productReviewFailure(error));
        }
    }
}
export const removeFromCart = ({product, tracking}) => {

    let {sku, quantity} = product;
    return dispatch => {

            let tracking = Object.assign({}, {data: tracking ? tracking : product}, {logType: TrackingEnum.TrackingType.ALL});
            dispatch({type: Types.REMOVE_FROM_CART, tracking: tracking});
            return new Promise((resolve, reject) => {
                try {
                    CartHandler.deleteProductFromCart(sku)
                        .then(response => {
                            dispatch(removeFromCartSuccess(product));
                            resolve({status: 200});
                        })
                        .catch(error => {
                            dispatch(productReviewFailure(error));
                            reject({status: 500});
                        });
                } catch (error) {
                    dispatch(productReviewFailure(error));
                    reject({status: 500});
                }
            });


    }
}

/**
 *
 * @param {*} sku is the old sku that needed to be replaced
 * @param {*} product is the updated product with new sku
 */
export const replaceProductInCart = ({ oldProduct, newProduct, tracking }) => {
    return dispatch => {
        dispatch({ type: Types.REPLACE_PRODUCT_IN_CART, tracking: (tracking) ? tracking : newProduct });
        try {
            CartHandler.replaceProductInCart(oldProduct.sku, newProduct)
                .then(response => {
                    //remove old sku keys from redux and add new sku with data in redux
                    dispatch(removeFromCartSuccess(oldProduct));
                    dispatch(addToCartSuccess({
                        sku: newProduct.sku,
                        product: { ...newProduct, quantity: 1 },
                        increase: true,
                        changeInQuantity: 1
                    }));
                })
                .catch(error => {
                    dispatch(productReviewFailure(error));
                });
        } catch (error) {
            dispatch(productReviewFailure(error));
        }
    }
}

export const updateProductInCart = ({ sku, product, increase }) => {
    return dispatch => {
        dispatch({ type: Types.UPDATE_PRODUCT_IN_CART, tracking: product });
        return new Promise((resolve, reject)=>{
            try {
                CartHandler.updateProductInCart(sku, product)
                    .then(response => {
                        dispatch(addToCartSuccess({sku, product, increase, changeInQuantity: 1}));
                        resolve({status: 200})
                    })
                    .catch(error => {
                        dispatch(productReviewFailure(error));
                        reject({status: 500})
                    });
            } catch (error) {
                dispatch(productReviewFailure(error));
                reject({status: 500})
            }
        })
    }
}

export const beginCheckout = () => {
    return dispatch => {
        dispatch({
            type: Types.BEGIN_CHECKOUT,
            tracking: {
                logType: TrackingEnum.TrackingType.ALL
            },

        })
    }
}

export const checkoutStep2 = () => {
    return dispatch => {
        dispatch({
            type: Types.CHECKOUT_STEP_2,
            tracking: {
                logType: TrackingEnum.TrackingType.GTM
            },

        })
    }
}

export const orderSuccess = (data) => {
    return dispatch => {
        try {
            CartHandler.clearCart()
                .then(response => {
                    dispatch(updateOrderStatusInCart(data));
                })
                .catch(error => {
                    dispatch(productReviewFailure(error));
                })
        } catch (error) {
            dispatch(productReviewFailure(error));
        }
    }
}

export const fetchCart = () => {
    return dispatch => {
        try {
            CartHandler.getCart()
                .then(response => {
                    if (response && Object.keys(response).length > 0) {
                        let itemsCount = 0;
                        for (let item in response) {
                            itemsCount += parseInt(response[item]["quantity"]);
                        }
                        dispatch(fetchCartSuccess({ itemsCount: itemsCount, data: response }))
                    }
                })
                .catch(error => {
                    dispatch(productReviewFailure(error));
                });
        } catch (error) {
            dispatch(productReviewFailure(error));
        }
    }
}

export const trackCheckoutEvent = ({ tracking }) => {
    return dispatch => {
        dispatch({
            type: Types.CHECKOUT_EVENTS,
            tracking
        });
    }
}

// export const updateProductsAfterReview =()=>{
//     return{
//         type:'hhd',

//     }
// }

export function getCartObj() {
    var cart = new CartManager();
    return dispatch => {
        cart.getCart().then(respo => {
            dispatch(didGetCartObj(respo))
        }).catch(error => {
            dispatch(didFailToGetCartObj(error))
            //console.warn(error)
        });
    }

}



const updateData = ({ data, items, isError = false }) => {
    let OOSData = {}, OOSCount = 0, itemsCount=0;
    for (let sku in items) {
        let updates;
        let currentData = data[sku];    //current state of sku 
        let updatedData = items[sku];   //state returned by review call
        if (isError) {
            if (updatedData.available_quantity > 0) {
                updates = { ...currentData, ...updatedData, quantity: parseInt(updatedData.available_quantity) };
                //OOSCount += parseInt(currentData.quantity)-parseInt(updatedData.available_quantity);
            } else {
                OOSData = { ...OOSData, [sku]: { ...currentData, ...updatedData, sku:sku } }
                OOSCount += parseInt(currentData.quantity);
            }
        } else {
            updates = { ...currentData, ...updatedData, sku:sku};
        }
        if (currentData && updates) {
            data = { ...data, [sku]: updates };
            itemsCount += parseInt(updates.quantity);
        }
        //we really don't need this.
        // else{
        //     data = {...data, [sku]:updates}
        // }

        
    }
    return { data, OOSData: OOSData, OOSCount:OOSCount, itemsCount:itemsCount };
}


export const productReviewSuccess = (response) => {
    return (dispatch, getState) => {
        let { errors, items } = response;
        let state = getState();
        let {data, itemsCount, cartReview} = state.cart;
        let OOSData = null, OOSCount=0;
        if (errors && errors.items) {
            let result = updateData({ data: data, items: errors.items, isError: true });
            data = result.data,
            OOSData = result.OOSData;
            OOSCount = result.OOSCount;
            itemsCount = (result.itemsCount)?result.itemsCount:itemsCount;
            cartReview = {...cartReview, response};
        }

        if (items) {
            let result = updateData({ data: data, items: items});
            data = result.data;
            //itemsCount = result.itemsCount;
        }

        let result = null;
        if (!(errors && errors.items)) {
            result = {}
            for (let sku in data) {
                let item = data[sku];
                item.price =  (!!item.price && item.price != 0) ? item.price/100 : 0;
                item.special_price = (!!item.special_price && item.special_price != 0) ? item.special_price/100 : 0;
                result[sku] = item;
            }
            cartReview= response;
        }

        dispatch({
            type: Types.PRODUCT_REVIEW_SUCCESS,
            data: {
                data: result?result:data,
                OOSData: OOSData,
                cartReview: cartReview,
                itemsCount:parseInt(itemsCount),
                OOSCount:OOSCount,
            }
        })
    }
}

export const productReviewFailure = (error) => {
    return {
        type: Types.PRODUCT_REVIEW_FAILURE,
        error
    }
}

export const beginFetchingProductReview = () => {
    return {
        type: Types.BEGIN_PRODUCT_REVIEW,
    }
}

export const addToCartSuccess = (data) => {
    let tracking = Object.assign({}, data.product, {logType: TrackingEnum.TrackingType.ALL}, {increase: data.increase}, {changeInQuantity: data.changeInQuantity});
    return {
        type: Types.ADD_TO_CART_SUCCESS,
        data: data,
        tracking
    }
}

export const removeFromCartSuccess = (data) => {
    let tracking = Object.assign({}, data, { logType: TrackingEnum.TrackingType.ALL });
    return {
        type: Types.REMOVE_FROM_CART_SUCCESS,
        data: data,
        tracking
    }
}
export const updateOrderStatusInCart = (data) => {
    return {
        type: Types.ORDER_SUCCESS,
        data: data
    }
}
export const fetchCartSuccess = (data) => {
    return {
        type: Types.FETCH_CART_SUCCESS,
        data: data
    }
}
// export const addToCartFailure =(data)=>{
//     return{
//         type:Types.CART_ERROR
//     }
// }

export function productReviewReceived(responseData) {
    return {
        type: 'PRODUCT_REVIEW_SUCCESS',
        data: responseData
    }
}

export function productReviewError() {
    return {
        type: 'PRODUCT_REVIEW_FAILURE',
    }
}

export function didGetCartObj(cartObj) {
    return {
        type: 'DID_GET_CART_OBJECT',
        data: cartObj
    }
}

export function didFailToGetCartObj(error) {
    return {
        type: 'DID_FAIL_TO_GET_CART_OBJECT',
        data: error
    }
}


function jsonToQueryString(json) {
    return (!json) ? '' : '?' +
        Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}
const getProductReviewUrl = (data, itemToBeDeletedSku = null, getState, slot) => {
    let state = null, paymentMethod = 'cc', countryBilling = '', countryShipping = '', shopCode = '';
    if(getState){
        state= getState();
    }
    if(state && state.configAPIReducer && state.configAPIReducer.selectedCountry){
        countryBilling = state.configAPIReducer.selectedCountry.countryCode;
        countryShipping = state.configAPIReducer.selectedCountry.countryCode;
        shopCode = state.configAPIReducer.selectedCountry.countryCode
    }
    let params = {};
    //var urlString = ''; // https://api.wadi.com/checkout/order/review?addresses[billing][country]=ae&addresses[shipping][country]=ae&customer=&items[CA787AC96WFB-29537]=1&payment[method]=cc&shop=ae&ts=1507711995

    var currentTime = (new Date).getTime() / 1000;
    params = {
        addresses: {
            billing: {
                country: countryBilling
            },
            shipping: {
                country: countryShipping
            },
        },
        customer: {
            payment: {
                method: paymentMethod,
                shop: shopCode,
                ts: currentTime
            },
        }
    }


    let urlString = 'addresses[billing][country]=' + countryBilling + '&addresses[shipping][country]=' + countryShipping + '&customer=';
    for (let sku in data) {
        //let {sku, quantity} = data[i];
        let quantity = data[sku]['quantity'];
        urlString += `&items[${sku}]=${quantity}`;  //need to add sku with string
    }

    if(!!itemToBeDeletedSku){
        urlString += `&cartAction[action]=delete&cartAction[sku]=${itemToBeDeletedSku}` // add the item to be deleted into url => cartAction[action] = 'delete'&cartAction[sku]='#{item-sku-simple}' ... cartAction: {action: 'delete', sku: sku-simple of deleted product}
    }

    if (GLOBAL.CONFIG.isGrocery && slot) {
        urlString += `&selected_slot=${slot.selected_slot}`;
        urlString += `&selected_date=${slot.selected_date}`;
    }
    //let finalUrl = 'addresses[billing][country]=sa&addresses[shipping][country]=sa&customer=&items[AR030WT980187-1877243]=1&payment[method]=cc&shop=sa&ts=1515670717.152'
    let finalUrl = `${urlString}&payment[method]=${paymentMethod}&shop=${shopCode}&ts=${currentTime}`;

    return encodeURI(finalUrl);
}

export const showUpdateAlert = ({ title = "", message = "", positiveAction, negativeAction, neutralAction, cancelable = true }) => {

    return (
        Alert.alert(
            title,
            message,
            [
                //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: cancelable }
        )
    );
}




