'use strict';

import React from 'react';
import {
    AsyncStorage
} from 'react-native';

const configKey = 'wadi_config_key'; // unique key for user


export default function ConfigHandler() {

    this.getConfig = () => {
        return _getConfig();
    };

    this.setConfig = (configObj) => {
        return _setConfig(configObj);
    };

    this.clearConfig = () => {
        return _clearConfig();
    };
}

/************ Private Methods *****************/

//User Related private methods

const _setConfig = (configObj) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(configKey, JSON.stringify(configObj))
            .then(() => {
                    resolve(true)
                }
            )
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

const _getConfig = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(configKey)
            .then((obj) => {
                if (obj) {
                    let configObj = JSON.parse(obj);
                    resolve(configObj);
                }
                else {
                    resolve(false);
                }
            })
            .catch((error) => reject({success: false, error}));
    });
};

const _clearConfig = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(configKey)
            .then(() => resolve(true))
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

