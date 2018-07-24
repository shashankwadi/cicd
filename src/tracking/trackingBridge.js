/*
 * @Author: shahsank sharma 
 * @Date: 2017-07-27 11:46:43 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2018-01-29 18:46:14
 */

'use strict';
/*
    case gtm
    case tune
    case fb
    case all
*/

import { NativeModules } from 'react-native';
const analyticsBridge = NativeModules.WDITrackingBridge;
import TrackingEnum from './trackingEnum';
import Enums from './trackingEnum';
import TuneTracker from './tune';
import GTMTracker from './gtm';
import MSDTracker from './msd';
import FacebookTracking from './facebook';
import { isEmptyObject } from '../utilities/utilities';
import {getCustomTuneProfileAttributes} from "../analytics/profileAttributesConstants";


export default class TrackingBridge {

    /**
     * Track Event.
     *
     * @param   {string} title  - The title of Event.
     * @param   {Object} data - The data to be tracked.
     * @param   {number} logType - The log type, where this event needs to be tracked
     * @param   {sting} eventType - type of event click, view, navigate
     * @param   {string} currentPage - name of the screen
     */
    track = (trackingObj, actionType) => {
        //call generic native method for ios and android right here.
        let dataObj = this.getTrackingObjByLogType(trackingObj, actionType);
        if (!isEmptyObject(dataObj)){

            analyticsBridge.trackEvent( dataObj );
        }
    }

    /**
     * Track Event.
     *
     * @param   {string} title  - The title of Event.
     * @param   {Object} trackingData - The data to be tracked.
     * @param   {number} logType - The log type, where this event needs to be tracked.
     */
    trackEvent(title, trackingData, logType) {

        // analyticsBridge.trackEvent(title, trackingData, logType)
    }

    /**
     * Track Screen visit.
     *
     * @param   {string} screenName  - The name of the Screen.
     * @param   {object} screenData  - The data of the Screen.
     */
    trackScreenVisit(screenName, screenData) {
        analyticsBridge.trackScreenVisit(screenName, screenData)
    }

    /**
     * Track Api Failure.
     *
     * @param   {string} apiUrl  - The title of Event.
     */
     trackApiFailure(apiUrl) {
        analyticsBridge.trackApiFailure(apiUrl)
    }

    registerCustomProfileAttributes() {
         analyticsBridge.registerTunePersonalizedData(getCustomTuneProfileAttributes())
    }

    getTrackingObjByLogType(trackingObj, actionType) {
        let gtmEnabled = true;
        let msdEnabled = true; //Values to be read from feature map
        let tuneEnabled = true;
        let fbEnabled = true;
        let dataObject = {};
        switch(trackingObj.logType) {
            case TrackingEnum.TrackingType.ALL:
            {
                if (gtmEnabled) {

                    let gtmTrackingObj = GTMTracker.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(gtmTrackingObj)) {

                        dataObject.gtm = gtmTrackingObj;
                    }

                }


                if(tuneEnabled) {

                    let tuneTrackingObj = TuneTracker.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(tuneTrackingObj)) {

                        dataObject.tune = tuneTrackingObj;
                    }

                }

                if (fbEnabled) {

                    let fbTrackingObj = FacebookTracking.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(fbTrackingObj)) {

                        dataObject.fb = fbTrackingObj;
                    }

                }
                if(msdEnabled) {

                    let msdTrackingObj = MSDTracker.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(msdTrackingObj)) {

                        dataObject.msd = msdTrackingObj;
                    }
                }
            }
            break;
            case TrackingEnum.TrackingType.GTM:
            {
                if (gtmEnabled) {

                    let gtmTrackingObj = GTMTracker.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(gtmTrackingObj)) {

                        dataObject.gtm = gtmTrackingObj;
                    }
                }

            }
            break;
            case TrackingEnum.TrackingType.TUNE:
            {
                if(tuneEnabled) {

                    let tuneTrackingObj = TuneTracker.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(tuneTrackingObj)) {

                        dataObject.tune = tuneTrackingObj;
                    }
                }

            }
            break;
            case TrackingEnum.TrackingType.FB:
            {
                if (fbEnabled) {
                    let fbTrackingObj = FacebookTracking.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(fbTrackingObj)) {

                        dataObject.fb = fbTrackingObj;
                    }
                }
            }
            break;
            case TrackingEnum.TrackingType.MSD:
            {
                if(msdEnabled) {

                    let msdTrackingObj = MSDTracker.getTrackingObj(trackingObj, actionType);
                    if(!isEmptyObject(msdTrackingObj)) {

                        dataObject.msd = msdTrackingObj;
                    }
                }
            }
            break;
            default: {
                return {}
            }
            break;
        }
        return dataObject;
    }
}
