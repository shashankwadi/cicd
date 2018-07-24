/**** Includes all the actions related to Authentication Screens (like login, signup etc.) ****/


'use strict';
import {Alert} from 'react-native';
import Actions from './actionTypes';
import * as GLOBAL from '../utilities/constants';

import ApiHandler from '../utilities/ApiHandler'; //new api client using apiSauce, wrapper of axios
import UserHandler from "../utilities/managers/userHandler";
import {resetAction} from './navigatorAction';
import {strings} from 'utilities/uiString';
import {resetSelectedCity} from "./configAPIActions";
import TrackingEnum from "../tracking/trackingEnum"
import store from "../reducers/store";
import {screens} from 'Wadi/src/components/constants/constants'
import {deepLinkActions} from "./globalActions";
import {setLoginToken} from 'Wadi/src/utilities/sharedPreferences'

const BASE_URL_TYPE = "PROD";
//const BASE_URL_TYPE = "STAG";

var client = new ApiHandler();

// This is the login with mail method*/
export function loginWithMail(username, password, modalNavigatorProps) {
    return dispatch => {

        //set the is_fetching true
        dispatch(_beginAuthenticationLoader());

        //let client = new ApiHandler(),
        let headers = {},
            params = {
                email: username,
                password: password
            };

        client.postRequest(GLOBAL.API_URL.Wadi_Mail_Login, params, headers, BASE_URL_TYPE)
            .then((response) => {
                dispatch(_stopAuthenticationLoader());
                if (response.status === 200) {
                    dispatch(_setUserDataPostLogin(response))
                    // authentication index file will determine to close modal or navigate to phone screen
                    //dispatch(hideLoginModalAndNavigate(screens.LoginPage, modalNavigatorProps));
                }
                else {
                    Alert.alert(response.data.error_string);
                    dispatch(_mailLoginFailure(response.data))
                }
            })
            .catch((error) => {
                Alert.alert(strings.ServerError);
                dispatch(_stopAuthenticationLoader());
            });
    }
}

// Fetch user googleSelectedCity from async storage*/
export const fetchUserGroceryCity = () => {
    return dispatch => {
        UserHandler.getGooglePlacesSelectedCity()
            .then((city_en) => {
                dispatch(_groceryUserSelectedCity(city_en));
            })
            .catch(() => {
                //console.log('Error while fetching user')
            });
    }
};

export const fetchUserLocation = () => {
    return dispatch => {
        UserHandler.getGoogleUserLocation().then((userLocation) => {
            dispatch(_groceryUserSelectedCity(null, userLocation))
        }).catch()
    }
};


// Fetch user data from async storage*/
export const fetchUserDataStorage = () => {
    return dispatch => {
        UserHandler.getUser()
            .then((userObj) => {
                if (userObj && userObj.cookie) {
                    dispatch(getUserInfo(userObj.cookie))
                        .then((params) => {
                            if (params.status !== 200) {
                                _clearUserDataStorage(); //empty data storage
                                dispatch(_clearUserDataPostClearStorage()); //empty redux
                            }
                        })
                        .catch((e) => {
                            //console.log('error');
                        });
                }
            })
            .catch(() => {
                //console.log('Error while fetching user')
            });
    }
};

//Clear user data from async storage */
export const clearUserDataStorage = () => {
    return dispatch => {
        UserHandler.clearUser()
            .then((userObj) => {
                //console.log('logged out')
            })
            .catch(() => {
                //console.log('Error while logging out user')
            });

    }
};

export const setDeviceInfo = (deviceInfo) => {
    return dispatch => {
        dispatch({
            type: Actions.SET_DEVICE_INFO,
            payload: deviceInfo
        });

    }
};


