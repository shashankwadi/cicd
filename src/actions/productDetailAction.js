/**
 * can be droped in favour of sagas
 */

import Types from './actionTypes';
import * as GLOBAL from 'Wadi/src/utilities/constants';

var StaticJson = require('Wadi/src/actions/json/static.json');

import ApiHandler from '../utilities/ApiHandler';
import {error} from '../reducers/productsReducer';
import store from 'Wadi/src/reducers/store';
import {getPromiseDeliveryDetails} from "./getPromiseDeliveryAction";

import TrackingEnum from '../tracking/trackingEnum';
const BASE_URL_TYPE = "PROD";
//const BASE_URL_TYPE = "STAG";
var client = new ApiHandler();

/**
 * 
 * @param {*} url is either of .html url or product/sku
 */
export const clearCurrentData = (url)=>{
    return dispatch =>{
        dispatch({
            type:Types.CLEAR_PRODUCT_DATA,
            url,
        })
    }
}

export const getProductDetail = (params) => {
    return (dispatch, getStore) => {
        dispatch(productDetailRequest())
        let url = GLOBAL.API_URL.WADI_SAWA_PREFIX + params;
        var headers = {};
        return new Promise((resolve, reject) => {

            client.getRequest(url, headers, BASE_URL_TYPE)
                .then(response => {
                    let data = (response.data && response.data.data) ? response.data.data : {};
                    let bestSeller = _getSupplierForDeliveryPromise(response.data.data);
                    if(bestSeller){
                        data={...data, bestSeller};
                    }
                    //dispatch(productDetailReceived({url:params, data:data}));
                    if (response.status === 200) {
                        if (response.data && response.data.data.simples && response.data.data.simples.length > 0) {
                            dispatch(getPDPPromiseDetails({data: response.data.data, url: null, postParams: null})); // get promise details
                        }
                        resolve({status: 200, sku: data.sku, data: data})
                    }
                    else
                        resolve({status: 403})
                })
                .catch(error => {
                    dispatch(productDetailError(error));
                    reject({status: 403});
                });
        });

    }
}

/**
 *
 * @param {*} url is the extended url
 * @param {*} data is the updated producted data;
 */
export const updateCurrentProduct =({url, data})=>{
    return dispatch =>{
        dispatch(productDetailReceived({url, data}));
    }
}

export const productDetailRequest = () => {
    return {
        type: Types.GET_PRODUCT_DETAIL
    }
}

export const productDetailReceived = (data) => {
    let tracking = Object.assign({}, data.data, {logType: TrackingEnum.TrackingType.ALL})
    return {
        type: Types.GET_PRODUCT_DETAIL_SUCCESS,
        data,
        tracking
    }
};

export const productDetailError = (error) => {
    return {
        type: Types.GET_PRODUCT_DETAIL_ERROR,
        errorInFetch: true
    }
};

export const getSimilarProducts = (sku) => {
    return dispatch => {

        let headers = {uuid: 'CDC79E97-4E24-4668-A995-0AE8F0D1E3BB', source: 'app'};

        return new Promise((resolve, reject) => {
            client.getRequest(GLOBAL.API_URL.Wadi_Similar_Products + sku, headers, BASE_URL_TYPE)
                .then((response) => {
                        //console.log('similar_products_response', response);

                        if (response.status === 200) {

                            resolve({status: 200, response: response})
                        }
                        else
                            resolve({status: 403})
                    }
                )
                .catch((error) => {
                    reject({status: 403});
                });


        });

    };
}

export const getFrequentlyBought = (sku) => {
    return dispatch => {

        // let headers = {uuid: 'CDC79E97-4E24-4668-A995-0AE8F0D1E3BB', source: 'app'};
        let headers = {};
        return new Promise((resolve, reject) => {
            client.getRequest(GLOBAL.API_URL.Wadi_Frequently_Bought + sku, headers, "PROD")
                .then((response) => {
                        if (response.status === 200) {

                            resolve({status: 200, response: response})
                        }
                        else
                            resolve({status: 403})
                    }
                )
                .catch((error) => {
                    reject({status: 403});
                });


        });

    };
}

export const getSizeChart = (sku) => {
    return dispatch => {
        let headers = {};
        return new Promise((resolve, reject) => {
            client.getRequest(GLOBAL.API_URL.Wadi_Size_Chart + sku, headers, "STAG")
                .then((response) => {
                    if (response.status === 200
                        && response.data.success === true) {
                        resolve({status: 200, response: response})
                    } else {
                        resolve({status: 403})
                    }
                })
                .catch((error) => {
                    reject({status: 403});
                })
        })
    }
};


