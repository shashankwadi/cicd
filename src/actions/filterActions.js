'use strict';

import Types from './actionTypes';
import * as GLOBAL from 'Wadi/src/utilities/constants';

import ApiHandler from '../utilities/ApiHandler';

const BASE_URL_TYPE = "PROD";
var client = new ApiHandler();

/**
 * 
 * @param {*} filters is the query string generated in component;
 */
export const getFilters = (filters) => {
   return dispatch => {
        dispatch(filterRequest());
        
        //filters will look like "brand=adidas,reebok&color=red”;
        //let url =  GLOBAL.API_URL.WADI_SAWA_PREFIX + GLOBAL.API_URL.Wadi_Filter_URL+filters;
        let url =  GLOBAL.API_URL.WADI_SAWA_PREFIX+filters;
        //let url = 'https://en-ae.wadi-stg.com/api/sawa/v1/u/filter?facets=1' + filters;
        let headers = {};
        client.getRequest(url, headers, BASE_URL_TYPE )
        .then(response =>{
            let facets = (response.data && response.data.facets)?response.data.facets:null;
            //Object.keys(facets).map((key) => { return { key: key, ...facets[key] } });
            let categories = (facets) ? Object.keys(facets).map((key) => { return { key: key, ...facets[key] } }) : [];
            let search = (response.data && response.data.search)?response.data.search:{};
            dispatch(getFiltersSuccess({categories:categories, search:search}));
        }).catch(error=>{
            dispatch(getFiltersError(error));
        });
    }

}

export const filterRequest =()=> {
    return {
        type: Types.GET_FILTERS
    }
}

export const getFiltersSuccess=(data)=> {
    return {
        type: Types.GET_FILTERS_SUCCESS,
        data
    }
}

export const getFiltersError=(error) =>{
    return {
        type: Types.GET_FILTERS_ERROR,
        errorInFetch: true
    }
}

