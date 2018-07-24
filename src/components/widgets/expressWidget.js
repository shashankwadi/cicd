/**
 * Created by Akhil Choudhary
 * Created on 2018-02-08
 *
 */


import React from 'react';
import {I18nManager, Image, StyleSheet, Text, View} from 'react-native';
import GLOBAL from '../../utilities/constants'
import ExpressIcon from '../../icons/expressIcons/express_icon.png'
import {strings} from '../../utilities/uiString'


const ExpressWidget = () => {
    return (<View style={styles.parentContainer}>
        <Image style={{marginRight: 5, width: 15, height: 15}}
               source={ExpressIcon}
        />
        <Text style={styles.textStyle}>
            {strings.WadiExpress}
        </Text>
    </View>)
};


var styles = StyleSheet.create({
    parentContainer: {
        backgroundColor: GLOBAL.COLORS.expressBackground,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopRightRadius: I18nManager.isRTL ? 1 : 16,
        borderTopLeftRadius: I18nManager.isRTL ? 16 : 1,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textStyle: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14
    }
});
export default ExpressWidget