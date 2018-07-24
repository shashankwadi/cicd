'use strict';

import React from 'react';
import {
    AsyncStorage
} from 'react-native';

const featureMapKey = 'wadi_feature_map_key'; // unique key for user


export default function FeatureMapHandler() {

    this.getFeatureMap = () => {
        return _getFeatureMap();
    };

    this.setFeatureMap = (featureMapObj) => {
        return _setFeatureMap(featureMapObj);
    };

    this.clearFeatureMap = () => {
        return _clearFeatureMap();
    };
}

/************ Private Methods *****************/

//User Related private methods

const _setFeatureMap = (featureMapObj) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(featureMapKey, JSON.stringify(featureMapObj))
            .then(() => {
                    resolve(true)
                }
            )
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

const _getFeatureMap = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(featureMapKey)
            .then((obj) => {
                if (obj) {
                    let featureMapObj = JSON.parse(obj);
                    resolve(featureMapObj);
                }
                else {
                    resolve(false);
                }
            })
            .catch((error) => reject({success: false, error}));
    });
};

const _clearFeatureMap = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(featureMapKey)
            .then(() => resolve(true))
            .catch((error) => {
                reject({success: false, error})
            });
    });
};

