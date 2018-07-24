export const webViewActionType = {


    listener: {
        API: 'API',
        GOOGLE_LOGIN: 'GOOGLE_LOGIN',
        FACEBOOK_LOGIN: 'FACEBOOK_LOGIN',
        LOCATION: 'LOCATION',
        SCREEN_VISIT: 'SCREEN_VISIT',
        TRACKING: 'TRACKING',
        USER_LOG_OUT: 'USER_LOG_OUT',
        FETCH_LOCATION: 'GET_LOCATION',
        INITIATE_APPLE_PAY: 'INITIATE_APPLE_PAY',
        DID_COMPLETE_PURCHASE_APPLEPAY: 'DID_COMPLETE_PURCHASE_APPLEPAY',
        DID_FAIL_PURCHASE_APPLEPAY: 'DID_FAIL_PURCHASE_APPLEPAY',
        VIBRATION: 'VIBRATION',
        SHOW_LOCATION: 'SHOW_LOCATION',
        TRIGGER_ALERT: 'TRIGGER_ALERT',
        SHOW_COUNTRY_SELECTION_DIALOG: 'SHOW_COUNTRY_SELECTION_DIALOG',
        WEBVIEW_DID_LOAD:'WEBVIEW_DID_LOAD',
        SAVE_USER_DATA:'SAVE_USER_DATA',
        GET_USER_DATA:'GET_USER_DATA',
        RATE_THE_APP: 'RATE_THE_APP',
        SEND_FEEDBACK: 'SEND_FEEDBACK',
        OPEN_URL: 'OPEN_URL',
        TUNE_PURCHASE_EVENT:'TUNE_PURCHASE_EVENT',
        REGISTER_TUNE_PERSONALISED_EVENT:'REGISTER_TUNE_PERSONALISED_EVENT'
    },
    speaker: {
        API_RESPONSE: 'API_RESPONSE', //done
        DEEP_LINK: 'DEEP_LINK', //done
        EVENT_FAILED: 'EVENT_FAILED', // not required down the line
        GOOGLE_LOGIN_RESPONSE: 'GOOGLE_LOGIN_RESPONSE', // done
        FACEBOOK_LOGIN_RESPONSE: 'FACEBOOK_LOGIN_RESPONSE', // done
        USER_LOG_OUT_RESPONSE: 'USER_LOG_OUT_RESPONSE', // done
        STATUS_BAR_TAPPED: 'STATUS_BAR_TAPPED', // yet to do
        LOCATION_FETCHED: 'LOCATION_FETCHED',
        USER_DID_AUTHORIZE_APPLEPAY: 'USER_DID_AUTHORIZE_APPLEPAY',
        USER_SELECTED_COUNTRY: 'USER_SELECTED_COUNTRY',
        USER_DATA:'USER_DATA',
        CC_COMPLETED:'CC_COMPLETED',
    }

};