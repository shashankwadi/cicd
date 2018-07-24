'use strict';

import React, {Component} from 'react';
import {NativeModules} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {Client, Configuration} from 'bugsnag-react-native';
import codePush from "react-native-code-push";

import {screens} from 'Wadi/src/components/constants/constants';
import store from 'Wadi/src/reducers/store';
import screenTracker from 'Wadi/src/components/navigators/screenTracker';
import registerScreen from 'Wadi/src/components/navigators/registerScreen.js';
import UserHandler from "utilities/managers/userHandler";

import {taskAfterApplaunch, isIos} from '../../utilities/utilities';
import * as GLOBAL from '../../utilities/constants';

const dataBridge = NativeModules.WDIDataBridge;
codePush.getUpdateMetadata().then((metadata) => {

    const configuration = new Configuration();
    UserHandler.getCurrentDoodleBundleChecksum().then(currentCheckSum => {
        if (metadata) {
            configuration.appVersion = metadata.appVersion;
            configuration.codeBundleId = `${metadata.appVersion}-${metadata.label}`;
            configuration.registerBeforeSendCallback((report) => {
                // add your custom metadata here
                report.metadata = {
                    ...report.metadata, // merge existing metadata that could have been added by other callbacks
                    extra: {
                        "checksum": currentCheckSum,
                        'codepushVersion': metadata.appVersion
                    }
                }
            });
        }
    }).catch(err => {
        configuration.appVersion = metadata.appVersion;
        configuration.codeBundleId = `${metadata.appVersion}-${metadata.label}`;

    });

    const bugsnag = new Client(configuration);
});


registerScreen(store, Provider);
screenTracker();

class App extends Component {
    constructor(props) {
        super(props);
        taskAfterApplaunch(this.launchAppropriateApp());
    }


    hidiNativeSplash() {
        if (isIos()) {
            dataBridge.hideSplash()
        }
    }
    startApp() {
        Navigation.startSingleScreenApp({
            screen: {
                screen: screens.SplashScreen, // unique ID registered with Navigation.registerScreen
                title: 'SplashScreen', // title of the screen as appears in the nav bar (optional),
            },
            animationType: 'fade',
            portraitOnlyMode: true,
            appStyle: {navBarHidden: true}
        });
    }

    launchWebApp = () => {
        // console.log('languageSelected is', this.state.languageSelected);
        Navigation.startSingleScreenApp({
            screen: {
                screen: screens.DoodleContainerScreen,
                title: 'mweb App',
                navigatorStyle: {
                    navBarBackgroundColor: GLOBAL.COLORS.wadiDarkGreen,
                    statusBarColor:GLOBAL.COLORS.wadiDarkGreen,
                    statusBarTextColorScheme: GLOBAL.CONFIG.isGrocery?'dark':'light'
                }
            },
            animationType: 'fade',
            appStyle: {
                navBarHidden: true,
                navBarBackgroundColor: GLOBAL.COLORS.wadiDarkGreen,
                statusBarTextColorScheme: GLOBAL.CONFIG.isGrocery?'dark':'light',
                statusBarColor:GLOBAL.COLORS.wadiDarkGreen
            },
            navigatorStyle: {
                navBarHidden: true,
            },
            portraitOnlyMode: true,
            // passProps: {languageSelected: this.state.languageSelected}
        });
    }

    launchAppropriateApp() {
        this.hidiNativeSplash();
        GLOBAL.CONFIG.enableMobileWeb? this.launchWebApp() : this.startApp()
    }
}

export default App;
