/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-10-08
 * This file is the action file for redux navigation
 * ****/

import {NavigationActions} from 'react-navigation';


/* Reset Navigation
 * URL: https://reactnavigation.org/docs/navigators/navigation-actions#Reset
 */
export const resetAction = (routeName, params, key = null) => NavigationActions.reset({
    index: 0,
    key: key, //this will take to root
    actions: [
        NavigationActions.navigate({routeName: routeName, params: params, key: null})
    ]
});


/* Navigate Action
 * URL: https://reactnavigation.org/docs/navigators/navigation-actions#Navigate
 */
export const navigateAction = (routeName, params, index) => {
    NavigationActions.navigate({
        index: index,
        routeName: routeName,
        params: params,
    });
}


/* Back Action
 * URL: https://reactnavigation.org/docs/navigators/navigation-actions#Navigate
 */
export const backAction = (routeName) => NavigationActions.back({
    key: routeName
});