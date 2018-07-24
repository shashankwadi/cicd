'use strict';

import {StyleSheet, Platform} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from '../../../utilities/utilities';


export const imageFlex = 0.3;
export const detailsFlex = 0.6;
export const deleteFlex = 0.1;
export const NAVBAR_HEIGHT = 64;
export const STATUS_BAR_HEIGHT = 0;

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        //marginTop:NAVBAR_HEIGHT+100
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    navbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
        //height: NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingTop: STATUS_BAR_HEIGHT,
    },

    //grocery list
    mainContainerView: {
        flex: 1,
        backgroundColor: 'white'
    },
    list1container: {
        // flex: 1,
        paddingTop: NAVBAR_HEIGHT,
    },
    itemContainer: {
        marginBottom: 0.75,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'

    },
    imageStyle: {
        flex: imageFlex,
        margin: 10
    },
    detailsViewStyle: {
        flex: detailsFlex,
    },
    titleText: {
        marginTop: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14
    },
    colorTitleText: {
        marginTop: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'gray'
    },
    quantityAddSelectionButton: {
        marginTop: 5,
        paddingTop: 3,
        marginLeft: 10,
        width: 20,
        height: 20,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 14,
        color: 'white',
    },
    quantityRemoveSelectionButton: {
        marginTop: 5,
        paddingTop: 3,
        marginLeft: 10,
        width: 20,
        height: 20,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 14,
        color: 'white',
    },
    addSelectionButton: {
        marginTop: 5,
        paddingTop: 5,
        paddingBottom: 5,
        flex: 0.5,
        width: 100,
        paddingLeft: 20,
        borderRadius: 10,
        paddingRight: 20,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'white'
    },
    priceText: {
        color: 'darkgray',
        fontSize: 12,
        fontFamily: GLOBAL.COLORS.default_font,
        textDecorationLine: 'line-through',
        marginLeft: 5,
    },
    specialPriceText: {
        color: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 12,
        fontFamily: GLOBAL.COLORS.default_font,
    },
    CheckoutButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: GLOBAL.COLORS.default_font,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    footerKeyTitle: {
        marginTop: 5,
        paddingTop: 5,
        flex: .5,
        paddingLeft: 40,
        textAlign: 'left',
        width: 100,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'gray'
    },
    footerValueTitle: {
        marginTop: 5,
        paddingTop: 5,
        flex: .5,
        paddingLeft: 40,
        textAlign: 'left',
        width: 100,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
    },
    deleteButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginTop: 5,
    },

    filterContainer: {
        flex: 0.45,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flashBanner: {
        backgroundColor: 'red',
        height: 100,
        width: 200
    },
    topFilterContainer: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    expressWidgetContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        flex:0,
        height:24,
        alignItems:'center',
    },

    appliedFilterContainer:{
        flexDirection:'row',
        width:'100%',
        padding:10,
        borderColor:'#ededed',
        borderTopWidth:1,
        borderBottomWidth:1
    },
    appliedFilter:{
        padding:5,
        backgroundColor:'#ededed',
        borderWidth:1,
        borderColor:'#ededed',
        marginHorizontal:5,
        borderRadius:4
    },
    resetText:{
        fontFamily:GLOBAL.FONTS.default_font_bold,
        color:'#333',
    },
    topFilterParentContainer:{
        paddingTop: 3,
        flexDirection: 'row',
        width: dimensions.width,
        paddingBottom: 3,
        backgroundColor:'#fafafa'
    },
    topFilterSubContainer:{
        flexDirection: 'row',
        width: dimensions.width,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plpViewTypeIcon:{
        width: 24,
        height: 24,
        marginRight: 10
    },
    loaderContainer:{
        height: 50,
        width: dimensions.width,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterIconStyle:{
        marginRight: 5,
        width: 15,
        height: 15}



});

export default styles;