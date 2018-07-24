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
} from 'react-native';
import styles from './style';
import {connect} from 'react-redux';
import CustomActivityIndicator from '../customActivityIndicator';
import {strings} from 'utilities/uiString';

class SignupSuccessScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={styles.containerView}>


                {/*Padded left right View*/}
                <ScrollView style={[styles.paddedView]}>
                    {/*LOGIN HEADER*/}
                    <View style={styles.screenHeading}>
                        <Text style={styles.screenHeadingText}>{strings.SignUpSuccessHeading}</Text>
                    </View>


                    {/*Action View - forgot pass & go */}
                    <View style={styles.actionView}>
                        <TouchableOpacity activeOpacity ={1} style={styles.forgetPasswordButton}>
                            <Text>{strings.ContinueShopping}</Text>
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



export default connect(mapStateToProps)(SignupSuccessScreen)