// Check Email Existence */
export const checkEmailExistence = (email, name, props) => {
    return dispatch => {
        dispatch(_beginAuthenticationLoader());
        //let client = new ApiHandler(),
        let headers = {},
            apiUrl = GLOBAL.API_URL.Wadi_Check_User_Email_Exists.replace(':email', email);

        return new Promise((resolve, reject) => {

            client.getRequest(apiUrl, headers, BASE_URL_TYPE)
                .then((response) => {
                    dispatch(_stopAuthenticationLoader());
                    //console.log('result email existence', response)
                    if (response.status === 200) {
                        if (!response.data.success) {
                            resolve({status: 200, msg: ''})
                        }
                        else {
                            resolve({status: 500});
                            Alert.alert(strings.Error, 'Email already exists');
                        }

                    }
                    else {
                        resolve({status: 500});
                        Alert.alert(strings.Error, strings.ServerError);
                    }

                })
                .catch((error) => {
                    resolve({status: 500});
                    Alert.alert(strings.Error, strings.ServerError);
                    dispatch(_mailLoginFailure())
                });
        })

    }
};

// Clear  User Country Code from asyc storage*/
export const clearUserCountryCodeStorage = () => {
    return dispatch => {
        UserHandler.clearUserCountryCode()
            .then(() => {
                //console.log('country code is removed')
            })
            .catch(() => {
                    //console.log('Error while setting country code')
                }
            );
    }
};


// Request OTP */
//params = {name, email, phoneNumber, type(call/sms), isLoggedIn}
export const requestOTP = (params) => {
    return dispatch => {
        //set the is_fetching true
        dispatch(_beginAuthenticationLoader());

        //let client = new ApiHandler(),
        let headers = {},
            postParams = {
                ...params,
                phoneNumber: _formatPhoneNumber(params.phoneNumber, params.countryCode)
            };

        return new Promise((resolve, reject) => {
            client.postRequest(GLOBAL.API_URL.Wadi_Verify_Mobile_Request_OTP, postParams, headers, BASE_URL_TYPE)
                .then((response) => {
                    //console.log('request otp response -', response);
                    dispatch(_stopAuthenticationLoader());
                    if (response.status === 200) {
                        if (response.data.success) {
                            //console.log('success request otp');
                            resolve({params: params, status: 200});
                        }
                        else {
                            Alert.alert(strings.Error, strings.ServerError);
                            resolve({params: params, status: 403});
                        }
                    }
                    else
                        _errorAlert(strings.ServerError);
                })
                .catch((error) => {
                    _errorAlert();
                    dispatch(_stopAuthenticationLoader());
                    reject({params: params, status: 403});
                });


        });

    }
};

// Verify OTP */
//params = {name, email, phoneNumber, verificationCode, countryCode}
export const verifyOTP = (params, userDataObj) => {
    return dispatch => {
        //set the is_fetching true
        dispatch(_beginAuthenticationLoader());

        //let client = new ApiHandler(),
        let headers = {},
            postParams = {
                ...params,
                phoneNumber: _formatPhoneNumber(params.phoneNumber, params.countryCode)
            };


        return new Promise((resolve, reject) => {
            client.postRequest(GLOBAL.API_URL.Wadi_Verify_Mobile_Verify_OTP, postParams, headers, BASE_URL_TYPE)
                .then((response) => {
                    //console.log('verify otp response -', response);
                    dispatch(_stopAuthenticationLoader());
                    if (response.status === 200) {
                        if (response.data.success && response.data.phoneVerified) {
                            //console.log('success verify otp');
                            userDataObj = {
                                ...userDataObj,
                                phoneNumber: params.phoneNumber,
                                isPrimary: true
                            };
                            dispatch(_verifyOTPSuccess(userDataObj)); //save data in redux and async storage
                            resolve({params: params, status: 200})
                        }
                        else {
                            Alert.alert(strings.error, strings.OtpVerifyError);
                            resolve({params: params, status: 403});
                        }
                    }

                    else {
                        _errorAlert(strings.ServerError)
                    }

                })
                .catch((error) => {
                    _errorAlert();
                    dispatch(_stopAuthenticationLoader());
                    reject({params: params, status: 403});
                });
        });

    }
};

// temp save the number to redux while skipping the verification - this will be used at checkout time.
export const tempSavePhoneNumber = (phoneNumber) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(_beginAuthenticationLoader());
            dispatch(_tempSavePhoneNumber(phoneNumber));
            dispatch(_stopAuthenticationLoader());
            resolve(true);
        })
    }

};


