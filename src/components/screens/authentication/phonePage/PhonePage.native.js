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
    Image
} from 'react-native';

import images from 'assets/images';
import * as GLOBAL from '../../../../utilities/constants';
import FormValidator from '../../../../utilities/FormValidator'
import styles from './style';
import {connect} from 'react-redux';
import {requestOTP} from '../../../../actions/accountActions';
import CustomActivityIndicator from '../customActivityIndicator';
import RightHeaderButton from '../../../helpers/rightHeaderButton';
import {VectorIcon} from '../../../common';
import {strings} from 'utilities/uiString';
import {deepLinkActions} from "../../../../actions/globalActions";
import {screens} from "../../../constants/constants";

const angleRightIcon = (<VectorIcon groupName={"FontAwesome"} name={"angle-right"}
                                    style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>);


class PhoneScreen extends Component {

    constructor(props) {
        super(props);
        let params = this.props,
            isLoggedIn = this.props.accountStore.loggedIn;
        this.state = {
            email: params && params.email ? params.email : (isLoggedIn ? this.props.accountStore.userData.email : ''),
            name: params && params.name ? params.name : (isLoggedIn ? (this.props.accountStore.userData.firstName + ' ' + this.props.accountStore.userData.lastName) : ''),
            phone: ''
        };
    }

    componentWillMount() {
        //Check if props of email and name are coming or not?
        if (this.state.email === '' || this.state.name === '') {
            this.props.navigator.dismissModal({
                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
            });
        }


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


    /* Submit Mobile Function */
    _submitMobile = () => {

        // validate email and name and check email existence.

        let validator = new FormValidator(),
            phoneError = validator.validateMobile(this.state.phone);

        if (phoneError && phoneError.length > 0) {
            Alert.alert(strings.Error, phoneError);
            return false;
        }

        let postData = {
            'email': this.state.email,
            'name': this.state.name,
            'phoneNumber': this.state.phone,
            'isLoggedIn': this.props.accountStore.loggedIn,
            'countryCode': this.props.accountStore.countryCode,
            'type': 'sms'

        };

        //expected response = {params: {name, email, phoneNumber, type(call/sms), isLoggedIn}, status: response.status}
        this.props.requestOTP(postData)
            .then((response) => {
                    if (response && response.status === 200) {
                        this.props.deepLinkActions({
                            navigator: this.props.navigator,
                            currentScreen: screens.PhoneScreen,
                            toScreen: screens.OTPScreen,
                            params: response.params
                        });
                        //this.props.navigation.navigate('EnterOTP', response.params) //navigate to verify otp page
                    }
                }
            );
    };

    /*Go Back to SignUp*/
    _goBackToSignup = () => {
        // this.props.navigation.goBack();
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    };

    render() {

        return (
            <View style={styles.containerView}>


                {/*Padded left right View*/}
                <ScrollView style={styles.paddedView}>
                    {/*LOGIN HEADER*/}
                    <View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>{strings.SignUpPageHeading}</Text>
                    </View>


                    <View style={styles.blueBackgroundContainer}>
                        <View>
                            <Text style={styles.blueBackgroundContainerText}>
                                {strings.PhonePageOneStepText}
                            </Text>
                        </View>
                    </View>


                    {/*Email Container*/}
                    <View style={styles.emailContainer}>
                        <View style={styles.emailContainerLabel}>
                            <Text style={styles.emailContainerLabelText}>{strings.PhonePageEmailPlaceholder}</Text>
                        </View>
                        <Text style={styles.emailContainerEmail} numberOfLines={1}
                              ellipsizeMode={'tail'}> {this.state.email} </Text>
                        {
                            this.props && this.props && this.props.isComingFromSignup
                            &&
                            <TouchableOpacity activeOpacity={1} style={styles.emailContainerEdit}
                                              onPress={this._goBackToSignup}>
                                <VectorIcon groupName={"FontAwesome"} name={"pencil"}
                                            style={styles.emailContainerEditIcon}/>
                            </TouchableOpacity>
                        }
                    </View>


                    {/*Mobile Number Container*/}
                    <View style={styles.mobileNumberContainer}>
                        <View style={styles.flagContainer}>
                            {
                                this.props.configAPIStore && this.props.configAPIStore.selectedCountry && this.props.configAPIStore.selectedCountry.phoneCode === '+966'
                                    ?
                                    <Image source={images.saIcon}/>
                                    :
                                    <Image source={images.uaeIcon}/>
                            }
                        </View>
                        <View style={styles.mobileContainer}>
                            <TextInput style={styles.mobileContainerTextField}
                                       placeholder={strings.Phone}
                                       placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                       onChangeText={(phone) => this.setState({phone})}
                                       underlineColorAndroid='transparent'
                                       value={this.state.phone}/>
                        </View>
                    </View>

                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity activeOpacity={1} style={styles.rightAngleButton}
                                          onPress={this._submitMobile}>
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
        accountStore: store.accounts,
        configAPIStore: store.configAPIReducer
    }

}

function mapDispatchToProps(dispatch) {
    return {
        requestOTP: (params) => dispatch(requestOTP(params)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PhoneScreen)