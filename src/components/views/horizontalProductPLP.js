'use strict';
import React, {PureComponent} from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import TimerLabel from 'Wadi/src/components/views/timerLabel';
import Stars from 'react-native-stars';
import images from 'assets/images';
import ExpressWidget from '../widgets/expressWidget';
import {strings} from '../../utilities/uiString';
import {connect} from 'react-redux';
import BulletListInfo from 'Wadi/src/components/views/pdp/bulletListInfo';
import {ProgressImageBackground} from '../common';
import WadiStylesheet from 'Wadi/src/utilities/namespaces/wadiStyles';

let verticalMargin = 0.0;

class HorizontalProductPLP extends PureComponent {

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

            </View>
        )
    }

    /**
     * Renders offer text on the top of the product image
     */
    renderOfferBadge() {
        let {badges, offerBadge, ribbon} = this.props.data;
        let borderColor = (this.props.data.offerBadgeBorderColor && this.props.data.offerBadgeBorderColor.length > 0) ? this.props.data.offerBadgeBorderColor : GLOBAL.COLORS.wadidarkgray;
        let textColor = (this.props.data.offerBadgeTextColor && this.props.data.offerBadgeTextColor.length > 0) ? this.props.data.offerBadgeTextColor : GLOBAL.COLORS.wadidarkgray;
        return (
            <View style={styles.badgeLabelView}>

                {(ribbon && ribbon.name) &&
                <View style={styles.badgeContainerView}>
                    <Text style={[WadiStylesheet.wadiBadgeTextStyle, {
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
        let discountValue = this.props.data.discount ? String(this.props.data.discount) : '';
        return (
            <View style={styles.imageOverlayBottomView}>
                {discountValue.length > 0 &&
                <View style={styles.discountView}>
                    <Text style={WadiStylesheet.wadiDiscountTextStyle}>
                        {`${discountValue}${strings.offText}`}
                    </Text>
                </View>}
            </View>

        )
    }

    /**
     *Renders image of the product as a background which calls bottom and top renderer to show timer label, quantity and discount
     */
    renderImage() {
        let {imageKey, maxImages} = this.props.data;
        let url = (imageKey) ? `https://b.wadicdn.com/product/${imageKey}/${1}-product.jpg` : this.props.data.imageUrl;
        return (
            <ProgressImageBackground
                defaultImage = {require('../../icons/placeholderImage.png')}
                source={{uri: url}} style={styles.imageView} resizeMode='contain'>
                <View style={styles.imageOverlayView}>
                    {this.renderTopImageOverlay()}
                    {this.renderBottomImageOverlay()}
                </View>
            </ProgressImageBackground>
        )
    }


    /**
     * Renders product details
     */
    renderDetails() {
        let totalQuantity = (this.props.data.flash && this.props.data.flash.totQty) ? this.props.data.flash.totQty : 0;
        let availableQty = (this.props.data.flash && this.props.data.flash.availableQty) ? this.props.data.flash.availableQty : 0;
        let currency = this.props.featureMapAPIReducer && this.props.featureMapAPIReducer.featureMapObj &&
        this.props.featureMapAPIReducer.featureMapObj.currency ? this.props.featureMapAPIReducer.featureMapObj.currency.label : 'SAR';
        return (
            <View style={styles.productDetailsContainer}>
                {this.renderOfferBadge()}
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.name}</Text>
                {this.props.data.highlights && this.props.data.highlights.length > 0 &&
                    <View style = {{marginLeft: 8, marginTop: 10}}>
                <BulletListInfo bulletData={this.props.data.highlights} parentStyle = {{fontSize: 13}}/>
                    </View>}
                {this.renderStarRating()}
                {((this.props.data.price) && (this.props.data.specialPrice)) ?
                    this.renderPriceWithSpecialPrice(currency): this.renderPrice(currency)
                }
                {this.props.data.flash && (this.props.data.flash.isFlash == 1 || this.props.data.flash.active == 1) &&
                this.renderTimerContainer(availableQty)}
                {totalQuantity > 0 && availableQty > 0 && this.renderQuantityView()}
                {!!this.props.data.is_express && this.props.data.is_express == 1 &&
                <View style={styles.expressWidgetContainer}>
                    <ExpressWidget/>
                </View>}
            </View>
        )
    }

    /**
     *Renders ratings view
     */
    renderStarRating() {
        let totalRatings = (String(this.props.data.totalRatings).length > 0) ? ('(' + this.props.data.totalRatings + ')') : '';
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
                    <Text style={styles.totalRatingsText}> {totalRatings} </Text>

                </View>)
        } else {
            return (<View style={{height: 0}}/>)
        }

    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.props.callBack}>
                <View style={{backgroundColor: 'white', padding: 4, width: dimensions.width}}>
                    <View style={styles.containerView}>
                        <View style={{flexDirection: 'row'}}>
                            {this.renderImage()}
                            {this.renderDetails()}

                        </View>
                    </View>
                </View>
                <View style={styles.separatorView}/>

            </TouchableOpacity>
        )
    }

    /**
     *
     *Renders unit left and timer label
     */
    renderTimerContainer =(availableQty)=>{
        return(<View style={styles.timerContainerHorizontalPLP}>
            {availableQty > 0 &&
            <Text style={{fontSize: 12, color: GLOBAL.COLORS.red}}>{availableQty} {strings.UnitsLeft}</Text>}
            <TimerLabel
                expiryTime={this.props.data.flash.endAt ? new Date(this.props.data.flash.endAt).getTime() : 0}/></View>)

    }
    /**
     * Renders price as well as special price view
     * @param currency
     *
     */
    renderPriceWithSpecialPrice= (currency) => {
        return(<View style={styles.priceView}>

            <Text style={styles.priceText}>{`${this.props.data.price}` || ""}</Text>
            <View style={{width: 7}}/>
            <Text
                style={styles.specialPriceText}>{`${this.props.data.specialPrice} ${currency}` || ""}</Text>
        </View> )
    }

    /**
     * Renders price view
     * @param currency
     *
     */
    renderPrice = (currency) => {
        return(<View style={styles.priceView}>
            <Text style={styles.specialPriceText}>{`${this.props.data.price} ${currency}` || ""}</Text>
        </View>)
    }

    /**
     * Renders quantity progressbar
     *
     */
    renderQuantityView = () => {
        return(<View style={styles.progressBarContainerView}>
            <View
                style={[styles.progressPendingView, {flex: availableQty / totalQuantity}]}>
            </View>
            <View
                style={[styles.progressDoneView, {flex: 1 - (availableQty / totalQuantity)}]}>
            </View>
        </View>)
    }
}

