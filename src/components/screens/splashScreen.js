import React, {Component} from 'react';
import {connect} from 'react-redux'
import {fetchCart} from '../../actions/cartActions';
import {fetchUserDataStorage, fetchUserGroceryCity, fetchUserLocation, logoutUser, setDeviceInfo} from "../../actions/accountActions";

import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import {Alert, Image, Linking, NativeModules, Text, View} from 'react-native';
import {
    calculateSelectedCity,
    getConfig,
    getUserSelectedCountryFromStorage,
    setSelectedCountry,
    setSelectedLanguage
} from "../../actions/configAPIActions";
import {getFeatureMap} from "../../actions/featureMapAPIActions";
import images from 'assets/images';
import {dimensions, isDifferentObject, isEmptyString, isIos, screenManager} from '../../utilities/utilities';
import {strings} from 'utilities/uiString';
import {checkAndStartBundleUpdate as _checkAndStartBundleUpdate} from '../../utilities/managers/backgroundTaskManager';
import CountryView from '../../components/views/country/countryView';
import TrackingBridge from 'Wadi/src/tracking/trackingBridge';
import * as Constants from 'Wadi/src/components/constants/constants';
import {screens} from 'Wadi/src/components/constants/constants';
import deeplinkHandler, {setCurrentScreen} from 'Wadi/src/utilities/managers/deeplinkHandler';
import GooglePlaces from './googlePlaces'

import App from 'Wadi/src/components/navigators/tabbedApp';
import * as GLOBAL from '../../utilities/constants';
import {Navigation} from 'react-native-navigation'

import WadiProgressBar from 'Wadi/src/libs/WadiProgressBar.js';
import {rateAppPressed} from './accountsPage'

const dataBridge = NativeModules.WDIDataBridge;
const tracking = new TrackingBridge();

var isLoaded = false;

class SplashScreen extends Component {

