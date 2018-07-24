'use strict';
import React from 'react';
import {ScreenVisibilityListener} from 'react-native-navigation';


import {getStoreData} from 'Wadi/src/utilities/utilities.js'
import TrackingBridge from 'Wadi/src/tracking/trackingBridge';
import {isIos} from 'utilities/utilities';

const tracking = new TrackingBridge();

export default function registerScreenVisibilityListener() {
    new ScreenVisibilityListener({
      willAppear: ({screen}) => _screenWillAppear({screen}),
      didAppear: ({screen, startTime, endTime, commandType}) => _screenDidAppear({screen, startTime, endTime, commandType}),
      willDisappear: ({screen}) => _screenWillDisappear({screen}),
      didDisappear: ({screen}) => _screenDidDisappear({screen}),
    }).register();
}

const _screenWillAppear = ({screen})=>{
    //console.log(`Displaying screen ${screen}`);
}

const _screenDidAppear = ({screen, startTime, endTime, commandType})=>{
    //console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`);
    if(!isIos() && commandType === 'InitialScreen') return true;
    let store = getStoreData();
    let {configAPIReducer}= store;
    let screenDataObj = {};
    if (configAPIReducer && configAPIReducer.selectedCountry) {
        screenDataObj.country_name = configAPIReducer.selectedCountry.name;
    }
    tracking.trackScreenVisit(screen, screenDataObj);
}

const _screenWillDisappear =({screen})=>{
    //console.log(`Screen will disappear ${screen}`)
}
const _screenDidDisappear =({screen})=>{
    //console.log(`Screen disappeared ${screen}`)
}
