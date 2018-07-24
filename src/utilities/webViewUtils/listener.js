import {webViewActionType} from "./webViewActionTypes";
import {webViewFetchAPI} from "../../actions/webViewActions";
import {GoogleSignin} from 'react-native-google-signin';
import {getDeviceInfo, removeLoginToken} from 'Wadi/src/utilities/sharedPreferences';
import {Navigation} from 'react-native-navigation'
import * as Constants from 'Wadi/src/components/constants/constants';
import {
    didFailApplePayTransaction,
    didFinishApplePayTransaction,
    didTapApplePayButton
} from '../../components/helpers/applePay';
import {Alert, AsyncStorage, Linking, NativeModules, PermissionsAndroid, Platform, Vibration} from 'react-native'
import * as GLOBAL from '../../utilities/constants';
import {googleGetCityName} from '../../utilities/utilities'
import {debounce} from "lodash"

const FBSDK = require('react-native-fbsdk');
const analyticsBridge = NativeModules.WDITrackingBridge;

const vibrationDuration = 500;
export const listenerHandler = (event, webViewRef, callback, updateLocalState) => {
    //console.log('event.message- ', event.message, 'event.nativeEvent- ', event.nativeEvent);

    //grocery ios client id 731220662895-1nvem5tb4bgo3v2jmofq8vfu05t97gcc.apps.googleusercontent.com
    //grocery webClient id 731220662895-oacl3cpord0ut5ge8e0spgvm9ajq2s74.apps.googleusercontent.com

    if(GLOBAL.CONFIG.isGrocery){
        GoogleSignin.configure({
            iosClientId: '731220662895-1nvem5tb4bgo3v2jmofq8vfu05t97gcc.apps.googleusercontent.com',
            webClientId: '731220662895-oacl3cpord0ut5ge8e0spgvm9ajq2s74.apps.googleusercontent.com'
        }).then(() => {
        });
    }else{
        GoogleSignin.configure({
            iosClientId: '1034143548269-arkrmgffqd60mpo9d4sgu2kvip9thil3.apps.googleusercontent.com',
            webClientId: '1034143548269-us4drm7upkqgsdpe3835n63k77ick6vl.apps.googleusercontent.com'
        }).then(() => {
        });
    }


    const {
        LoginManager,
        AccessToken
    } = FBSDK;


    GoogleSignin.hasPlayServices({autoResolve: true}).then(() => {
    }).catch((err) => {

    });

    return new Promise((resolve, reject) => {
        if (!event || (!event.nativeEvent && !event.message)) {
            resolve({
                data: {code: 500, message: 'Event not found'},
                speakerActionType: webViewActionType.speaker.EVENT_FAILED
            });
        }

        let params = JSON.parse(event.nativeEvent.data),
            actionType = params.actionType,
            requestData = params.data;

        if (!params) {
            resolve({
                data: {code: 500, message: 'Params not found'},
                speakerActionType: webViewActionType.speaker.EVENT_FAILED
            });
        }

        if (!actionType) {
            resolve({
                data: {code: 500, message: 'No Action type found'},
                speakerActionType: webViewActionType.speaker.EVENT_FAILED
            });
        }

        if (actionType === webViewActionType.listener.WEBVIEW_DID_LOAD) {
            callback(webViewActionType.listener.WEBVIEW_DID_LOAD);
            resolve(null);
        }


        // API LISTENER
        else if (actionType === webViewActionType.listener.API) {
            webViewFetchAPI(requestData)
                .then(response => {
                    if (!!response && response.code === 200)
                        resolve({data: response, speakerActionType: webViewActionType.speaker.API_RESPONSE});
                    else
                        resolve({
                            data: {
                                code: 500,
                                message: `There is some error while webViewFetchAPI, error = ${JSON.stringify(response.message)}`
                            },
                            speakerActionType: webViewActionType.speaker.API_RESPONSE
                        });
                })
                .catch(err => {
                    resolve({
                        data: {
                            code: 500,
                            message: `There is some error while webViewFetchAPI, error = ${JSON.stringify(err)}`
                        },
                        speakerActionType: webViewActionType.speaker.API_RESPONSE
                    });

                });
        }

        // google Login
        else if (actionType === webViewActionType.listener.GOOGLE_LOGIN) {
            GoogleSignin.signIn()
                .then((user) => {
                    resolve({
                        data: {code: 200, response: user, message: 'google login success'},
                        speakerActionType: webViewActionType.speaker.GOOGLE_LOGIN_RESPONSE
                    });
                })
                .catch((err) => {
                    resolve({
                        data: {code: 500, message: `google login failed, error = ${JSON.stringify(err)}`},
                        speakerActionType: webViewActionType.speaker.GOOGLE_LOGIN_RESPONSE
                    });
                })
                .done();
        }

        // facebook login
        else if (actionType === webViewActionType.listener.FACEBOOK_LOGIN) {
            LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
                function (result) {
                    if (result.isCancelled) {
                        self.props.stopAuthenticationLoader();
                        resolve({
                            data: {code: 500, message: `Canceller by user or some error`},
                            speakerActionType: webViewActionType.speaker.FACEBOOK_LOGIN_RESPONSE
                        });
                    } else {
                        /*alert('Login success with permissions: '
                            +result.grantedPermissions.toString());*/
                        AccessToken.getCurrentAccessToken().then(
                            (data) => {
                                //alert(data.accessToken.toString())
                                resolve({
                                    data: {code: 200, message: `google login success`, response: data},
                                    speakerActionType: webViewActionType.speaker.FACEBOOK_LOGIN_RESPONSE
                                });
                            }
                        )
                    }
                },
                function (error) {
                    resolve({
                        data: {code: 500, message: `facebook login failed, error = ${JSON.stringify(error)}`},
                        speakerActionType: webViewActionType.speaker.FACEBOOK_LOGIN_RESPONSE
                    });
                }
            );
        }

        // log out user
        else if (actionType === webViewActionType.listener.USER_LOG_OUT) {
            removeLoginToken()
                .then(() => {
                    resolve({
                        data: {code: 200, message: 'User logged out successfully'},
                        speakerActionType: webViewActionType.speaker.USER_LOG_OUT_RESPONSE
                    });
                })
                .catch(() => {
                    resolve({
                        data: {code: 500, message: 'Failed to log out user'},
                        speakerActionType: webViewActionType.speaker.USER_LOG_OUT_RESPONSE
                    });
                })
        }

        else if (actionType === webViewActionType.listener.FETCH_LOCATION) {
            //check if we have location saved
            getUserSelectedCity().then(response => {
                    if (GLOBAL.CONFIG.isGrocery) {
                        if (response.latitude && response.longitude) {
                            resolve({
                                data: {
                                    latitude: response.latitude,
                                    longitude: response.longitude,
                                    address: response.userSelectedPlace,
                                    city: response.userSelectedCity,
                                    userSubLocality:response.userSubLocality,
                                    code: 200
                                },
                                speakerActionType: webViewActionType.speaker.LOCATION_FETCHED
                            })
                        }

                        else {
                            openLocationModal(webViewRef, updateLocalState);
                            resolve(false);
                        }

                    }
                    else {
                        requestUserLocation().then(response => {
                            response && response.latitude && response.longitude ? resolve({
                                data: {
                                    latitude: response.latitude,
                                    longitude: response.longitude,
                                    city: response.city,
                                    address: response.address,
                                    code: 200
                                },
                                speakerActionType: webViewActionType.speaker.LOCATION_FETCHED
                            }) : resolve({
                                data: {code: 500, message: 'Error fetching user location'},
                                speakerActionType: webViewActionType.speaker.LOCATION_FETCHED
                            });
                        }).catch(error => console.log("errrorrr:", error))

                    }
                }
            )


        }

        else if (actionType === webViewActionType.listener.INITIATE_APPLE_PAY) {
            didTapApplePayButton(requestData)
        }

        else if (actionType === webViewActionType.listener.DID_COMPLETE_PURCHASE_APPLEPAY) {

            didFinishApplePayTransaction();
        }

        else if (actionType === webViewActionType.listener.DID_COMPLETE_PURCHASE_APPLEPAY) {
            didFailApplePayTransaction();
        }
        else if (actionType === webViewActionType.listener.VIBRATION) {
            Vibration.vibrate(vibrationDuration)
        }
        else if (actionType === webViewActionType.listener.SHOW_LOCATION) {
            openLocationModal(webViewRef, updateLocalState)
        }
        else if (actionType === webViewActionType.listener.TRIGGER_ALERT) {
            if (requestData.message)
                Alert.alert('Alert', requestData.message)
        }
        else if (actionType === webViewActionType.listener.SHOW_COUNTRY_SELECTION_DIALOG) {
            fromLocation().then( response=>{
                    // openCountrySelectionModal(webViewRef, callback)
                    openLocationModal(webViewRef, updateLocalState)
            })

        }
        else if (actionType === webViewActionType.listener.SAVE_USER_DATA) {
            saveUserData(requestData).then(res => { //get the name of the key coming in request data and change it accordingly here

            })

        }
        else if (actionType === webViewActionType.listener.GET_USER_DATA) {
            getUserData().then(response => {
                if (response) {
                    resolve({
                        data: {
                            userData: response,
                            code: 200
                        },
                        speakerActionType: webViewActionType.speaker.USER_DATA
                    })

                }
                else {
                    resolve(false)
                }

            })

        }
        else if (actionType === webViewActionType.listener.RATE_THE_APP) {

            let url = (Platform.OS === 'android') ? ((GLOBAL.CONFIG.isGrocery) ? 'https://play.google.com/store/apps/details?id=com.wadi.fmcg' : 'https://play.google.com/store/apps/details?id=com.wadi.android') : ((GLOBAL.CONFIG.isGrocery) ? 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=1237674044' : 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=993182133');
            Linking.openURL(url)
        }
        else if (actionType === webViewActionType.listener.SEND_FEEDBACK) {
            getDeviceInfo()
                .then((result) => {

                    Linking.openURL('mailto:apps@wadi.com?subject="App feedback"&body=' + "" +
                        "Device Info - \n" +
                        "Device ID: " + result.deviceID + "\n" +
                        "Device Name: " + result.manufacturer + " " + result.model + "\n" +
                        "OS Version: " + result.osVersion + "\n" +
                        "Network Type: " + result.networkType + "\n" +
                        "Operator: " + result.operatorName + "\n" +
                        "App Version: " + result.appVersionName + "\n\n\n");
                });
        }
        else if (actionType === webViewActionType.listener.OPEN_URL) {
            if(requestData.url) {
                Navigation.showModal({
                    screen: Constants.screens.DoodleWebHelperView, // unique ID registered with Navigation.registerScreen
                    title: requestData.title, // title of the screen as appears in the nav bar (optional)
                    animationType: 'slide-up',
                    backButtonHidden: true,
                    navigatorStyle: {
                        navBarHeight: 1,
                    },
                    topBarElevationShadowEnabled:false,
                    navigatorButtons: {

                    },
                    passProps: {
                        callback:(params)=>openUrlCallBack(webViewRef, params),
                        url: requestData.url,
                        showLoader: requestData && requestData.showLoader ? requestData.showLoader : false,
                        title: requestData && requestData.title ? requestData.title : false

                    },
                    transparent: false// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
                });
            }

        }

        else if (actionType === webViewActionType.listener.TUNE_PURCHASE_EVENT) {
            if(!!requestData) {
                var dataObject = {};
                dataObject.tune = requestData
                analyticsBridge.trackEvent(dataObject);
            }
        }

        else if (actionType === webViewActionType.listener.REGISTER_TUNE_PERSONALISED_EVENT) {
            if(!!requestData) {
                //This will an array of strings
                analyticsBridge.registerTunePersonalizedData(requestData)
            }
        }

        else {
            resolve(false);
        }

    })

};

