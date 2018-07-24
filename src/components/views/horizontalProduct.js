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
import { PriceView } from '../common';

let verticalMargin = 0.0;
let imageHeightToWidthRatio = 1.3;

export default class HorizontalProduct extends Component {

    constructor(props) {
        super(props);
    }

    // pushPDPScreen() {
    //     this.props.navigation.navigate(Constants.screens.ProductDetail, {
    //         extendedUrl: 'product/' + this.props.data.sku,
    //         sku: this.props.data.sku,
    //         product: this.props.data
    //     });

    // }

    renderTopImageOverlay() {
        return (
            <View style={styles.imageOverlayTopView}>
                {this.props.data.offerBadge.length > 0 && <View style={styles.badgeContainerView}>
                    <Text style={styles.badgeText}>
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
                            {discountValue}{'% OFF'}
                        </Text>
                    </View>}
            </View>

        )
    }

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

    renderDetails() {
        let progressDone = Number(this.props.data.progressBar);
        let progressPending = 100 - progressDone;
        let progressPendingText = (progressPending) + '% LEFT'
        return (
            <View style={styles.productDetailsContainer}>
                <Text style={styles.titleText} numberOfLines={2}>{this.props.data.title}</Text>
                {(!!this.props && !!this.props.data) &&
                    <PriceView
                        {...this.props.data}
                        priceTextStyle={styles.priceText}
                        specialPriceTextStyle={styles.specialPriceText}
                        containerStyles={styles.priceView}
                    />
                }
                {this.props.data.progressBar && this.props.data.progressBar.length > 0 && <View style={styles.progressBarContainerView}>
                    <View style={[styles.progressPendingView, { flex: progressPending / 10 }]}>
                    </View>
                    <View style={[styles.progressDoneView, { flex: progressDone / 10 }]}>
                    </View>
                </View>}
                {this.props.data.progressBar && this.props.data.progressBar.length > 0 && <Text style={styles.progressPendingText}>
                    {progressPendingText}
                </Text>}
            </View>
        )
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

}


var styles = StyleSheet.create({
    containerView: {
        backgroundColor: 'white',
        width: dimensions.width,
        marginVertical: verticalMargin,
        flexDirection: 'row',
        height: 90,
        overflow: 'hidden',
        borderWidth: 0.3,
        borderColor: '#bbbbbb'
    },
    imageView: {
        flex: 0.3,
        paddingLeft: 2
    },
    titleText: {
        fontSize: 12,
        paddingLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        fontWeight: 'bold',
        textAlign: 'left'

    },
    productDetailsContainer: {
        flex: 0.7,
        justifyContent: 'center',
        paddingRight: 5
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
        textAlign: 'left',
        color: GLOBAL.COLORS.headerViewAllColor

    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
        textAlign: 'left',
        textDecorationLine: 'line-through'


    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'darkgray',
        textAlign: 'left',
    },
    progressBarContainerView: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 10,
        height: 2,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
        borderWidth: 0.1,
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
        color: GLOBAL.COLORS.wadiRoseColor,
        textAlign: 'left'
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
        paddingTop: 2,
        paddingLeft: 2,
        color: 'darkgray',
        fontSize: 6,
        fontFamily: GLOBAL.FONTS.default_font,
        borderColor: 'darkgray',
        borderWidth: 1,
        alignSelf: 'center'
    },
    discountView: {
        backgroundColor: GLOBAL.COLORS.wadiRoseColor,
        marginLeft: 5,
        marginBottom: 5,
        borderRadius: 3
    },
    discountText: {
        color: 'white',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 8,
        paddingHorizontal: 2,
        paddingTop: 2,
        textAlign: 'center'
    }
});