const _setPDPDeliveryDetailsInRedux = (deliveryDetailsObj) => {
    return {
        type: Types.GET_PDP_DELIVERY_DETAILS,
        deliveryDetailsObj: deliveryDetailsObj
    }
};


export const getPDPPromiseDetails = (obj) => { // obj = {data, url, params}
    /**********
     * obj = {data: {}, url: '', params: {}} *
     * comments:  one of data or url is null
     * when data is present, it is coming from api response of pdp - where data is PDP OBject
     * when url is present, it is coming from pdp screen - (change city)
     * when params is present, it is coming from pdp screen - select size or change city (in which size is selected)
     * *********/

    return (dispatch, getStore) => {

        if (obj.data || obj.url) { // coming from API response or change city
            return new Promise((resolve, reject) => {
                let pdpReducer = getStore().productDetailReducers;
                let pdpData = obj.data ? obj.data : pdpReducer.data[obj.url];
                _calculatePDPPromiseDetailsParams(getStore, pdpData)  // this will read pdp object from redux and calculate the post params
                    .then((result) => {
                        if (result.status === 200 && result.params) { // if we got some params
                            getPromiseDeliveryDetails(result.params)
                                .then((res) => {
                                    if (res.status === 200) {
                                        dispatch(_setPDPDeliveryDetailsInRedux(res.catalog_simple));
                                    }
                                })
                                .catch((err) => {
                                    dispatch(_setPDPDeliveryDetailsInRedux(null)); // else set null
                                   // console.log('error in pdp action', err);
                                })
                        }
                        else { // if no post params exists
                            dispatch(_setPDPDeliveryDetailsInRedux(null)); // else set null
                        }
                    })
                    .catch((err) => {
                        // do nothing
                        reject(false);
                    });

            });
        }
        else if(obj.params){ // coming from select size
            getPromiseDeliveryDetails(obj.params)
                .then((res) => {
                    if (res.status === 200) {
                        dispatch(_setPDPDeliveryDetailsInRedux(res.catalog_simple));
                    }
                })
                .catch((err) => {
                    dispatch(_setPDPDeliveryDetailsInRedux(null)); // else set null
                    //console.log('error in pdp action', err);
                })
        }
        else{ // some error, handle it
            dispatch(_setPDPDeliveryDetailsInRedux(null)); // else set null
        }
    }
};

const _calculatePDPPromiseDetailsParams = (store, pdpData) => {
    return new Promise((resolve, reject) => {
        let configAPIReducer = store().configAPIReducer;
        var pdpObj = pdpData,
            supplier = _getSupplierForDeliveryPromise(pdpObj);

        if (supplier) {
            let getPromiseDetailsBodyParams = {
                "catalog_simple": [{
                    "sku_simple": supplier.sku,
                    "vendor_code": supplier.vendor_code
                }],
                "destination": configAPIReducer.selectedCity,
                "shop": configAPIReducer.selectedCountry.countryCode
            };
            resolve({status: 200, params: getPromiseDetailsBodyParams});
        }
        else {
            resolve({status: 500})
        }

    });
};


export const _getSupplierForDeliveryPromise = (pdpObj) => {
    var supplier = null;
    if(pdpObj && pdpObj.simples){
        for (let i = 0; i < pdpObj.simples.length; i++) {
            let tempSimple = pdpObj.simples[i];
            if (tempSimple.suppliers && tempSimple.suppliers.length > 0)
                for (let j = 0; j < tempSimple.suppliers.length; j++) {
                    let tempSupplier = tempSimple.suppliers[j];
                    if (tempSupplier.availableQty && parseInt(tempSupplier.availableQty) > 0) {
                        supplier = {...tempSupplier, size: tempSimple.size};
                        return supplier;
                    }
                }
    
        }
    }
    return supplier;
};


export const _getFirstDefaultSupplier = (suppliers) => {
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

export const trackAddToCart = (product) => {

    let tracking = Object.assign({}, {data: product}, {logType: TrackingEnum.TrackingType.MSD})
    return dispatch => {
        dispatch({
            type: Types.ADD_TO_CART,
            tracking
        })
    }

}

export const trackCarousalSwipe = (product) => {

    let tracking = Object.assign({}, {data: product}, {logType: TrackingEnum.TrackingType.MSD})
    return dispatch => {
        dispatch({
            type: Types.CAROUSAL_SWIPE,
            tracking
        })
    }

}