// Submit Password - Signup*/
export const submitPassword = (params) => {
    return (dispatch, getStore) => {
        //set the is_fetching true
        dispatch(_beginAuthenticationLoader());

        //let client = new ApiHandler(),
        let headers = {},
            postParams = {
                email: params.email,
                password: params.password,
                firstName: params.name,
                lastName: '.',
                gender: 'male',
                country: "sa",
                language: "en"
            };

        return new Promise((resolve, reject) => {
            client.postRequest(GLOBAL.API_URL.Wadi_Mail_Signup, postParams, headers, BASE_URL_TYPE)
                .then((response) => {
                    //console.log('submit password -', response);
                    dispatch(_stopAuthenticationLoader());
                    if (response.status === 201) {
                        if (response.data) {
                            //console.log('success submit password');
                            dispatch(_setUserDataPostLogin(response));

                            // make primary number only if user verified number

                            var userRedux = getStore().accounts.userData;
                            if (userRedux.isPrimary) { //if phone verified, set primary
                                setPrimaryNumber({...params, phoneNumber: userRedux.phoneNumber})
                                    .then((res) => {
                                        if (res.status === 200) {
                                            //console.log('Set primary is success');
                                            resolve({status: 200}); // if primary also set
                                        }
                                        else {
                                            resolve({status: 403}); //if failed to set primary
                                        }
                                    })
                                    .catch((e) => {
                                        _errorAlert();
                                        //console.log(e);
                                        resolve({status: 403}) // handle error
                                    })
                            }
                            else { // if not verified phone, finish the process
                                resolve({status: 200});
                            }

                        }

                        else { // if backend doesn't gives you back the user data, signup failed

                            Alert.alert(strings.Error, strings.ServerError);
                            resolve({params: params, status: 403});
                        }
                    }

                    else {
                        (_errorAlert(strings.ServerError));
                    }

                })
                .catch((error) => {
                    (_errorAlert());
                    (_stopAuthenticationLoader());
                    reject({params: params, status: 403});
                });


        });

    }
};


// Set primary number */
//params = {name, email, phoneNumber, verificationCode, countryCode}
export const setPrimaryNumber = (params, cookie = null) => {


    //let client = new ApiHandler(),
    let postParams = {
            number: _formatPhoneNumber(params.phoneNumber, params.countryCode),
            verified: true,
            isPrimary: true,
        },
        headers = cookie ? {'cookie': 'identity=' + cookie} : {};

    return new Promise((resolve, reject) => {
        client.postRequest(GLOBAL.API_URL.Wadi_Set_Primary, postParams, headers, BASE_URL_TYPE)
            .then((response) => {
                //console.log('set primary -', response);
                if (response.status === 201) {
                    resolve({params: params, status: 200});
                }
                else {
                    resolve({params: params, status: 403});
                }

            })
            .catch((error) => {
                _errorAlert();
                reject({params: params, status: 403});
            });


    });


};

// get the User Info using the token
export const getUserInfo = (token, count = 1) => {
    return (dispatch, getStore) => {

        //let client = new ApiHandler(),
        let headers = {'cookie': 'identity=' + token};
        return new Promise((resolve, reject) => {
            client.getRequest(GLOBAL.API_URL.Wadi_User_Info, headers, BASE_URL_TYPE)
                .then((response) => {

                    count += 1;
                    if (response.status === 200) {
                        dispatch(_setUserDataPostLogin(response, token))
                            .then((res) => {
                                resolve({status: 200});
                                dispatch(_stopAuthenticationLoader());
                            })
                            .catch(() => {
                                resolve({status: 403})
                            });
                    }
                    else {
                        if (count < 3) {
                            dispatch(getUserInfo(token, count));
                        }
                        else {
                            dispatch(logoutUser(token));
                            resolve({status: 403})
                        }
                    }

                })
                .catch((error) => {
                    reject({params: params, status: 403});
                });


        });

    };
};

