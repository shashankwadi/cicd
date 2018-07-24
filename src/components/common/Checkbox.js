'use strict';


import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image
} from 'react-native';
import PropTypes from 'prop-types';

import {isIos} from '../../utilities/utilities';
import images from 'assets/images';
import VectorIcon from "./VectorIcon.native";
import Colors from 'Wadi/src/utilities/namespaces/colors';


let size = (isIos()) ? 24 : 20;

const selected = (<VectorIcon groupName={"Ionicons"} name={"ios-checkmark"}
                              style={{fontSize: 25, color: Colors.wadiDarkGreen}}/>)
const unSelected = (<VectorIcon groupName={"Ionicons"} name={"ios-checkmark"}
                                style={{fontSize: 25, color: Colors.authenticationTextFieldPlaceholderColor}}/>)
export const styles = StyleSheet.create({
    container: {
        width: 15,
        height: 15,
        //backgroundColor:'#ededed',
        borderColor: '#ededed',
        justifyContent: 'center',
        alignItems: 'center',

    },
    checkMark: {
        width: 10,
        height: 10,
        alignSelf: 'center'
    }
});

const Checkbox = ({isSelected, containerStyle}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {isSelected ? selected : unSelected}
        </View>
    );
};

Checkbox.propTypes = {
    isSelected: PropTypes.bool,
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

Checkbox.defaultProps = {
    isSelected: false,
    containerStyle: undefined,
};

export default Checkbox;