const openUrlCallBack=(webViewRef, params)=>{
    webViewRef.postMessage(JSON.stringify({
        data:{
            url:params,
            code: 200
        },
        speakerActionType: webViewActionType.speaker.CC_COMPLETED
    }), '*');
};

const openLocationModal = debounce((webViewRef, updateLocalState) => {
    this.handleMapEvent = (latitude, longitude, userLocation, city, subLocality) => {
        webViewRef.postMessage(JSON.stringify({
            data: {latitude, longitude, address: userLocation, city, code: 200, subLocality: subLocality},
            speakerActionType: webViewActionType.speaker.LOCATION_FETCHED
        }), '*');
    };

    this.handleCitySelectionListener = (city,latitude,longitude,subLocality, language) => {
        updateLocalState({
            latitude: latitude, 
            longitude: longitude, 
            //userLocation: userLocation, 
            city: city,
            subLocality: subLocality,
            language:language
        });
        webViewRef.postMessage(JSON.stringify({
            data: {city, latitude, longitude, subLocality:subLocality ? subLocality : '' , code: 200},
            speakerActionType: webViewActionType.speaker.LOCATION_FETCHED
        }), '*');
    }


    Navigation.showModal({
        screen: Constants.screens.CitySelectionScreen, // unique ID registered with Navigation.registerScreen
        title: 'Enter your location', // title of the screen as appears in the nav bar (optional)
        animationType: 'slide-up',
        backButtonHidden: true,
        navigatorButtons: {
            rightButtons: [
                {
                    component: 'MapsBackButton',
                    id: 'closeButton'
                }

            ]
        },
        navigatorStyle: {navBarTextColor: '#FFFFFF', navBarHeight: 1,},
        passProps: {callback: (city,latitude,longitude,subLocality, language) => this.handleCitySelectionListener(city,latitude,longitude,subLocality, language)},
        transparent: false// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });

},250);


getUserSelectedCity = async () => {

    try {
        let userLocationData= await Promise.all([
            AsyncStorage.getItem('latitude'),
            AsyncStorage.getItem('longitude'),
            AsyncStorage.getItem('userSelectedPlace'),
            AsyncStorage.getItem('userSelectedCity'),
            AsyncStorage.getItem('subLocality')
        ]);
        return {latitude:userLocationData[0],
            longitude:userLocationData[1],
            userSelectedPlace:userLocationData[2],
            userSelectedCity:userLocationData[3],
            userSubLocality:userLocationData[4]
        }
    } catch (error) {
        return false;
    }

};


requestUserLocation = () => {

    return new Promise((resolve, reject) => {
        if (Platform.OS === "android") {
            this.requestLocationPermission().then(response => {
                if (!!response.location) {
                    getUserCurrentLocation().then(response => {
                        resolve(response)
                    })
                }
                else {//permission denied
                    resolve(false)
                }
            })
        }
        else {
            getUserCurrentLocation().then(response => {
                resolve(response)
            })
        }
    })

};


requestLocationPermission = async () => {
    try {
        const granted = await
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'Wadi needs your current location'
                }
            );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) { //location access granted
            return {'location': true}

        } else {
            return {'location': false}
        }
    } catch (err) {
    }
};


