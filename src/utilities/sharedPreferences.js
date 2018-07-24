import {NativeModules} from 'react-native';
import * as GLOBAL from '../utilities/constants';

const appData = NativeModules.WDIDataBridge;

var getString = async function (key: string) {
    try {
        return await appData.getString(key);
    } catch (e) { //console.error(e);
    }
};

var putString = async function (key: string, value: string) {
    try {
        return await appData.putString(key, value);
    } catch (e) { //console.error(e);
    }
};

var getInt = async function (key: string) {
    try {
        return await appData.getInt(key);
    } catch (e) { //console.error(e);
    }
};

var putInt = async function (key: string, value: number) {
    try {
        return await appData.putInt(key, value);
    } catch (e) { //console.error(e);
    }
};

var getLong = async function (key: string) {
    try {
        return await appData.getLong(key);
    } catch (e) { //console.error(e);
    }
};

var putLong = async function (key: string, value: number) {
    try {
        return await appData.putLong(key, value);
    } catch (e) { //console.error(e);
    }
};

var getBoolean = async function (key: string) {
    try {
        return await appData.getBoolean(key);
    } catch (e) { //console.error(e);
    }
};

var putBoolean = async function (key: string, value: boolean) {
    try {
        return await appData.putBoolean(key, value);
    } catch (e) { //console.error(e);
    }
};

var getLoginToken = async function () {
    try {
        return await appData.getLoginToken();
    } catch (e) { //console.error(e);
    }
};

var setLoginToken = async function (token = null) {
    try {
        return await appData.setLoginToken(token);
    } catch (e) { //console.error(e);
    }
};

var removeLoginToken = async function () {
    try {
        return await appData.removeLoginToken();
    } catch (e) { //console.error(e);
    }
};

var removeObjForKey = async function (key: string) {
    try {
        return await appData.removeObjectForKey(key);
    } catch (e) { //console.error(e);
    }
};

var getUserEmail = async function () {
    try {
        return await appData.getUserEmail();
    } catch (e) { //console.error(e);
    }
};

var getUserMobile = async function () {
    try {
        return await appData.getUserMobile();
    } catch (e) { //console.error(e);
    }
};

var getDeviceId = async function () {
    try {
        return await appData.getDeviceId();
    } catch (e) { //console.error(e);
    }
};

var getAppVersion = async function () {
    try {
        return await appData.getAppVersion();
    } catch (e) { //console.error(e);
    }
};

var getLatLong = async function () {
    try {
        return await appData.getLatLong();
    } catch (e) { //console.error(e);
    }
};

var setLanguage = async function (value) {
    try {
        return await appData.setLanguage(value, GLOBAL.CONFIG.isGrocery);
    } catch (e) { //console.error(e);
    }
};

var getLanguage = async function () {
    try {
        return await appData.getLanguage();
    } catch (e) { //console.error(e);
    }
};

const getDeviceInfo = async function () {
    try {
        return await appData.getDeviceInfo();
    } catch (e) {

    }
};

const getUserLocation= async function () {
    try{
        return await appData.getUserLocation()
    }catch (e){

    }
}

module.exports = {
    getString: getString,
    getLoginToken: getLoginToken,
    setLoginToken: setLoginToken,
    removeLoginToken: removeLoginToken,
    putBoolean: putBoolean,
    getBoolean: getBoolean,
    setLanguage: setLanguage,
    putLong: putLong,
    getLong: getLong,
    putInt: putInt,
    getInt: getInt,
    putString: putString,
    getUserEmail: getUserEmail,
    getUserMobile: getUserMobile,
    getDeviceId: getDeviceId,
    getAppVersion: getAppVersion,
    getLanguage: getLanguage,
    getLatLong: getLatLong,
    getDeviceInfo: getDeviceInfo,
    getUserLocation:getUserLocation
};
