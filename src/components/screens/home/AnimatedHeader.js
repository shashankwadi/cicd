'use strict';
import React, { PureComponent, Component } from 'react';
import {
    Animated,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import { VectorIcon } from '../../common';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions, isIos, isIphoneX } from 'utilities/utilities';
import { strings } from 'utilities/uiString';

import { CartBadge } from '../../common';


const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});
const scrollRangeForAnimation = GLOBAL.CONFIG.isGrocery ? 150 : 100;
const TOP_HALF_HEIGHT = GLOBAL.CONFIG.isGrocery ? 90 : 50;
const SEARCH_BAR_PADDING_TOP = GLOBAL.CONFIG.isGrocery ? STATUS_BAR_HEIGHT : 25;
const LOGO_CONTAINER_ANIM_TOP = isIphoneX?45:25
export default class AnimatedHeader extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let { scrollY, subLocality, cartPressed, menuPressed, searchPressed, openLocationModal } = this.props;
        const headerImage = (GLOBAL.CONFIG.isGrocery) ? require('./../../../icons/navbar/wadigrocery_en.png') : require('./../../../icons/navbar/Logo_en.png');
        const categoryImage = require('./../../../icons/tabbar/tab_category_unselected.png');
        const handbagImage = require('./../../../icons/navbar/handbag.png');
        const SearchUnSelIcon = require('../../../icons/tabbar/tab_search_unselected.png');

        let animationRange = scrollY.interpolate({
            inputRange: [0, scrollRangeForAnimation],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        })
        const animateHeader = {
            transform: [
                {
                    translateY: scrollY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -TOP_HALF_HEIGHT + SEARCH_BAR_PADDING_TOP],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
        
        const logoContainerAnim = {
            transform: [
                {
                    translateY: scrollY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -LOGO_CONTAINER_ANIM_TOP],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };

        const searchBarAnim = {
            transform: [
                {
                    translateY: scrollY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, SEARCH_BAR_PADDING_TOP],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };

       

        return (
            <Animated.View style={[styles.homeHeaderContainer,  animateHeader]}>
                <Animated.View style={[logoContainerAnim]}>
                    <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 5 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={headerImage} />
                        </View>
                    </View>
                    {GLOBAL.CONFIG.isGrocery &&
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}>
                            <Text>{strings.shipping_in}</Text>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                                <TouchableOpacity style={styles.locationButton} onPress={() => openLocationModal()}>
                                    <Text style={styles.locationText}>{subLocality}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                </Animated.View>
                <Animated.View style={[{ paddingHorizontal: 8, paddingBottom: 5 }]}>
                    <TouchableOpacity activeOpacity={1} style={styles.searchContainer} onPress={() => searchPressed()} >
                        <View style={[styles.searchViewStyle]}>
                            <View style={styles.innerSearchBox}>
                                {/* <Image source={SearchUnSelIcon} style={[styles.iconSearch]} /> */}
                                <Text style={styles.searchTextStyle}>{strings.What_are_you_searching_for}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>)
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        height: 40,
        opacity: 1,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //margin: 5,
    },
    searchTextStyle: {
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'grey',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        paddingTop: 2,
        //marginRight: -10
    },
    searchViewStyle: {
        width: '100%',
        height: 32,
        paddingTop: 10,
        paddingBottom: 10,
        //paddingRight: 20,
        paddingHorizontal: 10,
        borderColor: '#444',
        backgroundColor: 'white',//'#DBF3F3',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSearch: {
        //flex: 1,
        //position: 'absolute',
        //top: 13,
        height: 14,
        width: 14,
    },
    innerSearchBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20
    },
    cartButtonContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartButtonImage: {
        position: 'absolute',
        right: 15
    },
    categoryHeaderButton: {
        flex: 0.2,
        justifyContent: 'center'
    },
    homeHeaderContainer: {
        position: 'absolute',
        top: 0,
        paddingTop: isIphoneX?40:20,
        left: 0,
        right: 0,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        //height: 130,
        width: dimensions.width,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationButton: {
        backgroundColor: 'black',
        borderRadius: 15,
        height: 30,
        minWidth: 160,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    categoryImage: {
        marginLeft: 10
    },
    locationText: {
        alignItems: 'center',
        paddingTop: 2,
        fontSize: 12,
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'white'
    },
});