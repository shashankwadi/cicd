/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-08
 *
 */


import React, {Component} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import images from 'assets/images';
import {screens} from 'Wadi/src/components/constants/constants';
import * as GLOBAL from '../../../../utilities/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormValidator from '../../../../utilities/FormValidator'
import styles from './style';
import {connect} from 'react-redux';
import {
    _beginAuthenticationLoader,
    _stopAuthenticationLoader,
    loginWithMail,
    socialLoginAPI
} from '../../../../actions/accountActions';
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import CustomActivityIndicator from '../customActivityIndicator';
import RightHeaderButton from '../../../helpers/rightHeaderButton';
import {GoogleSignin} from 'react-native-google-signin';
import {strings} from 'utilities/uiString';
import {isIos} from "../../../../utilities/utilities";

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken
} = FBSDK;

GoogleSignin.hasPlayServices({autoResolve: true}).then(() => {
    // play services are available. can now configure library
}).catch((err) => {

});

const facebookIcon = (<Icon name="facebook" style={{fontSize: 25, color: 'blue'}}/>),
    googleIcon = (<Icon name="google" style={{fontSize: 25, color: 'red'}}/>),
    angleRightIcon = (<Icon name="angle-right" style={{fontSize: 25, color: GLOBAL.COLORS.wadiDarkGreen}}/>);

const CURRENT_SCREEN = screens.LoginPage;
class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    componentDidMount() {
        if(GLOBAL.CONFIG.isGrocery){
            GoogleSignin.configure({
                iosClientId: '731220662895-1nvem5tb4bgo3v2jmofq8vfu05t97gcc.apps.googleusercontent.com',
                webClientId: '731220662895-oacl3cpord0ut5ge8e0spgvm9ajq2s74.apps.googleusercontent.com'
            }).then(() => {
            });
        }else{
            GoogleSignin.configure({
                iosClientId: '1034143548269-arkrmgffqd60mpo9d4sgu2kvip9thil3.apps.googleusercontent.com',
                webClientId: '1034143548269-us4drm7upkqgsdpe3835n63k77ick6vl.apps.googleusercontent.com'
            }).then(() => {
            });
        }

        GoogleSignin.hasPlayServices({autoResolve: true}).then(() => {
        }).catch((err) => {

        });
    }


    /*To Center align the logo => ios make it by default, this is for android*/
    // static navigationOptions = ({navigation}) => {
    //     return {
    //         headerLeft: (
    //             <TouchableOpacity activeOpacity={1}
    //                               onPress={() => {
    //                                   navigation.state.params.toggleModal()
    //                               }}
    //                               style={styles.toggleLoginModalArrow}>
    //                 <Image style={styles.toggleLoginModalArrowImage} source={images.downArrow}/>
    //             </TouchableOpacity>
    //         ),
    //         headerRight: (<RightHeaderButton/>)
    //     }
    // };

    moveToScreen = (screenName, params={})=>{
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: screenName,
            params: {...params}
        });
    }
    /* Submit login Function */
    _submitLogin = () => {
        var validator = new FormValidator(),
            emailError = validator.validateEmail(this.state.email),
            passwordError = validator.validatePassword(this.state.password);

        if (emailError && emailError.length > 0) {
            Alert.alert(strings.Error, emailError);
            return false;
        }

        if (passwordError && passwordError.length > 0) {
            Alert.alert(strings.Error, passwordError);
            return false;
        }

        let postData = {
            'email': this.state.email,
            'password': this.state.password
        };
        this.props.loginWithMail(postData.email, postData.password, this.props.navigator);
    };


    /*Navigate to sign up*/
    _navigateToSignUp = () => {
        this.moveToScreen(screens.SignupScreen);
        //this.props.navigation.navigate('SignUp');
    };

    _fbLogin = () => {
        const self = this;
        self.props.beginAuthenticationLoader();
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function (result) {
                if (result.isCancelled) {
                    self.props.stopAuthenticationLoader();
                    Alert.alert(strings.Error, strings.AuthenticationFailed);
                } else {
                    /*alert('Login success with permissions: '
                        +result.grantedPermissions.toString());*/
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            //alert(data.accessToken.toString())
                            self.props.socialLoginAPI('facebook', data.accessToken);
                        }
                    )
                }
            },
            function (error) {
                self.props.stopAuthenticationLoader();
                Alert.alert(strings.Error, strings.AuthenticationFailed);
            }
        );
    };

    _googleLogin = () => {
        const self = this;
        self.props.beginAuthenticationLoader();
        GoogleSignin.signIn()
            .then((user) => {
                self.props.stopAuthenticationLoader();
                self.props.socialLoginAPI('googlev3', user.idToken)
            })
            .catch((err) => {
                self.props.stopAuthenticationLoader();
                Alert.alert(strings.Error, strings.AuthenticationFailed);
            })
            .done();
    }

    render() {

        return (
            <KeyboardAvoidingView style={styles.containerView}>


                {/*Padded left right View*/}
                <ScrollView style={styles.paddedView} keyboardDismissMode={isIos() ? 'on-drag' : 'none'}>
                    {/*LOGIN HEADER*/}
                    <View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>{strings.SignInPageHeading}</Text>
                    </View>

                    {/*Social Login View*/}
                    <View style={styles.socialLoginContainer}>

                        {/*Facebook*/}
                        <TouchableOpacity activeOpacity={1} style={styles.facebookLoginButton} onPress={this._fbLogin}>
                            {facebookIcon}
                            <Text style={styles.facebookLoginButtonText}>
                                {strings.Facebook}
                            </Text>
                        </TouchableOpacity>


                        {/*Google*/}
                        <TouchableOpacity activeOpacity={1} style={styles.googleLoginButton}
                                          onPress={this._googleLogin}>
                            {googleIcon}
                            <Text style={styles.googleLoginButtonText}>
                                {strings.Google}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/*Or Text*/}
                    <Text style={styles.orText}>
                        {strings.Or}
                    </Text>

                    {/*Logged Out Container*/}
                    <View>
                        <TextInput style={[styles.textField, styles.marginBottom25]}
                                   placeholder={strings.Email}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(email) => this.setState({email})}
                                   underlineColorAndroid='transparent'
                                   value={this.state.email}
                                   onSubmitEditing={Keyboard.dismiss} onBlur={Keyboard.dismiss}>
                        </TextInput>
                        <TextInput style={[styles.textField, styles.marginBottom10]}
                                   placeholder={strings.Password}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(password) => this.setState({password})}
                                   secureTextEntry={true}
                                   underlineColorAndroid='transparent'
                                   value={this.state.password}
                                   onSubmitEditing={Keyboard.dismiss} onBlur={Keyboard.dismiss}>
                        </TextInput>
                    </View>

                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity style={styles.forgetPasswordButton} activeOpacity={1}>
                            <Text style={styles.forgetPasswordText}
                                  onPress={() => this.moveToScreen(screens.ForgotPasswordScreen)}>
                                {strings.ForgotPassword}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightAngleButton} onPress={this._submitLogin} activeOpacity={1}>
                            {angleRightIcon}
                        </TouchableOpacity>
                    </View>
                </ScrollView>


                {/*Create New Account View*/}
                <View style={styles.createNewAccountView}>
                    <TouchableOpacity onPress={this._navigateToSignUp} activeOpacity={1}>
                        <Text style={styles.createNewAccountViewText}>
                            {strings.CreateAccount}
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
        loginWithMail: (username, password, modalNavigatorProps) => {
            dispatch(loginWithMail(username, password, modalNavigatorProps));
        },
        socialLoginAPI: (provider, token) => dispatch(socialLoginAPI(provider, token)),
        beginAuthenticationLoader: () => dispatch(_beginAuthenticationLoader()),
        stopAuthenticationLoader: () => dispatch(_stopAuthenticationLoader()),
        deepLinkActions: (params) => dispatch(deepLinkActions(params))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)