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
    StyleSheet
} from 'react-native';


import * as GLOBAL from '../../../../utilities/constants';
import FormValidator from '../../../../utilities/FormValidator'
import styles from './style';
import {connect} from 'react-redux';
import {toggleLoginModal, submitPassword, hideLoginModalAndNavigate} from '../../../../actions/accountActions';
import CustomActivityIndicator from '../customActivityIndicator';
import RightHeaderButton from '../../../helpers/rightHeaderButton';
import {VectorIcon} from '../../../common';
import {strings} from 'utilities/uiString';
import {screens} from "../../../constants/constants";

const angleRightIcon = (<VectorIcon groupName={"FontAwesome"} name={"angle-right"}
                                    style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>)

class PasswordScreen extends Component {

    constructor(props) {
        super(props);
        let params = this.props,
            isLoggedIn = this.props.accountStore.loggedIn;
        this.state = {
            email: params && params.email ? params.email : (isLoggedIn ? this.props.accountStore.userData.email : ''),
            name: params && params.name ? params.name : (isLoggedIn ? (this.props.accountStore.userData.firstName + ' ' + this.props.accountStore.userData.lastName) : ''),
            phoneNumber: params && params.phoneNumber ? params.phoneNumber : (isLoggedIn ? this.props.accountStore.userData.phoneNumber : ''),
            verificationCode: params && params.verificationCode ? params.verificationCode : '',
            password: '',
            confirmPassword: ''
        };

        //this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        //Check if props of email and name are coming or not?
        if (this.state.email === '' || this.state.name === '' || this.state.phoneNumber === '') {
            this.props.hideLoginModal(screens.PasswordScreen, this.props.navigator);
            // this.props.navigator.dismissModal({
            //     animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
            // });
        }


    }

    componentDidMount() {
        // this.props.navigation.setParams({toggleModal: () => this.props.toggleLoginModal()});
    }


    /*To Center align the logo => ios make it by default, this is for android*/
    // static navigationOptions = ({navigation}) => {
    //     return {
    //
    //         headerRight: (<RightHeaderButton/>)
    //     }
    // };

    /* Submit signup Function */
    _submitPassword = () => {

        // validate email and name and check email existence.

        let validator = new FormValidator(),
            passwordError = validator.validatePassword(this.state.password),
            confirmPassword = validator.validatePassword(this.state.confirmPassword),
            samePasswordError = this.state.password !== this.state.confirmPassword ? strings.EnterValidConfirmPassword : '';

        if (passwordError && passwordError.length > 0) {
            Alert.alert(strings.Error, passwordError);
            return false;
        }

        if (confirmPassword && passwordError.length > 0) {
            Alert.alert(strings.Error, strings.EnterValidConfirmPassword);
            return false;
        }

        if (samePasswordError && samePasswordError.length > 0) {
            Alert.alert(strings.Error, samePasswordError);
            return false;
        }

        let postData = {
            'email': this.state.email,
            'name': this.state.name,
            'phoneNumber': this.state.phoneNumber,
            'countryCode': this.props.accountStore.countryCode,
            'password': this.state.password,
            'isPrimary': this.props.accountStore.isPrimary
        };

        this.props.submitPassword(postData, this.props.accountStore.userData)
            .then((res) => {
                if (res && res.status === 200) {
                    //this.props.hideLoginModalAndNavigate();
                    this.props.navigator.dismissModal({
                        animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                    });
                }
            }).catch((e) => {});
    };

    render() {

        const textFieldDisabledStyle = StyleSheet.create({
            textField: {backgroundColor: (this.state.isVerifySkipped ? GLOBAL.COLORS.lightGreyColor : '#fff')}
        });
        return (
            <View style={styles.containerView}>

                {/*Padded left right View*/}
                <ScrollView style={styles.paddedView}>
                    {/*LOGIN HEADER*/}
                    <View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>Set New Password</Text>
                    </View>


                    {/*Blue background text*/}
                    <View style={styles.blueBackgroundContainer}>
                        <View>
                            <Text style={styles.blueBackgroundContainerText}>
                                {this.props.accountStore.isPrimary ? strings.PhoneVerified : strings.PhoneNotVerified}
                            </Text>
                        </View>
                    </View>


                    {/*Logged Out Container*/}
                    <View>
                        <TextInput style={[styles.textField, styles.marginBottom25]}
                                   placeholder={strings.Password}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(password) => this.setState({password})}
                                   autoFocus={true}
                                   secureTextEntry={true}
                                   underlineColorAndroid='transparent'
                                   value={this.state.password}>
                        </TextInput>
                        <TextInput style={[styles.textField, styles.marginBottom10]}
                                   placeholder={strings.ConfirmPassword}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                                   secureTextEntry={true}
                                   underlineColorAndroid='transparent'
                                   value={this.state.confirmPassword}>
                        </TextInput>
                    </View>

                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity activeOpacity ={1} style={styles.rightAngleButton} onPress={this._submitPassword}>
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
        submitPassword: (params) => dispatch(submitPassword(params)),

        /*Toggle login modal action*/
        toggleLoginModal: () => dispatch(toggleLoginModal()),
        hideLoginModal: () => dispatch(hideLoginModalAndNavigate()),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PasswordScreen);