

/**
 * at 15/11/2017 by Manjeet Singh
 * Avoid this reducer I am planning to drop it in favour of productsReducer
 */

import Types from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    errorInFetch: false,
    dataSource : [],
    count:0,
    totalCount:0,
    search: {}
}

export default function productListReducer(state = initialState, action) {
    
    switch (action.type) {
        case Types.FETCHING_PRODUCT:

        if(action.pageNumber == 1) {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
                dataSource : []
            }
        } else {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Types.PRODUCT_RECEIVED: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: false,
                ...action.data, // {count, dataSource as array}
            }
        }
        case Types.PRODUCT_ERROR:
        return{
            ...state,
            isFetching:false,
            errorInFetch:false,
        }
        case Types.FILTER_APPLIED:{
            return{
                ...state,
                ...action.data     //updating filters
            }
        }
        case Types.SORT_SELECTED:
        case Types.SIZE_SELECTED:
        case Types.QUANTITY_SELECTED:
        default:
            return state

    }
}