// Logout user api hit, clear async storage and redux
export function logoutUser(token = null) {

    return (dispatch, getStore) => {

        dispatch(_beginAuthenticationLoader());
        //let client = new ApiHandler(),
        let headers = {'Cookie': 'identity=' + (getStore().accounts.userData.cookie ? getStore().accounts.userData.cookie : (token ? token : ''))};

        client.getRequest(GLOBAL.API_URL.Wadi_Logout, headers, BASE_URL_TYPE)
            .then((responseData) => {
                if (responseData.status === 200) {
                    //console.log('logout response', responseData);
                    dispatch(_stopAuthenticationLoader());
                    _clearUserDataStorage(); //empty data storage
                    dispatch(_clearUserDataPostClearStorage()); //empty redux
                    dispatch(resetSelectedCity());
                }
                resetAction('Account');
            })
            .catch(error => {
                dispatch(_stopAuthenticationLoader());
                Alert.alert(strings.ServerError);
            });
    }
}


//Reset password API*/
export function resetPasswordRequest(email) {
    return dispatch => {
        //let client = new ApiHandler(),
        let headers = {},
            postParams = {};

        dispatch(_beginAuthenticationLoader());
        return new Promise((resolve, reject) => {
            client.postRequest(GLOBAL.API_URL.Wadi_Password_Reset_Request.replace(':email', email), postParams, headers, BASE_URL_TYPE)
                .then((response) => {
                    dispatch(_stopAuthenticationLoader());
                    //console.log('password reset request success -', response);
                    if (response.message)
                        resolve({message: response.message, status: 200});
                    else
                        resolve({message: response.data.message, status: 200});
                })
                .catch((error) => {
                    _errorAlert();
                    dispatch(_stopAuthenticationLoader());
                    reject({params: params, status: 403});
                });
        });
    }
}

