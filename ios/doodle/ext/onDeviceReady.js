'use strict;'

// ******************************** RN methods

var deeplinkHandler = function (d) {
    console.log('Deeplink Received: ', d);
    // Ideal way
    // var link = d.url;
    // link = new URL(link);

    // iOS 11.3 sucks
    var link = d.url.split('://');

    console.log('Deeplink Processed: ', link);
    // console.log('processed link: ', link.pathname.replace('//', '/') + link.search);
    // var event = new CustomEvent('deeplink-url', { detail: link.pathname.replace('//', '/') + link.search });
    var event = new CustomEvent('deeplink-url', { detail: '/' + link[1] });
    document.dispatchEvent(event);
};

var googleLoginHandler = function (d) {
    if (d.code === 200) {
        var event = new CustomEvent('rn-social-signin', { detail: { provider: "googlev3", token: d.response.idToken } });
        document.dispatchEvent(event);
    } else {
        console.log('Google oAuth Failed');
    }
};

var fbLoginHandler = function (d) {
    if (d.code === 200) {
        var event = new CustomEvent('rn-social-signin', { detail: { provider: "facebook", token: d.response.accessToken } });
        document.dispatchEvent(event);
    } else {
        console.log('Facebook oAuth Failed');
    }
};

var apiResponseHandler = function (d) {
    if (d.code === 200) {
        switch (d.methodType) {
            case 'POST':
                var event = new CustomEvent('rn-post-response', { detail: d.response });
                break;
            case 'PUT':
                var event = new CustomEvent('rn-put-response', { detail: d.response });
                break;
            case 'GET':
                var event = new CustomEvent('rn-get-response', { detail: d.response });
                break;
        }
        document.dispatchEvent(event);
    }
};

var applePayHandler = function (d) {
    console.log('Apple Pay Response Received: ', d)
    if (d.code === 200) {
        var event = new CustomEvent('rn-apple-pay-response', { detail: { provider: "token", token: d.authResponse.accessToken } });
        document.dispatchEvent(event);
    } else {
        console.log('Apple Pay Auth Failed');
    }
};

var countryLanguageHandler = function (d) {
    if (d.code === 200) {
        var event = new CustomEvent('rn-country-language-changed', { detail: d });
        document.dispatchEvent(event);
    } else {
        console.log('Country Language Change Failed');
    }
};

var locationFetchedHandler = function (d) {
    if (d.code === 200) {
        var event = new CustomEvent('rn-location-fetched', { detail: d });
        document.dispatchEvent(event);
    } else {
        console.log('Location Fetch Failed');
    }
};

var ccPaymentHandler = function (d) {
    if (d.code === 200) {
        var event = new CustomEvent('rn-cc-payment', { detail: d });
        document.dispatchEvent(event);
    } else {
        console.log('CC Payment Response Failed');
    }
};

var getUserDataHandler = function (d) {
    if (d.code === 200) {
        var event = new CustomEvent('rn-get-user-data', { detail: d });
        document.dispatchEvent(event);
    } else {
        console.log('Get User Data Failed');
    }
};

var failedHandler = function (d) {
    console.log('Failed Handler: ', d);
};

var logoutHandler = function (d) {
    console.log('Logout Handler: ', d);
};

var handlers = {
    'GOOGLE_LOGIN_RESPONSE': googleLoginHandler,
    'FACEBOOK_LOGIN_RESPONSE': fbLoginHandler,
    'DEEP_LINK': deeplinkHandler,
    'API_RESPONSE': apiResponseHandler,
    'EVENT_FAILED': failedHandler,
    'USER_LOG_OUT_RESPONSE': logoutHandler,
    'USER_DID_AUTHORIZE_APPLEPAY': applePayHandler,
    'USER_SELECTED_COUNTRY': countryLanguageHandler,
    'LOCATION_FETCHED': locationFetchedHandler,
    'CC_COMPLETED': ccPaymentHandler,
    'USER_DATA': getUserDataHandler
};

var handleRNCommunication = function () {
    document.addEventListener('message', function(e) {
        console.log('>>> WebView: Message Received: ', e);
        if (e.data) {
            var d = JSON.parse(e.data);
            if (d.speakerActionType) {
                handlers[d.speakerActionType](d.data);
            }
        }
    });
};

handleRNCommunication();

// ******************************** RN methods

function resultHandler (result) {
    console.log('resultHandler: ' + (result==null?"NULL":result));
}
function jsonResultHandler(result) {
    console.log('JSON resultHandler: ' + JSON.stringify(result));
}
function errorHandler (error) {
    console.log('errorHandler: ' + error);
}

