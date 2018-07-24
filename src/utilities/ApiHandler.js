/**
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-10-07
 *
 * @Comments: This file is created by Simranjeet Singh Sawhney on 09-11-2017
 * It is the base api handler file for calling the API
 * Add the all the possible api methods like get, post in this file only.
 * Also, it includes the common headers as well
 **/


'use strict';
import {create} from 'apisauce';
import {Platform} from 'react-native';

import * as GLOBAL from '../utilities/constants';
import store from 'Wadi/src/reducers/store';

/***
 *
 * APISAUCE NPM Package is used => it is wrapper of AXIOS which itself is a wrapper of FETCH
 * https://github.com/infinitered/apisauce
 *
 ***/

/*Defines the working environment*/
var env = GLOBAL.ENUM.EnvironmentType.Production;

/*This will create base API hit
* Add base url and common headers into this
* Use this to call other urls*/
const api = create({
    baseURL: getBaseUrl(env),
    //headers: addCommonHeaders()
});


export default function ApiHandler() {
    this.getRequest = (url, headers = null, baseUrlType = "") => {
        updateBaseUrl(baseUrlType);
        return api.get(url, {}, {headers: addCommonHeaders(headers)}); //need to look into this
    };

    /* POST METHOD */
    this.postRequest = (url, params, headers, baseUrlType = "") => {
        updateBaseUrl(baseUrlType); //remove it when in production
        return api.post(url, params, {headers: addCommonHeaders(headers)});
    };

    this.putRequest = (url, params, headers, baseUrlType = "") => {
        updateBaseUrl(baseUrlType); //remove it when in production
        return api.put(url, params, {headers: addCommonHeaders(headers)});
    };

    this.patchRequest = (url, params, headers, baseUrlType = "") => {
        updateBaseUrl(baseUrlType); //remove it when in production
        return api.patch(url, params, {headers: addCommonHeaders(headers)});
    };

    this.deleteRequest = (url, params, headers, baseUrlType = "") => {
        updateBaseUrl(baseUrlType);
        return api.delete(url, params, {headers: addCommonHeaders(headers)});
    };

    this.headRequest = (url, params, headers, baseUrlType = "") => {
        updateBaseUrl(baseUrlType);
        return api.head(url, params, {headers: addCommonHeaders(headers)});
    }
}


/*this function is for common headers*/
export function addCommonHeaders(headersToAppend = null) {
    var state = null;
    if (store) {
        state = store.getState();
    }

    var headers = {}

    if (GLOBAL.CONFIG.isGrocery) {
        headers = {
            'source':'app',
            'n-device':'mobile',
            'appName':'wadi_grocery',
            'Content-Type': 'application/json'
        };

        if (Platform.OS === 'ios') {
            headers['n-context'] = 'grocery-ios';
        }
        else {
            headers['n-context'] = 'grocery-android';
        }

    }else{
        headers = {
            "source": "app",
            "N-App": "Wadi",
            "N-media": "app",
            "N-Device": "mobile",
            "N-context": "small",
            'Content-Type': 'application/json'
        };
    }

    // dynamic headers
    let city = (( store && state && state.configAPIReducer && state.configAPIReducer.selectedCity) ? (state.configAPIReducer.selectedCity) : ('riyadh')),
        language = ((store && state && state.configAPIReducer && state.configAPIReducer.selectedLanguage) ? (state.configAPIReducer.selectedLanguage) : ('en')),
        country = ((store && state && state.configAPIReducer && state.configAPIReducer.selectedCountry && state.configAPIReducer.selectedCountry.countryCode) ? (state.configAPIReducer.selectedCountry.countryCode) : ('sa')),
        n_locale = language + '_' + country.toUpperCase();

    headers['language'] = language;
    headers['N-Locale'] = n_locale;

    if (!GLOBAL.CONFIG.isGrocery) {

        headers['city'] = city;
    } else {

        headers['city'] = state && state.accounts && state.accounts.selectedCityGrocery ? state.accounts.selectedCityGrocery : "";
    }

    //Platform Specific headers
    if (Platform.OS === 'ios') {
        headers['N-Platform'] = 'ios';
    }
    else {
        headers['N-Platform'] = 'android';
    }

    // append additional headers
    if (headersToAppend)
        Object.assign(headers, headersToAppend);

    return headers;
}


/*Get the base URL*/
function getBaseUrl(env) {
    if (env === GLOBAL.ENUM.EnvironmentType.Production) {
        return GLOBAL.API_URL.WadiBaseURLProd;
    }
    return GLOBAL.API_URL.WadiBaseURLStaging;
}

function updateBaseUrl(baseUrlType = "") {
    if (baseUrlType === "") return;
    let type = BaseUrlType[baseUrlType];
    if (type !== api.getBaseURL()) {
        api.setBaseURL(type);
    }
}

export const BaseUrlType = {
    PROD: GLOBAL.API_URL.WadiBaseURLProd,
    STAG: GLOBAL.API_URL.WadiBaseURLStaging,
    MOCK: GLOBAL.API_URL.WadiMockable,
    MYWADI:GLOBAL.API_URL.MyWadi,
    TRACKWADI: GLOBAL.API_URL.TrackWadiBaseUrl,
    WadiS3: GLOBAL.API_URL.WadiS3,

};