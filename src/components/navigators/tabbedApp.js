'use strict';

import React, {Component} from 'react';
import {I18nManager} from 'react-native';
import {Navigation} from 'react-native-navigation';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {screens} from 'Wadi/src/components/constants/constants';

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

import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";

//const bugsnag = new Client();

const navigatorStyle = {
    titleImage: wadiNavBarIcon,
    tabBarSelectedButtonColor: 'black',

    tabBarButtonColor:  GLOBAL.COLORS.unselectedTabColor,
    tabBarTextFontFamily: GLOBAL.FONTS.default_font, //change the tab font family
    tabBarTextFontSize: 8,
    tabBarBackgroundColor: 'white',
    initialTabIndex: I18nManager.isRTL ? 3 : 1,
    statusBarColor:GLOBAL.COLORS.wadiDarkGreen,
    statusBarTextColorScheme: GLOBAL.CONFIG.isGrocery?'dark':'light',
};

export const customHeaderStyle = (title = null, screen = null) => {
    return ({
        navBarCustomView: 'CustomHeader',
        navBarComponentAlignment: 'center', // center/fill
        navBarCustomViewInitialProps: {screenName: title}, // navBar custom component props
        navBarTextColor:GLOBAL.CONFIG.isGrocery ? GLOBAL.COLORS.headerTitleColor : GLOBAL.COLORS.white,
        navBarButtonColor: GLOBAL.CONFIG.isGrocery ?GLOBAL.COLORS.headerTitleColor : GLOBAL.COLORS.white
    })
};

const tabHeaderStyle = {
    navBarCustomView: 'CustomHeader',
    navBarComponentAlignment: 'fill', // center/fill
    navBarCustomViewInitialProps: {homescreen: true}, // navBar custom component props
};

const tabCustomHeaderStyle = {
    navBarCustomView: 'CustomHeader',
    navBarComponentAlignment: 'fill', // center/fill
    navBarCustomViewInitialProps: {homescreen: false}, // navBar custom component props
};


const appStyle = {
    keepStyleAcrossPush: true,
    navBarTranslucent: false,
    drawUnderNavBar: false,
    drawUnderTabBar: false,
    hideBackButtonTitle:true,
    navBarBackgroundColor:GLOBAL.COLORS.wadiDarkGreen,
    navBarNoBorder:true,
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    initialTabIndex: I18nManager.isRTL ? 3 : 1,
    navBarTitleTextCentered: true,
    forceTitlesDisplay: true,
    tabBarSelectedButtonColor: GLOBAL.CONFIG.isGrocery ? 'black' : GLOBAL.COLORS.wadiDarkGreen,
    tabBarButtonColor: GLOBAL.CONFIG.isGrocery ? 'grey' : GLOBAL.COLORS.unselectedTabColor,
    topBarElevationShadowEnabled: false,
    statusBarTextColorScheme: GLOBAL.CONFIG.isGrocery?'dark':'light',
    statusBarColor:GLOBAL.COLORS.wadiDarkGreen,
    tabFontFamily: GLOBAL.FONTS.default_font,  // existing font family name or asset file without extension which can be '.ttf' or '.otf' (searched only if '.ttf' asset not found)
    tabFontSize: 8,
};

const langBasedTab = {
    en: [
        {
            label: 'CATEGORY',
            screen: screens.Category,
            icon: CategoryUnSelIcon,
            selectedIcon: CategorySelIcon,
            title: 'CATEGORY',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },
        {
            label: 'HOME',
            screen: screens.Home,
            icon: HomeUnSelIcon,
            selectedIcon: HomeSelIcon,
            title: 'HOME',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabHeaderStyle,
        },
        {
            label: 'SEARCH',
            screen: screens.Search,
            icon: SearchUnSelIcon,
            selectedIcon: SearchSelIcon,
            title: 'SEARCH',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },
        {
            label: 'CART',
            screen: screens.Cart,
            icon: CartUnSelIcon,
            selectedIcon: CartSelIcon,
            title: 'CART',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },
        {
            label: 'ACCOUNT',
            screen: screens.Account,
            icon: AccountUnSelIcon,
            selectedIcon: AccountSelIcon,
            title: 'ACCOUNT',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },
    ], ar: [
        {
            label: 'الحساب',
            screen: screens.Account,
            icon: AccountUnSelIcon,
            selectedIcon: AccountSelIcon,
            title: 'الحساب',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },
        {
            label: 'عربة التسوق',
            screen: screens.Cart,
            icon: CartUnSelIcon,
            selectedIcon: CartSelIcon,
            title: 'عربة التسوق',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },
        {
            label: 'البحث',
            screen: screens.Search,
            icon: SearchUnSelIcon,
            selectedIcon: SearchSelIcon,
            title: 'البحث',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        },

        {
            label: 'الصفحة الرئيسية',
            screen: screens.Home,
            icon: HomeUnSelIcon,
            selectedIcon: HomeSelIcon,
            title: 'الصفحة الرئيسية',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabHeaderStyle,
        },
        {
            label: 'الفئة',
            screen: screens.Category,
            icon: CategoryUnSelIcon,
            selectedIcon: CategorySelIcon,
            title: 'الفئة',
            titleImage: wadiNavBarIcon,
            navigatorStyle: tabCustomHeaderStyle,
        }


    ]
};

export default class App extends Component {
    constructor(props) {
        super(props);
        this.startApp();
    }

    startApp() {

        Navigation.startTabBasedApp({
            tabs: I18nManager.isRTL ? langBasedTab.ar : langBasedTab.en,
            tabsStyle: {...navigatorStyle},
            appStyle: {...appStyle},
        });
    }
}