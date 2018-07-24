import Actions from './actionTypes';
import * as GLOBAL from '../utilities/constants';

import ApiHandler from '../utilities/ApiHandler';
import ConfigHandler from "../utilities/managers/configHandler";
import UserHandler from "../utilities/managers/userHandler";
import store from 'Wadi/src/reducers/store';
import {_setCountryCode} from "./accountActions";
import TrackingEnum from '../tracking/trackingEnum';

const BASE_URL_TYPE = "PROD";
const client = new ApiHandler();
const configHandler = new ConfigHandler();
import {Platform} from 'react-native'
import {getCommonHeadersForConfigFeatureMap} from "../utilities/utilities";

export const getConfig = () => {
    return dispatch => {

        return new Promise((resolve, reject) => {
            getCommonHeadersForConfigFeatureMap().then(headers =>{
                client.getRequest(GLOBAL.API_URL.Wadi_Get_Config, headers, BASE_URL_TYPE)
                    .then((response) => {
                        //check response status
                        if (response && response.data && response.data.assets && response.data.assets.meta) {
                            _setConfigDataStorage(response.data.assets.meta); // save data to Async Storage
                            dispatch(_setConfigObjRedux(response.data.assets.meta)); //store in redux
                            resolve({ status: 200, data: response.data.assets.meta })
                        }
                        else {
                            resolve({ status: 403 });
                        }
                    })
                    .catch((err) => {
                        //console.log('err', err);
                        resolve({ status: 403 });
                    })
            })

        });
    }

};

export const setSelectedLanguage = (selectedLanguage) => {
    return dispatch => {
        dispatch(_setSelectedLanguage(selectedLanguage))

    }
};

/* Set User Country Obj in async storage*/
export const setSelectedCountry = (selectedCountry) => {

    return dispatch => {
        UserHandler.setSelectedUserCountryObj(selectedCountry)
            .then(() => {
            })
            .catch(() => {
            });
        dispatch(_setSelectedCountry(selectedCountry))
    }
};

//Reset bundle after tracking country and language
export const resetBundleWithUserCountryAndLanguage = (selectedCountry, selectedLanguage) => {
    
    return dispatch => {
        dispatch(_resetAppWithSelectedLanguageAndCountry(selectedCountry, selectedLanguage));
        UserHandler.setSelectedUserCountryObj(selectedCountry)
            .then(() => {
            })
            .catch(() => {
            });
        dispatch(_setSelectedCountry(selectedCountry));
        dispatch(_setSelectedLanguage(selectedLanguage))
    }
};

//set selected language
export const _setSelectedLanguage = (selectedLanguage) => {
    return {
        type: Actions.SET_SELECTED_LANGUAGE,
        payload: selectedLanguage
    }
};



/* Get User Country Obj from async storage*/
export const getUserSelectedCountryFromStorage = () => {
    return dispatch => {
        UserHandler.getSelectedUserCountryObj()
            .then((code) => {
                dispatch(_setSelectedCountry(code));
                dispatch(_setCountryCode(code.phoneCode ? code.phoneCode : '+966')); // set in accounts reducer - keyname = countryCode
            })
            .catch(() => {
            });
    }
};


// Clear  User Country Obj from asyc storage*/
export const clearUserSelectedCountryStorage = () => {
    return dispatch => {
        UserHandler.clearUserSelectedCountry()
            .then(() => {
                //console.log('country code is removed')
            })
            .catch(() => {
                //console.log('Error while setting country code')
            }
            );
    }
};