function testSetters() {
    // XD.tune.setAge(23);
    // XD.tune.setAppAdMeasurement(true);
    // XD.tune.setAppleVendorIdentifier("12345678-1234-1234-1234-123456789012");
    // XD.tune.setCurrencyCode("AUD");
    // XD.tune.setExistingUser(false);
    // XD.tune.setFacebookEventLogging(true, false);
    // XD.tune.setFacebookUserId("198273645");
    // XD.tune.setGender(1);
    // XD.tune.setGoogleUserId("5647382910");
    // XD.tune.setJailbroken(false);
    // XD.tune.setLocation(1.1, 2.2);
    // XD.tune.setLocationWithAltitude(3.3, 4.4, 5.5);
    XD.tune.setPackageName("com.wadi.wadi");
    // XD.tune.setPayingUser(true);
    XD.tune.setShouldAutoCollectAppleAdvertisingIdentifier(true);
    // XD.tune.setShouldAutoCollectDeviceLocation(true);
    // XD.tune.setShouldAutoDetectJailbroken(true);
    XD.tune.setShouldAutoGenerateAppleVendorIdentifier(true);
    // XD.tune.setTRUSTeId("tempTrusteId");
    // XD.tune.setTwitterUserId("1357908642");
    // XD.tune.setUseCookieMeasurement(false);
    // XD.tune.setUserEmail("tempUserEmail@tempUserCompany.com");
    // XD.tune.setUserId("tempUserId");
    // XD.tune.setUserName("tempUserName");
    var preloadData = {
        "publisherId":"1122334455",
        "publisherReferenceId":"RX1357",
        "agencyId":"66554477",
        "publisherSub5":"some_pub_sub_value"
    };
    // XD.tune.setPreloadData(preloadData);
}

function setReferralSources(referralSource, referralUrl) {
    // console.log('>>> referralSource, referralUrl: ', referralSource, referralUrl);
    MobileAppTracker.setReferralSource(referralSource);
    MobileAppTracker.setReferralUrl(referralUrl);
}

// Deeplink Handler
function handleOpenURL(url) {
    var link = url;
    if (link && link.startsWith('wadi://')) {
        link = link.replace('wadi://', '/');
    }
    document.addEventListener('deviceready', function () {
        var event = new CustomEvent('deeplink-url', { detail: link });
        document.dispatchEvent(event);
    },  false);
}

