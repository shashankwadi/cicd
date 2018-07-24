'use strict';

import {Dimensions, Platform, NativeModules} from 'react-native';
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';
import * as GLOBAL from '../utilities/constants'

import store from 'Wadi/src/reducers/store';
import codePush from "react-native-code-push";
import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import images from 'assets/images';

export const isIphoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;

export const dimensions = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
}

export const isIos = () => {
    return (Platform.OS === "ios");
}

export const isEmptyString = (str) => {

    return (!str || 0 === str.length);
}

export const getStoreData = () => {

    return store ? store.getState() : null
}
export const isEmptyObject = (obj) => {

    return !(obj && Object.keys(obj).length > 0);
}

const getGroceryCities = (cityArray) => {
    var groceryCities = [];
    cityArray.forEach((cityObj) => {
        groceryCities.push(cityObj && cityObj.city ? cityObj.city.toLowerCase() : '');
    })
    return groceryCities;
}

export const getCurrency = () => {

    let featureMapAPI = store.getState().featureMapAPIReducer;
    let currency = (featureMapAPI.featureMapObj && featureMapAPI.featureMapObj.currency && !isEmptyString(featureMapAPI.featureMapObj.currency.label)) ? featureMapAPI.featureMapObj.currency.label : '';
    return currency
}

String.prototype.toCapitalize = function () {
    return this.toLowerCase().replace(/^.|\s\S/g, function (a) {
        return a.toUpperCase();
    });
}


export const googleGetCityName = (longitude, latitude, groceryCitiesArr) => {

    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&key=AIzaSyCOgLEmYAEOv2qt-4axXSa3RJqaQ81hwsQ`,
        deliverableCities = getGroceryCities(groceryCitiesArr),
        lat = 0, lng = 0, cityName = "",subLocality=null;
    console.log("delivery cities aree:::",deliverableCities)

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                return response.json()
            })
            .then(data => {

                // check if data and results are present
                if (data && data.status == "OK" && !!data.results && data.results.length > 0) {
                    let locality = data.results[0];
                    let address = locality.formatted_address ? locality.formatted_address : null
                    // check if geometry location is present?

                    // check if result.address_components are present
                    if (!!locality.address_components && !!locality.address_components.length > 0) {
                        locality.address_components.forEach((val, index) => {
                            cityName = val.long_name.toLowerCase();
                            if(val.types){
                                if(val.types.indexOf("sublocality")>-1){
                                    subLocality=cityName;
                                }
                            }


                            // if long name is one of deliverable city, return this only!
                            if (deliverableCities.indexOf(cityName) > -1) {

                                resolve({cityName, address: address, inService: true,subLocality:subLocality?subLocality:cityName});
                            }
                        });

                        // if long_name is not of deliverable_city, it will throw last city...
                        resolve({cityName, address: address, inService: false,subLocality:subLocality?subLocality:cityName});
                    }
                }
                else {  // if google returns null in response
                    // return null
                    resolve({cityName, address: null, inService: false,subLocality:subLocality?subLocality:cityName});
                }

            })
            .catch(error => {
                // do nothing
                reject({"error": error});
            });
    })

};


export const getLatLongFromAddress = (address, groceryCitiesArr) => {

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&language=en&key=AIzaSyCOgLEmYAEOv2qt-4axXSa3RJqaQ81hwsQ`,
        deliverableCities = getGroceryCities(groceryCitiesArr),
        lat = 0, lng = 0, cityName = "",subLocality=null

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                return response.json()
            })
            .then(data => {

                // check if data and results are present
                if (data && data.status == "OK" && !!data.results && data.results.length > 0) {
                    // for (const result of data.results) {
                    data.results.forEach(result => {
                        let locality = result;

                        let latlng = locality.geometry ? locality.geometry.location : null
                        console.log("latlng is:", latlng)
                        // check if geometry location is present?

                        // check if result.address_components are present
                        if (!!locality.address_components && !!locality.address_components.length > 0) {
                            locality.address_components.forEach((val, index) => {
                                cityName = val.long_name.toLowerCase();

                                if(val.types){
                                    if(val.types.indexOf("sublocality")>-1){
                                        subLocality=cityName;

                                    }
                                }



                                // if long name is one of deliverable city, return this only!
                                if (deliverableCities.indexOf(cityName) > -1) {

                                    resolve({cityName, latlng: latlng, inService: true,subLocality:subLocality?subLocality:cityName});

                                }
                            });

                            // if long_name is not of deliverable_city, it will throw last city...

                        }

                    })

                    resolve({'cityName': "", latlng: data.results[0].geometry.location, inService: false,subLocality:subLocality?subLocality:cityName});


                }
                else {  // if google returns null in response
                    // return null
                    resolve({cityName, latlng: null, inService: false,subLocality:subLocality?subLocality:cityName});
                }

            })
            .catch(error => {
                // do nothing
                reject({"error": error});
            });
    })

};

export const isDifferentObject=(first, second)=>{
    if(isEmptyObject(first) && isEmptyObject(second)){
        return false;
    }
    return (JSON.stringify(first) !== JSON.stringify(second));
}

export const getCodePushVersion = async() => {
    try{
    let codePushMetaData = await codePush.getUpdateMetadata()
    return codePushMetaData.label
    }
    catch (error){
        return GLOBAL.CONFIG.codepushVersionFallBackValue
    }
}

export const getCommonHeadersForConfigFeatureMap = async()=>{

   let versionArray= await Promise.all([getAppVersion(), getCodePushVersion()]);

    return{
        "source": "rn-app",
        "n-platform" : Platform.OS,
        "n-app" : GLOBAL.CONFIG.isGrocery?"rn-grocery":"rn-wadi",
        "n-build": isIos()?"1.0":"0.2",
        "n-codepush": '1.0'
    }
}

 export const getAppVersion = async() => {

    try{
        let appVersion = await prefs.getAppVersion()
        return appVersion
    }
    catch(error){
        return GLOBAL.CONFIG.versionFallBackValue
    }


 }

/**
 * 
 * @param {*} task is a function to be executed after proper appLaucnh
 */
export const taskAfterApplaunch = (task)=>{
    if(task && typeof task === 'function'){
        Navigation.isAppLaunched()
        .then(appLaunched => {
          if (appLaunched) {
            task(); // App is launched -> show UI
          }
          new NativeEventsReceiver().appLaunched(task); // App hasn't been launched yet -> show the UI only when needed.
        });
    }
}

/**
 * 
 * @param {*} config is configAPIReducer from redux store
 */
export const configHaveContent = (config)=>{
    return (config && config.configObj && config.configObj.content && config.configObj.content.selectableCountries);
}

export const getSplashImage = () => {
    let splashName;
    if (isIos()) {
        if (dimensions.height == 812) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeniX_grocery : images.splashScreeniX
        } else if (dimensions.height == 736) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni6plus_grocery : images.splashScreeni6plus
        } else if (dimensions.height == 568) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni5_grocery : images.splashScreeni5
        } else if (dimensions.height == 480) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni4_grocery : images.splashScreeni4
        } else {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni6_grocery : images.splashScreeni6
        }
    } else {
        if (!GLOBAL.CONFIG.isGrocery) {
            splashName = images.splashScreeni6;
        } else {
            splashName = images.splashGroceryAndroid
        }
    }

    return splashName
};


