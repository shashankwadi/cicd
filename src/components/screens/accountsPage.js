import React, {Component} from 'react';
import {
    FlatList, I18nManager,
    Image,
    Linking,
    NativeEventEmitter,
    NativeModules,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from '../../utilities/constants';

import images from 'assets/images';
import {dimensions} from '../../utilities/utilities';
import {strings} from '../../utilities/uiString';
import {logoutUser, toggleLoginModal} from '../../actions/accountActions';
import {navigateAction} from '../../actions/navigatorAction';
import {connect} from 'react-redux';
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {getDeviceInfo} from 'Wadi/src/utilities/sharedPreferences';
import deeplinkHandler from "../../utilities/managers/deeplinkHandler";
import codePush from "react-native-code-push";

const { WDIPaymentBridge } = NativeModules;
const applePayEmitter = new NativeEventEmitter(WDIPaymentBridge);

const CURRENT_SCREEN = Constants.AccountsPage;
const subscription = applePayEmitter.addListener(
    'onUserAuthorize',
    (paymentResponse) => console.log('apple payyy' + JSON.stringify(paymentResponse))
);

class AccountsPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            codePushVersion: ''
        }
        codePush.getUpdateMetadata().then((metadata) => {

            codePushVersion = '' + metadata.appVersion + '-' + metadata.label;
            this.setState({
                codePushVersion: codePushVersion
            })

        })
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    dataForList = () => {
        return [
            {
                key: this.props.currentState.loggedIn ? strings.MyAccount : strings.SignIn,
                image: images.signInIcon
            },
            {
                key: strings.TrackOrder,
                image: images.trackIcon
            },
            {
                key: strings.SendFeedback,
                image: images.feedbackIcon

            },
            {
                key: strings.RateApp,
                image: images.rateIcon

            },
            {
                key: strings.Country,
                image: images.settingsIcon

            },
            {
                key: 'Home-v2',
                image: images.settingsIcon

            },
            {
                key: 'Version ' + this.state.codePushVersion,
                image: images.settingsIcon

            }
        ]
    };
    loggedInDataForList = () => {
        return [
            {
                key: `${strings.Welcome} ${this.props.currentState.userData.firstName}`,
                image: images.signInIcon
            },
            {
                key: strings.TrackOrder,
                image: images.trackIcon
            },
            {
                key: strings.MyWallet,
                image: images.walletIcon

            },
            {
                key: strings.MyOrders,
                image: images.orderIcon

            },
            // {
            //     key: strings.AddressBook,
            //     image: images.settingsIcon
            //
            // },
            // {
            //     key: strings.CreditCardScreen,
            //     image: images.settingsIcon
            //
            // },
            {
                key: strings.SendFeedback,
                image: images.feedbackIcon

            },
            {
                key: strings.RateApp,
                image: images.rateIcon

            },
            {
                key: strings.Country,
                image: images.settingsIcon

            },
            {
                key: strings.Logout,
                image: images.logoutIcon

            },
            {
                key: 'Home-v2',
                image: images.settingsIcon

            },
            {
                key: 'Version ' + this.state.codePushVersion,
                image: images.settingsIcon

            }
        ]
    };


    componentWillUnmount() {
        //subscription.remove();
    }

    rowPressed = (item) => {

        switch (item.key) {
            case strings.SignIn:
                /*this.props.navigation.navigate('Home');*/
                this.props.toggleLoginModal(this.props.navigator, null);
                break;
            case strings.Logout:
                this.props.logoutUser();
                break;
            case strings.Country:
                this.moveToScreen(Constants.screens.CountryView);
                //this.props.navigation.navigate(Constants.screens.Country);
                break;
            case strings.MyOrders:
                //this.moveToScreen(Constants.screens.Language);
                //this.props.navigation.navigate('AccountsWebView', {url: 'https://my.wadi.com/orders'});  //need to change if it is not coming in feature map api url - read this from feature map api response
                this.moveToScreen(Constants.screens.MyOrders);
                break;
            case strings.MyWallet:
                this.moveToScreen(Constants.screens.AccountsWebView,{url: "https://my.wadi.com/wallet"});
                //this.moveToScreen(Constants.screens.Language);
                //this.props.navigation.navigate('Wallet'); //need to change if it is not coming in feature map api url - read this from feature map api response
                //this.moveToScreen(Constants.screens.Wallet);
                break;
            case strings.TrackOrder:
                deeplinkHandler(this.props.navigator, 'https://track.wadi.com/', "Track Order", null, params = {url: "https://track.wadi.com/"});
                // this.props.navigation.navigate('AccountsWebView', { url: "https://track.wadi.com/" }); //need to change if it is not coming in feature map api url - read this from feature map api response
                break;
            case strings.Language:
                this.moveToScreen(Constants.screens.Language);
                //this.props.navigation.navigate(Constants.screens.Language);
                break;
            case strings.RateApp:

                rateAppPressed();
                break;
            case strings.SendFeedback:
                this.sendFeedbackPressed();
                break;
            case strings.AddressBook:
                this.moveToScreen(Constants.screens.AddressPage);
                break;
            case strings.CreditCardScreen:
                this.moveToScreen(Constants.screens.CreditCardScreen);
                break;
            case 'Home-v2':
                this.moveToScreen(Constants.screens.MockableHome);
                break;
            case strings.ApplePay:
                WDIPaymentBridge.initiateApplePay({

                    "paymentData": {
                        'currencyCode': 'USD',
                        'countryCode': 'US',
                        'paymentParams': [
                            {
                                'key': 'Wadi',
                                'value': '20',
                                'country': 'US',
                                'currency': 'USD'

                            }
                        ]

                    }
                });
                default:
        }
    }

    moveToScreen = (screenName, params = {}) => {
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: Constants.screens.Category,
            toScreen: screenName,
            params: params
        });
    }



    sendFeedbackPressed() {
        getDeviceInfo()
            .then((result) => {

                Linking.openURL('mailto:apps@wadi.com?subject="App feedback"&body=' + "" +
                    "Device Info - \n" +
                    "Device ID: " + result.deviceID + "\n" +
                    "Device Name: " + result.manufacturer + " " + result.model + "\n" +
                    "OS Version: " + result.osVersion + "\n" +
                    "Network Type: " + result.networkType + "\n" +
                    "Operator: " + result.operatorName + "\n" +
                    "App Version: " + result.appVersionName + "\n\n\n");
            });
    }

    render() {
        return (
            <ScrollView style={styles.containerView}>
                <FlatList style={styles.list}
                          data={this.props.currentState.loggedIn ? this.loggedInDataForList() : this.dataForList()}
                          scrollEnabled={false}
                          removeClippedSubviews={false}
                          ItemSeparatorComponent={this.renderSeparator}
                          renderItem={({item}) => (
                              <View>
                                  <TouchableOpacity activeOpacity={1} style={styles.itemContainer}
                                                    onPress={() => this.rowPressed(item)}>
                                      <Image source={item.image} style={styles.image}></Image>
                                      <Text style={styles.item}>{item.key}</Text>
                                  </TouchableOpacity>
                                  <View style={{height: .5, backgroundColor: '#efeff2'}}></View>
                              </View>
                          )}>
                </FlatList>
            </ScrollView>
        )
    }
}

