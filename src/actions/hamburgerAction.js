

import Actions from './actionTypes';
import ApiHandler from 'Wadi/src/utilities/ApiHandler';
import * as GLOBAL from 'Wadi/src/utilities/constants';

var ApiClient = new ApiHandler();

export function getCategoriesStack() {
    return dispatch => {
        dispatch(categoriesFetchStart())
        var headers = {};
        url =  GLOBAL.API_URL.Wadi_Navigation_Stack;
        // client.isWadi = false;
        ApiClient.getRequest(url)
            .then(responseData => {
                let menus = (responseData.data && responseData.data.menu)?responseData.data.menu:[];   
                dispatch(categoriesReceived(menus));
            }).catch(error => {

                
               dispatch(categoriesReceiveFailed(error));
            });

    }                
}

export function categoriesFetchStart() {
    return {
        type: Actions.FETCH_CATEGORIES_START
    }
}

export function categoriesReceived(categoryData) {

    return {
        type: Actions.FETCH_CATEGORIES_RECEIVED,
        categories: categoryData
    }
}

export function categoriesReceiveFailed(error) {

    return {
        type: Actions.FETCH_CATEGORIES_FAILED,
        errorInFetch: true
    }
}