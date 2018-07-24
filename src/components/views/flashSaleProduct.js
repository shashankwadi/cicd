'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import TimerLabel from 'Wadi/src/components/views/timerLabel';
import Stars from 'react-native-stars';
import images from 'assets/images';

import {PriceView} from '../common';


let verticalMargin = 0.0;
let imageHeightToWidthRatio = 1.3;

export default class FlashSaleProduct extends Component {

    constructor(props) {
        super(props);
    }

    renderTopImageOverlay() {
        return (
            <View style={styles.imageOverlayTopView}>

            </View>
        )
    }

    renderOfferBadge() {
        let borderColor = (this.props.data.offerBadgeBorderColor && this.props.data.offerBadgeBorderColor.length > 0) ? this.props.data.offerBadgeBorderColor : "darkgray";
        let textColor = (this.props.data.offerBadgeTextColor && this.props.data.offerBadgeTextColor.length > 0) ? this.props.data.offerBadgeTextColor : "darkgray";
        return (
            <View style={styles.badgeLabelView}>
                {this.props.data.offerBadge.length > 0 && <View style={styles.badgeContainerView}>
                    <Text style={[styles.badgeText, { color: textColor, borderColor: borderColor }]}>
                        {this.props.data.offerBadge}{' '}
                    </Text>
                </View>}
            </View>
        )
    }

    renderBottomImageOverlay() {
        let discountValue = this.props.data.discount ? String(this.props.data.discount) : ''
        return (
            <View style={styles.imageOverlayBottomView}>
                {discountValue.length > 0 &&
                    <View style={styles.discountView}>
                        <Text style={styles.discountText}>
                            {discountValue}{'% OFF!'}
                        </Text>
                    </View>}
            </View>

        )
    }

    renderImage() {
        return (
            <TouchableOpacity activeOpacity ={1} onPress={this.props.callBack} style={styles.imageView} >
                <ImageBackground source={{ uri: this.props.data.imageUrl }} style={{flex:1}} resizeMode='contain'>
                    <View style={styles.imageOverlayView}>
                        {this.renderTopImageOverlay()}
                        {this.renderBottomImageOverlay()}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
    renderUnitsAndTimer() {
        return (
              <View style={styles.timerView}>
                    {this.renderTimer()}
                </View>
        )
    }

    renderTimer() {

        var showTimer = (this.props.data.expiryTime && String(this.props.data.expiryTime).length > 0 && this.props.data.startTime && String(this.props.data.startTime).length > 0) ? true : false;

        if (showTimer) {
            return (
                <TimerLabel style={styles.timerLabel} prefixText = {'Ends in'} expiryTime={this.props.data.expiryTime} />
            )
        } else {
            return (
                <View />
            )
        }

    }

    renderDetails() {
        let progressDone = Number(this.props.data.progressBar);
        let progressPending = 100 - progressDone;
        return (
            <View style={styles.productDetailsContainer}>
                {this.renderOfferBadge()}
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.title}</Text>
                {this.renderStarRating()}
                {(!!this.props && !!this.props.data)&&
                <PriceView
                    {...this.props.data}
                    //priceTextStyle={styles.priceText}
                    //specialPriceTextStyle={styles.specialPriceText}
                    containerStyles={styles.priceView}
                />}
                {this.props.data.progressBar && this.props.data.progressBar.length > 0 && <View style={styles.stockRemainingProgressView}>
                    <View style={styles.progressBarContainerView}>
                        <View style={[styles.progressPendingView, { flex: progressPending / 10 }]}/>
                        <View style={[styles.progressDoneView, { flex: progressDone / 10 }]}/>
                    </View>
                    <View style = {styles.percentSoldView}>
                    <Text style = {styles.percentSoldText}>{progressDone}% Sold</Text>
                    </View> 
                </View>}
                {this.renderUnitsAndTimer()}
            </View>
        )
    }

    renderStarRating() {
        let totalRatings = (!!this.props.data.totalRatings && String(this.props.data.totalRatings).length > 0) ? ('(' + this.props.data.totalRatings + ')') : '';
        if (this.props.data.starRating && String(this.props.data.starRating).length > 0) {
            return (
                <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginLeft: 5 }}>
                    <Stars
                    half={true}
                    rating = {this.props.data.starRating}
                    spacing={2}
                    count={5}
                    starSize={12}
                    backingColor='transparent'
                    fullStar={images.starFilled}
                    emptyStar={images.starEmpty}
                    halfStar={images.starHalf}/>
                    
                    <Text style={styles.totalRatingsText}> {totalRatings} </Text>

                </View>)
        } else {
            return (<View style={{ height: 0 }} />)
        }

    }

    render() {
        return (
            <View style={{backgroundColor: 'transparent', padding: 7.5, width: dimensions.width }}>
                <View style={styles.containerView}>
                    <View style = {{flexDirection: 'row'}}>
                        {this.renderImage()}
                        {this.renderDetails()}
                    </View>
                </View>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    containerView: {
        padding: 10,
        borderRadius: 3,                
        backgroundColor: 'white',
        marginVertical: verticalMargin,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    imageView: {
        flex: 0.3,
        backgroundColor: 'white'
    },
    timerView: {
        marginTop: 5,
        marginLeft: 5,
        justifyContent: 'center'

    },
    titleText: {
        fontSize: 12,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        marginTop: 5

    },
    productDetailsContainer: {
        flex: 0.70,
        justifyContent: 'center',
        paddingRight: 5
    },
    priceView: {
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 5,

    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 12,
        textAlign: 'left',
        color: GLOBAL.COLORS.wadiDarkGreen,
        marginTop: 5,
        marginLeft: 10,        

    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
        textAlign: 'left',
        marginTop: 5,
        textDecorationLine: 'line-through'


    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        marginTop: 5
    },
    stockRemainingProgressView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 5,
        marginTop: 5,
        
    },
    progressBarContainerView: {
        flex: 0.6,
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 3,
        borderColor: GLOBAL.COLORS.wadiRoseColor,
        borderWidth: 1.5,
        height: 10,
    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorFilled,
    },
    progressDoneView: {
        backgroundColor: 'white',
    },
    percentSoldView: {
        flex: 0.4,
        marginLeft: 5,
        justifyContent: 'center'
    },
    percentSoldText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 10,
        color: 'darkgray',
        textAlign: 'left',
    },
    imageOverlayView: {
        flex: 1,
    },
    imageOverlayTopView: {
        flex: 0.5
    },
    imageOverlayBottomView: {
        flex: 0.5,
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    badgeContainerView: {
        marginTop: 3,
        flexDirection: 'row',
    },
    badgeText: {
        paddingTop: 4,
        paddingLeft: 4,
        color: 'darkgray',
        fontSize: 8,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 4,
        alignSelf: 'center',
        backgroundColor: 'white'

    },
    discountView: {
        backgroundColor: GLOBAL.COLORS.discountViewBackground,

    },
    discountText: {
        color: 'black',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 11,
        paddingHorizontal: 5,
        paddingTop: 2,
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 0.1,
        borderColor: GLOBAL.COLORS.discountViewBackground

    },
    badgeLabelView: {
        paddingLeft: 5
    },
    unitAndTimerContainer: {
        flexDirection: 'row',
        marginLeft: 5,
        marginTop: 3,

    },
    unitsLeftText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'darkgray',
        fontSize: 12
    },
    totalRatingsText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'darkgray',
        fontSize: 12

    },
    addToCartContainer: {
        marginTop: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        borderRadius: 5       
    },
    addToCartButton: {
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        color: 'white',
        fontSize: 16

    }
});
