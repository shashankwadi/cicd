'use strict';

import Actions from './actionTypes';
import * as GLOBAL from '../utilities/constants';

import ApiHandler from '../utilities/ApiHandler';
import ConfigHandler from "../utilities/managers/configHandler";
import FeatureMapHandler from "../utilities/managers/featureMapHandler";

const BASE_URL_TYPE = "PROD";
const client = new ApiHandler();


export const getPromiseDeliveryDetails = (postBody) => {
    /****** postBody params supposed to be
     * {"catalog_simple":[{"sku_simple":"AP771EL18RAB-573202","vendor_code":"V00010"}],"destination":"Abu Areish","shop":"sa"}
     * ********/
    return new Promise((resolve, reject) => {
        client.postRequest(GLOBAL.API_URL.Wadi_Get_Promise_Details, postBody, {}, BASE_URL_TYPE)
            .then((response) => {
                //check response status
                //console.log('get promise resp', response);
                if(response.status == 200 && response.data && response.data.data && response.data.data.catalog_simple)
                    resolve({status: 200, catalog_simple: response.data.data.catalog_simple});
                else
                    resolve({status: 403})

            })
            .catch((err) => {
                //console.log('err', err);
                reject({status: 403});
            })
    });


};
