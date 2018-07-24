/**
 * created by Manjeet Singh on 12-20-2017
 * Goal- resusable down header button to close modals
 * pass either navigation or onPress;
 */

'use strict'
import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
"";

import images from 'assets/images';

const propTypes = {
    callBack:PropTypes.func,
    navigation:PropTypes.object.isRequired,
};

const defaultProps = {
    callBack: undefined,
    navigation:undefined,
};

const HeaderDown = ({callBack, navigation}) => {
    return (
        <TouchableOpacity activeOpacity ={1}
          onPress={() => {callBack?callBack():navigation.goBack(null)}}
          style={styles.toggleLoginModalArrow}>
          <Image style={styles.toggleLoginModalArrowImage} source={images.downArrow}/>
      </TouchableOpacity>
    );
};

HeaderDown.propTypes = propTypes;
HeaderDown.defaultProps = defaultProps;

const styles = StyleSheet.create({
    /*Toggle Login Modal arrow*/
    toggleLoginModalArrow: {
        marginLeft: 5, 
        height: 30, 
        width: 30, 
        alignItems: 'center'
    },
    toggleLoginModalArrowImage: {
        flex: 1,
        resizeMode: 'contain'
    }
});
export default HeaderDown;