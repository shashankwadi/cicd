'use strict';
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';


import * as GLOBAL from 'Wadi/src/utilities/constants';

import {dimensions} from 'utilities/utilities';
import TimerLabel from 'Wadi/src/components/views/timerLabel';
import Stars from 'react-native-stars';
import images from 'assets/images';
import ExpressWidget from '../widgets/expressWidget';
import {ProgressImageBackground} from '../common';
import {strings} from '../../utilities/uiString';
import {connect} from 'react-redux';
import wadiStylesheet from 'Wadi/src/utilities/namespaces/wadiStyles';


let screenToCellWidthRatio = 2.0;
let interCellMargin = 0.0;
let verticalMargin = 0.0;
let imageHeightToWidthRatio = 1.20;

let initialTotalRightMargin = Math.ceil(screenToCellWidthRatio) * interCellMargin;
let screenWidthWithoutMargin = dimensions.width - initialTotalRightMargin;
let cellWidth = screenWidthWithoutMargin / screenToCellWidthRatio;
let imageHeight = cellWidth * imageHeightToWidthRatio;

class GridProductPLP extends PureComponent {

    constructor(props) {
        super(props);
    }

    /**
     * Renders empty view on the top half of the image
     *
     */
    renderTopImageOverlay() {
        return (
            <View style={styles.imageOverlayTopView}>
                {this.renderOfferBadge()}
            </View>
        )
    }


    /**
     * Renders offer text on the top of the product image
     */
    renderOfferBadge() {
        let {badges, offerBadge, ribbon} = this.props.data;
        let borderColor = (this.props.data.offerBadgeBorderColor && this.props.data.offerBadgeBorderColor.length > 0) ? this.props.data.offerBadgeBorderColor : GLOBAL.COLORS.wadidarkgrey;
        let textColor = (this.props.data.offerBadgeTextColor && this.props.data.offerBadgeTextColor.length > 0) ? this.props.data.offerBadgeTextColor : GLOBAL.COLORS.wadidarkgrey;
        return (
            <View style={styles.badgeLabelView}>
                {(ribbon && ribbon.name) &&
                <View style={styles.badgeContainerView}>
                    <Text style={[wadiStylesheet.wadiBadgeTextStyle, {color: textColor, borderColor: borderColor,backgroundColor:GLOBAL.COLORS.transparentWhite}]} numberOfLines={1} ellipsizeMode={'tail'}>
                        {ribbon.name.toUpperCase()}
                    </Text>
                </View>
                }
            </View>
        )
    }

    /***
     *Renders timer label if flash sale is active and shows available quantity left
     */
    renderBottomImageOverlay() {
        let totalQuantity = (this.props.data.flash && this.props.data.flash.totQty) ? this.props.data.flash.totQty : 0;
        let availableQty = (this.props.data.flash && this.props.data.flash.availableQty) ? this.props.data.flash.availableQty : 0;
        if ((this.props.data.flash && (this.props.data.flash.isFlash == 1 || this.props.data.flash.active == 1))
            || totalQuantity > 0 && availableQty > 0) {
            return (
                <View style={styles.imageOverlayBottomView}>
                    <View style={styles.progressBarContainer}>
                        {this.props.data.flash && (this.props.data.flash.isFlash == 1 || this.props.data.flash.active == 1) &&
                        <View style={styles.timerLabelUnitsLeftContainer}>
                            {availableQty > 0 && <Text style={{fontSize: 12}}>{availableQty} {strings.UnitsLeft}</Text>}
                            <TimerLabel
                                expiryTime={this.props.data.flash.endAt ? new Date(this.props.data.flash.endAt).getTime() : 0}/></View>}
                        {totalQuantity > 0 && availableQty > 0 &&
                        <View style={styles.progressBarContainerView}>
                            <View
                                style={[styles.progressPendingView, {flex: availableQty / totalQuantity}]}>
                            </View>
                            <View
                                style={[styles.progressDoneView, {flex: 1 - (availableQty / totalQuantity)}]}>
                            </View>
                        </View>}
                    </View>
                </View>

            )
        } else {
            return (
                <View/>
            )
        }
    }

    /**
     *Renders image of the product as a background which calls bottom and top renderer to show timer label, quantity and discount
     */
    renderImage() {
        let {imageKey, maxImages, imageUrl} = this.props.data;
        let url = (imageKey) ? `https://b.wadicdn.com/product/${imageKey}/${1}-product.jpg` : undefined;
        let discountValue = this.props.data.discount ? String(this.props.data.discount) : '';
        return (
            <View style={styles.imageViewContainer}>
                <ProgressImageBackground 
                    defaultImage = {require('../../icons/placeholderImage.png')}
                    source={{uri: url || imageUrl}} 
                    style={styles.imageView} resizeMode='contain'>
                        <View style={styles.imageOverlayView}>
                                {this.renderTopImageOverlay()}
                        </View>
                        {discountValue.length > 0 &&
                        <View style={styles.discountView}>
                            <Text style={wadiStylesheet.wadiDiscountTextStyle}>
                                {`${discountValue}${strings.offText}`}
                            </Text>

                        </View>}
                </ProgressImageBackground>
                {this.renderBottomImageOverlay()}
            </View>
        )
    }


