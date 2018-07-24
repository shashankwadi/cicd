import React, {Component} from 'react';

import {
    AppState,
    BackHandler,
    Linking,
    NativeModules,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
    WebView,
    AsyncStorage
} from 'react-native';
import {getLoginToken} from 'Wadi/src/utilities/sharedPreferences';
import {connect} from "react-redux";
import * as GLOBAL from '../../utilities/constants';
import RNFetchBlob from "react-native-fetch-blob";
import UserHandler from "../../utilities/managers/userHandler";
import {WebViewHandler} from '../../utilities/webViewUtils';
import {webViewActionType} from "../../utilities/webViewUtils/webViewActionTypes";
import {Navigation} from 'react-native-navigation'
import * as Constants from 'Wadi/src/components/constants/constants';
import CustomActivityIndicator from "./authentication/customActivityIndicator/CustomActivityIndicator.native";
import { configHaveContent} from '../../utilities/utilities';
import {isEmptyObject} from "../../utilities/utilities";
import withNetworkConnectivity from '../higherOrderComponents/withNetworkConnectivity';


//const doodleJs = require('Wadi/src/doodle/test.html');

const dataBridge = NativeModules.WDIDataBridge;
var WebViewAndroid = require('react-native-webview-android');


class DoodleContainerScreen extends Component {

    static navigatorStyle = {
        navBarHidden: true
    };

