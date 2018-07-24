'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import { strings } from 'Wadi/src/utilities/uiString';
import TimerLabel from 'Wadi/src/components/views/timerLabel';
import Stars from 'react-native-stars';
import images from 'assets/images';
import {PriceView} from '../common';

import { selectors } from 'Wadi/src/reducers/reducers';
import store from 'Wadi/src/reducers/store';

let verticalMargin = 0.0;

export default class SuperSmashingProduct extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Renders blank view on the top of image of product
     */
    renderTopImageOverlay() {
        return (
            <View style={styles.imageOverlayTopView}>

            </View>
        )
    }


    renderOfferBadge() {
        let borderColor = (this.props.data.offerBadgeBorderColor.length > 0) ? this.props.data.offerBadgeBorderColor : "darkgray";
        let textColor = (this.props.data.offerBadgeTextColor.length > 0) ? this.props.data.offerBadgeTextColor : "darkgray";
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

    /**
     *Renders discount view
     */
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

    /**
     *Renders product image and discount view
     */
    renderImage() {
        return (
            <ImageBackground source={{ uri: this.props.data.imageUrl }} style={styles.imageView} resizeMode='contain'>
                <View style={styles.imageOverlayView}>
                    {this.renderTopImageOverlay()}
                    {this.renderBottomImageOverlay()}
                </View>
            </ImageBackground>
        )
    }

    /**
     *
     * Renders timer and stock remaining view
     */
    renderUnitsAndTimer() {
        return (
            <View style={styles.unitAndTimerContainer}>
                <View style={styles.unitsRemainView}>
                    {String(this.props.data.stockQty).length > 0 &&
                        <Text style={styles.unitsLeftText}
                            numberOfLines={1}
                        >
                            {this.props.data.stockQty} units left
                    </Text>
                    }
                </View>
                <View style={styles.timerView}>
                    {this.renderTimer()}
                </View>
            </View>
        )
    }

    /**
     *Renders timer view
     */
    renderTimer() {

        let showTimer = (this.props.data.expiryTime && String(this.props.data.expiryTime).length > 0) ? true : false;
        if (showTimer) {
            return (
                <TimerLabel style={styles.timerLabel} expiryTime={this.props.data.expiryTime} />
            )
        } else {
            return (
                <View />
            )
        }

    }

    /***
     *
     * Renders Product detail
     */
    renderDetails() {
        let progressDone = Number(this.props.data.progressBar);
        let progressPending = 100 - progressDone;

        return (
            <View style={{flex:1}}>
                <View style={styles.productDetailsContainer}>
                    {this.renderOfferBadge()}
                    <Text style={styles.titleText} numberOfLines={2}>{this.props.data.title}</Text>
                    {this.renderStarRating()}
                    {(!!this.props && !!this.props.data)&&
                    <PriceView
                        {...this.props.data}
                        priceTextStyle={styles.priceText}
                        specialPriceTextStyle={styles.specialPriceText}
                        containerStyles={styles.priceView}
                    />
                    }
                    {this.renderUnitsAndTimer()}
                    {this.props.data.progressBar && this.props.data.progressBar.length > 0 && <View style={styles.progressBarContainerView}>
                        <View style={[styles.progressPendingView, { flex: progressPending / 10 }]}>
                        </View>
                        <View style={[styles.progressDoneView, { flex: progressDone / 10 }]}>
                        </View>
                    </View>}
                </View>
            </View>
        )
    }

    /**
     *
     * Renders rating view
     */
    renderStarRating() {
        let totalRatings = (String(this.props.data.totalRatings).length > 0) ? ('(' + this.props.data.totalRatings + ')') : '';
        if (this.props.data.starRating && String(this.props.data.starRating).length > 0) {
            return (
                <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginLeft: 5 }}>
                    <Stars
                        disabled={true}
                        half={true}
                        rating={this.props.data.starRating}
                        spacing={2}
                        count={5}
                        starSize={12}
                        backingColor='transparent'
                        fullStar={images.starFilled}
                        emptyStar={images.starEmpty}
                        halfStar={images.starHalf} />
                    <Text style={styles.totalRatingsText}> {totalRatings} </Text>

                </View>)
        } else {
            return (<View style={{ height: 0 }} />)
        }

    }

    /**
     *Renders add to cart button
     */
    renderActionButton = () => {
        let dataSource = this.props.data;
        let isOutOfStock = selectors.isOutOfStock(dataSource);
        let isAlreadyInCart = selectors.isAlreadyInCart(store.getState().cart, dataSource);
        let disabled = (!isAlreadyInCart && isOutOfStock) ? true : false;
        let actionButtonStyle = (isAlreadyInCart || disabled) ? { backgroundColor: GLOBAL.COLORS.lightGreyColor } : undefined;
        let actionButtonText = disabled ? strings.OutOfStcok : (isAlreadyInCart ? strings.AlreadyInCart : strings.AddToCart);
        let callBackParams = {
            addToCartClicked: true,
            showDetails: false,
            isAlreadyInCart: isAlreadyInCart,
        }
        return (
            <TouchableOpacity activeOpacity ={1}
                disabled={disabled}
                style={[styles.addToCartContainer, actionButtonStyle]}
                onPress={() => this.callBack(callBackParams)}>
                <Text style={[styles.addToCartButton]}>{actionButtonText}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        let backgroundColor = (this.props.data.is_promoted) ? GLOBAL.COLORS.superSmashingDefaultBackground : 'white';
        let callBackParams = {
            addToCartClicked: false,
            showDetails: true,
            isAlreadyInCart: false,
        }
        return (
            <View style={{ backgroundColor: 'white', padding: 7.5, width: dimensions.width }}>
                <TouchableOpacity activeOpacity ={1} onPress={() => this.callBack(callBackParams)}>
                <View style={[styles.containerView, { backgroundColor: backgroundColor }]}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.renderImage()}
                        {this.renderDetails()}
                    </View>
                    {this.renderActionButton()}
                </View>
                </TouchableOpacity>
            </View>
        )
    }

    callBack = (params) => {
        this.props.callBack(params)
    }

}

var styles = StyleSheet.create({
    containerView: {
        padding: 10,
        backgroundColor: 'white',
        marginVertical: verticalMargin,
    },
    imageView: {
        flex: 0.35,
        backgroundColor: 'white'
    },
    unitsRemainView: {
        flex: 0.5,
    },
    timerView: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center',

    },
    titleText: {
        fontSize: 14,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        marginTop: 5

    },
    productDetailsContainer: {
        flex: 0.65,
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
        fontSize: 14,
        textAlign: 'left',
        color: 'black',
        marginTop: 5

    },
    priceText: {
        //marginLeft: 10,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
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
        marginLeft: 5,
        marginRight: 50,
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
        paddingHorizontal: 4,
        color: 'darkgray',
        fontSize: 10,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 4,
        alignSelf: 'center',
        backgroundColor: 'white',
        textAlign: 'center',

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
        paddingHorizontal: 5,
    },
    unitAndTimerContainer: {
        flexDirection: 'row',
        marginTop: 3,
        marginHorizontal: 5,
        marginRight: 50,

    },
    unitsLeftText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'darkgray',
        fontSize: 12,
        textAlign: 'left'
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