//Toggle login modal to any view*/
export function toggleLoginModal(propsNavigation, toScreen = null) {
    return (dispatch, getStore) => {
        let accountStore = getStore().accounts;
        // if (accountStore.isLoginModalVisible && accountStore.toScreen && accountStore.propsNavigation && accountStore.loggedIn)
        //     accountStore.propsNavigation.navigate(accountStore.toScreen);
        dispatch({
            type: Actions.TOGGLE_LOGIN_MODAL,
            toScreen: toScreen,
            propsNavigation: propsNavigation ? propsNavigation : accountStore.propsNavigation
        });
        propsNavigation.showModal({
            screen: screens.Authentication, // unique ID registered with Navigation.registerScreen
            title: "Login", // title of the screen as appears in the nav bar (optional)
            passProps: {}, // simple serializable object that will pass as props to the modal (optional)
            navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
            animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
    }
}

//Toggle login modal to any view*/
export function hideLoginModalAndNavigate(fromScreen) {
    return (dispatch, getStore) => {
        let accountStore = getStore().accounts;


        if (accountStore.isLoginModalVisible && accountStore.toScreen && accountStore.propsNavigation && accountStore.loggedIn && !!accountStore.toScreen) {
            dispatch(
                deepLinkActions({
                    navigator: accountStore.propsNavigation,
                    currentScreen: !!fromScreen ? fromScreen : '',
                    toScreen: accountStore.toScreen
                })
            );
        }
        dispatch({
            type: Actions.HIDE_LOGIN_MODAL
        });
    }
}

// we save number temporarily if user does not verify his number, so we need to clear this number once he returns back from checkout page
export const removeTempNumberAfterCheckout = () => {
    return (dispatch, getStore) => {
        let accountStore = getStore().accounts;
        if ((accountStore && accountStore.userData.phoneNumber) && !accountStore.userData.isPrimary) {
            dispatch({
                type: Actions.REMOVE_TEMP_NUMBER
            })
        }
    }
};

// hit api after response from social login
export function socialLoginAPI(provider, token) {
    return (dispatch, getStore) => {
        //var client = new ApiClient();
        let headers = {},
            postParams = {provider, token};

        client.postRequest(GLOBAL.API_URL.Wadi_Social_Login, postParams, headers, BASE_URL_TYPE)
            .then(responseData => {
                if (responseData.status === 201) { //success response

                    let token = _extractToken(responseData.headers['set-cookie']);
                    dispatch(getUserInfo(token))
                        .then(() => {
                            dispatch(_stopAuthenticationLoader());
                            const accountStore = getStore().accounts,
                                userData = accountStore.userData;
                            if (accountStore.loggedIn) { //check if success
                                // do nothing
                            }
                            else {
                                Alert.alert(strings.Error, strings.ServerError);
                            }
                        })
                        .catch(() => {
                            Alert.alert(strings.Error, strings.ServerError);
                            dispatch(_stopAuthenticationLoader());
                        });
                }

                else { //failure response

                    dispatch(_stopAuthenticationLoader());
                    Alert.alert(strings.Error, strings.ServerError);
                }
            })
            .catch(error => {
                dispatch(_stopAuthenticationLoader());
                Alert.alert(strings.Error, strings.ServerError);
            });
    }
}

export const getListOfOrders = () => {
    const accountStore = store.getState().accounts;
    var headers = {'Cookie': 'identity=' + (accountStore.userData.cookie)};
    return new Promise((resolve, reject) => {
        client.getRequest(GLOBAL.API_URL.Wadi_My_Orders, headers, BASE_URL_TYPE)
            .then((response) => {
                if (response.status === 200) {
                    var list = response.data.data;
                    var dataArr = [];
                    if (list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            let orderId = list[i].orderNr,
                                url = GLOBAL.API_URL.Wadi_Order_Detail.replace(':orderId', orderId);
                            client.getRequest(url, headers, BASE_URL_TYPE)
                                .then((res) => {
                                    if (res.status === 200) {
                                        dataArr.push({order: list[i], orderDetails: res.data});
                                        if (i == list.length - 1)
                                            resolve({status: 200, data: dataArr})
                                    }
                                    else {
                                        resolve({status: 500});
                                    }
                                })
                        }
                    }
                    else {
                        resolve({status: 200, data: dataArr}) // no data
                    }
                }
                else {
                    resolve({status: 500})
                }

            })
            .catch((err) => {
                //console.log('my order err', err)
                resolve({status: 200})
            })
    })
};

export const getTrackingOrderWebViewToken = (order_number) => {
    const accountStore = store.getState().accounts;
    let base_url_type = "TRACKWADI",
        url = GLOBAL.API_URL.Wadi_Order_Tracking_Details.replace(':email', accountStore.userData.email).replace(':order_number', order_number),
        headers = {};
    return new Promise((resolve, reject) => {
        client.getRequest(url, headers, base_url_type)
            .then((response) => {
                //console.log(response);
                if (response.status === 200) {
                    resolve({code: 200, url: response.data.data.tracking_link})
                } else {
                    resolve({code: 500})
                }

            })
            .catch((err) => {
                //console.log('my order err', err)
                resolve({code: 500})
            })
    });


};


/************  PRIVATE METHODS *********/

//Set the user in aysnc storage*/
const _setUserDataStorage = (userObj) => {
    UserHandler.setUser(userObj);
    setLoginToken(userObj.cookie);
};

// clear the user in aysnc storage
const _clearUserDataStorage = () => {
    UserHandler.clearUser();
};

//Set user data post fetching from async storage*/
const _setUserDataPostFetch = (userData) => {
    return {
        type: Actions.FETCH_USER_DATA,
        userData: userData,
        isLoggedIn: (userData && userData.email) ? true : false
    }
};


//delete data from redux
const _clearUserDataPostClearStorage = () => {
    return {
        type: Actions.LOGOUT
    }
};

export const _groceryUserSelectedCity = (city, userLocation = null, sublocality = null) => {
    return {
        type: Actions.SET_GROCERY_CITY,
        //grocerySelectedCity: city
        payload: {city, userLocation, sublocality}
    }
};

//Function to be trigger once successfully logged in*/
const _setUserDataPostLogin = (response, storageToken = null) => {
    return (dispatch, getStore) => {

        return new Promise((resolve, reject) => {
            //extract user and cookies out of response

            var user = response.data,
                cookie = (response.headers["set-cookie"]) ? _extractToken(response.headers["set-cookie"]) : (storageToken ? storageToken : ""),
                phones = user.phones,
                userReduxObj = getStore().accounts.userData,
                userObj = {
                    ...user,
                    cookie: cookie,
                    phoneNumber: userReduxObj.isPrimary ? userReduxObj.phoneNumber : null,
                    isPrimary: userReduxObj.isPrimary
                }; // appending key-value in user object

            /*check for primary number in array of phones*/
            if (phones && phones.length > 0) {
                phones.map((phone, index) => {
                    if (phone.isPrimary) {
                        userObj = {...userObj, phoneNumber: phone.number, isPrimary: true};
                        return true;
                    }
                })
            }

            _setUserDataStorage(userObj); // save data to Async Storage
            dispatch(_mailLoginSuccessful({...userObj})); // save data to reducer & hide login modal & save temp number for checkout

            resolve({status: 200})
        });


    };
};

export const _hideLoginModal = () => {
    return {
        type: Actions.HIDE_LOGIN_MODAL
    }
};

// Stop loader post login and set user data */
export function _mailLoginSuccessful(userData) {
    return {
        type: Actions.LOGIN_SUCCESS,
        userData: userData,
        tracking: {...userData, logType: TrackingEnum.TrackingType.TUNE}
    }
}

// Start loader */
export function _beginAuthenticationLoader() {
    return {
        type: Actions.BEGIN_AUTHENTICATION_LOADER
    }
}

// /* Stop loader */
export function _stopAuthenticationLoader() {
    return {
        type: Actions.STOP_AUTHENTICATION_LOADER
    }
}

// Stop loader if fails login */
export function _mailLoginFailure(errorMessage = '') {
    return {
        type: Actions.LOGIN_FAILED
    }
}

/* Set country code in redux store */
export const _setCountryCode = (countryCode) => {
    return {
        type: Actions.SET_COUNTRY_CODE,
        countryCode: countryCode
    }
};

/*Common alert*/
const _errorAlert = (title = strings.Error, msg = strings.ServerError) => {
    Alert.alert(title, msg);
};

/*Verify otp success => set user mobile and isPrimary in redux and storage*/
const _verifyOTPSuccess = (userObj) => {
    //Actions.VERIFY_OTP_SUCCESS
    return dispatch => {
        _setUserDataStorage(userObj); //set update data in storage irrespective of user logged in or not. if user is not logged in, it will simply save number
        dispatch(_setUserDataPostFetch(userObj));
    }
};

// temp save number
const _tempSavePhoneNumber = (phoneNumber) => {
    return {
        type: Actions.SAVE_TEMP_NUMBER,
        params: {phoneNumber: phoneNumber, isPrimary: false}
    };
};

//output => +966-54-0000000
const _formatPhoneNumber = (phoneNumber, countryCode) => {
    if (phoneNumber && countryCode) {
        phoneNumber = phoneNumber.toString();
        return countryCode + '-' + phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2);
    }
    else
        return false;
};

