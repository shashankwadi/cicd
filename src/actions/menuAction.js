import Actions from './actionTypes';
import ApiHandler from 'Wadi/src/utilities/ApiHandler';
import * as GLOBAL from 'Wadi/src/utilities/constants';

var ApiClient = new ApiHandler();

export function getCategoriesStack() {
    return dispatch => {
        dispatch(categoriesFetchStart())
        var headers = {};
        let url =  GLOBAL.API_URL.Wadi_Navigation_Stack;
        // client.isWadi = false;
        ApiClient.getRequest(url, null, "PROD")
            .then(response => {
                let data = (response.data && response.data.data && response.data.data && response.data.data.mapping)?response.data.data.mapping:{};   
                dispatch(categoriesReceived(data));
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

export function categoriesReceived(data) {

    return {
        type: Actions.FETCH_CATEGORIES_RECEIVED,
        data
    }
}

export function categoriesReceiveFailed(error) {

    return {
        type: Actions.FETCH_CATEGORIES_FAILED,
        data:error
    }
}