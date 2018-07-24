'use strict';

import React, {Component} from 'react';
import {
    NativeModules, StyleSheet, View, Linking, Platform, WebView, NativeEventEmitter, SafeAreaView, Text, AppState,
    AsyncStorage, Image, BackHandler,
} from 'react-native';
import WKWebView from 'react-native-wkwebview-reborn';
import {connect} from "react-redux";
import RNFetchBlob from "react-native-fetch-blob";
import * as GLOBAL from '../../../utilities/constants';
import UserHandler from "../../../utilities/managers/userHandler";
import ApiHandler from "../../../utilities/ApiHandler";
import {WebViewHandler} from '../../../utilities/webViewUtils';
import {getLoginToken} from '../../../utilities/sharedPreferences';
import {webViewActionType} from "../../../utilities/webViewUtils/webViewActionTypes";
import withNetworkConnectivity from '../../higherOrderComponents/withNetworkConnectivity';
import {
    isEmptyString, isEmptyObject, isIos, configHaveContent, dimensions,
    getSplashImage
} from "../../../utilities/utilities";

const {WDIPaymentBridge} = NativeModules;
const dataBridge = NativeModules.WDIDataBridge;
const zipBridge = NativeModules.RNZipArchive;
import {Navigation} from 'react-native-navigation'
import * as Constants from 'Wadi/src/components/constants/constants';
import CustomActivityIndicator from "../authentication/customActivityIndicator/CustomActivityIndicator.native";

