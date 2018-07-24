'use strict';

import React, { Component } from 'react';
import { NativeModules, StyleSheet, View, Linking, Platform, WebView, NativeEventEmitter, SafeAreaView, Text, AppState, AsyncStorage } from 'react-native';
import WKWebView from 'react-native-wkwebview-reborn';
const { WDIPaymentBridge } = NativeModules;

var alreadyMounted = false;
const applePayEmitter = new NativeEventEmitter(WDIPaymentBridge);
const applePayEventSubscription = applePayEmitter.addListener(
    'onUserAuthorize',
    (paymentResponse) => {
        userDidAuthorizePayment(paymentResponse)
    }
);

const userDidAuthorizePayment = (paymentData) => {
    if (!isEmptyObject(paymentData)) {
        WebViewHandler.speaker(paymentData, webViewActionType.speaker.USER_DID_AUTHORIZE_APPLEPAY, thisRef.webview)
    }
}


export default class DoodleScreen extends Component {
    render() {
        let { url, onMessage, headers, setWebViewRefs } = this.props;
        return (
            <WKWebView
                ref={setWebViewRefs}
                bounces={false}
                source={{ url: url }}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                sendCookies={true}
                //injectedJavaScript={injectedJavaScript}
                onMessage={onMessage}
                headers={headers}
                //onLoadEnd={this.checkForDeepLink.bind(this)}
                allowsLinkPreview={false}
            />
        )
    }
}