// read token from cookie
const _extractToken = (headerCookie) => {
    return headerCookie ? headerCookie.split(';')[0].split('=')[1] : ''
};

// get user address api
export function getAddresses() {

    return (dispatch, getStore) => {

        dispatch(_getAddress());
        //let client = new ApiHandler(),
        let headers = {
            'Cookie': 'identity=' + (getStore().accounts.userData.cookie)
        };

        client.getRequest(GLOBAL.API_URL.Wadi_User_Address, headers, BASE_URL_TYPE)
            .then((responseData) => {
                if (responseData.status === 200) {
//                    console.log('address response', responseData.data);
                    dispatch(_getAddressSuccess(responseData.data))
                } else {
                    dispatch(_getAddressFail())
                }
            })
            .catch(error => {
                dispatch(_getAddressFail());
                Alert.alert(strings.ServerError);
            });
    }
}

export function _getAddressSuccess(data) {
    return {
        type: Actions.GET_ADDRESS_SUCCESS,
        data: data,
    }
}

export function _getAddressFail() {
    return {
        type: Actions.GET_ADDRESS_FAIL,
    }
}

export function _getAddress() {
    return {
        type: Actions.GET_ADDRESS_START,
    }
}


// add user address api
export function addAddress(body) {

    return (dispatch, getStore) => {
        dispatch(_addAddress());
        let headers = {
            'Cookie': 'identity=' + (getStore().accounts.userData.cookie)
        };

        client.postRequest(GLOBAL.API_URL.Wadi_User_Address, body, headers, BASE_URL_TYPE)
            .then((responseData) => {
                // console.log('addAddress',responseData);
                if (responseData.status === 201) {
                    dispatch(_addAddressSuccess());
                    dispatch(getAddresses())
                } else {
                    dispatch(_addAddressFail())
                }
            })
            .catch(error => {
                dispatch(_addAddressFail());
                Alert.alert(strings.ServerError);
            });
    }
}

