/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-10-07
 * @Comments: Used for form validations
 */

import React  from 'react';
import {strings} from 'utilities/uiString';

export default function FormValidator () {

    this.validateEmail = (value) => {
      return isEmail(value) ? '' : strings.EnterEmailError
    };

    this.validateMobile = (value) => {
      return isMobile(value) ? '' : strings.EnterMobileError
    };

    this.validateName = (value) => {
      return isName(value) ? '' : strings.EnterValidName
    };

    this.validatePassword = (value) => {
        return isPassword(value) ? '' : strings.EnterValidPassword
    };

    this.validateOTP = (value) => {
        return isOneTimePassword(value) ? '' : strings.EnterValidOTPCode
    };


}


function isEmail(email){
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function isMobile(mobile){
    return (mobile.length === 9 && isNumeric(mobile));
}

function isName(name) {
    let regex = /^[A-Za-z ]+$/;
    return regex.test(name);
}

function isNumeric(number) {
    let re = /^[0-9]*$/; // check for 0-9
    return re.test(number);
}

function isPassword(password){
    return password.length >= 6
}

function isOneTimePassword(otp){
    return otp.length === 4
}
