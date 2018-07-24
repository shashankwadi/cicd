'use strict';

import React, {Component, PureComponent} from 'react';
import {AppRegistry, I18nManager, View} from 'react-native';

import codePush from "react-native-code-push";
import App from 'Wadi/src/components/navigators/startup';


let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
    updateDialog: false

};
const update=()=> {
    codePush.sync({
        updateDialog: false,
        installMode: codePush.InstallMode.ON_NEXT_RESUME
    }, () => codePushStatusDidChange, () => codePushDownloadDidProgress);
};

const codePushStatusDidChange=(status)=> {
    let msg = '';
    switch (status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            msg = ("Checking for updates.");
            break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            msg = ("Downloading package.");
            break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
            msg = ("Installing update.");
            break;
        case codePush.SyncStatus.UP_TO_DATE:
            msg = ("Up-to-date.");
            break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
            msg = ("Update installed.");
            break;
    }
};

const codePushDownloadDidProgress=(progress)=> {

};

const app = new App();

codePush(codePushOptions)(app);

update();