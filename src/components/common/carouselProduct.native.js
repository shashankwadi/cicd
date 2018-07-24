'use strict';
import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native';
import TimerLabel from 'Wadi/src/components/views/timerLabel';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import deeplinkHandler from '../../utilities/managers/deeplinkHandler';
import ExpressWidget from '../widgets/expressWidget'
import {connect} from "react-redux";
import {strings} from "../../utilities/uiString";
import wadiStylesheet from 'Wadi/src/utilities/namespaces/wadiStyles';

import ProgressiveImage from 'Wadi/src/helpers/progressiveImage';

let screenToCellWidthRatio = 2.25;
let interCellMargin = 0.0;
let verticalMargin = 0.0;
let imageHeightToWidthRatio = 1.3;

let initialTotalRightMargin = Math.ceil(screenToCellWidthRatio) * interCellMargin
let screenWidthWithoutMargin = dimensions.width - initialTotalRightMargin
let cellWidth = screenWidthWithoutMargin / screenToCellWidthRatio
let imageHeight = cellWidth * imageHeightToWidthRatio;

class CarouselProduct extends PureComponent {

    constructor(props) {
        super(props);
    }


    renderTopImageOverlay() {
        let {offerBadge, ribbon, offerBadgeBorderColor, offerBadgeTextColor} = this.props.data
        let borderColor = (offerBadgeBorderColor && offerBadgeBorderColor.length > 0) ? offerBadgeBorderColor : GLOBAL.COLORS.darkGreyColor;
        let textColor = (offerBadgeTextColor && offerBadgeTextColor.length > 0) ? offerBadgeTextColor : GLOBAL.COLORS.darkGreyColor;
        if (ribbon && ribbon.name) {
            return (
                this.renderRibbonView(ribbon, textColor, borderColor)
            )
        }
        if (offerBadge && offerBadge.length > 0) {
            return (
                this.renderOfferBadge(offerBadge,textColor,borderColor)
            )
        }
        return <View style={styles.imageOverlayTopView} />
    }

    renderBottomImageOverlay() {

        let discountValue = this.props.data.discount ? String(this.props.data.discount) : '';
        let totalQuantity = (this.props.data.flash && this.props.data.flash.totQty) ? this.props.data.flash.totQty : 0;
        let availableQty = (this.props.data.flash && this.props.data.flash.availableQty) ? this.props.data.flash.availableQty : 0;

        return (
            <View style={styles.imageOverlayBottomView}>
                <View style={styles.progressBarContainer}>
                    {this.props.data.flash && (this.props.data.flash.isFlash == 1 || this.props.data.flash.active == 1) &&
                    <View style={styles.timerLabelContainerCarousalProduct}>
                        {availableQty > 0 && <Text style={{fontSize:10}}>{availableQty} {strings.UnitsLeft}</Text>}

                        <TimerLabel style={{color: '#686868'}} expiryTime={this.props.data.flash.endAt ? new Date(this.props.data.flash.endAt).getTime() : 0}/>
                    </View>}
                    {totalQuantity > 0 && availableQty > 0 &&this.renderQuantityView(availableQty,totalQuantity)}
                </View>
                {discountValue.length > 0 &&
                <View style={styles.discountView}>
                    <Text style={wadiStylesheet.wadiDiscountTextStyle}>
                        {`${discountValue}% OFF`}
                    </Text>

                </View>}


            </View>

        )
    }

    renderImage() {
        let imageUrl = (this.props.data.imageKey) ? `https://b.wadicdn.com/product/${this.props.data.imageKey}/${1}-product.jpg` : this.props.data.imageUrl;
        return (
            <ImageBackground source={{uri: imageUrl}} style={styles.imageView} resizeMode='contain'>
                <View style={styles.imageOverlayView}>
                    {this.renderTopImageOverlay()}
                    {this.renderBottomImageOverlay()}
                </View>
            </ImageBackground>
        )
    }

    /**
     * Renders detail of the product including name price view quantity progressbar
     * @returns {XML}
     */
    renderDetails() {
        let currency = this.props.featureMapAPIReducer
        && this.props.featureMapAPIReducer.featureMapObj &&
        this.props.featureMapAPIReducer.featureMapObj.currency ? this.props.featureMapAPIReducer.featureMapObj.currency.label:'SAR';
        let progressDone = Number(this.props.data.progressBar);
        let progressPending = 100 - progressDone;
        let progressPendingText = (progressPending) + '% LEFT'
        return (
            <View style={styles.productDetailsContainer}>
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.name}</Text>

                {((this.props.data.price) && (this.props.data.specialPrice)) ?
                    this.renderSpecialPriceView(currency):this.renderPriceView(currency)

                }
                {!!this.props.data.is_express&&this.props.data.is_express==1&&<View style={styles.expressWidgetContainer}>
                    <ExpressWidget/>
                </View>}

                {!!(this.props.data.progressBar && this.props.data.progressBar.length > 0) && this.renderProductQuantityView(progressPending,progressDone)}
                {!!(this.props.data.progressBar && this.props.data.progressBar.length > 0) && <Text style={styles.progressPendingText}>
                    {progressPendingText}
                </Text>}
            </View>
        )
    }

    render() {

        return (
            <TouchableOpacity activeOpacity ={1} onPress={this.props.callBack}>
                <View style={styles.containerView}>
                    {this.renderImage()}
                    {this.renderDetails()}
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Renders ribbon View
     * @param ribbon
     * @param textColor
     * @param borderColor
     */
    renderRibbonView(ribbon,textColor,borderColor) {
        return(<View style={styles.imageOverlayTopView}>
            <View style={styles.badgeContainerView}>
                <Text style={[wadiStylesheet.wadiBadgeTextStyle, {color: textColor, borderColor: borderColor,backgroundColor:GLOBAL.COLORS.transparentWhite}]} numberOfLines={1} ellipsizeMode={'tail'}>
                    {ribbon.name.toUpperCase()}
                </Text>
            </View>
        </View>)
    }

    /**
     * Renders offer badge
     * @param offerBadge
     * @param textColor
     * @param borderColor
     * @returns {XML}
     */
    renderOfferBadge(offerBadge,textColor,borderColor){
        return(<View style={styles.imageOverlayTopView}>
            <View style={styles.badgeContainerView}>
                <Text style={[styles.badgeText, {color: textColor, borderColor: borderColor,backgroundColor:GLOBAL.COLORS.transparentWhite}]} numberOfLines={1} ellipsizeMode={'tail'}>
                    {offerBadge + ' '}
                </Text>
            </View>
        </View>)
    }

    /**
     * Renders quantity progressbar
     * @param availableQty
     * @param totalQuantity
     */
    renderQuantityView(availableQty,totalQuantity){
        return(< View style={styles.progressBarContainerView}>
            <View
                style={[styles.progressPendingView, {flex: availableQty / totalQuantity}]}>
            </View>
            <View
                style={[styles.progressDoneView, {flex: 1 - (availableQty / totalQuantity)}]}>
            </View>
        </View>)
    }

    /**
     * Renders special price View
     * @param currency
     * @returns {XML}
     */
    renderSpecialPriceView(currency){
        return(<View style={styles.priceView}>
            <Text style={styles.priceText}>{`${this.props.data.price}` || ''}</Text>
            <Text style={styles.specialPriceText}>{`${this.props.data.specialPrice} ${currency}` || ''}</Text>

        </View> )
    }

    /**
     * Renders price view without special price
     * @param currency
     * @returns {XML}
     */
    renderPriceView(currency){
        return(<View style={styles.priceView}>
            <Text style={styles.specialPriceText}>{`${this.props.data.price} ${currency}` || ''}</Text>
        </View>)
    }

    renderProductQuantityView(progressPending,progressDone){
        return(<View style={styles.progressBarContainerView}>
            <View style={[styles.progressPendingView, { flex: progressPending / 10 }]}>
            </View>
            <View style={[styles.progressDoneView, { flex: progressDone / 10 }]}>
            </View>
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
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: GLOBAL.COLORS.bordergGreyColor,
        flex: 1

    },
    imageView: {
        width: cellWidth,
        height: imageHeight,
        marginTop: 5
    },
    titleText: {
        width: cellWidth,
        fontSize: 12,
        paddingLeft: 5,
        paddingRight: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        color: GLOBAL.COLORS.black

    },
    productDetailsContainer: {
        paddingVertical: 10,
    },
    priceView: {
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 2,

    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        color: GLOBAL.COLORS.black,
        marginLeft: 5


    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
        textDecorationLine: 'line-through',
        marginLeft: 2,
        paddingTop: 1

    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
    },
    progressBarContainerView: {
        marginLeft: 5,
        marginRight: 5,
        height: 5,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
    },
    progressBarContainer: {
        justifyContent: 'flex-end',
        backgroundColor:'white',
        //paddingTop:2
    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorFilled
    },
    progressDoneView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorEmpty

    },
    progressPendingText: {
        marginTop: 1,
        fontSize: 8,
        marginLeft: 5,
        color: GLOBAL.COLORS.wadiRoseColor
    },
    imageOverlayView: {
        flex: 1,
    },
    imageOverlayTopView: {
        flex: 0.5
    },
    imageOverlayBottomView: {
        flex: 0.5,
        justifyContent:'flex-end',

    },
    badgeContainerView: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',

    },
    discountView: {
        paddingTop: 2,
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginLeft: 5,
        backgroundColor:'transparent',
        //opacity:0.2

    },
    expressWidgetContainer:{
        display:'flex',
        flex:0,
        flexDirection:'row',
        marginTop:10,
        marginLeft:5
    },
    timerLabelContainerCarousalProduct:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15,
        marginLeft:5,
        paddingLeft:5
    }
});

function mapStateToProps(state) {

    return {
        featureMapAPIReducer: state.featureMapAPIReducer,
    }
}
export default connect(mapStateToProps)(CarouselProduct)