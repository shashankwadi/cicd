'use strict';

import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    I18nManager,
    View
} from 'react-native';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { Client, Configuration } from 'bugsnag-react-native';

import { Navigation } from 'react-native-navigation';

import reducers from 'Wadi/src/reducers/reducers';
//import Tabs from "Wadi/src/components/navigators/rootNavigator"
import AppNavigatorState from './src/components/navigators';
import analyticsLogger from './src/analytics/analytics.js'
import screenLogger from './src/analytics/screenTracking.js'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'

//import createSagaMiddleware from 'redux-saga'  //https://redux-saga.js.org/ more declrative than thunk,
import {createStore, applyMiddleware} from 'redux'
import codePush from "react-native-code-push";
import { createEpicMiddleware }from 'redux-observable';

//import rootSaga from './src/sagas';
// let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};
let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.IMMEDIATE,
    updateDialog:true

}


const loggerMiddleware = createLogger();
//const middleware = [sagaMiddleware, thunkMiddleware, loggerMiddleware];

import epicSearchMiddleware from './src/utilities/epicAutocompleteMiddleware.js'

const epicMiddleware = createEpicMiddleware(epicSearchMiddleware)

export const store = createStore(
    reducers,
    applyMiddleware(
        //sagaMiddleware,
        thunkMiddleware, // lets us dispatch() functions
        //loggerMiddleware, // neat middleware that logs actions
        analyticsLogger, // All the analytics recording
        //screenLogger, //Screen tracking now we are tracking screen withour redux
        epicMiddleware
    )
);


//sagaMiddleware.run(rootSaga)

//const configuration = new Configuration();
const bugsnag = new Client();

import HomeUnSelIcon from 'Wadi/src/icons/tabbar/tab_home_unselected.png'
import HomeSelIcon from 'Wadi/src/icons/tabbar/tab_home_selected.png'

import CategoryUnSelIcon from 'Wadi/src/icons/tabbar/tab_category_unselected.png'
import CategorySelIcon from 'Wadi/src/icons/tabbar/tab_category_selected.png'

import AccountUnSelIcon from 'Wadi/src/icons/tabbar/tab_profile_unselected.png'
import AccountSelIcon from 'Wadi/src/icons/tabbar/tab_profile_selected.png'

import SearchUnSelIcon from 'Wadi/src/icons/tabbar/tab_search_unselected.png'
import SearchSelIcon from 'Wadi/src/icons/tabbar/tab_search_selected.png'

import CartUnSelIcon from 'Wadi/src/icons/tabbar/tab_bag_unselected.png'
import CartSelIcon from 'Wadi/src/icons/tabbar/tab_bag_selected.png'

import HomePage from '../screens/home'
import CategoryPage from '../screens/categoryPage'
import SearchPage from '../screens/search/searchPage'
import CartPage from '../screens/cartPage'
import AccountsPage from '../screens/accountsPage'


Navigation.registerComponent('HomePage', () => HomePage, store, Provider);
Navigation.registerComponent('CategoryPage', () => CategoryPage, store, Provider);
Navigation.registerComponent('SearchPage', () => SearchPage, store, Provider);
Navigation.registerComponent('CartPage', () => CartPage, store, Provider);
Navigation.registerComponent('CartPage', () => AccountsPage, store, Provider);


const navigatorStyle = {
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    statusBarTextColorScheme: 'light',
    drawUnderTabBar: true
};

class App extends Component {
    constructor(props) {
        super(props);
        this.startApp();
    }

    startApp() {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    label: 'CATEGORY',
                    screen: 'CategoryPage',
                    icon: CategoryUnSelIcon,
                    selectedIcon: CategorySelIcon,
                    title: 'CATEGORY',
                    navigatorStyle,
                },
                {
                    label: 'HOME',
                    screen: 'HomePage',
                    icon: HomeUnSelIcon,
                    selectedIcon: HomeSelIcon,
                    title: 'HOME',
                    navigatorStyle,
                },
                {
                    label: 'SEARCH',
                    screen: 'SearchPage',
                    icon: SearchUnSelIcon,
                    selectedIcon: SearchSelIcon,
                    title: 'SEARCH',
                    navigatorStyle,
                },
                {
                    label: 'CART',
                    screen: 'CartPage',
                    icon: CartUnSelIcon,
                    selectedIcon: CartSelIcon,
                    title: 'CART',
                    navigatorStyle,
                },
                {
                    label: 'ACCOUNT',
                    screen: 'AccountPage',
                    icon: AccountUnSelIcon,
                    selectedIcon: AccountSelIcon,
                    title: 'ACCOUNT',
                    navigatorStyle,
                },
            ],
            tabsStyle: {
                tabBarButtonColor: 'white',
                tabBarSelectedButtonColor: 'white',
                tabBarBackgroundColor: 'black'
            }
        });
    }
}

export default App;