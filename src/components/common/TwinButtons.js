

'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
    selected:PropTypes.number,
    leftText:PropTypes.string,
    rightText:PropTypes.string,
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    onPressLeft:PropTypes.func,
    onPressRight:PropTypes.func,
}
const defaultProps ={
    selected:1,
    leftText:"",
    rightText:"",
    containerStyle: undefined,
    onPressLeft:undefined,
    onPressRight:undefined
}
export const TwinButtons =({selected,containerStyle, onPressLeft, onPressRight, leftText, rightText})=>{
    return(
        <View style={[styles.container, containerStyle]}>
        <View style={styles.half}>
            <TouchableOpacity
                activeOpacity={1} 
                style={[styles.button, {backgroundColor:(selected===1)?"#333":"#FFF"}]}
                onPress={onPressLeft} >
                <Text style={{color: (selected===2)?"#333":"#FFF", textAlign: 'center'}}>{leftText.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.half}>
            <TouchableOpacity 
                activeOpacity={1}
                style={[styles.button, {backgroundColor:(selected===2)?"#333":"#FFF"}]}
                onPress={onPressRight}>
                <Text style={{color: (selected===1)?"#333":"#FFF", textAlign: 'center'}}>{rightText.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    </View>

    );
}

TwinButtons.propTypes = propTypes;
TwinButtons.defaultProps = defaultProps;

const styles = StyleSheet.create({
    container:{
        height: 50, 
        flexDirection: 'row',
        backgroundColor:'#e6e6e6'
    },
    half:{
        flex: 1, 
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        height: 40,
        borderRadius: 5,
        backgroundColor:'#FFF',
    },
});

export default TwinButtons;