    static navigatorStyle = {
        navBarHidden: true
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showLoader: false,
            languageSelected: true,
            isVideoRunning: GLOBAL.CONFIG.enableMobileWeb,
            downloadProgress: GLOBAL.CONFIG.enableMobileWeb?0:0.7,
            updateFlag:true, //for checking of update if mandatory update keep it true else make it false
        };
        this.onBundleProgress = this.onBundleProgress.bind(this);
        this.hidiNativeSplash();
        isLoaded=false;
    }

    componentWillMount() {
        this.setDeviceInfo();
        if(GLOBAL.CONFIG.enableMobileWeb){
            this.checkAndStartBundleUpdate();
        }

        this.props.fetchCart();
        if (GLOBAL.CONFIG.isGrocery) {
            this.props.fetchUserGroceryCity();
            this.props.fetchUserLocation();
        }
        this.props.fetchUserDataStorage(); // fetch user details from storage
        this.props.getUserSelectedCountryFromStorage(); // fetch country details from storage
        this.setUserLanguage()
        .then(response => {
            this.getFeatureMap();
        });
    }

    componentDidMount() {

        tracking.registerCustomProfileAttributes();
        Linking.addEventListener('url', this.handleOpenURL);
        if (!isIos()) {
            Linking.getInitialURL()
                .then((url) => {
                    if (url) {
                        this.props.saveInitialUrl(url);
                    }
                })
                .catch(err => {
                });
        }

    }

    componentWillReceiveProps(nextProps) {
        let {configAPIReducer} = nextProps;
        let {configAPIReducer: oldConfig} = this.props;

        if(isDifferentObject(configAPIReducer,oldConfig))
        {
            if(configAPIReducer&&configAPIReducer.configObj&&configAPIReducer.configObj.content){
                if( !!configAPIReducer.configObj.content.showUpdate) //IF update flag is set to true the show the update alert
                {
                    this.showUpdateAlert(configAPIReducer.configObj.content.mandatoryUpdate)
                }
                else{ //if update flag is false then just continue
                    this.setState({updateFlag:false})
                }
            }

        }
    }

    //Get DeviceId and set into state...
    setDeviceInfo() {

        prefs.getDeviceInfo().then((result) => {
            if(!!result) {
                this.props.setDeviceInfo(result);
            }
        });
    }

    showUpdateAlert(mandatoryUpdate) {

        Alert.alert(
            'Update',
            'Please Update your app for smoother experience',
            [
                !mandatoryUpdate&&{text: 'Ask me later', onPress: () => this.setState({updateFlag:false})},
                {text: 'Update', onPress: () => rateAppPressed()}, //takes user to update the app
            ],
            { cancelable: false }
        )
    }



    shouldComponentUpdate(nextProps, nextState) {
        return (this.state !== nextState);
    }

    componentWillUnmount() {
        //Linking.removeEventListener('url', this.handleOpenURL);
    }

    checkAndStartBundleUpdate = async () => {
        try {
            let bundleDownloadFinish = await _checkAndStartBundleUpdate(this.onBundleProgress);
            if (bundleDownloadFinish && bundleDownloadFinish !== "BUNDLE_UPDATES_FAILED") {
                //finish updates
                this.setState({
                    isVideoRunning: false
                });
            } else {
                this.setState((prevState)=>{
                    return{
                        isVideoRunning: false,
                        downloadProgress: prevState.downloadProgress + 0.7,
                    }
                });
                //no new updates or failed;
            }
        } catch (error) {
            this.setState((prevState)=>{
                return{
                    isVideoRunning: false,
                    downloadProgress: prevState.downloadProgress + 0.7,
                }
            });
        }
    };


    getFeatureMap =()=>{
        this.props.getFeatureMap()
        .then((res) => {
            if (res.status === 200) {
                this.setState((prevState)=>{
                    return{
                        downloadProgress: prevState.downloadProgress + 0.15,
                    }
                });
                this.getConfig();
            }
            else {
                this.showRetry(this.getFeatureMap);
            }
        })
        .catch((err) => {
            this.showRetry(this.getFeatureMap);
        })
        .done();
    };
    getConfig =()=>{
        this.props.getConfig()
        .then((res) => {
            if (res.status === 200) {
                this.props.calculateSelectedCity(); // calculate selected city and store it in redux
                this.setState((prevState)=>{
                    return{
                        loading: false,
                        downloadProgress: prevState.downloadProgress + 0.15,
                    }
                });
            }
            else {
                //console.log('error while fetching config');
                this.showRetry(this.getConfig);
            }
        })
        .catch((err) => {
            //console.log('error while fetching config', err);
            this.showRetry(this.getConfig);
        });
    };
    showRetry = (callBack)=>{
        if(callBack && typeof callBack === "function"){
            Alert.alert(
                "",
                strings.app_error,
                [
                    {text: strings.retry, onPress: () => callBack()},
                ],
                { cancelable: false }
            );
        }
    };



    onBundleProgress(completed) {
        this.setState((prevState)=>{
            return{
                downloadProgress: prevState.downloadProgress + (completed * 0.7),
            }
        });
    }

    updateProgress() {

    }
    handleOpenURL = (event) => {
        deeplinkHandler(this.props.navigator, event.url, null, null, null, true);
    };
    launchMainApp = () => {
        new App();
        return <View/>
    };

    setUserLanguage() {
        return new Promise((resolve, reject) => {
            prefs.getString('appLanguage').then((response) => {
                if (!!response && response.length > 0) {
                    this.setState({
                        languageSelected: true
                    }, () => {
                        resolve(true)
                    });
                    strings.setLanguage(response);
                    this.props.setSelectedLanguage(response)
                } else {

                    prefs.getString('systemLanguage').then((response) => {
                        strings.setLanguage(response);
                        this.props.setSelectedLanguage(response)
                    });
                    this.setState({
                        languageSelected: false
                    }, () => {
                        resolve(true)
                    })
                }
            });
        })
    }

    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        // dive into nested navigators
        if (route.routes) {
            return this.getCurrentRouteName(route);
        }

        return route.routeName;
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
            portraitOnlyMode: true,
            passProps: {languageSelected: this.state.languageSelected}
        });
        return <View/>
    };

    hidiNativeSplash() {

        if (isIos()) {
            dataBridge.hideSplash()
        }
    }

    render() {

        let {configAPIReducer} = this.props;

        let screenDataObj = {};
        if (configAPIReducer && configAPIReducer.selectedCountry) {
            screenDataObj.country_name = configAPIReducer.selectedCountry.name;
        }

        let loaderPositionBottom = isIos()? (dimensions.height/2)-40 : 240;
        let loaderMargin = isIos() ? 75 : 120;

        if (this.state.loading || this.state.isVideoRunning||this.state.updateFlag) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <Image style={{
                        height: dimensions.height, width: dimensions.width,
                        flex: 1
                    }}
                           source={getSplashImage()}
                           resizeMode={'cover'}>
                    </Image>
                    {GLOBAL.CONFIG.isGrocery && <View style={{
                        position: 'absolute',
                        bottom: loaderPositionBottom,
                        width: '100%',
                        backgroundColor: 'transparent'
                    }}>
                        <View style={{
                            marginLeft: loaderMargin,
                            marginRight: loaderMargin,
                        }}>

                            <WadiProgressBar
                                progress={this.state.downloadProgress}/>
                        </View>
                        <Text style={{marginTop:10,fontSize: 15,color:GLOBAL.COLORS.lightGreyColor,textAlign:'center'}}>{strings.splashText}</Text>
                    </View>}


                </View>
            )
        }

        else if (GLOBAL.CONFIG.enableMobileWeb) {
            this.hidiNativeSplash();
            if (!isLoaded) {
                isLoaded = true;
                return this.launchWebApp()
            } else {
                return <View />;
            }
        }
        else if (this.state.languageSelected == false
            && !!configAPIReducer.configObj.content
            && !!configAPIReducer.configObj.content.selectableCountries
            && configAPIReducer.configObj.content.selectableCountries.length > 0) {
            //This is for tracking app launch  when language is not set
            this.hidiNativeSplash();
            tracking.trackScreenVisit(Constants.screens.Country, screenDataObj);
            return (
                //<SafeAreaView style={{flex: 1}}>
                    <CountryView isOnLaunch={true} navigator={this.props.navigator}
                                 countryList={configAPIReducer.configObj.content.selectableCountries}/>
                //</SafeAreaView>
            )
        } else if (this.state.languageSelected == true
            && GLOBAL.CONFIG.isGrocery
            && !GLOBAL.CONFIG.enableMobileWeb) {

            this.hidiNativeSplash();
            return (<GooglePlaces navigator={this.props.navigator} launchMainApp={this.launchMainApp} onLaunch={true}/>)

        }
        this.hidiNativeSplash();
        if (!isLoaded) {
            isLoaded = true;
            return this.launchMainApp()
        } else {
            return <View/>;
        }
        //return <View/>


    }
}

