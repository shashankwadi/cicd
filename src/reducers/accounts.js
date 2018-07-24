import Actions from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    errorInFetch: false,
    loggedIn: false,
    userData: {
        firstName: null,
        lastName: null,
        email: null,
        birthday: null,
        gender: 'male',
        cookie: null,
        walletUuid: null,
        phoneNumber: null,
        isPrimary: false, //is primary number or notm
        city: null
    },
    errorMessage: '',
    skipAuthenticationKey: null,
    skipAuthenticationPath: null,
    redirectAuthenticationPath: null,
    isLoginModalVisible: false,
    countryCode: null,
    propsNavigation: null,
    addresses: null,
    selectedCityGrocery: "",
    userLocation: "",
    sublocality: "",
    deviceInfo: null,
};

export default function loginReducer(state = initialState, action) {
    switch (action.type) {

        case Actions.BEGIN_AUTHENTICATION_LOADER: {
            return {
                ...state,
                isFetching: true
            }
        }

        case Actions.STOP_AUTHENTICATION_LOADER: {
            return {
                ...state,
                isFetching: false,
            }
        }

        case Actions.LOGIN_SUCCESS: {
            return {
                ...state,
                loggedIn: true,
                userData: action.userData,
                /*isLoginModalVisible: false,*/
            }
        }

        case Actions.LOGIN_FAILED: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: true,
                userData: {},
                errorMessage: action.errorMessage
            }
        }

        case Actions.FETCH_USER_DATA: {
            return {
                ...state,
                userData: action.userData,
                loggedIn: action.isLoggedIn
            }
        }

        case Actions.SET_COUNTRY_CODE: {
            return {
                ...state,
                countryCode: action.countryCode
            }
        }

        case Actions.LOGOUT: {
            return {
                ...state,
                loggedIn: false,
                userData: {}
            }
        }

        // toggle login modal
        case Actions.TOGGLE_LOGIN_MODAL: {
            return {
                ...state,
                isLoginModalVisible: !state.isLoginModalVisible,
                fromScreen: (action && action.fromScreen) ? action.fromScreen : "",
                toScreen: (action && action.toScreen) ? action.toScreen : "",
                propsNavigation: action.propsNavigation
            }
        }

        // hide login modal
        case Actions.HIDE_LOGIN_MODAL: {
            return {
                ...state,
                isLoginModalVisible: false,
                propsNavigation: null
            }
        }

        // Remove temp number
        case Actions.REMOVE_TEMP_NUMBER: {
            return {
                ...state,
                userData: {
                    ...state.userData,
                    phoneNumber: null,
                }
            }
        }

        case Actions.VERIFY_OTP_SUCCESS: {
            return {
                ...state,
                userData: {
                    ...state.userData,
                    phoneNumber: action.phoneNumber,
                    isPrimary: true
                }
            }
        }

        // skip verification of OTP
        case Actions.SAVE_TEMP_NUMBER: {
            return {
                ...state,
                userData: {
                    ...state.userData,
                    phoneNumber: action.params.phoneNumber,
                    isPrimary: action.params.isPrimary
                }
            }
        }

        // set action selected city -- like from pdp if user changes city
        case Actions.SET_ACTION_SELECTED_CITY: {
            return {
                ...state,
                actionSelectedCity: action.actionSelectedCity
            }
        }

        case Actions.BEGIN_LOGOUT: {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
            }
        }
        case Actions.BEGIN_CHECK_EMAIL_EXISTENCE_API: {
            //TODO: Change according to requirements
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Actions.CHECK_EMAIL_EXISTENCE_API_SUCCESS: {
            //TODO: Change according to requirements
            return {
                ...state,
                isFetching: false,
                errorInFetch: false
            }
        }
        case Actions.CHECK_EMAIL_EXISTENCE_API_FAILURE: {
            //TODO: Change according to requirements
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.BEGIN_MOBILE_VERIFICATION_CODE_API: {
            //TODO: Change according to requirements
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Actions.MOBILE_VERIFICATION_CODE_API_SUCCESS: {
            //TODO: Change according to requirements
            return {
                ...state,
                isFetching: false,
                errorInFetch: false
            }
        }
        case Actions.MOBILE_VERIFICATION_CODE_API_FAILURE: {
            //TODO: Change according to requirements
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.BEGIN_SOCIAL_LOGIN_API: {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Actions.SOCIAL_LOGIN_API_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: false
            }
        }
        case Actions.SOCIAL_LOGIN_API_FAILURE: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.BEGIN_PASSWORD_REQUEST_API: {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Actions.PASSWORD_REQUEST_API_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: false
            }
        }
        case Actions.PASSWORD_REQUEST_API_FAILURE: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.GET_ADDRESS_START: {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Actions.GET_ADDRESS_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: false,
                userData: {
                    ...state.userData,
                    addresses: action.data.data
                }
            }
        }
        case Actions.GET_ADDRESS_FAIL: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.ADD_ADDRESS_START: {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }

        case Actions.ADD_ADDRESS_FAIL: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.ADD_ADDRESS_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: false,
            }
        }

        case Actions.GET_CARDS_REQUEST: {
            return {
                ...state,
                isFetching: true,
                errorInFetch: false
            }
        }
        case Actions.GET_CARDS_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: false,
                userData: {
                    ...state.userData,
                    cards: action.data.data
                }
            }
        }
        case Actions.GET_CARDS_FAIL: {
            return {
                ...state,
                isFetching: false,
                errorInFetch: true
            }
        }
        case Actions.SET_GROCERY_CITY: {
            return {
                ...state,
                selectedCityGrocery: action.payload.city ? action.payload.city : state.selectedCityGrocery,
                userLocation: action.payload.userLocation ? action.payload.userLocation : state.userLocation,
                sublocality: action.payload.sublocality ? action.payload.sublocality : state.sublocality
            }
        }
        case Actions.SET_DEVICE_INFO: {
            return {
                ...state,
                deviceInfo: action.payload
            }
        }
        default:
            return state
    }
}
