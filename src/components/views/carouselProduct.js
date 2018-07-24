'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import deeplinkHandler from '../../utilities/managers/deeplinkHandler';
import { PriceView } from '../common';

let screenToCellWidthRatio = 2.0;
let interCellMargin = 0.0;
let verticalMargin = 0.0;
let imageHeightToWidthRatio = 1.3;

let initialTotalRightMargin = Math.ceil(screenToCellWidthRatio) * interCellMargin
let screenWidthWithoutMargin = dimensions.width - initialTotalRightMargin
let cellWidth = screenWidthWithoutMargin / screenToCellWidthRatio
let imageHeight = cellWidth * imageHeightToWidthRatio;

export default class CarouselProduct extends Component {

    constructor(props) {
        super(props);
    }

    /**
 * 
 * @param {*} item conatins url for navigation;
 */
    itemPressed = () => {
        if (this.props && this.props.data && this.props.data.link) {
            // let { url } = item;
            // url = !((url.includes('.html')) || (url.includes('/product/'))) ? "plp" : url;
            deeplinkHandler(this.props.navigator, this.props.data.link, "Home");
        }
    }

    renderTopImageOverlay() {
        if (this.props.data.offerBadge && this.props.data.offerBadge.length > 0) {
            return (
                <View style={styles.imageOverlayTopView}>
                    <View style={styles.badgeContainerView}>
                        <Text style={styles.badgeText}>
                            {this.props.data.offerBadge + ' '}
                        </Text>
                    </View>
                </View>
            )
        } else {
            <View style={styles.imageOverlayTopView} />
        }
    }

    renderBottomImageOverlay() {
        let discountValue = this.props.data.discount ? String(this.props.data.discount) : ''
        return (
            <View style={styles.imageOverlayBottomView}>
                {discountValue.length > 0 && <View style={styles.discountView}>
                    <Text style={styles.discountText}>
                        {discountValue}{'% OFF'}
                    </Text>
                </View>}
            </View>

        )
    }

    renderImage() {
        let imageUrl = (this.props.data.imageKey) ? `https://b.wadicdn.com/product/${this.props.data.imageKey}/${1}-product.jpg` : this.props.data.imageUrl;
        return (
            <ImageBackground source={{ uri: imageUrl }} style={styles.imageView} resizeMode='contain'>
                <View style={styles.imageOverlayView}>
                    {this.renderTopImageOverlay()}
                    {this.renderBottomImageOverlay()}
                </View>
            </ImageBackground>
        )
    }

    renderDetails() {
        let progressDone = Number(this.props.data.progressBar);
        let progressPending = 100 - progressDone;
        let progressPendingText = (progressPending) + '% LEFT';
        console.log('progressPendingText-', progressPendingText, this.props.data.progressBar);
        return (
            <View style={styles.productDetailsContainer}>
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.title}</Text>
                {(!!this.props && !!this.props.data) &&
                    <PriceView
                        {...this.props.data}
                        containerStyles={styles.priceView}
                    />
                }
                {!!(this.props.data.progressBar && this.props.data.progressBar.length > 0) && <View style={styles.progressBarContainerView}>
                    <View style={[styles.progressPendingView, { flex: progressPending / 10 }]}>
                    </View>
                    <View style={[styles.progressDoneView, { flex: progressDone / 10 }]}>
                    </View>
                </View>}
                {!!(this.props.data.progressBar && this.props.data.progressBar.length > 0) && <Text style={styles.progressPendingText}>
                    {progressPendingText}
                </Text>}
            </View>
        )
    }

    render() {

        return (
            <TouchableOpacity activeOpacity ={1} style={styles.containerView} onPress={this.props.callBack}>
                {this.renderImage()}
                {this.renderDetails()}
            </TouchableOpacity>
        )
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

    },
    imageView: {
        width: cellWidth,
        height: imageHeight,
    },
    titleText: {
        width: cellWidth,
        fontSize: 12,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        fontWeight: 'bold',
        textAlign: 'left'

    },
    productDetailsContainer: {
        paddingBottom: 5
    },
    priceView: {
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 5,

    },
    specialPriceText: {
        marginLeft: 3,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: GLOBAL.COLORS.wadiDarkGreen


    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
        textDecorationLine: 'line-through'

    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
    },
    progressBarContainerView: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        height: 2,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor, borderWidth: 0.1,
        borderRadius: 100,
    },
    progressPendingView: {
        backgroundColor: 'red'
    },
    progressDoneView: {

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
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    badgeContainerView: {
        marginTop: 5,
        marginLeft: 5,
        flexDirection: 'row',
    },
    badgeText: {
        paddingTop: 4,
        paddingHorizontal: 4,
        color: 'darkgray',
        fontSize: 10,
        fontFamily: GLOBAL.FONTS.default_font,
        borderColor: 'darkgray',
        borderWidth: 1,
        alignSelf: 'center',
        textAlign: 'center'
    },
    discountView: {
        backgroundColor: GLOBAL.COLORS.wadiRoseColor,
        height: 20,
        marginLeft: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
    discountText: {
        color: 'white',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 10,
        paddingHorizontal: 5,
        paddingTop: 2,
        textAlign: 'center'
    }
});