import React, {Component} from 'react';
import {NativeModules, StyleSheet, View, Linking, Platform, WebView, NativeEventEmitter,SafeAreaView,Text, AppState,AsyncStorage} from 'react-native';
import WKWebView from 'react-native-wkwebview-reborn';
import {connect} from "react-redux";
import * as GLOBAL from '../../utilities/constants';
import RNFetchBlob from "react-native-fetch-blob";
import UserHandler from "../../utilities/managers/userHandler";
import ApiHandler from "../../utilities/ApiHandler";
import {isEmptyString, isEmptyObject} from "../../utilities/utilities";
import {WebViewHandler} from '../../utilities/webViewUtils';
import {getLoginToken} from 'Wadi/src/utilities/sharedPreferences';
import {webViewActionType} from "../../utilities/webViewUtils/webViewActionTypes";
import withNetworkConnectivity from '../higherOrderComponents/withNetworkConnectivity';

const {WDIPaymentBridge} = NativeModules;
const dataBridge = NativeModules.WDIDataBridge;
const zipBridge = NativeModules.RNZipArchive;
import {Navigation} from 'react-native-navigation'
import * as Constants from 'Wadi/src/components/constants/constants';
import CustomActivityIndicator from "./authentication/customActivityIndicator/CustomActivityIndicator.native";
import { configHaveContent } from '../../utilities/utilities';

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

class DoodleContainerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webViewLoaded:false,
            isDocumentsDirectory: false,
            port: 8080,
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
        };
        thisRef = this;
        this.handleOpenURL = this.handleOpenURL.bind(this);

    }

    componentWillMount() {
        getLoginToken()
            .then((token) => {

                if (!!token) {
                    this.setState({token})
                }
            })
            .catch((err) => {

            });

        UserHandler.getBundleUpdateStatus()
        .then(bundleUpdateStatus=>{
            this.setState({
                //isFirstLaunch: false,
                isDocumentsDirectory: !!bundleUpdateStatus,
                port: !!bundleUpdateStatus?8082:8080
            }, ()=>this.setWebUrl());
        })
        .catch((error)=>{
            this.setState({
                isFirstLaunch: true,
                port: 8080,
                isDocumentsDirectory: false,
                //url: "/android_asset/v2/index.html",
            }, ()=>this.setWebUrl());
            
        });
    }

    componentDidMount() {
        /**
         * reference to bug - https://github.com/wix/react-native-navigation/issues/2928, https://github.com/wix/react-native-navigation/issues/1212
         * Due to some unknown bug 1st screen with react-native-navigation is mounted twice and hence every function within component-life-cycle is called twice,
         * this beheviour causing serious issues with country picker and location picker so we have added following checks(hacks) for countering that bug
         * 1)check if we have config data in didMount, if not moveout from here (red flag)
         * 2)check if it we have selected country, if not show modal
         * 3)check if didMount called for second time, if yes so location modal else move out from here (red flag)
         */
        // if(!this.props.configAPIReducer.selectedCountry){
            this.getIsfromCountrySelectionFlag().then(response =>{
                if(!!response){
                    this.handleModalOpening(true)
                }
                else{
                    this.handleModalOpening(false)
                }
    
            }).catch((err) => { //if unable to get country selection flag open location modal
                this.handleModalOpening(false)
            });
        // }
        alreadyMounted = true;
        Linking.addEventListener('url', this.handleOpenURL);
        Linking.getInitialURL()
        .then((url) => {
            if (url) {
                this.setState({deepLinkObj: {url}});
            }
        })
        .catch(err => {
        });
        AppState.addEventListener('change', this._handleAppStateChange);

    }
    componentWillReceiveProps(nextProps) {
        if(this.props.configAPIReducer.selectedLanguage !== nextProps.configAPIReducer.selectedLanguage){
            this.setState({
                webViewLoaded:false
            }, ()=>this.stopLoaderWithDelay());
        }
    }

    componentWillUnmount() {
        applePayEventSubscription.remove();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    setWebUrl() {
        let webUrl = dataBridge.initiateServer(thisRef.state.isDocumentsDirectory, thisRef.state.port);
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

    render() {
        let jsCodeObj = {
                cookie: (!!this.state && !!this.state.token) ? `identity=${this.state.token}` : "",
                platform: Platform.OS,
                selectedCountry: this.state.selectedCountry ? this.state.selectedCountry : '',
                language: this.props.configAPIReducer.selectedLanguage,
                latitude: this.state.latitude ? this.state.latitude : '',
                longitude: this.state.longitude ? this.state.longitude : '',
                userLocation: this.state.userLocation ? this.state.userLocation : '',
                city: this.state.city ? this.state.city : '',
                subLocality:this.state.subLocality?this.state.subLocality:''
            },
            headers = {};

        let cookieToSend = ''
        if (!!this.state && !!this.state.token) {
            headers['cookie'] = `identity=${this.state.token}`;
            cookieToSend = this.state.token;
        }

        let devId = this.props.accounts.deviceInfo ? this.props.accounts.deviceInfo.deviceID : '' ;
        let appVersion = this.props.accounts.deviceInfo ? this.props.accounts.deviceInfo.appVersionName : '' ;

        if (jsCodeObj.city && this.props.accounts && this.props.accounts && this.props.accounts.deviceInfo && this.props.accounts.deviceInfo.deviceID) {
            let url = "http://127.0.0.1:" + this.state.port + "/doodle/index.html?lang=" + this.props.configAPIReducer.selectedLanguage+"&country=" + this.state.selectedCountry.countryCode + "&cookie=" + cookieToSend+ "&latitude=" + jsCodeObj.latitude + "&longitude=" + jsCodeObj.longitude + "&userLocation=" + jsCodeObj.userLocation + "&city=" + jsCodeObj.city+"&subLocality="+jsCodeObj.subLocality + "&unique_id=" + devId + "&appVersion=" + appVersion;

            return (
                <View style={styles.mainContainerView}>
                    <WKWebView
                        ref={ref => {
                            this.webview = ref;
                        }}
                        bounces={false}
                        source={{url: url}}
                        javaScriptEnabled={true}
                        scalesPageToFit={true}
                        sendCookies={true}
                        //injectedJavaScript={injectedJavaScript}
                        onMessage={this.onMessage.bind(this)}
                        headers={headers}
                        //onLoadEnd={this.checkForDeepLink.bind(this)}
                        allowsLinkPreview={false}
                    />
                    {!this.state.webViewLoaded && <CustomActivityIndicator/>}
                </View>
            )
        }
        else {
            return (<SafeAreaView style={{flex: 1}}>
                <CustomActivityIndicator/>
            </SafeAreaView>)
        }
    }

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
        this.setState({selectedCountry: data.selectedCountry, language: data.language}, () => {
            // this.webview.reload();
           // this.handleOpenLocationModal()
        })
    }

    /**
     * not generic right now, need code refactoring
     */
    updateLocalState = (updates)=>{
        if(!isEmptyObject(updates)){
            //this.setState(updates, ()=>this.stopLoaderWithDelay());
            //
            let {language, city, longitude, latitude, subLocality}= updates
            if(language !== this.props.configAPIReducer.selectedLanguage){
                this.setState(updates, ()=>this.stopLoaderWithDelay());
            }
        }
    }

    handleMessage(message) {
        if(message && message ==="WEBVIEW_DID_LOAD"){
            this.setState({
                    webViewLoaded:true
            }, ()=> this.onWebViewLoad());
        }else if (message && message.language && message.selectedCountry) {
            this.setState({selectedCountry: message.selectedCountry, language: message.language}, () => {
                this.webview.reload();
            })
        }
    }


    onWebViewLoad = ()=>{
        setTimeout(()=>{
            dataBridge.hideSplash();
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


    handleCitySelection(){
        if(!GLOBAL.CONFIG.isGrocery) return;
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
            navigatorStyle: {navBarTextColor: '#FFFFFF', navBarHeight: 1,},
            passProps: {
                callback: (city,latitude,longitude,subLocality, language) => this.handleCitySelectionCallBack(city,latitude,longitude, subLocality, language),
                onLaunch: true
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
        }, ()=>this.stopLoaderWithDelay());
}


    stopLoaderWithDelay =(delay = 4000)=>{
            if(!this.state.webViewLoaded){
                setTimeout(()=>{
                    this.setState({
                        webViewLoaded:true
                    })
                }, delay);
            }
    }


    handleModalOpening(fromCountrySelection) {
        // if (!!this.props.configAPIReducer.selectedLanguage && !!this.props.configAPIReducer.selectedCountry) {
        //     this.setState({
        //         selectedCountry: this.props.configAPIReducer.selectedCountry,
        //         language: this.props.configAPIReducer.selectedLanguage
        //     },() => {
        //         GLOBAL.CONFIG.isGrocery ? (fromCountrySelection?this.resetCountrySelectionFlag().then(res=>{
        //         }): this.showOrSaveCity()) : ''

        //     })
        // }
        if(!!this.props.configAPIReducer.selectedLanguage){
            GLOBAL.CONFIG.isGrocery ? (fromCountrySelection?this.resetCountrySelectionFlag().then(res=>{}): this.showOrSaveCity()) : ''
        }
        else {
            Navigation.showModal({
                screen: Constants.screens.CountryView, // unique ID registered with Navigation.registerScreen
                animationType: 'slide-up',
                backButtonHidden: true,
                navigatorStyle: { navBarTextColor: '#FFFFFF', navBarHeight: 1, },
                transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
                passProps: { callback: (data) => this.handleCountrySelection(data), isOnLaunch: true },
                overrideBackPress: true
            });
        }
    }

    showOrSaveCity() {
        this.fetchSavedCity().then(response=>{
            if(response!==null && response.city){
                this.setState(response, ()=>{this.stopLoaderWithDelay()});
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

    handleCitySelection(){
        if(!GLOBAL.CONFIG.isGrocery) return;
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
            navigatorStyle: {navBarTextColor: '#FFFFFF', navBarHeight: 1,},
            passProps: {
                callback: (city,latitude,longitude,subLocality, language) => this.handleCitySelectionCallBack(city,latitude,longitude,subLocality, language),
                onLaunch: true
            },
            transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            overrideBackPress: true
        });
    }

    resetCountrySelectionFlag=async()=> { //the app got opened from country selection so we have to reset the flag so during next launch location modal comes up
        try {

            await AsyncStorage.setItem('fromCountrySelection', "0");
            const latitude = await AsyncStorage.getItem('latitude')
            const longitude = await AsyncStorage.getItem('longitude')
            //const userLocation = await AsyncStorage.getItem('userSelectedPlace')
            const city = await AsyncStorage.getItem('userSelectedCity')
            const subLocality = await AsyncStorage.getItem('subLocality')
            // this.handleMapEvent(latitude, longitude, userLocation, city,subLocality)
            this.handleCitySelectionCallBack(city,latitude,longitude,subLocality, this.state.language)
            return true

        } catch (error) { //if some error happens while fetching the user location parameter open location modal
            //this.handleOpenLocationModal()
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

    handleCitySelectionCallBack(city, latitude, longitude, subLocality) {
        this.setState({
            city: city,
            latitude: latitude,
            longitude: longitude,
            subLocality: subLocality
        }, ()=>this.stopLoaderWithDelay())
    }



}

const styles = StyleSheet.create({
    mainContainerView: {
        flex: 1,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
    },

});


function mapStateToProps(state) {
    return {
        configAPIReducer: state.configAPIReducer,
        accounts: state.accounts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //add your action creators right here
    }
}
const DoodleWithNetwork = withNetworkConnectivity(DoodleContainerScreen);
export default connect(mapStateToProps, mapDispatchToProps)(DoodleWithNetwork)