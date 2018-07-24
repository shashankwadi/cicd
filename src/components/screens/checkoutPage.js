import React, {Component} from 'react';
import {Cookie, Platform, StyleSheet, View, WebView} from 'react-native';
import {connect} from 'react-redux';
import {dimensions, isIos} from 'utilities/utilities';
//import {CartActions} from '../../reducers/cart';
import {checkoutStep2, orderSuccess, trackCheckoutEvent} from '../../actions/cartActions';
import {addCommonHeaders} from "../../utilities/ApiHandler";
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {screens} from '../constants/constants';
import TrackingEnum from '../../tracking/trackingEnum';
import WadiWebView from "../../libs/WadiWebView";
import {removeTempNumberAfterCheckout} from "../../actions/accountActions";
import {deepLinkActions} from "../../actions/globalActions";

var pageNumber = 1;
var receivedPage = 0;
var thisRef;
let urls = [];
const CURRENT_SCREEN = screens.Checkout;
let checkoutOptionData, trackOrderData, orderPaymentData;
export class CheckoutPage extends Component {
    static navigatorStyle = {
        tabBarHidden: true,
    };

    constructor(props) {
        super(props);
        thisRef = this;
        this.state = {
            selectedTab: 'redTab',
            isNavigated: false,
            orderPlaced: false,
            message: "",
            callbackUrl: "",
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    }


    onNavigatorEvent(event) {
        switch(event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                console.log('hi');
                this.props.removeTempNumberAfterCheckout();
                break;
            case 'willCommitPreview':
                break;
        }
    }



    onShouldStartLoadWithRequest(event) {
        currentEvent = event;
        let requestString = currentEvent.url.toLowerCase();
        if (requestString.includes('wadi://') == true) {
            return false;
        } else {
            return true;
        }
    }

    onNavigationStateChange = (event) => {
        let {url} = event;
        if (url && this.state.callbackUrl !== url) {
            let message = "", orderPlaced = false, eventType = "";

            if (url.includes(GLOBAL.API_URL.CHECKOUT_SUCCESS)) {
                eventType = GLOBAL.API_URL.CHECKOUT_SUCCESS;
                //order placed successfully
                message = "Order Placed successfully";
                orderPlaced = true;
                this.trackCheckoutEvent(url, eventType);
                this.handleShopping();
            } else if (url.includes(GLOBAL.API_URL.CHECKOUT_TRACKORDER)) {
                eventType = GLOBAL.API_URL.CHECKOUT_TRACKORDER;
                this.trackCheckoutEvent(url, eventType);
                this.trackCheckoutEvent(url, GLOBAL.API_URL.CHECKOUT_SUCCESS_PAYMENT);
                this.trackCheckoutEvent(url, GLOBAL.API_URL.CHECKOUT_TRACK_CITY);
                this.props.orderSuccess({orderPlaced: orderPlaced, message: message, data: [], itemsCount: 0});
            } else if (url.includes(GLOBAL.API_URL.CHECKOUT_OPTIONS)) {
                eventType = GLOBAL.API_URL.CHECKOUT_OPTIONS;
                this.trackCheckoutEvent(url, eventType);
            } else if (url.includes(GLOBAL.API_URL.CHECKOUT_LOGOUT)) {
                eventType = GLOBAL.API_URL.CHECKOUT_LOGOUT;
                this.trackCheckoutEvent(url, eventType);
            } else if (url.includes(GLOBAL.API_URL.CHECKOUT_ADDRESS_SELECTION)) {
                eventType = GLOBAL.API_URL.CHECKOUT_ADDRESS_SELECTION;
                this.trackCheckoutEvent(url, eventType);
            } else if (url.includes(GLOBAL.API_URL.CHECKOUT_FAILURE)) {
                eventType = GLOBAL.API_URL.CHECKOUT_FAILURE;
                message = "Failed!! Try again some time letter";
                this.trackCheckoutEvent(url, eventType);
            } else if (url.includes(GLOBAL.API_URL.CHECKOUT_EXIT)) {
                eventType = GLOBAL.API_URL.CHECKOUT_EXIT;
                this.trackCheckoutEvent(url, eventType);
                //exit action or back pressed;
                this.handleShopping();
            }
        }
        return true;
    };

    componentDidMount() {
        this.props.checkoutStep2();
    }

    render() {

        let {user, cart, config} = this.props;
        let {cartReview, isFetching, errorInFetch} = cart;
        let orderReview = (cartReview) ? cartReview : null;
        let udid = 'cc7d610e-b47e-4b9c-9ff6-b2c563a02786';
        //let gaid = '66c07fb33d3baa35';
        //let phoneNumber = (user && user.phones && user.phones.length > 0)?user.phones.filter((item)=> item.isPrimary)[0]:null;
        let phoneNumber = user && user.phoneNumber ? user.phoneNumber : '00',
            isPrimaryPhoneNumber= user && user.isPrimary;
        let jsCodeObj = {
            guest: false,
            "deviceId": "66c07fb33d3baa35",
            //udid: udid,
            email: (user && user.email) ? user.email : '',
            version: '1.0',
            phoneVerification: isPrimaryPhoneNumber,
            misc: {
                cookie: (user && user.cookie) ? `identity=${user.cookie};` : ""
            },
            phoneNumber: phoneNumber,
            orderReview: orderReview
        };
        let platform = (Platform.OS === 'ios') ? 'ios' : 'android';
        let injectedJavaScript = `window.checkout.import(${JSON.stringify(jsCodeObj)})`;
        let cookie = `identity=${user.cookie};`;
        //let url = `https://en-sa.wadi-stg.com/checkout/shipping/cart-empty?platform=${platform}\u0026device=mobile\u0026x=1\u0026checkout=v1`;
        let url = `https://${config.selectedLanguage}-${config.selectedCountry.countryCode}.wadi.com/checkout/shipping/cart-empty?platform=${platform}\u0026device=mobile\u0026x=1\u0026checkout=v2`;
        var headers = addCommonHeaders();
        if (!isFetching) {
            return (
                <WadiWebView
                    style={{marginTop: 10, flex: 1}}
                    source={{
                        uri: url,
                        method: 'GET',
                        headers: headers
                    }}
                    javaScriptEnabled={true}
                    injectedJavaScript={injectedJavaScript}
                    automaticallyAdjustContentInsets={true}
                    onShouldStartLoadWithRequest={isIos() ? (event) => this.onNavigationStateChange(event) : () => {
                    }}
                    onNavigationStateChange={!isIos() ? (event) => this.onNavigationStateChange(event) : () => {
                    }}
                />
            )
        }
        return <View/>;
    }

    handleShopping = () => {
        this.props.deepLinkActions({
            tracking: {},
            url: GLOBAL.API_URL.Wadi_Home,
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
        });
    };
    trackCheckoutEvent = (url, eventType) => {
        if (url && url.includes("?")) {
            let queryString = url.split("?")[1];
            let dataString = decodeURIComponent(queryString);
            let data = (dataString) ? JSON.parse(dataString) : {};
            let trackingObj = {
                logType: TrackingEnum.TrackingType.ALL,
                eventType: eventType,
                ...data
            };
            /*
                Added below conditions to prevent multiple event firing.
                Not an ideal fix.
                Ideal fix: Remove multiple firing from WEBVIEW.
             */
            if (eventType === GLOBAL.API_URL.CHECKOUT_OPTIONS) {
                if (checkoutOptionData === trackingObj.type) {
                    return;
                } else {
                    checkoutOptionData = trackingObj.type;
                    setTimeout(() => {
                        checkoutOptionData = null;
                    }, 3000);
                }
            }

            if (eventType === GLOBAL.API_URL.CHECKOUT_TRACKORDER){
                if (trackOrderData === trackingObj.transactionId) {
                    return;
                } else {
                    trackOrderData = trackingObj.transactionId;
                }
            }

            if (eventType === GLOBAL.API_URL.CHECKOUT_SUCCESS_PAYMENT) {
                if (orderPaymentData === trackingObj.transactionId) {
                    return;
                } else {
                    orderPaymentData = trackingObj.transactionId;
                }
            }

            this.props.trackCheckoutEvent({tracking: trackingObj});
        }
    }
}
//
// CheckoutPage.navigationOptions = ({navigation}) => {
//     return {
//         headerTitle: 'CHECKOUT',
//         headerTintColor: '#333',
//         mode: 'modal',
//         headerLeft: <HeaderBack navigation={navigation}/>,
//     }
// }

const styles = StyleSheet.create({});


function mapStateToProps(state) {
    return {
        cart: state.cart,
        user: state.accounts.userData,
        config:state.configAPIReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //add your action creators right here
        //updateCartStatus:(params)=>dispatch(CartActions.updateCartStatus(params)),
        orderSuccess: (params) => dispatch(orderSuccess(params)),
        trackCheckoutEvent: (params) => dispatch(trackCheckoutEvent(params)),
        checkoutStep2: () => dispatch(checkoutStep2()),
        removeTempNumberAfterCheckout: () => dispatch(removeTempNumberAfterCheckout()),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage)