export function _addAddressSuccess(data) {
    return {
        type: Actions.ADD_ADDRESS_SUCCESS,
        data: data,
    }
}

export function _addAddressFail() {
    return {
        type: Actions.ADD_ADDRESS_FAIL,
    }
}

export function _addAddress() {
    return {
        type: Actions.ADD_ADDRESS_START,
    }
}


// add user address api
export function deleteAddress(addressId) {

    return (dispatch, getStore) => {

        dispatch(_addAddress());
        let headers = {
            'Cookie': 'identity=' + (getStore().accounts.userData.cookie)
        };

        client.deleteRequest(GLOBAL.API_URL.Wadi_User_Address + '/' + addressId, {}, headers, BASE_URL_TYPE)
            .then((responseData) => {
//                console.log('deleteAddress',responseData);
                if (responseData.status === 200) {
                    dispatch(_addAddressSuccess());
                    dispatch(getAddresses())
                } else {
                    dispatch(_addAddressFail())
                }
            })
            .catch(error => {
                dispatch(_addAddressFail());
                Alert.alert(strings.ServerError);
            });
    }
}


// add user address api
export function editAddress(body) {
    delete body.updatedAt;
    delete body.createdAt;
    return (dispatch, getStore) => {
        dispatch(_addAddress());
        let headers = {
            'Cookie': 'identity=' + (getStore().accounts.userData.cookie)
        };

        client.postRequest(GLOBAL.API_URL.Wadi_User_Address, body, headers, BASE_URL_TYPE)
            .then((responseData) => {
//                console.log('editAddress',responseData);
                if (responseData.status === 200) {
                    dispatch(_addAddressSuccess());
                    dispatch(getAddresses())
                } else {
                    dispatch(_addAddressFail())
                }
            })
            .catch(error => {
                dispatch(_addAddressFail());
                Alert.alert(strings.ServerError);
            });
    }
}

// get user saved cards api
export function getSavedCards() {

    return (dispatch, getStore) => {

        dispatch(_getCardsRequest());
        //let client = new ApiHandler(),
        let headers = {'Cookie': 'identity=' + (getStore().accounts.userData.cookie)};

        client.getRequest(GLOBAL.API_URL.Wadi_Saved_Cards + getStore().accounts.userData.email,
            headers, BASE_URL_TYPE)
            .then((responseData) => {
                if (responseData.status === 200) {
                    //console.log('cards response', responseData.data);
                    dispatch(_getCardSuccess(responseData.data))
                } else {
                    dispatch(_getAddressFail())
                }
            })
            .catch(error => {
                dispatch(_getCardFail());
                Alert.alert(strings.ServerError);
            });
    }
}


export function _getCardSuccess(data) {
    return {
        type: Actions.GET_CARDS_SUCCESS,
        data: data,
    }
}

export function _getCardFail() {
    return {
        type: Actions.GET_CARDS_FAIL,
    }
}

export function _getCardsRequest() {
    return {
        type: Actions.GET_CARDS_REQUEST,
    }
}