var styles = StyleSheet.create({
    containerView: {
        padding: 5,
        backgroundColor: 'white',
        marginVertical: verticalMargin,
    },
    imageView: {
        flex: 0.25,
        backgroundColor: 'white'
    },
    unitsRemainView: {
        flex: 0.5,
        justifyContent: 'center'
    },
    timerView: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center'

    },
    titleText: {
        fontSize: 16,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        marginTop: 5,
        marginLeft: 10,
        color: GLOBAL.COLORS.headerTitleColor,

    },
    productDetailsContainer: {
        flex: 0.75,
        justifyContent: 'center',
        paddingRight: 5
    },
    priceView: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 15,
        alignItems: 'center'

    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 17,
        textAlign: 'left',
        color: 'black',
        marginTop: 5

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
        marginRight: 50,
        height: 5,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
        marginLeft: 10,
        paddingLeft: 5
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
        flex: 0.5,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    badgeContainerView: {
        marginTop: 3,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    badgeText: {
        padding: 4,
        color: 'darkgray',
        fontSize: 10,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        borderColor: 'darkgray',
        borderWidth: 1,
        alignSelf: 'center',
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: 4

    },
    discountView: {
        padding: 2,
        borderRadius: 4,


    },
    discountText: {
        color: 'black',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 10,
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 0.1,
        borderColor: GLOBAL.COLORS.discountViewBackground,
        width: 65,

    },
    badgeLabelView: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginLeft: 5
    },
    unitAndTimerContainer: {
        flexDirection: 'row',
        marginLeft: 5,
        marginTop: 3,
        marginRight: 50,

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
        marginTop: 4,
        marginLeft: 15
    },
    timerContainerHorizontalPLP:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 50,
        marginLeft: 10,
        paddingLeft: 5,
        marginTop: 5,
        marginBottom: 5
    }
});

function mapStateToProps(state) {

    return {
        featureMapAPIReducer: state.featureMapAPIReducer,
    }
}

export default connect(mapStateToProps)(HorizontalProductPLP)