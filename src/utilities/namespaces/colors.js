
'use strict';
import * as CONFIG from './config';
/* Add All Global colors here  */

module.exports = {
    headerViewAllColor: '#00C2B1',
    headerTitleColor: '#000000',
    wadiRoseColor: 'rgb(209, 79, 87)',
    //discountViewBackground: '#ffdc4f',
    discountViewBackground: '#FBE83B',//'rgb(209, 79, 87)',
    flashSaleDefaultBackground: '#4E0FCD',
    superSmashingDefaultBackground: 'rgb(225, 247, 246)',
    progressBarColorFilled: 'rgb(219, 60, 81)',
    progressBarColorEmpty: 'rgb(221, 184, 191)',
    wadiYellow: 'rgb(250,245,216)',
    lightGreyColor: '#9e9e9e',
    darkGreyColor: '#565656',
    bordergGreyColor: '#E7E7E8',
    black:'#333',
    red:'#e23245',
    white:'#FFF',
    authenticationTextFieldPlaceholderColor: '#c7c7cd',
    wadiDarkGreen: CONFIG.isGrocery ? 'rgb(255, 227, 105)' : '#0eb6b6',
    wadiLightGreen:'#d9f4f3',
    wadiBackgroundGreen: !CONFIG.isGrocery ? '#d9f4f3' : '#fff9e1',
    screenBackgroundGray: '#f2f2f2',
    categoryBackgroundGray:'#f0f0f0',
    transparentWhite:'rgba(255,255,255,0.8)',
    expressBackground: '#FFDC50',
    loadMore:'#f0f0f2',
    itemLoaderBackground:'#bbbec1',
    unselectedTabColor:'#454449',
    outOfStock:'#EE0041',
    wadiGroceryNavBarWithoutAlpha: 'rgba(255, 227, 105, 0.0)',
    wadiGroceryNavBar: 'rgba(255, 227, 105, 1.0)'
    
};
