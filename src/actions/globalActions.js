'use stricts';

import deeplinkHandler from '../utilities/managers/deeplinkHandler';
import Types from './actionTypes';

/**
 * Created by Manjeet Singh on 01-04-2018
 * Goal - this file is the common place for all the reusable actions across the app
 */

/*
 * use it to navigate to diffrent screens;
 */
export const deepLinkActions = ({url, type = Types.DEEP_LINK, navigator, currentScreen, toScreen, params, tracking}) => {
    return dispatch => {
        dispatch({type:type, tracking: tracking});
        deeplinkHandler(navigator, url, currentScreen, toScreen, params);
    }
}

