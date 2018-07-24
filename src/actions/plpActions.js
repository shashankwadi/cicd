/**
 * at 15/11/2017 by Manjeet Singh
 * avoid using it, I like to drop it in favour of sagas
 */

import Types from './actionTypes';
//import ApiClient from 'Wadi/src/utilities/apiClient'
import * as GLOBAL from 'Wadi/src/utilities/constants';
import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import {getFiltersSuccess} from '../actions/filterActions';
import ApiHandler from '../utilities/ApiHandler';
import TrackingEnum from '../tracking/trackingEnum';

var client = new ApiHandler();
const BASE_URL_TYPE = "PROD";

export const getFinalUrl = (search) => {
    //'wadi.com/s/<search-text>/<categories1>-<cat2>/<brand1>--<brand2>?price=asc&sortBy=popularu'
    let pathParams = '', queryString = '';
    for (let key in search) {
        let data = search[key];
        if (key === 'page' || key === 'limit' || key === 'q'||key=='express') {
            queryString = (key === 'q')?queryString+`${key}=${data}&`:queryString;
        } else if (key === 'sort') {
            //queryString += `${key}=${data.by}&dir=${data.dir}&`;
        } else if (key === 'searchKey' || key === 'category' || key === 'brand') {
            if (data && data.length) {
                let ps = data.join('--').replace(/--\s*$/, "");
                pathParams += `/${ps}`;
            }
        } else {
            if (data && data.length) {
                let qs = data.join('--').replace(/--\s*$/, "");
                queryString += `${key}=${qs}&`;
            }
        }
    }
    let finalUrl = '';
    if(!!pathParams){
        finalUrl = `${pathParams}?${queryString}`;
    }
    return finalUrl;
}

export function getProduct({url, pageNumber, alreadyProduct, sortKey, filters, searchString = "", ...extras}) {
    /**
     * now final url already have filters with path params and query strings
     */
    //https://api.wadi.com/sawa/v1/u/catalog?&q=  for serach;
    return dispatch => {
        dispatch(productFetchStart(pageNumber));
        headers = {}
        //url = `plp?page=${pageNumber}${filters}`

        //url will be sent either from home page or catgory

        // if (searchString.length > 0) {
        //     url = `catalog?&q=${searchString}`;
        // }
        url = addQueryParams({url, pageNumber, sortKey, filters});
        if (extras.isExpress)
            url = url + "&express=1";

        url = GLOBAL.API_URL.WADI_SAWA_PREFIX + url;
        return new Promise((resolve, reject) => {
            client.getRequest(url, headers, BASE_URL_TYPE)
                .then((response) => {
                    if (response.status === 200) {
                        //data = (response.data && response.data)?response.data.data:[]
                        let responseData = response.data;
                        //let dataSource = formatData(responseData, alreadyProduct);
                        //let dataSource = formatPLPData(responseData, alreadyProduct, pageNumber);
                        let search = (responseData.search) ? responseData.search : {};
                        dispatch(productReceived({
                            //dataSource: dataSource,
                            //count: dataSource.length,
                            responseData: {...responseData, searchString: searchString},
                            //totalCount: responseData.totalCount,
                            search: search
                        }));
                        if (pageNumber == 1 && responseData.facets) {
                            let categories = (responseData.facets) ? Object.keys(responseData.facets).map((key) => {
                                return {key: key, ...responseData.facets[key]}
                            }) : [];
                            dispatch(getFiltersSuccess({categories: categories, search: search}));
                        }
                        resolve(response);
                    } else {
                        dispatch(productError("failed"));
                        reject(response);
                    }
                })
                .catch((error) => {
                    dispatch(productError(error));
                    reject(error);
                });
        });
    }
}


export function productReceived(data) {
    let tracking = Object.assign({}, data, {logType: TrackingEnum.TrackingType.ALL});
    return {
        type: Types.PRODUCT_RECEIVED,
        data: data,
        tracking
    }
}

export function productFetchStart(pageNumber) {

    return {
        type: Types.FETCHING_PRODUCT,
        pageNumber: pageNumber
    }
}

export const productError = (error) => {
    return {
        type: Types.PRODUCT_ERROR
    }
}

export const sortSelected = (params) => {
    return dispatch => {
        dispatch({
            type: Types.SORT_SELECTED,
            tracking: params,
        });
    }
}

export const sizeSelected = (params) => {
    return dispatch => {
        dispatch({
            type: Types.SIZE_SELECTED,
            tracking: params
        });
    }
}

