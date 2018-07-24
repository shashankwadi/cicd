/**
 * Created by Akhil Choudhary
 * Created on 2018-02-28
 *
 */
import React from 'react'
import {View, Text, StyleSheet, I18nManager} from 'react-native'
import * as GLOBAL from 'Wadi/src/utilities/constants';


const RatingBar = ({totalCount, itemCount, index}) => {

    return (<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.ratingText}>{`${index}-${index + 1}`}</Text>
        <View style={styles.progressBarContainerView}>
            <View style={[styles.progressPendingView, {flex: itemCount > 0 ? itemCount / totalCount : 0}]}>
            </View>
            <View style={[styles.progressDoneView, {
                flex: itemCount > 0 ? 1 - (itemCount / totalCount) : 1,
                borderTopLeftRadius: I18nManager.isRTL ? 4 : itemCount > 0 ? 0 : 4,
                borderBottomLeftRadius: I18nManager.isRTL ? 4 : itemCount > 0 ? 0 : 4,
                borderTopRightRadius: I18nManager.isRTL ? itemCount > 0 ? 0 : 4 : 4,
                borderBottomRightRadius: I18nManager.isRTL ? itemCount > 0 ? 0 : 4 : 4,
            }]}>
            </View>
        </View>
        <Text style={styles.reviewCountText} numberOfLines={1}>{itemCount}</Text></View>)
}

export default RatingBar


const styles = StyleSheet.create({
    parentContainer: {},
    ratingText: {
        color: '#666666',
        flex: 0.2,
        textAlign: 'left'
    },
    reviewCountText: {
        marginRight: 10,
        color: '#999999',
        flex: 0.2,
        textAlign: 'right'
    },
    progressBarContainerView: {
        flex: 0.7,
        height: 10,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
        justifyContent: 'flex-start'

    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        borderTopLeftRadius: I18nManager.isRTL ? 0 : 4,
        borderBottomLeftRadius: I18nManager.isRTL ? 0 : 4,
        borderTopRightRadius: I18nManager.isRTL ? 4 : 0,
        borderBottomRightRadius: I18nManager.isRTL ? 4 : 0,
    }, progressDoneView: {
        //backgroundColor: GLOBAL.COLORS.progressBarColorEmpty,
        backgroundColor: GLOBAL.COLORS.authenticationTextFieldPlaceholderColor,
        borderColor: GLOBAL.COLORS.authenticationTextFieldPlaceholderColor,
        borderWidth: 1,
    },

})