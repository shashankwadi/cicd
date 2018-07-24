/**
 * created by Manjeet Singh on 10-01-2018
 * Goal- resusable back header button to close modals
 * pass either navigation or onPress;
 */

'use strict'
import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    I18nManager
} from 'react-native';
import PropTypes from 'prop-types';


import {VectorIcon} from '../common';
import {resetPreviosParams} from '../../utilities/managers/deeplinkHandler';

const propTypes = {
    callBack:PropTypes.func,
    navigation:PropTypes.object.isRequired,
};

const defaultProps = {
    callBack: undefined,
    navigation:undefined,
};

const goBack =(navigation, callBack)=>{
    resetPreviosParams();
    if(callBack){
        callBack();
    }else{
        navigation.goBack(null)
    }
}

const HeaderBack = ({callBack, navigation}) => {
    return (
        <TouchableOpacity activeOpacity ={1}
          onPress={() => goBack(navigation, callBack)}
          style={styles.toggleLoginModalArrow}>
          <VectorIcon groupName={"Ionicons"} name={(Platform.OS === "ios") ? "ios-arrow-back" : "md-arrow-back"} size={25} style={{marginTop: 8, transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}/>
       </TouchableOpacity>
    );
};

HeaderBack.propTypes = propTypes;
HeaderBack.defaultProps = defaultProps;

const styles = StyleSheet.create({
    /*Toggle Login Modal arrow*/
    toggleLoginModalArrow: {
        marginLeft: 5, 
        height: 40,
        width: 40,
        alignItems: 'center'
    },
    toggleLoginModalArrowImage: {
        flex: 1,
        resizeMode: 'contain'
    }
});
export default HeaderBack;