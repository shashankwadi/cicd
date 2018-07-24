import Types from './actionTypes';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import ApiHandler from '../utilities/ApiHandler';

const BASE_URL_TYPE = "MOCK";
var client = new ApiHandler();

export function getTabData(tabUrl) {


   //tabUrl = tabUrl.substr(1);
    //let url = GLOBAL.API_URL.WADI_SAWA_PREFIX +tabUrl.substr(1) ;
    let url = tabUrl.substr(1);
    return new Promise((resolve, reject) => {
        client.getRequest(url, {'N-Platform': ''}, BASE_URL_TYPE)
            .then(
                response => {
                    resolve(response)
                }
            )
            .catch(error => {
                reject(error)
            })
    })


}