    constructor(props) {
        super(props);
        this.state = {
            webViewLoaded: false,
            url: '',
            isFirstLaunch: true,
            token: null,
            deepLinkObj: null,
            selectedCountry: {countryCode:"sa"},
            language: 'en',
            latitude: null,
            longitude: null,
            userLocation: null,
            city: null,
            appState: AppState.currentState,
            subLocality:null
        };
        this.handleBackButton = this.handleBackButton.bind(this);
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
            if(!!bundleUpdateStatus){
                this.setState({
                    isFirstLaunch: false,
                    url: RNFetchBlob.fs.dirs.DocumentDir + "/doodle/index.html"
                });
            }else{
                this.setState({
                    isFirstLaunch: true,
                    url: "/android_asset/v2/index.html",
                });
            }
        })
        .catch((error)=>{
            this.setState({
                isFirstLaunch: true,
                url: "/android_asset/v2/index.html",
            });
        });
    }

    componentDidMount() {
        // if (!configHaveContent(this.props.configAPIReducer)) {
        //     return true;
        // }
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
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        //AppState.addEventListener('change', this._handleAppStateChange);
        Linking.addEventListener('url', this.handleOpenURL);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.configAPIReducer.selectedLanguage !== nextProps.configAPIReducer.selectedLanguage){
            this.setState({
                webViewLoaded:false
            });
        }
    }

    componentWillUnmount() {
        //AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleModalOpening(fromCountrySelection) {
        // if (!!this.props.configAPIReducer.selectedLanguage && !!this.props.configAPIReducer.selectedCountry) {
        //     this.setState({
        //         selectedCountry: this.props.configAPIReducer.selectedCountry,
        //         language: this.props.configAPIReducer.selectedLanguage
        //     }, () => {
        //         GLOBAL.CONFIG.isGrocery ? (fromCountrySelection ? this.resetCountrySelectionFlag().then(res => {

        //         }) : this.showOrSaveCity()) : ''

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

    resetCountrySelectionFlag = async () => { //the app got opened from country selection so we have to reset the flag so during next launch location modal comes up
        try {
            await AsyncStorage.setItem('fromCountrySelection', "0");
            const latitude = await AsyncStorage.getItem('latitude')
            const longitude = await AsyncStorage.getItem('longitude')
            //const userLocation = await AsyncStorage.getItem('userSelectedPlace')
            const city = await AsyncStorage.getItem('userSelectedCity')
            const subLocality = await AsyncStorage.getItem('subLocality')
            this.handleCitySelectionCallBack(city,latitude,longitude,subLocality, this.state.language)
            //this.handleMapEvent(latitude, longitude, userLocation, city, subLocality)
            return true
        } catch (error) { //if some error happens while fetching the user location parameter open location modal
            //this.handleOpenLocationModal();
            this.showOrSaveCity();
            return false

        }
    }

    getIsfromCountrySelectionFlag = async () => {
        try {
            const fromCountrySelection = await AsyncStorage.getItem('fromCountrySelection')
            if (fromCountrySelection == "1") //dont show location modal as app got restarted from settings tab
            {
                return true
            }
            else { // normal flow; show location modal
                return false
            }
        } catch (error) { //incase of error show location modal
            return false
        }
    }


    handleOpenURL = (event) => {
        WebViewHandler.speaker(event, webViewActionType.speaker.DEEP_LINK, this.webview)
    };
    handleCountrySelection = (data) => {
        this.setState({
            selectedCountry: data.selectedCountry,
            language: data.language
        }, () => {});
    };

    handleMapEvent = (latitude, longitude, userLocation, city,subLocality) => {
        this.setState({
            latitude: latitude,
            longitude: longitude,
            userLocation: userLocation,
            city: city,
            subLocality: subLocality
        }, () => {});

    };
    checkForDeepLink = () => {
        if (this.props.firtsLaunch && this.props.firtsLaunch.url) {
            setTimeout(() => {
                this.handleOpenURL({url: this.props.firtsLaunch.url});
                this.props.firtsTimeLaunch();
            }, 1000);
        }
    };
    onMessage = (event) => {
        WebViewHandler.listener(event, this.webview, (message) => this.handleMessage(message), (updates)=>this.updateLocalState(updates))
    };
    onWebViewLoad = () => {
        //dataBridge.hideSplash();
        this.checkForDeepLink();
    };

    /**
     * implement this method for app state change
     */
    _handleAppStateChange = async (nextAppState) => {
        try{
            if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
                let bundleUpdateStatus = await UserHandler.getBundleUpdateStatus();
                if(!!bundleUpdateStatus){
                    //reload webview and set bundle update status to false
                    this.setState({
                        webViewLoaded:false,
                        url:RNFetchBlob.fs.dirs.DocumentDir + "/doodle/index.html"
                    },
                    ()=>{
                        this.webview.reload();
                    });
                    UserHandler.setBundleUpdateStatus(false);
                }
            }
        }catch(error){

        }
        this.setState({appState: nextAppState});
    }

    handleBackButton() {
        /*
            To fix webview.goBack() crash.
            Reference: https://stackoverflow.com/a/48640365/9821453
         */
        if (!this.webview) {
            return true;
        }
        this.webview.goBack();
        return true;
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
                this.setState(updates);
            }
        }
    }
    handleMessage(message) {
        if (message && message === "WEBVIEW_DID_LOAD") {
            this.setState({
                webViewLoaded: true
            }, () => this.onWebViewLoad());
        } else if (message && message.language && message.selectedCountry) {
            this.setState({
                    selectedCountry: message.selectedCountry,
                    language: message.language
            }, () => {});
        }
    }

    handleOpenLocationModal() {
        if(!GLOBAL.CONFIG.isGrocery) return;
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
                callback: (latitude, longitude, userLocation, city,subLocality) => this.handleMapEvent(latitude, longitude, userLocation, city,subLocality),
                onLaunch: true
            },
            transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            overrideBackPress: true
        });
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
                callback: (city,latitude,longitude,subLocality, language) => this.handleCitySelectionCallBack(city,latitude,longitude, subLocality, language),
                onLaunch: true
            },
            transparent: false,// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            overrideBackPress: true
        });
    }

    render() {
        let jsCodeObj = {
                cookie: (!!this.state && !!this.state.token) ? this.state.token : "",
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

        let deviceId = this.props.accounts.deviceInfo ? this.props.accounts.deviceInfo.deviceId : '' ;
        let appVersion = this.props.accounts.deviceInfo ? this.props.accounts.deviceInfo.appVersionName : '' ;

        if (this.state.url && this.state.url !== '' && jsCodeObj.city && this.props.accounts && this.props.accounts.deviceInfo && deviceId) {
            return (
                <View style={styles.mainContainerView}>
                    <WebView
                        ref={ref => {
                            if (!ref) {
                                return;
                            }
                            this.webview = ref;
                        }}
                        javaScriptEnabled={true}
                        geolocationEnabled={false}
                        builtInZoomControls={false}
                        onNavigationStateChange={this.onNavigationStateChange}
                        onMessage={this.onMessage.bind(this)}
                        source={{uri: "http://localhost:8080?lang=" + jsCodeObj.language + "&country=" + jsCodeObj.selectedCountry.countryCode + "&cookie=" + jsCodeObj.cookie + "&latitude=" + jsCodeObj.latitude + "&longitude=" + jsCodeObj.longitude + "&userLocation=" + jsCodeObj.userLocation + "&city=" + jsCodeObj.city + "&subLocality=" + jsCodeObj.subLocality + "&unique_id=" + deviceId + "&appVersion=" + appVersion}}
                        style={{flex: 1}}
                        disableCookies={false}
                        headers={headers}
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

    handleCitySelectionCallBack(city, latitude, longitude, subLocality, language) {
            this.setState({
                city:city,
                latitude:latitude,
                longitude:longitude,
                subLocality:subLocality,
                language:language
            })
    }


    showOrSaveCity() {
        this.fetchSavedCity().then(response=>{
            if(response!==null && response.city){
                this.setState(response, ()=>{});
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

}

const styles = StyleSheet.create({
    mainContainerView: {
        flex: 1,
        //backgroundColor: GLOBAL.COLORS.wadiDarkGreen
    },

});


function mapStateToProps(state) {
    return {
        configAPIReducer: state.configAPIReducer,
        firtsLaunch: state.firtsLaunch,
        accounts: state.accounts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //add your action creators right here,
        firtsTimeLaunch: () => dispatch({type: 'FIRST_TIME_LAUNCH'}),

    }
}

const DoodleWithNetwork = withNetworkConnectivity(DoodleContainerScreen);
DoodleWithNetwork.navigatorStyle = DoodleContainerScreen.navigatorStyle;
export default connect(mapStateToProps, mapDispatchToProps)(DoodleWithNetwork)