    /**
     * Renders product detail which includes name price and express icon if its provided by wadi express
     *
     */
    renderDetails() {
        let currency = this.props.featureMapAPIReducer
        && this.props.featureMapAPIReducer.featureMapObj &&
        this.props.featureMapAPIReducer.featureMapObj.currency ? this.props.featureMapAPIReducer.featureMapObj.currency.label:'SAR';
        return (
            <View style={styles.productDetailsContainer}>
                {(this.props.data.name) &&
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.name}</Text>}
                {this.renderStarRating()}
                {((this.props.data.price) && (this.props.data.specialPrice)) ?
                    this.renderPriceViewWithSpecialPrice(currency):this.renderPriceView(currency)

                }
                {!!this.props.data.is_express && this.props.data.is_express == 1 &&
                <View style={styles.expressWidgetContainer}>
                    <ExpressWidget/>
                </View>}


            </View>
        )
    }


    /**
     *Renders rating view
     */
    renderStarRating() {
        let totalRatings = (!!this.props.data.totalRatings && (String(this.props.data.totalRatings).length > 0)) ? ('(' + this.props.data.totalRatings + ')') : '';
        if (!!this.props.data.starRating && String(this.props.data.starRating).length > 0) {
            return (
                <View style={{alignItems: 'flex-start', flexDirection: 'row', marginLeft: 10}}>
                    <Stars
                        half={true}
                        rating={this.props.data.starRating}
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
            return (<View style={{height: 0}}/>)
        }

    }

    render() {
        return (
            <View>
                <TouchableOpacity activeOpacity={1} onPress={this.props.callBack}>
                    <View style={styles.containerView}>
                        {this.renderImage()}
                        {this.renderDetails()}

                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    renderPriceViewWithSpecialPrice=(currency)=>{
        return(<View style={styles.priceView}>
            <Text style={styles.priceText}>{`${this.props.data.price}` || ''}</Text>
            <View style={{width: 7}}/>
            <Text style={styles.specialPriceText}>{`${this.props.data.specialPrice} ${currency}` || ''}</Text>

        </View>)
    }

    renderPriceView=(currency)=>{
        return( <View style={styles.priceView}>
            <Text style={styles.specialPriceText}>{`${this.props.data.price} ${currency}` || ''}</Text>
        </View>)
    }
}

var styles = StyleSheet.create({
    containerView: {
        marginRight: interCellMargin,
        backgroundColor: 'white',
        marginVertical: verticalMargin,
        width: cellWidth,
        overflow: 'hidden',
        borderWidth: 0.3,
        borderColor: '#bbbbbb',
        paddingTop: 10

    },
    imageViewContainer: {
        width: cellWidth,
        height: imageHeight,

    },
    imageView: {
        flex: 1,
        backgroundColor: 'white',
    },
    unitsRemainView: {
        flex: 0.5,
        justifyContent: 'center'
    },
    timerView: {
        flex: 0.5,
        alignItems: 'flex-start',
        justifyContent: 'center'

    },
    titleText: {
        fontSize: 14,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        marginTop: 5,
        color:GLOBAL.COLORS.headerTitleColor

    },
    productDetailsContainer: {
        height: 110,
        justifyContent: 'flex-start',
        padding: 5
    },
    priceView: {
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 5,
        alignItems: 'center',

    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 17,
        textAlign: 'left',
        color: GLOBAL.COLORS.headerTitleColor,
        marginTop: 5,

    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 13,
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
    progressBarContainerView: {
        marginLeft: 10,
        marginRight: 15,
        height: 5,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorFilled
    },
    progressDoneView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorEmpty

    },
    imageOverlayView: {
        flex: 1,
    },
    imageOverlayTopView: {
        flex: 0.5
    },
    imageOverlayBottomView: {
        flex: 0.15,
        justifyContent:'flex-end',

    },
    badgeContainerView: {
        marginTop: 3,
        marginHorizontal: 5,
    },
    progressBarContainer: {
        justifyContent: 'flex-end',
        backgroundColor:'white',
        marginTop: 2
    },
    discountView: {
        paddingTop: 2,
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginLeft: 10,

    },
    badgeLabelView: {
        paddingLeft: 5,
        flexDirection: 'row',
        marginTop: 2
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
    subtitleContainer: {
        marginTop: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GLOBAL.COLORS.superSmashingDefaultBackground,
        borderRadius: 5
    },
    subtitleText: {
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        color: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 16

    },
    separatorView: {
        height: 0.5,
        backgroundColor: 'lightgray'
    },
    expressWidgetContainer: {
        display: 'flex',
        flex: 0,
        flexDirection: 'row',
        marginTop: 3,
        marginBottom: 4,
        marginLeft: 5
    },
    timerLabelUnitsLeftContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15,
        marginLeft: 5,
        paddingLeft: 5
    },
    timerLabelContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    salesEndTextStyle:{
        color: '#9e9e9e',
        marginTop: 5,
        textAlign: 'left',
        marginRight: 5
    },
    unitLeftContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    timerLabelProps:{
        color: '#686868',
        marginTop: 9
    }
});

function mapStateToProps(state) {

    return {
        featureMapAPIReducer: state.featureMapAPIReducer,
    }
}
export default connect(mapStateToProps)(GridProductPLP)