/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-11
 *
 */


import React, {Component} from 'react';
import {Alert, Keyboard, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';

import * as GLOBAL from '../../../../utilities/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormValidator from '../../../../utilities/FormValidator'
import styles from './style';
import {connect} from 'react-redux';
import {checkEmailExistence} from '../../../../actions/accountActions';
import {navigateAction} from '../../../../actions/navigatorAction';
import CustomActivityIndicator from '../customActivityIndicator';
import RightHeaderButton from '../../../helpers/rightHeaderButton';
import {strings} from 'utilities/uiString';
import {isIos} from "../../../../utilities/utilities";
import {deepLinkActions} from "../../../../actions/globalActions";
import {screens} from "../../../constants/constants";

const angleRightIcon = (<Icon name="angle-right" style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>);


class SignupScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: ''
        };
    }


    /*Navigate to login*/
    _navigateToLogin = () => this.props.navigator.pop();

    /* Submit login Function */
    _submitSignup = () => {

        // validate email and name and check email existence.

        var validator = new FormValidator(),
            emailError = validator.validateEmail(this.state.email),
            nameError = validator.validateName(this.state.name);


        if (nameError && nameError.length > 0) {
            Alert.alert(strings.Error, nameError);
            return false;
        }


        if (emailError && emailError.length > 0) {
            Alert.alert(strings.Error, emailError);
            return false;
        }

        let postData = {
            'email': this.state.email,
            'name': this.state.name
        };

        // var self = this;

        this.props.checkEmailExistence(postData.email, postData.name, this.props)
            .then((res) => {
                if (res.status === 200) {
                    this.props.deepLinkActions({
                        navigator: this.props.navigator,
                        currentScreen: screens.SignupScreen,
                        toScreen: screens.PhoneScreen,
                        params:{name: postData.name, email: postData.email, isComingFromSignup: true}
                    });
                    // this.props.deepLinkActions({
                    //     currentScreen: screens.SignupScreen,
                    //     toScreen: screens.PhoneScreen,
                    //     params:  {name: postData.name, email: postData.email, isComingFromSignup: true}
                    // })
                }
                else{
                    // do nothing
                }
            })
            .catch(() => {
                // do nothing
            });
    };

    render() {

        return (
            <KeyboardAvoidingView style={styles.containerView}>


                {/*Padded left right View*/}
                <ScrollView style={styles.paddedView} keyboardDismissMode={isIos() ? 'on-drag' : 'none'}>
                    {/*LOGIN HEADER*/}

                    {/*<View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>{strings.SignUpPageHeading}</Text>
                    </View>*/}


                    <View style={styles.blueBackgroundContainer}>
                        <View>
                            <Text style={styles.blueBackgroundContainerText}>
                                {strings.EnterYourDetailsForNewAccount}
                            </Text>
                        </View>
                    </View>


                    {/*Logged Out Container*/}
                    <View>
                        <TextInput style={[styles.textField, styles.marginBottom25]}
                                   placeholder={strings.Name}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(name) => this.setState({name})}
                                   underlineColorAndroid='transparent'
                                   value={this.state.name} onSubmitEditing={Keyboard.dismiss} onBlur={Keyboard.dismiss}>
                        </TextInput>
                        <TextInput style={[styles.textField, styles.marginBottom10]}
                                   placeholder={strings.Email}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(email) => this.setState({email})}
                                   underlineColorAndroid='transparent'
                                   value={this.state.email} onSubmitEditing={Keyboard.dismiss}
                                   onBlur={Keyboard.dismiss}>
                        </TextInput>
                    </View>

                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity activeOpacity={1} style={styles.rightAngleButton}
                                          onPress={this._submitSignup}>
                            {angleRightIcon}
                        </TouchableOpacity>
                    </View>
                </ScrollView>


                {/*Create New Account View*/}
                <View style={styles.createNewAccountView}>
                    <TouchableOpacity activeOpacity={1} onPress={this._navigateToLogin}>
                        <Text style={styles.createNewAccountViewText}>
                            {strings.AlreadyHaveAnAccount}
                        </Text>
                    </TouchableOpacity>
                </View>


                {/*Activity Indicator*/}
                {this.props.accountStore.isFetching && <CustomActivityIndicator/>}

            </KeyboardAvoidingView>
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
        /*Check Email Existence?*/
        checkEmailExistence: (email, name, props) => dispatch(checkEmailExistence(email, name, props)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
        navigateAction: (routeName) => dispatch(navigateAction(routeName))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)