/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-13
 *
 */


import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    StyleSheet,
} from 'react-native';

import * as GLOBAL from '../../../../utilities/constants';
import FormValidator from '../../../../utilities/FormValidator'
import styles from './style';
import {connect} from 'react-redux';
import {
    requestOTP,
    verifyOTP,
    tempSavePhoneNumber,
    setPrimaryNumber, hideLoginModalAndNavigate
} from '../../../../actions/accountActions';
import CustomActivityIndicator from '../customActivityIndicator';
import RightHeaderButton from '../../../helpers/rightHeaderButton';
import {VectorIcon} from '../../../common';
import {strings} from 'utilities/uiString';
import {deepLinkActions} from "../../../../actions/globalActions";
import {screens} from "../../../constants/constants";

const angleRightIcon = (<VectorIcon groupName={"FontAwesome"} name={"angle-right"}
                                    style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>),
    checkedSquare = (<VectorIcon groupName={"FontAwesome"} name={"check-square-o"}
                                 style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>),
    uncheckedSquare = (<VectorIcon groupName={"FontAwesome"} name={"square-o"}
                                   style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>)
const retryTimeout = 15; //in seconds

class OTPScreen extends Component {

    constructor(props) {
        super(props);
        let params = this.props,
            isLoggedIn = this.props.accountStore.loggedIn;
        this.state = {
            email: params && params.email ? params.email : (isLoggedIn ? this.props.accountStore.userData.email : ''),
            name: params && params.name ? params.name : (isLoggedIn ? (this.props.accountStore.userData.firstName + ' ' + this.props.accountStore.userData.lastName) : ''),
            phoneNumber: params && params.phoneNumber ? params.phoneNumber : (isLoggedIn ? this.props.accountStore.userData.phoneNumber : ''),
            otp: '',
            otpRetryTime: retryTimeout, //in seconds
            isSkipVisible: false,
            isVerifySkipped: false,
            resendCount: 0,
        };
    }

    componentWillMount() {
        this._startDecreasingOTPRetryTime();
        //Check if props of email and name are coming or not?


    }

    componentWillReceiveProps() {
        if (this.state.email === '' || this.state.name === '' || this.state.phoneNumber === '') {
            this.props.navigator.dismissModal({
                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
            });
        }
        if (this.state.otpRetryTime > 0)
            this._startDecreasingOTPRetryTime();
    }

    componentDidMount() {


    }


    /*To Center align the logo => ios make it by default, this is for android*/
    // static navigationOptions = ({navigation}) => {
    //     return {
    //
    //         headerRight: (<RightHeaderButton/>)
    //     }
    // };

    _startDecreasingOTPRetryTime = () => {
        setTimeout(() => {
            if (this.state.otpRetryTime > 0) {
                this.setState({otpRetryTime: this.state.otpRetryTime - 1});
                if(this.state.otpRetryTime === 0){
                    this.setState({resendCount: this.state.resendCount + 1});
                }
                if (this.state.otpRetryTime > 0)
                    this._startDecreasingOTPRetryTime();
            }
        }, 1000);

    };


    /* Submit OTP Function */
    _submitOTP = () => {

        // validate email and name and check email existence.

        let validator = new FormValidator(),
            otpError = validator.validateOTP(this.state.otp);

        let postData = {
            'email': this.state.email,
            'name': this.state.name,
            'phoneNumber': this.state.phoneNumber,
            'verificationCode': this.state.otp,
            'countryCode': this.props.accountStore.countryCode
        };

        if (!this.state.isVerifySkipped) {

            if (otpError && otpError.length > 0) {
                Alert.alert(strings.Error, otpError);
                return false;
            }

            this.props.verifyOTP(postData, this.props.accountStore.userData)
                .then((res) => {
                    let accounts = this.props.accountStore;
                    if (res && res.status === 200) {
                        if (accounts.loggedIn) {
                            setPrimaryNumber({
                                phoneNumber: accounts.userData.phoneNumber,
                                countryCode: accounts.countryCode
                            }, accounts.userData.cookie); // for case like social login
                            //this.props.hideLoginModalAndNavigate(); //close modal
                            this.props.navigator.dismissModal({
                                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                            });
                        }
                        else { //redirect to pending signUp flow
                            this.props.deepLinkActions({
                                navigator: this.props.navigator,
                                currentScreen: screens.OTPScreen,
                                toScreen: screens.PasswordScreen,
                                params: res.params
                            });
                            // this.props.navigation.navigate('EnterPassword', res.params);
                        }
                    }
                })
                .catch(() => {
                });
        }
        else {

            // handle temp number save (number = number, is_primary = false)
            // for signup we don't need saving number - to make it easy for checkout purpose, we are saving number only in redux.
            this.props.tempSavePhoneNumber(postData.phoneNumber)
                .then(() => {
                    if (this.props.accountStore.loggedIn) {
                        //this.props.hideLoginModalAndNavigate();
                        // this.props.navigator.dismissModal({
                        //     animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                        // });
                    }
                    else
                        this.props.deepLinkActions({
                            navigator: this.props.navigator,
                            currentScreen: screens.OTPScreen,
                            toScreen: screens.PasswordScreen,
                            params: postData
                        });
                        //this.props.navigation.navigate('EnterPassword', postData);
                })
                .catch(() => {
                });

        }
    };

    /*Go Back to SignUp*/
    _goBackToPhonePage = () => {
        this.props.navigator.pop();
    };


