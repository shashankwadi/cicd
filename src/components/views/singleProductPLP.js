'use strict';
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import TimerLabel from 'Wadi/src/components/views/timerLabel';
import Stars from 'react-native-stars';
import images from 'assets/images';
import ExpressWidget from '../widgets/expressWidget';
import {ProgressImageBackground} from '../common';
import {strings} from '../../utilities/uiString';
import wadiStylesheet from 'Wadi/src/utilities/namespaces/wadiStyles';


let screenToCellWidthRatio = 1.0;
let interCellMargin = 0.0;
let imageHeightToWidthRatio = 0.8;
let cellPadding = 10.0;

let initialTotalRightMargin = Math.ceil(screenToCellWidthRatio) * interCellMargin;
let screenWidthWithoutMargin = dimensions.width - initialTotalRightMargin;
let cellWidth = (screenWidthWithoutMargin / screenToCellWidthRatio);
let imageHeight = (cellWidth - (cellPadding * 2)) * imageHeightToWidthRatio;


class SingleProductPLP extends PureComponent {

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
                    <Text style={[wadiStylesheet.wadiBadgeTextStyle, {
                        color: textColor,
                        borderColor: borderColor,
                        backgroundColor: GLOBAL.COLORS.transparentWhite
                    }]} numberOfLines={1} ellipsizeMode={'tail'}>
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
        return (

            <View style={styles.imageOverlayBottomView}>
                <View style={styles.progressBarContainer}>

                    {totalQuantity > 0 && availableQty > 0 &&
                    < View style={styles.progressBarContainerView}>
                        <View
                            style={[styles.progressPendingView, {flex: availableQty / totalQuantity}]}>
                        </View>
                        <View
                            style={[styles.progressDoneView, {flex: 1 - (availableQty / totalQuantity)}]}>
                        </View>
                    </View>}
                    {this.props.data.flash && (this.props.data.flash.isFlash == 1 || this.props.data.flash.active == 1) &&
                    <TimerLabel
                        expiryTime={this.props.data.flash.endAt ? new Date(this.props.data.flash.endAt).getTime() : 0}/>}
                </View>
            </View>

        )
    }

    /**
     *Renders discount available view
     */
    renderDiscountView() {
        let discountValue = this.props.data.discount ? String(this.props.data.discount) : '';
        if (String(discountValue).length > 0) {
            return (
                <Text style={wadiStylesheet.wadiDiscountTextStyle}>
                    {`${discountValue}${strings.offText}`}
                </Text>
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
        let url = (imageKey) ? `https://b.wadicdn.com/product/${imageKey}/${1}-product.jpg` : this.props.data.imageUrl;
        return (

            <View style={styles.imageViewContainer}>
                <ProgressImageBackground 
                    defaultImage = {require('../../icons/placeholderImage.png')}
                    source={{uri: url || imageUrl}} style={styles.imageView} resizeMode='contain'>
                    <View style={styles.imageOverlayView}>
                        {this.renderTopImageOverlay()}
                        {this.renderBottomImageOverlay()}
                    </View>
                </ProgressImageBackground>
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
        this.props.featureMapAPIReducer.featureMapObj.currency ? this.props.featureMapAPIReducer.featureMapObj.currency.label : 'SAR';
        return (
            <View style={styles.productDetailsContainer}>
                <View style={styles.detailsTopView}>
                    <View style={styles.titleView}>
                        <Text style={styles.titleText} numberOfLines={2}>{this.props.data.name}</Text>

                    </View>
                    <View style={styles.discountContainerView}>
                        {this.renderDiscountView()}
                    </View>
                </View>
                <View style={styles.detailsBottomView}>
                    <View style={styles.priceContainterView}>
                        {((this.props.data.price) && (this.props.data.specialPrice)) ?
                            this.renderPriceViewWithSpecialPrice(currency):this.renderPriceView(currency)
                           }
                    </View>
                    <View style={styles.starRatingContainerView}>
                        {this.renderStarRating()}
                    </View>
                </View>
            </View>
        )
    }

    /**
     *Renders rating view
     */
    renderStarRating() {
        if (this.props.data.starRating && String(this.props.data.starRating).length > 0) {
            return (
                <View style={{alignItems: 'flex-start', flexDirection: 'row', marginLeft: 5}}>
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
                        {!!this.props.data.is_express && this.props.data.is_express == 1 &&
                        <View style={styles.expressWidgetContainer}>
                            <ExpressWidget/>
                        </View>}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderPriceViewWithSpecialPrice=(currency)=>{
        return(<View style={styles.priceView}>
            <Text style={styles.priceText}>{`${this.props.data.price}` || ""}</Text>
            <View style={{width: 7}}/>
            <Text
                style={styles.specialPriceText}>{`${this.props.data.specialPrice} ${currency}` || ""}</Text>
        </View> )
    }

    renderPriceView=(currency)=>{
        return( <View style={styles.priceView}>
            <Text
                style={styles.specialPriceText}>{`${this.props.data.price} ${currency}` || ""}</Text>
        </View>)
    }
}

var styles = StyleSheet.create({
    containerView: {
        padding: cellPadding,
        backgroundColor: 'white',
        width: cellWidth,
        marginBottom: 5,
        marginTop: 10

    },
    imageViewContainer: {
        width: cellWidth - (cellPadding * 2),
        height: imageHeight,
        // borderColor: 'lightgray',   //duplicate properties gives error on android
        borderWidth: 0.8,
        borderColor: '#bbbbbb',
        borderRadius: 4,
        overflow: 'hidden',
    },
    imageView: {
        flex: 1,
        backgroundColor: 'white'
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
        fontSize: 15,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        color: GLOBAL.COLORS.headerTitleColor

    },
    productDetailsContainer: {
    },
    detailsTopView: {
        paddingVertical: 5,
        flexDirection: 'row',
        display: 'flex',
        flex: 1,
        alignItems: 'flex-start',
        marginTop: 5
    },
    detailsBottomView: {
        paddingVertical: 5,
        flexDirection: 'row',
    },
    titleView: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    discountContainerView: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 4
    },
    starRatingContainerView: {
        flex: 0.35,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 10
    },
    priceContainterView: {
        flex: 0.65,
        alignItems: 'flex-start',
        justifyContent: 'center'

    },
    priceView: {
        flexDirection: 'row',
        marginLeft: 5,
        alignItems: 'center'

    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 16,
        textAlign: 'left',
        color: GLOBAL.COLORS.headerTitleColor,
    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 13,
        color: 'darkgray',
        textAlign: 'left',
        textDecorationLine: 'line-through'


    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
    },
    progressBarContainerView: {
        marginRight: 50,
        height: 5,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
        width: '50%',
        marginBottom: 5
    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorFilled,
        flexDirection: 'row'
    },
    progressDoneView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorEmpty,
        flexDirection: 'row'

    },
    imageOverlayView: {
        flex: 1,
    },
    imageOverlayTopView: {
        flex: 0.5,
        flexDirection: 'row'
    },
    imageOverlayBottomView: {
        flex: 0.5,

    },
    badgeContainerView: {
        marginTop: 8,
        marginHorizontal: 5,

    },
    badgeText: {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        color: 'darkgray',
        fontSize: 10,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: 'white',
        textAlign: 'center',


    },
    progressBarContainer: {
        flex: 1.0,
        justifyContent: 'flex-end',
        marginLeft: 10,
        marginBottom: 10
    },
    discountView: {
        flex: 0.2,
        paddingTop: 2,
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    discountText: {
        color: 'black',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 10,
        paddingHorizontal: 5,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 7,
        paddingRight: 7,
        textAlign: 'center',
        borderRadius: 2,
        borderWidth: 0.1,
        borderColor: GLOBAL.COLORS.discountViewBackground,
        backgroundColor: GLOBAL.COLORS.discountViewBackground,
        width: 65


    },
    badgeLabelView: {
        padding: 5,
        flexDirection: 'row',
        marginTop: -5,
    },
    unitAndTimerContainer: {
        flexDirection: 'row',
        marginLeft: 5,
        marginTop: 3,

    },
    unitsLeftText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'darkgray',
        fontSize: 12,
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
        marginTop: 4,
        marginBottom: 4
    },
    salesEndTextStyle:{
        color: '#9e9e9e',
        marginTop: 5,
        textAlign: 'left',
        marginRight: 5
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

export default connect(mapStateToProps)(SingleProductPLP)