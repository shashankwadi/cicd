import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TextInput,
    View,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    WebView,
    Alert,
    Cookie,
    Text,
    Image,
    Platform, NativeModules
} from 'react-native';

import {connect} from 'react-redux';
import {dimensions} from 'utilities/utilities';
import {addCommonHeaders} from "../../../utilities/ApiHandler"
import {getLoginToken} from 'Wadi/src/utilities/sharedPreferences';
import * as GLOBAL from "../../../utilities/constants";
import {Navigation} from "react-native-navigation";
import {VectorIcon} from '../../common';
import {isIos} from "../../../utilities/utilities";


const isIphoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
const headerHeight = isIos() ? (isIphoneX ? 80: 64) : 54;
const CHECKOUT_SUCCESS = 'wadi.com/success/';
const CHECKOUT_ERROR = 'wadi.com/error';

let checkoutUrl=null;
class DoodleWebHelperView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: {},
        };
    }

    componentWillMount(){
        var headers = addCommonHeaders();
        var loginToken = '';
        getLoginToken()
            .then((token) => {
                //console.log('get token is', token)
                if (!!token) {
                    loginToken = token
                }
            })
            .catch((err) => {
                console.log('error while getting user token, error = ', err);
            });
        if(loginToken){
            headers['cookie'] = 'identity='+loginToken;
        }
        // headers['city']='riyadh';
        this.setState({headers: headers});
        //console.log('state', this.props);
    }

    render() {
        let iphoneXStyleTop = (isIphoneX)?{paddingTop:50}:undefined;
        let topMargin =  isIos() ? (isIphoneX ? 0 : 30) : 10;
        let title = (this.props.title) ? this.props.title : ''
        return (
            <View style = {{flex: 1}}>
                <View style={[styles.launchHeader, iphoneXStyleTop,{flexDirection: 'row'} ]}>
                    {this.props.showLoader && <ActivityIndicator style = {styles.headerLoader} color = {"black"}/>}
                    <Text style={[styles.launchHeaderText, {marginTop:topMargin}]}>
                        {title}
                    </Text>
                    <TouchableOpacity
                        style = {styles.headerDownButton}
                        onPress = {()=>  Navigation.dismissModal({animationType: 'slide-down'})}>
                        <VectorIcon groupName={"Ionicons"}
                                    name={"ios-arrow-down"}
                                    style={{
                                        marginTop: isIos() ? 22 : 16,
                                        fontSize: 25,
                                        color: GLOBAL.COLORS.darkGreyColor,
                                    }}/>
                    </TouchableOpacity>
                </View>
            <WebView
                source={{
                    uri: this.props.url,
                    method: 'GET',
                    headers: this.state.headers
                }}
                onNavigationStateChange={(event)=>this.onNavigationStateChange(event)}
            />
            </View>
        )
    }

    onNavigationStateChange = (event) => {
        let {url} = event;
        console.log('oncheckout- ', url);
        if (url && checkoutUrl !== url) {
            if (url.includes(CHECKOUT_SUCCESS) || url.includes(CHECKOUT_ERROR)) {
                if(this.props.callback && typeof this.props.callback ==='function'){
                    this.props.callback(url);
                }
                Navigation.dismissModal({animationType: 'slide-down'});
            } 
        checkoutUrl = url;
        setTimeout(()=>{
            checkoutUrl= null;
         }, 3000)
        }
        return true;
    }


}
const styles = StyleSheet.create({

    launchHeader: {
        height: headerHeight,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.4,
        borderColor: GLOBAL.COLORS.lightGreyColor,
        backgroundColor:GLOBAL.COLORS.wadiDarkGreen,
    },
    launchHeaderText: {
        color: 'black',
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font,

    },
    headerDownButton:{
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'absolute', 
        right: 10, 
        height: 50, 
        width: 50,
        top: isIos() ? (isIphoneX ? 25 : 8) : 0,
    },
    headerLoader:{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        top: isIos() ? (isIphoneX ? 25 : 18) : 8,
        height: 50,
        width: 50
    },
});


function mapStateToProps(state) {
    return {
        accountStore: state.accounts,
        configStore: state.configAPIReducer,
        featureMapStore: state.featureMapAPIReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //add your action creators right here
        //updateCartStatus:(params)=>dispatch(CartActions.updateCartStatus(params)),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DoodleWebHelperView)