    /* Resend OTP */
    //type = call/sms
    _resendOTP = (type) => {
        if (!this.state.isVerifySkipped) {
            let postData = {
                'email': this.state.email,
                'name': this.state.name,
                'phoneNumber': this.state.phoneNumber,
                'isLoggedIn': this.props.accountStore.loggedIn,
                'type': type,
                'countryCode': this.props.accountStore.countryCode
            };

            this.props.requestOTP(postData)
                .then((res) => {
                        if (res && res.status === 200) {
                            this.setState({
                                isSkipVisible: true,
                                otpRetryTime: retryTimeout,
                                isVerifySkipped: false,
                                otp: ''
                            });
                            this._startDecreasingOTPRetryTime();
                        }
                    }
                );


        }
        else
            Alert.alert(strings.SkipPhone)
    };

    render() {

        const textFieldDisabledStyle = StyleSheet.create({
            textField: {backgroundColor: (this.state.isVerifySkipped ? '#e3e3e8' : '#fff')}
        });
        return (
            <View style={styles.containerView}>


                {/*Padded left right View*/}
                <ScrollView style={styles.paddedView}>
                    {/*LOGIN HEADER*/}
                    {/*<View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>{strings.EnterOTPHeading}</Text>
                    </View>*/}


                    <View style={styles.blueBackgroundContainer}>
                        <View>
                            <Text style={styles.blueBackgroundContainerText}>
                                {strings.VerificationCodeSentToYourPhone}
                            </Text>
                        </View>
                    </View>


                    {/*Phone Container*/}
                    <View style={styles.phoneContainer}>
                        <View style={styles.phoneContainerLabel}>
                            <Text style={styles.phoneContainerLabelText}>{strings.OTPPagePhonePlaceholder}</Text>
                        </View>
                        <Text style={styles.phoneContainerPhone}
                              numberOfLines={1}
                              ellipsizeMode={'tail'}>
                            {this.state.phoneNumber}
                        </Text>

                        <TouchableOpacity style={styles.phoneContainerEdit} onPress={this._goBackToPhonePage} activeOpacity ={1}>
                            <VectorIcon groupName={"FontAwesome"} name={"pencil"}
                                        style={styles.phoneContainerEditIcon}/>
                        </TouchableOpacity>

                    </View>


                    {/*OTP Container*/}
                    <View>

                        <TextInput style={[styles.textField, styles.marginBottom10, textFieldDisabledStyle.textField]}
                                   placeholder={strings.OTPVerificationText}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(otp) => this.setState({otp})}
                                   autoFocus={true}
                                   value={this.state.otp}
                                   underlineColorAndroid='transparent'
                                   editable={!this.state.isVerifySkipped}>
                        </TextInput>
                    </View>

                    {/*Retry skip container view*/}
                    {
                        this.state.otpRetryTime > 0
                        &&
                        <View style={styles.retryTextContainer}>
                            <Text>{`${strings.RetryOTPText} `}
                                00:{this.state.otpRetryTime < 10 ? `0${this.state.otpRetryTime}` : this.state.otpRetryTime}
                            </Text>
                        </View>
                    }

                    {/*Resend container*/}
                    {
                        this.state.otpRetryTime < 1
                        &&
                        <View style={styles.retryTextContainer}>
                            <TouchableOpacity onPress={() => this._resendOTP('call')} activeOpacity ={1}>
                                <Text style={[{textAlign: 'left'}, styles.retryText]}>{strings.ReceiveCodeOnCallText}</Text>
                            </TouchableOpacity>
                            <Text>
                                {strings.Or.toLowerCase()}
                            </Text>
                            <TouchableOpacity onPress={() => this._resendOTP('sms')} activeOpacity ={1}>
                                <Text style={[{textAlign: 'left'}, styles.retryText]}>{strings.ResendSMS}</Text>
                            </TouchableOpacity>
                        </View>

                    }


                    {/*Skip Container*/}
                    {
                        this.state.resendCount >= 2
                        &&
                        <View >

                            <TouchableOpacity
                                activeOpacity ={1}
                                onPress={() => this.setState({isVerifySkipped: !this.state.isVerifySkipped})}
                                style={styles.skipContainer}>
                                <View style={styles.checkbox}>{this.state.isVerifySkipped ? checkedSquare : uncheckedSquare}</View>
                                <Text style={styles.skipText}>{strings.ContinueWithoutVerifyingPhone}</Text>
                            </TouchableOpacity>

                        </View>
                    }


                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity style={styles.rightAngleButton} onPress={this._submitOTP} activeOpacity ={1}>
                            {angleRightIcon}
                        </TouchableOpacity>
                    </View>


                </ScrollView>


                {/*Activity Indicator*/}
                {this.props.accountStore.isFetching && <CustomActivityIndicator/>}

            </View>
        )
    }
}

function mapStateToProps(store) {
    return {
        accountStore: store.accounts
    }

}

function mapDispatchToProps(dispatch) {
    return {
        requestOTP: (params) => dispatch(requestOTP(params)),
        verifyOTP: (params, userDataObj) => dispatch(verifyOTP(params, userDataObj)),
        tempSavePhoneNumber: (phoneNumber) => dispatch(tempSavePhoneNumber(phoneNumber)),
        /*Toggle login modal action*/
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
        hideLoginModal: () => dispatch(hideLoginModalAndNavigate()),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen)