/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-08
 *
 */


import {StyleSheet,  I18nManager} from 'react-native';
import * as GLOBAL from '../../../../utilities/constants';

const styles = StyleSheet.create({
    /*Total screen view container*/
    containerView: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    paddedView: {
        paddingLeft: 35,
        paddingRight: 35
    },

    /*Login In Heading styles*/
    screenHeading: {
        marginTop: 35,
        marginBottom: 35,
        alignItems: 'center'
    },
    screenHeadingText: {
        fontSize: 25,
    },

    /*Social Login Styles*/
    socialLoginContainer: {
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 1,
        borderColor: '#c9c9c9',
        alignContent: 'center',
        marginBottom: 35
    },
    facebookLoginButton: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#c9c9c9',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    facebookLoginButtonText: {
        color: 'blue',
        fontSize: 20,
        marginLeft: 15
    },
    googleLoginButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    googleLoginButtonText: {
        color: 'red',
        fontSize: 20,
        marginLeft: 15
    },

    /*Or text Separator*/
    orText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#c9c9c9',
        marginBottom: 25
    },

    /*Text Field CSS*/
    textField: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#c9c9c9',
        color: '#000',
        fontSize: 17,
        textAlign:  I18nManager.isRTL ? 'right' : 'left'
    },


    /*Action View*/
    actionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
    },
    /*Forgot Password*/
    forgetPasswordButton: {},
    forgetPasswordText: {
        marginTop: 30,
        color: '#DA747C',
        textDecorationLine: 'underline',
        textDecorationColor: 'red',
        fontSize: 17
    },

    /*Right Angle Button*/
    rightAngleButton: {
        marginTop: 15,
        height: 50,
        width: 50,
        borderRadius: 50,
        borderColor: GLOBAL.COLORS.wadiDarkGreen,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 2.5,
        shadowOffset: {width: 1, height: 3},
    },

    /*Create a new account Styles*/
    createNewAccountView: {
        borderTopWidth: 1,
        borderColor: '#c9c9c9',
        paddingTop: 15,
        paddingBottom: 15,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center'
    },
    createNewAccountViewText: {
        color: GLOBAL.COLORS.wadiDarkGreen,
        textAlign: 'center',
        fontSize: 20
    },

    /*Utils styles*/
    marginBottom25: {
        marginBottom: 25
    },
    marginBottom10: {
        marginBottom: 10
    },

    /*Toggle Login Modal arrow*/
    toggleLoginModalArrow: {
        marginLeft: 5, height: 30, width: 30, alignItems: 'center'
    },
    toggleLoginModalArrowImage: {
        flex: 1,
        resizeMode: 'contain'
    }

});

export default styles;