getUserCurrentLocation = () => {

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position.coords && position.coords.longitude && position.coords.latitude) {
                    googleGetCityName(position.coords.longitude, position.coords.latitude).then(data => {
                        resolve({
                            city: data.cityName, address: data.address, longitude: position.coords.longitude,
                            latitude: position.coords.latitude
                        })
                    }).catch(error => {
                        resolve(false)
                    })
                }
                else {
                    resolve(false)
                }
            },
            (error) => {
                resolve(false)
            },
            {enableHighAccuracy: true, timeout: 20000},
        );
    })

};

openCountrySelectionModal = (webViewRef, callback) => {

    this.handleCountryChange = (data) => {
        callback({'selectedCountry': data.selectedCountry, language: data.language, code: 200});
        webViewRef.postMessage(JSON.stringify({
            data: {'selectedCountry': data.selectedCountry, language: data.language, code: 200},
            speakerActionType: webViewActionType.speaker.USER_SELECTED_COUNTRY
        }), '*');

    };
    Navigation.showModal({
        screen: Constants.screens.CountryView, // unique ID registered with Navigation.registerScreen
        animationType: 'slide-up',
        backButtonHidden: true,
        navigatorButtons: {
            rightButtons: [
                {
                    component: 'MapsBackButton',
                    id: 'closeButton'
                }

            ]
        },
        navigatorStyle: {navBarTextColor: '#FFFFFF', navBarHeight: 1,},
        transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        passProps: {callback: (data) => this.handleCountryChange(data)}
    });

};


const saveUserData = async (data) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(data) );
        return true
    } catch (error) {
        return false
    }


};

const getUserData = async () => {

    try {
        let userData = await AsyncStorage.getItem('userData');
        userData = userData || "{}"
        return JSON.parse(userData)
    } catch (error) {
        return false;
    }

};


const fromLocation = async () => {
    try {
        await AsyncStorage.setItem('fromCountrySelection', "1");
        return true
    } catch (error) {
        return false
    }


}