export function rateAppPressed() {
    let url=''

    if (Platform.OS === 'android') {
        if(GLOBAL.CONFIG.isGrocery)
            url=GLOBAL.API_URL.WADI_GROCERY_ANDROID_LINK
        else
            url=GLOBAL.API_URL.WADI_MAIN_ANDROID_LINK
    } else {
        if(GLOBAL.CONFIG.isGrocery)
            url=GLOBAL.API_URL.WADI_GROCERY_IOS_LINK
        else
            url=GLOBAL.API_URL.WADI_GROCERY_IOS_LINK

    }
    Linking.openURL(url)
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1
    },
    item: {
        flex: 0.86,
        color: 'black',
        textAlign: 'left',
        alignItems:'center',
        fontFamily: GLOBAL.FONTS.default_font,
        paddingTop:2,
    },
    image: {
        flex: 0.14,
        height: 17,
        resizeMode: 'contain',
    },
    list: {
        marginTop: 20,
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        height: 50,
        width: dimensions.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
});


function mapStateToProps(store) {
    return {
        currentState: store.accounts
    }

}

function mapDispatchToProps(dispatch) {
    return {

        //toggle login modal
        toggleLoginModal: (propsNavigation, toScreen = null) => dispatch(toggleLoginModal(propsNavigation, toScreen)),
        logoutUser: () => dispatch(logoutUser()),

        /*navigate Action imported*/
        navigateAction: (routeName, params) => dispatch(navigateAction(routeName, params)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)