// calculate selected city
// first from async  -- step 1
// if not found then second from self call -- step 2
// if not found then third from config call -- step 3
export const calculateSelectedCity = () => {
    return dispatch => {
        var city = null;
        _getSelectedCityFromStorage() // step 1
            .then((city_en) => {
                if (city_en) {
                    city = city_en;
                }
                else {
                    let cityFromSelfAPI = _getCityFromSelfAPIResponse(); // step 2
                    if (cityFromSelfAPI) {
                        city = cityFromSelfAPI;
                    }
                    else {
                        city = _getCityFromConfigAPIResponse(); // step 3
                    }
                }
                dispatch(saveSelectedCityInRedux(city)); // finally store this is redux

            })
            .catch(() => { // if catch in reading storage, do other steps -- do not break this steps
                let cityFromSelfAPI = _getCityFromSelfAPIResponse(); // step 2
                if (cityFromSelfAPI) {
                    city = cityFromSelfAPI;
                }
                else {
                    city = _getCityFromConfigAPIResponse(); // step 3
                }
            });
    }
};

// set selected city -- like from pdp change city or cart page ....
// save it in async storage, update redux with same
export const setSelectedCity = (city_en) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(saveSelectedCityInRedux(city_en)); // update config reducer -- keyname=> selectedCity
            //_setSelectedCityInStorage(city_en)
            //.then(()=>{resolve(true)})
            _setSelectedCityInStorage(city_en);
            resolve(true)
        });
    }
};


// save selected city in configAPI redux (key-name = selectedCity)
export const saveSelectedCityInRedux = (city_en) => {
    return {
        type: Actions.SET_SELECTED_CITY,
        selectedCity: city_en
    }
};

// when user hit logout
// 1. remove city from async storage
// 2. re-call calculateSelectedCity to save config city in redux
export const resetSelectedCity = () => {
    return dispatch => {
        _removeSelectedCityFromStorage()
            .then((res) => {
                dispatch(calculateSelectedCity());
            })
            .catch(() => {
                dispatch(calculateSelectedCity());
            })
    }
};



const _resetAppWithSelectedLanguageAndCountry = (selectedCountry, selectedLanguage) => {
    
    return {
        type: Actions.RESET_APP_COUNTRY_LANGUAGE,
        tracking: {
            selectedLanguage: selectedLanguage,
            selectedCountry: selectedCountry,
            logType: TrackingEnum.TrackingType.TUNE
        }
    }
};

const _setSelectedCountry = (selectedCountry) => {

    return {
        type: Actions.SET_SELECTED_COUNTRY,
        payload: selectedCountry
    }
};

const _setConfigObjRedux = (configObj) => {  //this will store in redux
    return {
        type: Actions.SET_CONFIG,
        configObj: configObj
    }
};

const _setConfigDataStorage = (configObj) => { // this will store in async storage
    configHandler.setConfig(configObj);
};

// read the stored selected city in storage
const _getSelectedCityFromStorage = () => {
    return new Promise((resolve, reject) => {
        UserHandler.getSelectedCity()
            .then((city_en) => {
                let city = city_en;
                if (city && city !== '') {
                    resolve(city);
                }
                else {
                    resolve(null)
                }
            })
            .catch(() => {
                resolve(null); // do not reject here
            });
    })
};


// get city from response stored in redux accountsReducer => keyName (userData.city) after customer self call
const _getCityFromSelfAPIResponse = () => {
    var city = null;
    const accountsStore = store.getState().accounts;
    if (accountsStore.loggedIn && accountsStore.userData && accountsStore.userData.city) {
        city = accountsStore.userData.city;
    }
    return city;
};

// get city from response stored in redux accountsReducer => keyName (userData.city) after customer self call
const _getCityFromConfigAPIResponse = () => {
    const configStore = store.getState().configAPIReducer;
    return ((configStore && configStore.selectedCountry && configStore.selectedCountry.countryCode) ? (configStore.selectedCountry.deliveryCity) : (null));
};

const _setSelectedCityInStorage = (city_en) => {
    UserHandler.setSelectedCity(city_en);
};

const _removeSelectedCityFromStorage = () => {
    return new Promise((resolve, reject) => {
        UserHandler.clearSelectedCity()
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                resolve(true);
            })
    })
};