export const quantitySelected = (params) => {
    return dispatch => {
        dispatch({
            type: Types.QUANTITY_SELECTED,
            tracking: params
        });
    }
}

export const filterApplied = (search) => {
    return dispatch => {
        dispatch({
            type: Types.FILTER_APPLIED,
            tracking: search,
            data: {search: search}
        })
    }
}

export const clearFilter = (params) => {
    return dispatch => {
        dispatch({
            type: Types.CLEAR_FILTER,
            tracking: params
        })
    }
}

addQueryParams = ({url, pageNumber, sortKey, filters}) => {
    if (url.includes("?")) {
        let newQueries = ""
        let urlParts = url.split("?");
        let queries = urlParts[1].split("&");
        for (let i = 0; i < queries.length; i++) {
            let qs = queries[i];
            if (qs.includes("page")) {
                qs = qs.substring(0, qs.indexOf("=")) + `=${pageNumber}`
            } else if (qs.includes("sort") && sortKey.length > 0) {
                qs = qs.substring(0, qs.indexOf("=")) + `=${sortKey}`
            }
            newQueries += `${qs}&`;
        }
        newQueries = newQueries.slice(0, -1)
        //url = `${urlParts[0]}?${newQueries}${filters}`;
        if (!url.includes("sort") && sortKey.length > 0) {
            url = url + "&sort=" + sortKey;
        }
        if (!url.includes("page")) {
            url = url + "&page=" + pageNumber;
        }
    } else {
        //url =  `${url}?page=${pageNumber}${filters}`;
        if (sortKey.length > 0) {
            url = url + "?sort=" + sortKey;
        }
    }
    return url;
}
/**
 * this function need to be refractored in favour of flatlist
 */

export const formatData = (responseData, alreadyProduct) => {
    var dataBlob = {}, sectionIDs = [], rowIDs = [], i = 0, j = 0;

    var indexSection = 0, indexRow = 0;


    if (!!alreadyProduct.dataBlob) {
        dataBlob = alreadyProduct.dataBlob
        sectionIDs = alreadyProduct.sectionIDs
        rowIDs = alreadyProduct.rowIDs
        indexSection = 2;
        indexRow = rowIDs[rowIDs.length - 1].length;
    }
    let isWidgets = responseData.widgets ? true : false;
    //let sectionsLen = (isWidgets) ? 3 : 2
    let sectionsLen = 3;
    for (i = indexSection; i < sectionsLen; i++) {
        let sectionGroup;

        if (isWidgets) {
            sectionGroup = (i == 0) ? responseData.widgets : []
            (i == 1 ? sectionGroup = [{filterRow: 'yes'}] : sectionGroup = responseData.data);
        } else {
            sectionGroup = (i == 0) ? [] :
                (i == 1 ? sectionGroup = [{filterRow: 'yes'}] : sectionGroup = responseData.data);
            //sectionGroup = (i == 1) ? [{ filterRow: 'yes' }] : responseData.data;
            //sectionGroup = responseData.data
        }

        // Add Section to Section ID Array
        if (indexRow > 0) {


            rowIDs[i] = rowIDs[rowIDs.length - 1];


        } else {

            sectionIDs.push(i);
            // Set Value for Section ID that will be retrieved by getSectionData


            // Initialize Empty RowID Array for Section Index

            rowIDs[i] = [];
        }

        dataBlob[i] = {type: i};
        var rowsLength = sectionGroup.length;
        for (j = 0; j < rowsLength; j++) {

            var rowData = sectionGroup[j];

            const rowId = `${i}:${j + indexRow}`;

            // Add Unique Row ID to RowID Array for Section
            rowIDs[rowIDs.length - 1].push(rowId);

            // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
            dataBlob[rowId] = rowData;

        }
    }
    return {dataBlob, sectionIDs, rowIDs};
}

export const formatPLPData = (response, alreadyProduct = [], pageNumber) => {
    let data = [];
    // if(pageNumber==1){
    //     data = [...data, {sectionID:'1', filterRow: 'yes', type:'filter_row' }]
    // }
    if(response && response.data){
        let isWidgets = response.widgets ? true : false;
        if (isWidgets) {
            data = [...response.widgets, ...data];
        }
        data = [...data, ...response.data];
        if (pageNumber != 1 && alreadyProduct && alreadyProduct.length > 0) {
            data = [...alreadyProduct, ...data];
        }
    }
    return data;
}
