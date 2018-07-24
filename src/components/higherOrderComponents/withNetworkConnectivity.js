'use strict';
import React, {Component} from 'react';
import {
    NativeModules,
    BackHandler,
    NetInfo,
    Linking,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal
} from 'react-native';


import COLORS from '../../utilities/namespaces/colors';
import * as GLOBAL from '../../utilities/constants';
import makeHttpRequest from '../../utilities/makeHttpRequest';
import {strings} from 'utilities/uiString';
import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import {fallBackActions} from "../../actions/fallBackActions";
import {checkAndStartBundleUpdate as _checkAndStartBundleUpdate} from '../../utilities/managers/backgroundTaskManager';
import UserHandler from '../../utilities/managers/userHandler';
import {isIos} from '../../utilities/utilities';

const dataBridge = NativeModules.WDIDataBridge;

const POLLING_ERROR_URL = 'https://api.wadi.com/sawa/hc';
const REQUEST_TIMEOUT = 2500;
const REQUEST_INTERVAL = 3000;
const FINAL_PROGRESS_VALUE = isIos()?0.70:0.9;

var connectivityCheckInterval = null;

const withNetWorkConnectivity = (WrappedComponent) => {
    return class extends Component {
        _handleBackWithNewtork = () => {
            if (this.state.isConnected) {
                return false;
            } else {
                return true
            }
        }
        _handleConnectionChange = (isConnected) => {
            if(!this.state.isConnected && isConnected && this.state.loading){
                this.initializeAppData(isConnected);
            }
            this.setState({isConnected: isConnected});
            
        }
        startPollingTimer = (requestInterval = REQUEST_INTERVAL, requestTimeout = REQUEST_TIMEOUT) => {
            clearTimeout(connectivityCheckInterval);        //clear previous timeout
            connectivityCheckInterval = setTimeout(this._checkInternetByPolling, requestInterval);      //start new timeout
        }
        _checkInternetByPolling = (timeout = REQUEST_TIMEOUT) => {
            makeHttpRequest({
                method: 'HEAD',
                url: POLLING_ERROR_URL,
                timeout: timeout,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
                .then((response) => {
                    this._handleConnectionChange(true)
                    this.startPollingTimer(REQUEST_INTERVAL);
                })
                .catch((error) => {
                    this._handleConnectionChange(false)
                    this.startPollingTimer(REQUEST_INTERVAL);
                });
        }
        initializeAppData = (isConnected = false) => {
            if (GLOBAL.CONFIG.enableMobileWeb) {
                this.checkAndStartBundleUpdate(isConnected);
            }
            fallBackActions.getInstance().fetchUserData(); // fetch user details from storage
            fallBackActions.getInstance().getUserSelectedCountry(); // fetch country details from storage
        }
        onBundleProgress = (completed) => {
            this.setState({
                downloadProgress: completed * FINAL_PROGRESS_VALUE,
                // loading: false,
            });
        }

        bundleStatusAndroid=()=> {
            UserHandler.getBundleUpdateStatus()
                .then(bundleUpdateStatus=>{
                    if(!!bundleUpdateStatus){
                        this.setState({
                            loading: false,
                            //url: RNFetchBlob.fs.dirs.DocumentDir + "/doodle/index.html"
                        });
                    }else{
                        this.setState({
                            loading: false,
                            //url: "/android_asset/v2/index.html",
                        });
                    }
                })
                .catch((error)=>{
                    this.setState({
                        loading: false,
                        //url: "/android_asset/v2/index.html",
                    });
                });
        }
        setWebUrl=()=> {
            if(isIos()){
                dataBridge.initiateServer(this.state.isDocumentsDirectory, this.state.port)
                .then(()=>{
                    this.setState({
                        loading:false
                    });
                });
            }
        }
    
        bundleStatusIos =()=> {
            UserHandler.getBundleUpdateStatus()
                .then(bundleUpdateStatus=>{
                    this.setState({
                        isDocumentsDirectory: !!bundleUpdateStatus,
                        port: !!bundleUpdateStatus?8082:8080
                    }, ()=>this.setWebUrl());
                })
                .catch((error)=>{
                    this.setState({
                        port: 8080,
                        isDocumentsDirectory: false,
                    }, ()=>this.setWebUrl());
                });
        }
        
        checkBundleStatus =()=>{
            isIos() ? this.bundleStatusIos() : this.bundleStatusAndroid();
        }

        checkAndStartBundleUpdate = async (isConnected = false) => {
            try {
                let bundleDownloadFinish = await _checkAndStartBundleUpdate(this.onBundleProgress);
                if (bundleDownloadFinish) {
                    //finish updates
                    if (bundleDownloadFinish === "NETWORK_ERROR") {
                        // this.setState({
                        //     //loading: false,
                        //     //downloadProgress: FINAL_PROGRESS_VALUE //TODO: add network check and revert it back to initial state
                        // });

                    } else if (bundleDownloadFinish !== "BUNDLE_UPDATES_FAILED") {
                        this.setState({
                            //loading: false,
                            downloadProgress: FINAL_PROGRESS_VALUE
                        });
                        this.checkBundleStatus();
                    }
                } else {
                    this.setState((prevState) => {
                        return {
                            //loading: false,
                            downloadProgress: FINAL_PROGRESS_VALUE
                        }
                    });
                    this.checkBundleStatus();
                    //no new updates or failed;
                }
            } catch (error) {
                this.setState((prevState) => {
                    return {
                        //loading: false,
                        downloadProgress: FINAL_PROGRESS_VALUE
                    }
                });
                this.checkBundleStatus();
            }
        };

        constructor(props) {
            super(props);
            this.state = {
                loading:true,
                isConnected: true,
                isVideoRunning: true,
                downloadProgress: 0.0,
                isDocumentsDirectory: false,
                port: 8080,
            }
            this._checkInternetByPolling = this._checkInternetByPolling.bind(this);
            this._retry = this._retry.bind(this);

        }

        componentWillMount() {
            this.setDeviceInfo();
        }

        componentDidMount() {
            this.initializeAppData();
            NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
            if (Platform.OS === 'android') {
                NetInfo.isConnected
                    .fetch()
                    .then(this._handleConnectionChange);
            }
            BackHandler.addEventListener('hardwareBackPress', this._handleBackWithNewtork);
            // this.startPollingTimer(1000);
        }

        componentWillUnMount() {
            NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
            //clearInterval(this.connectivityCheckInterval);
            clearTimeout(connectivityCheckInterval);
            BackHandler.removeEventListener('hardwareBackPress', this._handleBackWithNewtork);
        }

        _retry() {
            this.setState({
                isConnected: true
            }, () => {
                this.forceUpdate()
                setTimeout(() => {
                    NetInfo.isConnected.fetch().then(isConnected => {
                        this.setState({
                            isConnected: isConnected
                        }, this.forceUpdate());
                    });
                }, 250)
            })
        }

        setDeviceInfo() {
            prefs.getDeviceInfo().then((result) => {
                if (!!result) {
                    fallBackActions.getInstance().setDeviceInfo(result)

                }
            });
        }

        setUserLanguage() {
            return new Promise((resolve, reject) => {
                prefs.getString('appLanguage').then((response) => {
                    if (!!response && response.length > 0) {
                        strings.setLanguage(response);
                        fallBackActions.getInstance().setSelectedLanguage(response)
                        this.setState({
                            languageSelected: true
                        }, () => {
                            resolve(true)
                        });
                    } else {

                        prefs.getString('systemLanguage').then((response) => {
                            strings.setLanguage(response);
                            fallBackActions.getInstance().setSelectedLanguage(response)
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


        render() {
            return (
                <View style={{flex: 1}}>
                    <WrappedComponent {...this.props} {...this.state}/>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={!this.state.isConnected}
                        onRequestClose={() => {

                        }}>
                        <View style={styles.frontView}>
                            <Image source={require('../../icons/static_error_tv.gif')} style={styles.noNetWorkImg}/>
                            <TouchableOpacity onPress={this._retry}
                                              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                                <Image source={require('../../icons/networkError/reload.png')}
                                       style={styles.reloadButtonImage}/>
                                <Text style={[styles.msgText, styles.retryText]}>{strings.network_check_retry}</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>

            );
        }
    }
}

export default withNetWorkConnectivity;

const styles = StyleSheet.create({
    frontView: {
        position: 'absolute',
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
    },
    noNetWorkActionBtn: {
        backgroundColor: COLORS.wadiDarkGreen,
        padding: 10,
        margin: 10
    },
    noNetWorkTopView: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: COLORS.black,
        justifyContent: 'space-between',
        padding: 15
    },
    noNetWorkImg: {
        marginTop: 100,
        width: 150,
        height: 150
    },
    msgText: {
        color: COLORS.white,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 18,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    retryText: {paddingBottom: 5, marginTop: 10},

    loadingIndicator: {
        position: 'absolute',
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    reloadButtonImage: {
        alignSelf: 'center'
    }
})