function mapStateToProps(state) {
    return {
        //configObj: state.configAPIReducer.configObj,
        configAPIReducer: state.configAPIReducer,
        accounts: state.accounts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //dispatch,
        saveInitialUrl: (url) => dispatch({type: 'SAVE_INITIAL_DEEPLINK_URL', url: url}),
        updateCurrentScreen: (name) => dispatch({type: 'UPDATE_SCREEN_NAME', currentScreen: name}),
        fetchCart: (params) => dispatch(fetchCart(params)),
        fetchUserDataStorage: () => dispatch(fetchUserDataStorage()),
        logoutUser: () => dispatch(logoutUser()),
        getConfig: () => dispatch(getConfig()),
        getFeatureMap: () => dispatch(getFeatureMap()),
        setSelectedCountry: (selectedCountry) => dispatch(setSelectedCountry(selectedCountry)),
        setSelectedLanguage: (selectedLanguage) => dispatch(setSelectedLanguage(selectedLanguage)),
        getUserSelectedCountryFromStorage: () => dispatch(getUserSelectedCountryFromStorage()),
        calculateSelectedCity: () => dispatch(calculateSelectedCity()),
        fetchUserGroceryCity: () => dispatch(fetchUserGroceryCity()),
        fetchUserLocation: () => dispatch(fetchUserLocation()),
        setDeviceInfo: (deviceInfo) => dispatch(setDeviceInfo(deviceInfo))
    }
}

export const getSplashImage = () => {
    let splashName;
    if (isIos()) {
        if (dimensions.height == 812) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeniX_grocery : images.splashScreeniX
        } else if (dimensions.height == 736) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni6plus_grocery : images.splashScreeni6plus
        } else if (dimensions.height == 568) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni5_grocery : images.splashScreeni5
        } else if (dimensions.height == 480) {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni4_grocery : images.splashScreeni4
        } else {
            splashName = (GLOBAL.CONFIG.isGrocery) ? images.splashScreeni6_grocery : images.splashScreeni6
        }
    } else {
        if (!GLOBAL.CONFIG.isGrocery) {
            splashName = images.splashScreeni5;
        } else {
            splashName = images.splashGroceryAndroid
        }
    }

    return splashName
};
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
