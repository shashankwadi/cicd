/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-09
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
import {resetPasswordRequest} from '../../../../actions/accountActions';
import CustomActivityIndicator from '../customActivityIndicator';
import RightHeaderButton from '../../../helpers/rightHeaderButton';
import {strings} from 'utilities/uiString';

class ForgetPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }


    /*To Center align the logo => ios make it by default, this is for android*/
    // static navigationOptions = ({navigation}) => {
    //     return {
    //         headerLeft: (
    //             <TouchableOpacity activeOpacity ={1}
    //                 onPress={() => {
    //                     navigation.state.params.toggleModal()
    //                 }}
    //                 style={styles.toggleLoginModalArrow}>
    //                 <Image style={styles.toggleLoginModalArrowImage} source={images.downArrow}/>
    //             </TouchableOpacity>
    //         ),
    //         headerRight: (<RightHeaderButton/>)
    //     }
    // };

    /* Submit login Function */
    _resetPasswordRequest = () => {
        var validator = new FormValidator(),
            emailError = validator.validateEmail(this.state.email);

        if (emailError && emailError.length > 0) {
            Alert.alert(strings.Error, emailError);
            return false;
        }

        let postData = {
            'email': this.state.email
        };
        this.props.resetPasswordRequest(postData.email)
            .then((res) => {
                if (res.status === 200) {
                    Alert.alert(res.message);
                }
            })
            .catch(() => {
                Alert.alert(strings.Error, strings.ServerError);
            });
    };


    render() {

        return (
            <View style={styles.containerView}>


                {/*Padded left right View*/}
                <ScrollView style={[styles.paddedView]}>
                    {/*LOGIN HEADER*/}
                    <View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>{strings.ForgotPasswordHeading}</Text>
                    </View>

                    {/*Logged Out Container*/}
                    <View>
                        <TextInput style={[styles.textField, styles.marginBottom25]}
                                   placeholder={strings.Email}
                                   placeholderTextColor={GLOBAL.COLORS.authenticationTextFieldPlaceholderColor}
                                   onChangeText={(email) => this.setState({email})}
                                   autoFocus={true}
                                   underlineColorAndroid='transparent'
                                   value={this.state.email}>
                        </TextInput>

                    </View>

                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity activeOpacity ={1} style={styles.forgetPasswordButton} onPress={this._resetPasswordRequest}>
                            <Text>{strings.ResetMyPassword}</Text>
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
        resetPasswordRequest: (email) => dispatch(resetPasswordRequest(email)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordScreen)