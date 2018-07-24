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
import * as Constants from 'Wadi/src/components/constants/constants';

import { dimensions } from 'utilities/utilities';
import TimerLabel from 'Wadi/src/components/views/timerLabel';
import Stars from 'react-native-stars';
import images from 'assets/images';

let screenToCellWidthRatio = 2.0;
let interCellMargin = 0.0;
let verticalMargin = 0.0;
let imageHeightToWidthRatio = 1.0;

let initialTotalRightMargin = Math.ceil(screenToCellWidthRatio) * interCellMargin
let screenWidthWithoutMargin = dimensions.width - initialTotalRightMargin
let cellWidth = screenWidthWithoutMargin / screenToCellWidthRatio
let imageHeight = cellWidth * imageHeightToWidthRatio;
var thisRef;
const BASE__PRODUCT_URL = "https://b.wadicdn.com/product/{image_key}/{angle}-product.jpg";



export default class GridProductAlgolia extends Component {

    constructor(props) {
        super(props);
        thisRef = this;
    }

    renderTopImageOverlay() {
        return (
            <View style={styles.imageOverlayTopView}>
                {this.renderOfferBadge()}
            </View>
        )
    }

    renderOfferBadge() {
        let { badges, offerBadge, ribbon } = this.props.data;
        let borderColor = (this.props.data.offerBadgeBorderColor && this.props.data.offerBadgeBorderColor.length > 0) ? this.props.data.offerBadgeBorderColor : "darkgray";
        let textColor = (this.props.data.offerBadgeTextColor && this.props.data.offerBadgeTextColor.length > 0) ? this.props.data.offerBadgeTextColor : "darkgray";
        return (
            <View style={styles.badgeLabelView}>
                {((offerBadge && offerBadge.length > 0) || (badges && badges.length > 0)) && <View style={styles.badgeContainerView}>
                    <Text style={[styles.badgeText, { color: textColor, borderColor: borderColor }]}>
                        {offerBadge ? `${offerBadge} ` : (badges ? `${badges[0]} ` : "")}
                    </Text>
                </View>}
                {(ribbon && ribbon.name) &&
                    <View style={styles.badgeContainerView}>
                        <Text style={[styles.badgeText, { color: textColor, borderColor: borderColor }]}>
                            {ribbon.name}
                        </Text>
                    </View>
                }
            </View>
        )
    }

    renderBottomImageOverlay() {
        let progressDone = Number(this.props.data.progressBar);
        let progressPending = 100 - progressDone;
        let discountValue = this.props.data.discount ? String(this.props.data.discount) : ''
        return (


            <View style={styles.imageOverlayBottomView}>
                <View style={styles.progressBarContainer}>
                    {this.renderUnitsAndTimer()}
                    {this.props.data.progressBar && this.props.data.progressBar.length > 0 && <View style={styles.progressBarContainerView}>
                        <View style={[styles.progressPendingView, { flex: progressPending / 10 }]}>
                        </View>
                        <View style={[styles.progressDoneView, { flex: progressDone / 10 }]}>
                        </View>
                    </View>}
                </View>
                <View style={styles.discountView}>
                    {discountValue.length > 0 &&
                        <View style={styles.discountView}>
                            <Text style={styles.discountText}>
                                {discountValue}{'% OFF!'}
                            </Text>

                        </View>}
                </View>


            </View>

        )
    }

    renderImage() {
        let { imageKey, maxImages, imageUrl } = this.props.data;
        let url = (imageKey) ? `https://b.wadicdn.com/product/${imageKey}/${1}-product.jpg` : undefined;
        return (
            <View style={styles.imageViewContainer}>
                <ImageBackground source={{ uri: url || imageUrl }} style={styles.imageView} resizeMode='contain'>
                    <View style={styles.imageOverlayView}>
                        {this.renderTopImageOverlay()}
                        {this.renderBottomImageOverlay()}
                    </View>
                </ImageBackground>
            </View>
        )
    }
    renderUnitsAndTimer() {
        if (!!this.props.data.stockQty) {
            return (
                <View style={styles.unitAndTimerContainer}>
                    <View style={styles.unitsRemainView}>
                        {String(this.props.data.stockQty).length > 0 &&
                            <Text style={styles.unitsLeftText} numberOfLines={1}
                                adjustsFontSizeToFit={true}
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
    }

    renderTimer() {

        var showTimer = (this.props.data.expiryTime && String(this.props.data.expiryTime).length > 0) ? true : false;
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

    renderDetails() {
        

        return (
            <View style={styles.productDetailsContainer}>
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.name}</Text>
                {this.renderStarRating()}
                {((this.props.data.price) && (this.props.data.specialPrice)) ?
                    <View style={styles.priceView}>
                        <Text style={styles.priceText}>{`${this.props.data.price} SAR ` || ''}</Text>
                        <Text style={styles.specialPriceText}>{`${this.props.data.specialPrice} SAR` || ''}</Text>
                    </View> :
                    <View style={styles.priceView}>
                        <Text style={styles.specialPriceText}>{`${this.props.data.price} SAR` || ''}</Text>
                    </View>}
            </View>
        )
    }

    renderStarRating() {
        let totalRatings = (!!this.props.data.totalRatings && (String(this.props.data.totalRatings).length > 0)) ? ('(' + this.props.data.totalRatings + ')') : '';
        if (!!this.props.data.starRating && String(this.props.data.starRating).length > 0) {
            return (
                <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginLeft: 10 }}>
                    <Stars
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

    render() {
        return (
            <View>
                <TouchableOpacity activeOpacity ={1} onPress={this.props.callBack}>
                    <View style={styles.containerView}>
                        {this.renderImage()}
                        {this.renderDetails()}
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    pushPDPScreen() {
        //sku for sizes - BE610TO97BHY  
        //sku for colors - AP771EL34AOB
        this.props.navigation.navigate(Constants.screens.HomeToPdp, {
            extendedUrl: 'product/' + this.props.data.sku, //hardcoded just for test
            sku: this.props.data.sku,
            product: this.props.data
        });

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
        borderColor: '#bbbbbb'

    },
    imageViewContainer: {
        width: cellWidth,
        height: imageHeight,

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
        fontSize: 14,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        marginTop: 5

    },
    productDetailsContainer: {
        height: 125,
        justifyContent: 'center',
        paddingRight: 5
    },
    priceView: {
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 5,
        backgroundColor: 'yellow'

    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        textAlign: 'left',
        color: 'black',
        marginTop: 5

    },
    priceText: {
        marginLeft: 10,
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

    },
    badgeContainerView: {
        marginTop: 3,
    },
    badgeText: {
        paddingTop: 4,
        paddingLeft: 4,
        color: 'darkgray',
        fontSize: 10,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        borderColor: 'darkgray',
        borderWidth: 1,
        borderRadius: 4,
        alignSelf: 'center',
        backgroundColor: 'white'

    },
    progressBarContainer: {
        flex: 0.8,
        justifyContent: 'flex-end',
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
        fontSize: 11,
        paddingHorizontal: 5,
        paddingTop: 2,
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 0.1,
        borderColor: GLOBAL.COLORS.discountViewBackground,
        backgroundColor: GLOBAL.COLORS.discountViewBackground
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
    }
});
