'use strict'

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import * as GLOBAL from 'Wadi/src/utilities/constants';
//import ApiClient from 'Wadi/src/utilities/apiClient';
import ApiHandler from '../utilities/ApiHandler';
import { HomePageActions, HomePageTypes as Types } from '../reducers/homePageReducers';

// var client = new ApiClient();
// client.isWadi = false;
const BASE_URL_TYPE = "PROD";
var client = new ApiHandler();


export default function* homePage(request) {
    //let client = yield call(ApiClient);       
    if (!request) return false;  //no request stop right here

    let headers = {};
    const { type } = request
    if (type === Types.GET_HOME_WIDGET) {
        //const { filters } = request;
        //filters will look like "brand=adidas,reebok&color=red”
        //let url = 'homePageData';
        //let url = 'homepage';
        //let url ='page_for_test/?dfdffdfdf';
        //let url ='';
        alert("HomePage Saga called");
        let url =  GLOBAL.API_URL.WADI_SAWA_PREFIX + GLOBAL.API_URL.Wadi_Home;
        const response = yield call(client.getRequest, url, null, BASE_URL_TYPE);  //need to send this as headers in static apis {"source": "app",}
        alert("HomePage Saga success", response);
        if (response.status === 200) {
            let data = (response.data && response.data.render && response.data.render.json)?response.data.render.json:[]
            //let mapping = (response.data && response.data.assets && response.data.assets.mapping) ? response.data.assets.mapping : null
            //yield put(HomePageActions.getHomeWidgetSuccess(response.data));
            yield put(HomePageActions.getHomeWidgetSuccess(data));
        } else {
            yield put(HomePageActions.getHomeWidgetError("Filter error"))
        }
    }
    if (type === Types.GET_HOME_WIDGET_OLD) {
        let url = 'homepage';
        //let url ='';
        const response = yield call(client.getRequest, url, null, "MOCK");  //need to send this as headers in static apis {"source": "app",}
        if (response.status === 200) {
            //let data = (response.data && response.data.render && response.data.render.json)?response.data.render.json:[]
            //let mapping = (response.data && response.data.assets && response.data.assets.mapping) ? response.data.assets.mapping : null
            yield put(HomePageActions.getHomeWidgetSuccess(response.data.widgets));
            //yield put(HomePageActions.getHomeWidgetSuccess(data));
        } else {
            yield put(HomePageActions.getHomeWidgetError("Filter error"));
        }
    }

    //added te
    if (type === Types.GET_CAROUSEL_PRODUCTS) {
        //let url = 'homepage';
        //let url ='';
        let {params} = request;
        if(params){
            let {url, uid} = params;
            url = GLOBAL.API_URL.WADI_SAWA_PREFIX + url;
            const response = yield call(client.getRequest, url, null, BASE_URL_TYPE);  //need to send this as headers in static apis {"source": "app",}
            if (response.status === 200) {
                let data = (response.data && response.data.data)?response.data.data:[];
                yield put(HomePageActions.getCarouselProductsSuccess({uid, url, data:data}));
                //yield put(HomePageActions.getHomeWidgetSuccess(data));
            } else {
                yield put(HomePageActions.getHomeWidgetError("Filter error"))
            }
        }
        
    }
}