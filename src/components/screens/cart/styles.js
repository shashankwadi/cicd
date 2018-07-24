'use strict';

import React from 'react';
import {I18nManager, StyleSheet} from 'react-native';

import {dimensions} from '../../../utilities/utilities';
import * as GLOBAL from '../../../utilities/constants';

export const imageFlex = 0.3;
export const detailsFlex = 0.55;
export const deleteFlex = 0.15;

const styles = StyleSheet.create({
    mainContainerView: {
        flex: 1,
        marginTop: 1,
        backgroundColor: GLOBAL.COLORS.white,
    },
    list1container: {
        flex: 1,
        backgroundColor: GLOBAL.COLORS.white
    },
    cartItem: {
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: GLOBAL.COLORS.white,
        borderWidth: 1,
        borderColor: GLOBAL.COLORS.bordergGreyColor,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingTop: 7,
        paddingBottom: 10,
    },
    imageContainer: {
        flex: imageFlex,
        margin: 10,
    },
    imageStyle: {
        height: imageFlex * dimensions.width,
        width: '90%',
        alignSelf: 'center',
        //justifyContent:'center',
        //paddingVertical:8,
        //paddingHorizontal:5,
    },
    detailsViewStyle: {
        flex: detailsFlex,
        alignSelf: 'center'
    },
    titleText: {
        //marginTop: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14
    },
    colorTitleText: {
        marginVertical: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: '#666'
    },
    infoText: {
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: '#666'
    },
    lessItem: {
        marginTop: 5,
        marginLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        color: GLOBAL.COLORS.wadiRoseColor,
    },
    quantitySelectionButton: {
        //marginTop: 5,
        marginLeft: 10,
        width: 24,
        height: 24,
        borderColor: 'gray',
        borderRadius: 24 / 2,
        borderWidth: 1.25,
        justifyContent: 'center',
        alignItems: 'center',
        //display: 'flex',
        flexDirection: 'column',
    },
    quantitySelectionButtonText: {
        fontSize: 18,
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'gray'
    },
    deleteProductButton: {
        marginTop: 5,
        paddingTop: 3,
        width: 20,
        height: 20,
        borderColor: 'gray',
        borderRadius: 10,
        borderWidth: 1,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'gray'
    },
    priceText: {
        color: '#999',
        fontSize: 14,
        fontFamily: GLOBAL.COLORS.default_font,
        textDecorationLine: 'line-through',
    },
    specialPriceText: {
        //color: GLOBAL.COLORS.headerViewAllColor,
        color:'#333',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: GLOBAL.FONTS.default_font_bold,
    },
    CheckoutButtonText: {
        color: GLOBAL.CONFIG.isGrocery ? 'black' : GLOBAL.COLORS.white,
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        // fontWeight: 'bold',
        textAlign: 'center'
    },
    footerKeyTitle: {
        marginTop: 5,
        paddingTop: 5,
        flex: .5,
        //paddingLeft: 40,
        textAlign: 'left',
        //width: 100,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: '#80807b'
    },
    footerValueTitle: {
        marginTop: 5,
        paddingTop: 5,
        flex: .5,
        //paddingLeft: 40,
        textAlign: 'right',
        //width: 100,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
    },
    totalLabel: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: 'black'
    },
    deleteButton: {
        width: 30,
        height: 30,
        //borderRadius: 30 / 2,
        //borderWidth: 1,
        //borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GLOBAL.COLORS.white,
        //marginTop: 5,
        marginLeft: 13
    },
    sizeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GLOBAL.COLORS.white
    },
    offerViewHeaderContainer: {
        //display: 'flex',
        backgroundColor: '#F8FAFA',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: GLOBAL.COLORS.headerViewAllColor,
        borderBottomWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginBottom: 10,
    },
    offerViewHeaderRow: {
        //alignItems: 'flex-start',
        //display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    expressWidgetContainer: {
        //display: 'flex',
        //flex: 0,
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4

    },
    bottomHalf: {
        borderColor: GLOBAL.COLORS.bordergGreyColor,
        borderTopWidth: 1,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    discountView: {
        backgroundColor: '#E24253',
        paddingTop: 8,
        paddingBottom:5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 5,
        marginVertical:5,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    discountText: {
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        //fontWeight:'bold',
        fontSize: 12,
        color: GLOBAL.COLORS.white,
    },
    underlineText:{
        //marginRight: 10,
        color: GLOBAL.COLORS.wadiDarkGreen,
        textDecorationColor: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font,
        textDecorationLine: 'underline',
    },
    billViewContainer:{
        backgroundColor: GLOBAL.COLORS.wadiBackgroundGreen,
        //flex: 1,
        //marginTop: 10,
    },
    billViewBox:{
        backgroundColor: GLOBAL.COLORS.wadiBackgroundGreen,
        paddingVertical: 0,
        paddingHorizontal: 15
    },
    billViewBorder:{
        marginTop: 5,
        backgroundColor: "#CED0CE",
        height: 1,
        flex: 1
    },
    shippingTo:{
        color: GLOBAL.WADI_STYLES.wadiDefaultHeaderStyle,
        marginLeft: 10,
        marginRight: I18nManager.isRTL ? 10 : 3,
        fontFamily: GLOBAL.FONTS.default_font,
    },
    selectedCity:{
        color: GLOBAL.COLORS.wadiDarkGreen,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
    },
    shippingToContainer:{
        flexDirection: 'row',
        height: 40,
        //justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#efeff2',
    },
    loaderGifContainer:{  position: 'absolute',
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    offerTextStyle:{
        width:dimensions.width-40,
        color: GLOBAL.COLORS.headerViewAllColor,
        textAlign: 'center',
        margin:5,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
    }

});

export default styles;