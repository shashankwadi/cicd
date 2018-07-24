import Types from './actionTypes';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import ApiHandler from '../utilities/ApiHandler';

var StaticJson = require('Wadi/src/actions/json/static.json');

var client = new ApiHandler();
const BASE_URL_TYPE = "PROD";
//const BASE_URL_TYPE = "STAG";

export const clearCurrentData = (url)=>{
    return dispatch =>{
        dispatch({
            type:Types.CLEAR_HOME_DATA,
            url,
        })
    }
};

export const getHomeWidget = ({ extendedUrl = "" }) => {
    return dispatch => {
        dispatch(widgetFetchStart());
        return new Promise((resolve, reject) => {
            //let url = (extendedUrl && extendedUrl.length>0)?extendedUrl:GLOBAL.API_URL.Wadi_Home;
            let url = (extendedUrl && extendedUrl.length > 0) ? extendedUrl : GLOBAL.API_URL.Wadi_Home; //prod
            url = GLOBAL.API_URL.WADI_SAWA_PREFIX + url;

            let headers = {'N-Platform': ''}; //use only for doodle apis
            client.getRequest(url, headers, BASE_URL_TYPE)
                .then(response => {
                    if (response.status === 200 && response.ok) {
                        //let data = (response && response.data && response.data.widgets)?response.data.widgets:[];  //mocakble
                        let data = (response.data && response.data.render && response.data.render.json) ? response.data.render.json : []; //production
                        //let data = (response && response.data && response.data.assets && response.data.assets.widgets)?response.data.assets.widgets:[] //staging
                        //dispatch(widgetReceived({ url: extendedUrl, data: data }));
                        resolve({ data: data, status: 200 });
                    } else {
                        reject(response);
                    }
                }).catch(error => {
                    reject(response);
                    dispatch(widgetReceicedError(error));
                });
        })

    }
};
export const getMockableHomeWidget = ({ extendedUrl = "" }) => {
    return dispatch => {
        dispatch(widgetFetchStart());
        return new Promise((resolve, reject) => {
            let url = extendedUrl; //mocakbale
            let headers = {'N-Platform': ''}; //use only for doodle apis
            client.getRequest(url, headers, "MOCK")
                .then(response => {
                    if (response.status === 200 && response.ok) {
                        let data = (response && response.data && response.data.widgets)?response.data.widgets:[];  //mocakble
                        resolve({ data: data, status: 200 });
                    } else {
                        reject(response);
                    }
                }).catch(error => {
                    reject(response);
                    dispatch(widgetReceicedError(error));
                });
        })

    }
};

//get carousel products;
export const getCarouselProducts = ({ url, uid }) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let delimiter = "?";
            if (url && url.indexOf(delimiter) !== -1) {
                delimiter = "&";
            }
            url = GLOBAL.API_URL.WADI_SAWA_PREFIX + url + delimiter + "limit=5";
            var headers = {};
            client.getRequest(url, headers, BASE_URL_TYPE)
                .then(response => {
                    if (response.status === 200 && response.ok) {
                        let data = (response.data && response.data.data) ? response.data.data : [];
                        dispatch(carouselProductSuccess({ uid, url, data: data }));
                        resolve({ data: data, status: 200 });
                    } else {
                        reject(response);
                    }
                }).catch(error => {
                    reject(error);
                });
        });

        // client.getRequest(url, headers, BASE_URL_TYPE )
        // .then(response=>{
        //     let data = (response.data && response.data.data)?response.data.data:[];
        //     dispatch(carouselProductSuccess({uid, url, data:data}));
        // }).catch(error =>{
        //     //dispatch(carouselProductSuccess({uid, url, data:data}));
        // });
    }
};

export const hideSearchBar = (hidden) => {
    return {
        type: Types.HIDE_SEARCH_BAR,
        searchBarHidden: hidden
    }
};

export const widgetFetchStart = () => {
    return {
        type: Types.FETCHING_WIDGET,
    }
};

/**
 * 
 * @param {*} data is a object having keys named as url and data
 */
export const widgetReceived = (data) => {

    return {
        type: Types.WIDGET_RECEIVED,
        data,
    }
};

export const widgetReceicedError = (error) => {

    return {
        type: Types.WIDGET_RECEIVED_ERROR,
        errorInFetch: true
    }
};

export const carouselProductSuccess = ({ uid, url, data }) => {
    return {
        type: Types.CAROUSEL_PRODUCTS_SUCCESS,
        data: { uid, url, data }
    }
};