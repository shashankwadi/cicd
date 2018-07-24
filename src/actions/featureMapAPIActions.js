import Actions from './actionTypes';
import * as GLOBAL from '../utilities/constants';

import ApiHandler from '../utilities/ApiHandler';
import FeatureMapHandler from "../utilities/managers/featureMapHandler";
import {Platform} from 'react-native'
import {getCommonHeadersForConfigFeatureMap} from "../utilities/utilities";
const BASE_URL_TYPE = "PROD";
const client = new ApiHandler();
const featureMapHandler = new FeatureMapHandler();


export const getFeatureMap = () => {

    return dispatch => {
        return new Promise((resolve,reject)=>{
        getCommonHeadersForConfigFeatureMap().then(headers =>{

                client.getRequest(GLOBAL.API_URL.Wadi_Get_Feature_Map, headers, BASE_URL_TYPE)
                    .then((response) => {
                        //check response status
                        if(response && response.status === 200 && response.data && response.data.assets && response.data.assets.meta){
                            _setFeatureMapStorage(response.data.assets.meta); // save data to Async Storage
                            dispatch(_setFeatureMapObjRedux(response.data.assets.meta)); //store in redux
                            resolve({status: 200})
                        }
                        else{
                            resolve({status: 403});
                        }
                    })
                    .catch((err) => {
                        //console.log('err', err);
                        resolve({status: 403});
                    })
            });

        })


    }

};


const _setFeatureMapObjRedux = (featureMapObj) => {  //this will store in redux
    return {
        type: Actions.SET_FEATURE_MAP,
        featureMapObj: featureMapObj
    }
};

const _setFeatureMapStorage = (featureMapObj) => { // this will store in async storage
    featureMapHandler.setFeatureMap(featureMapObj);
};