const XD = {
    init: () => {
        XD.initApp();
        XD.initializeTune();
        XD.setFirstLaunch();
    },
    initApp: () => {
        // StatusBar.hide();
        // console.log('StatusBar: ', StatusBar);
        StatusBar.backgroundColorByHexString('#0FB0AA');
        StatusBar.overlaysWebView(true);
        window.appDirectory = cordova.file.applicationDirectory + 'www';
        // console.log(window.appDirectory);
        var iphoneX = window.screen.width === 375 && window.screen.height === 812;
        if (iphoneX) {
            document.querySelector('html').classList.add('device-iphone-x');
        }
    },

    setFirstLaunch: () => {
        window.localStorage.setItem('firstLaunch', true);
    },

    isFirstLaunch: () => {
        return window.localStorage.getItem('firstLaunch') !== 'true';
    },

    tune: null,
    deeplinkReceived: (deeplink) => {
        console.log('>>> deeplink received: ', deeplink);
    },
    deeplinkFailed: (err) => {
        console.log('>>> deeplinkFailed -> err: ', err);
    },
    initializeTune: () => {
        XD.tune = window.plugins.tunePlugin;
        XD.tune.setDebugMode(true);
        // XD.tune.init('192305', 'b70d5b8be07413966b01e3910d6d5326', 'com.wadi.wadi', true);
        // XD.tune.enablePushNotifications('1034143548269');

        XD.tune.initTune('192305', 'b70d5b8be07413966b01e3910d6d5326', true);
        // XD.tune.setPackageName('com.wadi.wadi');
        testSetters();
        // Use the project_number in the google-services.json file
        XD.tune.enablePushNotifications('1034143548269');
        // XD.tune.setDelegate(true, resultHandler, errorHandler);
        XD.tune.setDelegate(true, function resultHandler (result) {
            console.log('Set Delegate: ' + (result==null?"NULL":result));
        }, errorHandler);

        XD.tune.checkForDeferredDeeplink(XD.deeplinkReceived, XD.deeplinkFailed);
        XD.tune.automateIapEventMeasurement(true);
        XD.tune.registerPowerHook("PowerButton", "Power Hook Button Title", "Test Power Hooks");
        // XD.tune.registerDeeplinkListener(XD.deeplinkReceived, XD.deeplinkFailed)
        // XD.tune.setPushNotificationSenderId(context.getResources()
        //         .getString(R.string.gcm_sender_id));
        // XD.tune.setPushNotificationRegistrationId('1034143548269');
        //Enable Tune SmartWhere
        XD.tune.enableSmartwhere(function resultHandler (result) {
            console.log('SmartWhere: ' + (result==null?"NULL":result));
        }, errorHandler);
        XD.tune.getTuneId(function resultHandler (result) {
            console.log('TuneID: ' + (result==null?"NULL":result));
        }, errorHandler);
        // Deprecated
        // XD.tune.getMatId(function resultHandler (result) {
        //     console.log('MatID: ' + (result==null?"NULL":result));
        // }, errorHandler);
        XD.tune.getOpenLogId(function resultHandler (result) {
            console.log('OpenID: ' + (result==null?"NULL":result));
        }, errorHandler);
        XD.tune.getAdvertisingId(function resultHandler (result) {
            console.log('AdvertisingID: ' + (result==null?"NULL":result));
        }, errorHandler);
        // 9D4F81B1-54BB-4E2E-9FC2-847937DFEBD3

        // 2018-02-09 18:55:01.168710+0530 Wadi[1870:693228] deeplinkFailed -> err: 
        // Error Domain=com.tune.Tune Code=404 "Deferred deep link not found"
        // UserInfo={NSLocalizedDescription=Deferred deep link not found,
        // request_url=https://192305.deeplink.mobileapptracking.com/v1/link.txt?platform=ios&advertiser_id=192305&ver=4.13.4&package_name=com.wadi.wadi&ad_id=D89D118D-FC1C-496D-AC47-2EA78927FBD8&ios_ad_tracking=1}
 
        // Only if you have pre-existing users before TUNE SDK implementation, identify these users
        // using this code snippet.
        // Otherwise, pre-existing users will be counted as new installs the first time they run your app.
        if (!XD.isFirstLaunch()) {
            XD.tune.setExistingUser(true);
        }
 
        XD.tune.measureSession();

        // https://developers.tune.com/sdk/phonegap-quick-start/
        // <string name="facebook_app_id">699077540282679</string>
        // <string name="gcm_sender_id">1034143548269</string>
        // <string name="app_name">Wadi</string>
        // <string name="app_name_versioned">Wad REL</string>
        // <string name="package_name">com.wadi.android.rel</string>
        // <string name="ad4push_private_key">01d45c0ca2eb14e1b817a0936161e6786aae0b06</string>
        // <string name="ad4push_partner_id">rocketinternet98b757b8d038707</string>
        // <string name="gcm_id">gcm:260761796438</string>
        // <string name="adjust_environment">production</string>
        // <string name="adjust_app_token">usvca3b6cfvs</string>
        // <string name="newrelic_app_token">AAd233dc4fe1e7ca2e11f2fbfd62038d4374236c86</string>
        // <string name="kahuna_secret_key">66a0cda71af945688d6365232b5ecef4</string>
        // <string name="kahuna_sender_id">346170239177</string>
        // <string name="appsee_api_key">b3a3c80cf474474eb212ed382bf47b34</string>
        // <string name="google_signin_client_id">1034143548269-us4drm7upkqgsdpe3835n63k77ick6vl.apps.googleusercontent.com</string>
        // <string name="insta_bug_token">416bbef3b6703889033d71f1da17b057</string>
        // <string name="facebook_app_id">699077540282679</string>
        // <string name="gcm_sender_id">1034143548269</string>

        // --------------------
        // TODO
        // --------------------
        // Advertising ID
        //  iOS - Done
        //  Android - Check - https://developer.android.com/sdk/installing/adding-packages.html
        // --------------------
        // Pre-Existing Users migration
        // --------------------
        // TUNE Measurement Engine such that any install record with an "insdate" value before the "onboarding_date" value will automatically be marked as an "existing_user" and made "Organic".
        // To provide TUNE with your Onboarding date before launching your app with the TUNE SDK, please contact support@tune.com.
        // Install Date (insdate) - Install date of App
        // Onboarding Date (onboarding_date) - Set as first day app goes live to Store
        // --------------------
        // Set Custom Profiling
        // --------------------

        // JS sample
        // https://github.com/TuneOSS/phonegap-plugin/blob/master/example/index.html
    }
};
