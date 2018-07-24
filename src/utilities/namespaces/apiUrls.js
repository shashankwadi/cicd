'use strict';

import * as CONFIG from './config';
import {Platform} from 'react-native';

//Doodle checksum API endpoints
const DoodleApiMain_iOS = 'getiosmainchecksum';
const DoodleApiGrocery_iOS = 'getiosgrocerychecksum';
const DoodleApiMain_android = 'getandroidmainchecksum';
const DoodleApiGrocery_android = 'getandroidgrocerychecksum';
const DoodleApi_iOS = CONFIG.isGrocery ? DoodleApiGrocery_iOS : DoodleApiMain_iOS;
const DoodleApi_android = CONFIG.isGrocery ? DoodleApiGrocery_android : DoodleApiMain_android;

//Doodle Bundle Urls
const DoodleBundleUrlMain_iOS = 'ios-main-doodle.zip';
const DoodleBundleUrlGrocery_iOS = 'ios-grocery-doodle-v46.zip';
const DoodleBundleUrlMain_android = 'android-main-doodle.zip';
const DoodleBundleUrlGrocery_android = 'android-grocery-doodle-v58.zip';
const DoodleBundleUrl_iOS = CONFIG.isGrocery ? DoodleBundleUrlGrocery_iOS : DoodleBundleUrlMain_iOS;
const DoodleBundleUrl_android = CONFIG.isGrocery ? DoodleBundleUrlGrocery_android : DoodleBundleUrlMain_android;


/* Add All Global Api urls here  */
module.exports = {
    //Base URLs
    WadiBaseURLProd: 'https://api.wadi.com/',
    WadiBaseURLStaging: 'https://api.wadi-stg.com/',
    WadiMockable: 'http://demo3402530.mockable.io/',
    WadiS3: 'https://wadi-doodle-bundle.s3.amazonaws.com/',
    MyWadi: 'https://my.wadi.com/',
    //prefixes
    WADI_SAWA_PREFIX: 'sawa/v1/u/',
    TrackWadiBaseUrl: 'https://track.wadi.com',

    //Doodle checksum API endpoint
    Wadi_DoodleChecksumAPI: Platform.OS === 'ios' ? DoodleApi_iOS : DoodleApi_android,

    //Doodle Bundle Url
    Wadi_DoodleBundleUrl: Platform.OS === 'ios' ? DoodleBundleUrl_iOS : DoodleBundleUrl_android,


    //GET URLs
    Grocery_Home: 'https://demo3402530.mockable.io/fmcgconfig', //to enable grocery homepage
    //Grocery_Home: '', // to enable the wadi homepage
    Wadi_Home: '',
    //Wadi_Home: 'homePageData',
    Wadi_Navigation_Stack: '/sawa/v1/config/navigation',
    Wadi_Filter_URL: 'filter/?q=',
    Wadi_Check_User_Email_Exists: '/jerry/v2/users/:email/exists',
    Wadi_Logout: 'jerry/v1/logout',
    Wadi_User_Info: 'jerry/v1/customers/self',
    Wadi_Similar_Products: '/sawa/v1/recommendations?widgets=0&limit=15&sku=',
    Wadi_Frequently_Bought: '/sawa/v1/recommendations?widgets=5&limit=2&sku=',
    Wadi_Get_Config: '/sawa/v1/u/configData',
    Wadi_Get_Config_Grocery: '/sawa/v1/u/configDataGrocery',
    Wadi_Get_Feature_Map: '/sawa/v1/u/apiFeatureMap',
    Wadi_Get_Feature_Map_Grocery: '/sawa/v1/u/apiFeatureMapGrocery',
    Wadi_Size_Chart: '/sawa/v1/u/sizechart/',
    Wadi_User_Address: 'jerry/v2/addresses',
    Wadi_My_Orders: 'jerry/v1/customer/orders',
    Wadi_Order_Detail: 'jerry/v1/orders/:orderId.json?depth=1',
    Wadi_Order_Tracking_Details: '/token?email=:email&order_nr=:order_number',
    Wadi_Saved_Cards: '/checkout/payment/tokenization/',

    Wadi_Wallet_Summary: 'api/jerry/wallet/summary',
    Wadi_Wallet_Upcoming_Points: 'api/jerry/wallet/loyalty/upcoming',
    Wadi_Wallet_Transactions: 'api/jerry/wallet/transactions',
    Wadi_Wallet_Redeem_Coupon: 'api/jerry/wallet/coupon/redeem',

    //POST URLs
    Wadi_Mail_Login: 'jerry/login',
    Wadi_Mail_Signup: 'jerry/customers.json',
    Wadi_Verify_Mobile_Request_OTP: 'jerry/v2/phone/verify',
    Wadi_Verify_Mobile_Verify_OTP: 'jerry/v2/phone/code/verify',
    Wadi_Set_Primary: 'jerry/phones/primary',
    Wadi_Social_Login: 'jerry/connect',
    Wadi_Password_Reset_Request: 'jerry/v1/password-reset-request/:email/',
    Wadi_Get_Promise_Details: '/sawa/v1/getpromise',

    //Checkout Urls
    CHECKOUT_SUCCESS: "/checkout/success",
    CHECKOUT_SUCCESS_PAYMENT: "checkoutPayment",
    CHECKOUT_TRACK_CITY: "checkoutCityTracking",
    CHECKOUT_FAILURE: "/checkout/error?",
    CHECKOUT_TRACKORDER: "/trackOrder?",
    CHECKOUT_EXIT: "/exit?",
    CHECKOUT_OPTIONS: '/checkoutOption?',
    CHECKOUT_LOGOUT: 'logout?',
    CHECKOUT_ADDRESS_SELECTION: '/addressSelection?',

    //app links
    WADI_MAIN_ANDROID_LINK:'https://play.google.com/store/apps/details?id=com.wadi.android',
    WADI_GROCERY_ANDROID_LINK:'https://play.google.com/store/apps/details?id=com.wadi.fmcg',
    WADI_MAIN_IOS_LINK:'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=993182133',
    WADI_GROCERY_IOS_LINK:'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=1237674044',
};


