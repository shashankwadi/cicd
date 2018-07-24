'use strict';

import React from 'react';
import {AsyncStorage} from 'react-native';

import store from 'Wadi/src/reducers/store';
import {isEmptyObject} from "../utilities";

const appState = store ? store.getState() : null;

const userKey = 'wadi_user_key'; // unique key for user
const userCountryCodeKey = 'wadi_user_country_code_key'; // unique key for user
const userCountryKey = 'wadi_user_country_key'; // unique key for user
const userActionSelectedCity = 'wadi_user_action_selected_key'; // unique key for user
const currentDoodleBundleChecksum = 'wadi_current_doodle_bundle_checksum'; //current bundle checksum;
const bundleUpdateStatus = 'wadi_current_doodle_bundle_status';

const userSelectedGoogleCity = 'userSelectedCity';

function UserHandler() {

    this.getUser = () => {
        return _getUser();
    };

    this.setUser = (userObj) => {
        return _setUser(userObj);
    };

    this.clearUser = () => {
        return _clearUser();
    };

    this.getSelectedUserCountryObj = () => {
        return _getUserSelectedCountryObj();
    };

    this.setSelectedUserCountryObj = (countryCode) => {
        return _setUserSelectedCountryObj(countryCode)
    };

    this.clearUserSelectedCountry = () => {
        return _clearUserSelectedCountry();
    };

    this.setSelectedCity = (cityEnglish) => { //like change city from PDP // save only english labelled city
        return _setSelectedCity(cityEnglish);
    };

    this.getSelectedCity = () => {
        return _getSelectedCity(); // return city in english
    };

    this.clearSelectedCity = () => { // in case of logout
        return _clearSelectedCity();
    };

    this.getUserFirstName = () => {
        return _getUserFirstName();
    };

    this.getGooglePlacesSelectedCity = () => {
        return _getGooglePlacesSelectedCity(); // return city in english
    };
    this.getGoogleUserLocation = async () => {
        try {

            const userLocation = await AsyncStorage.getItem('userSelectedPlace');
            return userLocation;
        }
        catch (error) {
            return error;
        }

    };

    this.setDoodleBundleChecksum = (checksum) => {
        return _setDoodleBundleChecksum(checksum);
    };

    this.getCurrentDoodleBundleChecksum = () => {
        return _getCurrentDoodleBundleChecksum();
    }

    this.setBundleUpdateStatus =(value)=>{
        return _setBundleUpdateStatus(value);
    }

    this.getBundleUpdateStatus =()=>{
        return _getBundleUpdateStatus();
    }
}

/************ Private Methods *****************/

//User Related private methods

const _setBundleUpdateStatus = (value)=>{
    return new Promise ((resolve, reject)=>{
        AsyncStorage.setItem(bundleUpdateStatus, JSON.stringify(value))
        .then(() => {
            resolve(true)
        })
        .catch((error) => {
            resolve(false)
        });
    });
}

const _getBundleUpdateStatus = ()=>{
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(bundleUpdateStatus)
            .then((value) => {
                resolve(JSON.parse(value));
            })
            .catch((error) => {
                reject(false) // do not reject
            });
    });
}



const _setDoodleBundleChecksum = (checksum) => {

    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(currentDoodleBundleChecksum, checksum)
            .then(() => {
                resolve(true)
            })
            .catch((error) => {
                resolve(false)
            });
    });

};


const _getCurrentDoodleBundleChecksum = () => {

    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(currentDoodleBundleChecksum)
            .then((currentChecksum) => {
                if (!!currentChecksum && currentChecksum.length > 0) {
                    resolve(currentChecksum);
                }
                else {
                    resolve('')
                }
            })
            .catch((error) => {
                reject(null) // do not reject
            });
    });

};

const _getGooglePlacesSelectedCity = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(userSelectedGoogleCity)
            .then((cityEnglish) => {
                if (!!cityEnglish && cityEnglish.length > 0) {
                    resolve(cityEnglish);
                }
                else {
                    resolve('')
                }
            })
            .catch((error) => {
                reject(null) // do not reject
            });
    });

};


const _setUser = (userObj) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(userKey, JSON.stringify(userObj))
            .then(() => {
                    resolve(true)
                }
            )
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

const _getUser = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(userKey)
            .then((obj) => {
                if (obj) {
                    let userObj = JSON.parse(obj);
                    resolve(userObj);
                }
                else {
                    reject({success: false})
                }
            })
            .catch((error) => reject({success: false, error}));
    });
};

const _clearUser = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(userKey)
            .then(() => resolve(true))
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

/* Country related methods  */

const _setUserSelectedCountryObj = (selectedCountry) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(userCountryKey, JSON.stringify(selectedCountry))
            .then(() => resolve(true))
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

const _getUserSelectedCountryObj = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(userCountryKey)
            .then((code) => {
                resolve(JSON.parse(code))
            })
            .catch((error) => reject({success: false, error}));
    });
};


const _clearUserSelectedCountry = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(userCountryKey)
            .then(() => resolve(true))
            .catch((error) => {
                reject({success: false, error})
            });
    });
};


// Action Selected city Methods - like change city from PDP // city in english
const _setSelectedCity = (cityEnglish) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(userActionSelectedCity, JSON.stringify(cityEnglish))
            .then(() => {
                resolve(true)
            })
            .catch((error) => {
                resolve(false)
            });
    });
};

const _getSelectedCity = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(userActionSelectedCity)
            .then((cityEnglish) => {
                if (cityEnglish) {
                    resolve(JSON.parse(cityEnglish));
                }
                else {
                    resolve(null)
                }
            })
            .catch((error) => {
                reject(null) // do not reject
            });
    });
};

const _clearSelectedCity = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(userActionSelectedCity)
            .then(() => resolve(true))
            .catch((error) => {
                resolve(true) // do not reject
            });
    });
};

const _getUserFirstName = () => {

    let userFirstName = "";
    if (appState && appState.accounts && appState.accounts.userData && !isEmptyObject(appState.accounts.userData)) {
        userFirstName = appState.accounts.userData.firstName;
    }
    return userFirstName;
};

const UserHandler = new UserHandler();
export default UserHandler;