import DoodleScreen from './doodleScreen';
import WadiProgressBar from "../../../libs/WadiProgressBar";
import {strings} from '../../../utilities/uiString';
import {fallBackActions} from "../../../actions/fallBackActions";
import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import {setSelectedLanguage} from "../../../actions/configAPIActions";

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
var thisRef= null;
const loaderMargin = isIos()? 75 : 120;
const WEBVIEW_LOAD_TIMEOUT = isIos()?250:100;
const INITIAL_PROGRESS_VALUE = isIos()?0.7:0.9
const DEFAULT_DELAY = 8000;
const INCREMENTAL_PROGRESS = 0.00375;
var progressTimer = null;
class DoodleContainer extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            webViewLoadProgress:INITIAL_PROGRESS_VALUE,
            webViewLoaded:false,
            token: null,
            deepLinkObj: null,
            selectedCountry: {countryCode:"sa"},
            language: 'en',
            appState: AppState.currentState,
            latitude: null,
            longitude: null,
            userLocation: null,
            city: null,
            subLocality:null,
            isFirstLaunch:true
        };
        thisRef = this;
        this.handleOpenURL = this.handleOpenURL.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        getLoginToken()
            .then((token) => {

                if (!!token) {
                    this.setState({ token })
                }
            })
            .catch((err) => {

            });
        this.getIsfromCountrySelectionFlag().then(response => {
            if (!!response) {
                this.handleModalOpening(true)
            }
            else {
                this.handleModalOpening(false)
            }

        }).catch((err) => { //if unable to get country selection flag open location modal
            this.handleModalOpening(false)
        });
        alreadyMounted = true;
        this.handleDeepLinkEvents();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    }
    componentWillReceiveProps(nextProps) {
        if(this.props.configAPIReducer.selectedLanguage !== nextProps.configAPIReducer.selectedLanguage){
            this.stopLoaderWithDelay();
        }
    }

    componentWillUnmount() {
        applePayEventSubscription.remove();
        this.clearTimer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    clearTimer=()=>{
        if(progressTimer){
            clearInterval(progressTimer);
        }
    }
    handleDeepLinkEvents=()=>{
        Linking.addEventListener('url', this.handleOpenURL);
        setTimeout(()=>{
            Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    this.setState({deepLinkObj: {url}});
                }
            })
            .catch(err => {
            });
        }, 10)
    }

    setUserLanguage() {
        return new Promise((resolve, reject) => {
            prefs.getString('appLanguage').then((response) => {
                if (!!response && response.length > 0) {
                    strings.setLanguage(response);
                    this.props.setSelectedLanguage(response)
                    this.setState({
                        languageSelected: response
                    }, () => {
                        resolve(true)
                    });

                } else {

                    prefs.getString('systemLanguage').then((response) => {
                        strings.setLanguage(response);
                        this.props.setSelectedLanguage(response)
                        this.setState({
                            languageSelected: response
                        }, () => {
                            resolve(false)
                        })
                    });

                }
            });
        })
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            if (this.webview && this.webview.props && this.webview.props.source) {
                if (isEmptyString(this.webview.props.source.url)) {
                    dataBridge.resetApp();
                }
            }
        }
        this.setState({appState: nextAppState});
    }

    handleOpenURL = (event) => {
        if(this.state.webViewLoaded){
            WebViewHandler.speaker(event, webViewActionType.speaker.DEEP_LINK, this.webview)
        }
    };

    checkForDeepLink = () => {
        if (!!this.state.deepLinkObj) {
            this.handleOpenURL(this.state.deepLinkObj);
            this.setState({deepLinkObj: null})
        }
    };

    onMessage = (event) => {
        WebViewHandler.listener(event, this.webview, (message) => this.handleMessage(message), (updates)=>this.updateLocalState(updates))
    };

    getUserCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState(
                    {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude
                    })
            },
            (error) => {

            },
            {enableHighAccuracy: true, timeout: 20000},
        );

    }

    handleCountrySelection = (data) => {
        this.setState({
            selectedCountry: data.selectedCountry, 
            language: data.language
        }, () => {});
    }

    /**
     * not generic right now, need code refactoring
     */
    updateLocalState = (updates)=>{
        if(!isEmptyObject(updates)){
            let {language, city, longitude, latitude, subLocality}= updates
            if(language !== this.props.configAPIReducer.selectedLanguage){
                this.setState({
                    ...updates, 
                    webViewLoaded:false,
                    webViewLoadProgress:INITIAL_PROGRESS_VALUE
                }, ()=>this.stopLoaderWithDelay());
            }
        }
    }

    handleMessage(message) {
        if(message && message ==="WEBVIEW_DID_LOAD"){
            this.clearTimer();
            this.setState({
                    webViewLoadProgress:1,
            }, ()=> this.onWebViewLoad());
        }else if (message && message.language && message.selectedCountry) {
            this.setState({
                selectedCountry: message.selectedCountry, 
                language: message.language
            }, () => {
                 isIos() && this.webview.reload();
            })
        }
    }


    onWebViewLoad = ()=>{
        setTimeout(()=>{
            this.setState({
                webViewLoaded:true
            });
        }, WEBVIEW_LOAD_TIMEOUT);
        setTimeout(()=>{
            this.checkForDeepLink();
        }, 1000);
    }

    handleOpenLocationModal() {
        Navigation.showModal({
            screen: Constants.screens.GooglePlaces, // unique ID registered with Navigation.registerScreen
            title: 'Enter your location', // title of the screen as appears in the nav bar (optional)
            animationType: 'slide-up',
            backButtonHidden: true,
            navigatorButtons: {
                rightButtons: [
                    {
                        component: 'MapsBackButton',
                        id: 'closeButton'
                    }

                ]
            },
            navigatorStyle: {navBarTextColor: '#FFFFFF', navBarHeight: 1,},
            passProps: {
                callback: (latitude, longitude, userLocation, city, subLocality) => this.handleMapEvent(latitude, longitude, userLocation, city, subLocality),
                onLaunch: true
            },
            transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            overrideBackPress: true
        });
    }
    handleMapEvent = (latitude, longitude, userLocation, city,subLocality) => {
        this.setState({
            latitude: latitude,
            longitude: longitude,
            userLocation: userLocation,
            city: city,
            subLocality: subLocality
        }, () => this.stopLoaderWithDelay());
    };


    handleCitySelection() {
        if (!GLOBAL.CONFIG.isGrocery) return;
        Navigation.showModal({
            screen: Constants.screens.CitySelectionScreen, // unique ID registered with Navigation.registerScreen
            title: 'Select City For Delivery', // title of the screen as appears in the nav bar (optional)
            animationType: 'slide-up',
            backButtonHidden: true,
            navigatorButtons: {
                rightButtons: [
                    {
                        component: 'MapsBackButton',
                        id: 'closeButton'
                    }

                ]
            },
            navigatorStyle: { navBarTextColor: '#FFFFFF', navBarHeight: 1, },
            passProps: {
                callback: (city, latitude, longitude, subLocality, language) => this.handleCitySelectionCallBack(city, latitude, longitude, subLocality, language),
                onLaunch: true,

            },
            transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            overrideBackPress: true
        });
    }

    handleCitySelectionCallBack(city, latitude, longitude, subLocality, language) {
        this.setState({
            city:city,
            latitude:latitude,
            longitude:longitude,
            subLocality:subLocality,
            isFirstLaunch:false
        },()=> this.stopLoaderWithDelay());
    }

    /**
     * We are adding the timeout of 100ms in this so user can see bar filling from 90% to 100%
     *  but if webview did load and manual timeout happens at the same time then user will see progressbar fully filled.
     */
    
    stopLoaderWithDelay =(delay = DEFAULT_DELAY)=>{
            if(!this.state.webViewLoaded && isIos() && !!this.state.city){
                if(!progressTimer){
                    this.startProgressLoader();
                }
                // setTimeout(()=>{
                //     this.setState({
                //         webViewLoadProgress:1,
                //     }, ()=>{
                //         setTimeout(()=>{
                //             this.setState({
                //                 webViewLoaded:true,
                //             });
                //         }, 100);
                //     });
                // }, delay);
            }
    }

    startProgressLoader =()=>{
        progressTimer = setInterval(()=>{
            if(!this.props.loading){
                this.setState((prevState)=>{
                    return{
                        webViewLoadProgress:prevState.webViewLoadProgress+INCREMENTAL_PROGRESS
                    }
                }, ()=>{
                    if(this.state.webViewLoadProgress >=1){
                        setTimeout(()=>{
                            this.setState({
                                webViewLoaded:true,
                            });
                        }, 100);
                        this.clearTimer();
                    }
                })
            }
        }, 100);
    }


    handleModalOpening(fromCountrySelection) {
        this.setUserLanguage().then((response)=>{
            if(response){
                this.setState({
                    isFirstLaunch:false
                })
                GLOBAL.CONFIG.isGrocery ? (fromCountrySelection?this.resetCountrySelectionFlag().then(res=>{}): this.showOrSaveCity()) : ''
            }
            else{
                this.handleCitySelection()
            }

        })
    }

    showOrSaveCity() {
        this.fetchSavedCity().then(response=>{
            if(response!==null && response.city){
                this.setState({
                    ...response,
                }, this.stopLoaderWithDelay);
            }
            else{
                this.handleCitySelection()
            }
        }).catch(error=>{
            this.handleCitySelection()

        })

    }
    fetchSavedCity = async () => {
        try {
            const userSelectedCity = await AsyncStorage.getItem('userSelectedCity');
            const longitude = await AsyncStorage.getItem('longitude');
            const latitude = await AsyncStorage.getItem('latitude');
            const subLocality = await AsyncStorage.getItem('subLocality');
            return { city: userSelectedCity, longitude, latitude, subLocality }
        }
        catch (error) {
            return null;
        }
    }



    resetCountrySelectionFlag=async()=> { //the app got opened from country selection so we have to reset the flag so during next launch location modal comes up
        try {

            await AsyncStorage.setItem('fromCountrySelection', "0");
            const latitude = await AsyncStorage.getItem('latitude')
            const longitude = await AsyncStorage.getItem('longitude')
            const city = await AsyncStorage.getItem('userSelectedCity')
            const subLocality = await AsyncStorage.getItem('subLocality')
            this.handleCitySelectionCallBack(city,latitude,longitude,subLocality, this.state.language)
            return true

        } catch (error) { //if some error happens while fetching the user location parameter open location modal
            this.showOrSaveCity();
            return false

        }
    }

    getIsfromCountrySelectionFlag=async()=> {
        try {
            const fromCountrySelection= await AsyncStorage.getItem('fromCountrySelection')
            if(fromCountrySelection=="1") //dont show location modal as app got restarted from settings tab
            {
                return true
            }
            else{ // normal flow; show location modal
                return false
            }


        }catch (error) { //incase of error show location modal
            return false

        }
    }

    handleBackButton() {
        if (!this.webview) {
            return true;
        }
        this.webview.goBack();
        return true;
    }

    setWebViewRefs =(webViewRef)=>{
        if (!webViewRef) {
            return;
        }
        this.webview = webViewRef;
    }

    render() {
        let { loading,downloadProgress, port} = this.props;
        let {webViewLoaded, isFirstLaunch, webViewLoadProgress} = this.state;

        let jsCodeObj = {
                cookie: (!!this.state && !!this.state.token) ? `${this.state.token}` : "",
                platform: Platform.OS,
                selectedCountry: this.state.selectedCountry ? this.state.selectedCountry : '',
                language: this.props.configAPIReducer.selectedLanguage,
                latitude: this.state.latitude ? this.state.latitude : '',
                longitude: this.state.longitude ? this.state.longitude : '',
                userLocation: this.state.userLocation ? this.state.userLocation : '',
                city: this.state.city ? this.state.city : '',
                subLocality: this.state.subLocality ? this.state.subLocality : ''
            },
            headers = {};

        let cookieToSend = ''
        if (!!this.state && !!this.state.token) {
            headers['cookie'] = `identity=${this.state.token}`;
            cookieToSend = this.state.token;
        }
        let deviceId, appVersion
        if (this.props.accounts && this.props.accounts.deviceInfo) {
            let {deviceInfo} = this.props.accounts
            deviceId = isIos() ? deviceInfo.deviceID : deviceInfo.deviceId;
            appVersion = deviceInfo.appVersionName ? deviceInfo.appVersionName : '';
        }



       
            let url = isIos() ? "http://127.0.0.1:" + port + "/doodle/index.html?lang=" + this.props.configAPIReducer.selectedLanguage + "&country=" + this.state.selectedCountry.countryCode + "&cookie=" + cookieToSend + "&latitude=" + jsCodeObj.latitude + "&longitude=" + jsCodeObj.longitude + "&userLocation=" + jsCodeObj.userLocation + "&city=" + jsCodeObj.city + "&subLocality=" + jsCodeObj.subLocality + "&unique_id=" + deviceId + "&appVersion=" + appVersion :
                "http://localhost:8080/?lang=" + jsCodeObj.language + "&country=" + jsCodeObj.selectedCountry.countryCode + "&cookie=" + jsCodeObj.cookie + "&latitude=" + jsCodeObj.latitude + "&longitude=" + jsCodeObj.longitude + "&userLocation=" + jsCodeObj.userLocation + "&city=" + jsCodeObj.city + "&subLocality=" + jsCodeObj.subLocality + "&unique_id=" + deviceId + "&appVersion=" + appVersion;
            return (
                <View style={styles.mainContainerView}>
                    {(!!jsCodeObj.city && !!deviceId && !loading) &&
                    <DoodleScreen
                        url={url}
                        onMessage={this.onMessage}
                        headers={headers}
                        setWebViewRefs={this.setWebViewRefs}/>
                    }

                    {!webViewLoaded &&
                    <View style={styles.splashContainer}>
                        <Image style={{
                            height: dimensions.height, width: dimensions.width,
                            flex: 1
                        }}
                               source={getSplashImage()}
                               resizeMode={'cover'}>
                        </Image>
                        {!isFirstLaunch && <View style={styles.loaderContainer}>
                            <View style={styles.loaderMargin}>
                                <WadiProgressBar progress={!loading?webViewLoadProgress:downloadProgress}/>
                            </View>
                            <Text style={styles.splashText}>{strings.splashText}</Text>
                        </View>}
                    </View>}
                </View>
            )

    }


    hideSplash() {
       isIos()&& dataBridge.hideSplash();
    }
}

const styles = StyleSheet.create({
        mainContainerView: {
            flex: 1,
            backgroundColor:'transparent',
        },
        loaderContainer: {
            position: 'absolute',
            bottom: isIos() ? (dimensions.height / 2) - 40 : 240,
            width: '100%',
            backgroundColor: 'transparent'
        },
        loaderMargin: {
            marginLeft: loaderMargin,
            marginRight: loaderMargin,
        },
        splashContainer: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        splashText:{
            marginTop: 10,
            fontSize: 15,
            color: GLOBAL.COLORS.lightGreyColor,
            textAlign: 'center'
        }
    },
);


function mapStateToProps(state) {
    return {
        configAPIReducer: state.configAPIReducer,
        accounts: state.accounts,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //add your action creators right here
        setSelectedLanguage: (selectedLanguage) => dispatch(setSelectedLanguage(selectedLanguage)),
    }
}
const DoodleWithNetwork = withNetworkConnectivity(DoodleContainer);
DoodleWithNetwork.navigatorStyle = DoodleContainer.navigatorStyle;
export default connect(mapStateToProps, mapDispatchToProps)(DoodleWithNetwork)