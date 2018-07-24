'use strict';
import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import ProgressiveImage from 'Wadi/src/helpers/progressiveImage';

export default class OfferProduct extends Component {

    constructor(props) {
        super(props);
    }

    renderImage() {
        return (
            <ProgressiveImage source={{uri: this.props.data.imageUrl}} style={styles.imageView} resizeMode='contain'/>
        )
    }

    renderDetails() {
    var columnViews = [];

    let columns = this.props.data.subtitle.length;
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let subtitle = this.props.data.subtitle[columnIndex];
        let fontSize = (subtitle.fontSize && subtitle.fontSize.length > 0) ? Number(subtitle.fontSize) : 10;
        let fontWeight = (subtitle.isBold) ? "bold" : "normal";
        let fontStyle = (subtitle.isItalics) ? "italic" : "normal";
        let backgroundColor = (subtitle.backgroundColor && subtitle.backgroundColor.length > 0) ? subtitle.backgroundColor : 'transparent';
        let titleColor = (subtitle.titleColor && subtitle.titleColor.length > 0) ? subtitle.titleColor : "black";
        let padding = 0;
        if (backgroundColor != 'transparent') {
            padding = 3;
        }
        let interspacing = 3.0;

        columnViews.push(
            <Text key={columnIndex} style={{ marginLeft: interspacing, padding: padding, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle, backgroundColor: backgroundColor, color: titleColor, fontFamily: GLOBAL.FONTS.default, borderRadius: 2,    overflow: 'hidden' }}>
                {subtitle.text}
            </Text>)
    }

        return (
            <View style={styles.productDetailsContainer}>
                {this.props.data.title && this.props.data.title.length &&
                <Text style = {styles.titleText} numberOfLines = {1}>
                    {this.props.data.title}
                </Text>}
                {columnViews.length > 0 && 
                <View style = {styles.subtitleContainer}>
                    {columnViews}
                </View>}
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
        backgroundColor: 'white',
        width: dimensions.width/2 - 0.5,
        height: dimensions.width/2 - 0.5,
        marginHorizontal: 0.25, 
        marginVertical: 0.40
    },
    productDetailsContainer: {
        flex: 0.35,
        alignItems: 'center',
        justifyContent: 'center'

    },
    imageView: {
        flex: 0.65,
    },
    titleText: {
        fontSize: 12,
        margin: 5,
        fontFamily: GLOBAL.FONTS.default,
        fontWeight: "bold"
    },
    subtitleContainer: {
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});