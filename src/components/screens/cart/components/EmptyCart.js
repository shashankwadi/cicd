

'use strict';

import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';


import * as GLOBAL from 'utilities/constants';
import { strings} from 'utilities/uiString';

export default class EmptyCart extends PureComponent{
    static propTypes = {
        callBack:PropTypes.func,
    };

    static defaultProps = {
        callBack:undefined
    };
    render(){
        let {callBack} = this.props;

        return(
            <View style={styles.container}>
                <Image source={require('../../../../icons/cart_empty/EmtyBagIcon.png')} resizeMode={"cover"} style={styles.cartIcon}/>
                <Text style={styles.messageText}>{strings.shopping_bag_empty_msg}</Text>
                <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={callBack}>
                    <Text style={styles.actionBtnTxt}>{strings.go_to_products}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:GLOBAL.COLORS.white,
        paddingHorizontal:15,
    },
    cartIcon:{
        marginBottom:30,
    },
    messageText:{
        fontFamily: GLOBAL.FONTS.default_font, 
        fontSize:16,
        textAlign:'center',
        color:GLOBAL.COLORS.lightGreyColor
    },
    actionBtn:{
        backgroundColor:GLOBAL.COLORS.wadiDarkGreen,
        marginTop:30,
        paddingBottom:10,
        paddingTop:13,
        paddingHorizontal:15,
        justifyContent:'center',
        alignItems:'center',
    },
    actionBtnTxt:{
        color:GLOBAL.COLORS.white,
        fontFamily:GLOBAL.FONTS.default_font_bold,
        fontSize:16,
        textAlign:'center',
    },
});