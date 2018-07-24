'use strict';
/**
 * Created by Manjeet Singh on 8/11/2017
 * this file should be common place for all custom navigation states
 */
import { NavigationActions} from 'react-navigation'

import AppNavigator from '../components/navigators/rootNavigator';
import AppSatck from '../components/navigators/appStack';
import Types from '../actions/actionTypes';

//const INITIAL_STATE = AppNavigator.router.getStateForAction(NavigationActions.init());
const INITIAL_STATE = AppSatck.router.getStateForAction(NavigationActions.init());

const navigatorReducer = (state = INITIAL_STATE, action) => {

    /*The below if condition is to prevent the double page navigation in case of multiple times of clicks*/
    // if (action.type.startsWith('Navigation/')) {
    //     const { type, routeName } = action
    //     const lastRoute = state.routes[state.routes.length - 1]
    //     if (type == lastRoute.type || routeName == lastRoute.routeName)
    //         return state
    // }

    const nextState = AppSatck.router.getStateForAction(action, state);
    return nextState || state;
};


export default navigatorReducer;

export const currentScreen = (state = "", action) => {
    switch (action.type) {
        case Types.UPDATE_SCREEN_NAME:
            return action.currentScreen;
        default:
            return state;
    }
};


export const firtsLaunch = (state = {url:null, initial:false}, action)=>{
    switch(action.type){
        case Types.FIRST_TIME_LAUNCH:
            return {...state, initial:true, url:null};
        case Types.SAVE_INITIAL_DEEPLINK_URL:
            return {...state, url:action.url};
        default:
            return state;
    }
}