import Types from '../actions/actionTypes';


const INITIAL_STATE = {
    configObj: {},
    selectedCity: null
};

export default function configAPIReducer(state = INITIAL_STATE, actions) {
    switch (actions.type) {
        case Types.GET_CONFIG:
            return {
                ...state
            };
        case Types.SET_CONFIG:
            return {
                ...state,
                configObj: actions.configObj
            };
        case Types.DELETE_CONFIG:
            return {
                ...state
            };
        case Types.SET_SELECTED_LANGUAGE: 
            return {
                ...state,
                selectedLanguage: actions.payload
            };
        case Types.SET_SELECTED_COUNTRY: 
            return {
                ...state,
                selectedCountry: actions.payload
            };
        case Types.SET_SELECTED_CITY:
            return {
                ...state,
                selectedCity: actions.selectedCity
            };
        case Types.DELETE_SELECTED_CITY:
            return {
                ...state,
                selectedCountry: null
            };
        default:
            return state;
    }
}
export const getCountryFlag = (countryCode) => {
    let icon;
    switch (countryCode) {
        case 'sa':
            icon = require('Wadi/src/icons/flags/sa.png');
            break;
        case 'ae':
            icon = require('Wadi/src/icons/flags/ae.png');
            break;
        case 'ku':
            icon = require('Wadi/src/icons/flags/ku.png');
            break;
        case 'le':
            icon = require('Wadi/src/icons/flags/le.png');
            break;
        case 'om':
            icon = require('Wadi/src/icons/flags/om.png');
            break;
        case 'qa':
            icon = require('Wadi/src/icons/flags/qa.png');
            break;
        case 'br':
            icon = require('Wadi/src/icons/flags/br.png');
            break;
    }
    return icon;
};