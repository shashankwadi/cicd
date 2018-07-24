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
import * as Constants from 'Wadi/src/components/constants/constants';


var bannerHeight = 0;
let buttonHeight = 30;
export default class FlashBanner extends Component {

    constructor(props) {
        super(props);
    }

    renderTopRightButton(topRightButton) {
        return(
            <TouchableOpacity activeOpacity ={1} style = {styles.topRightButton} onPress = {()=>this.props.callBack(topRightButton)}>
                <Text style = {styles.buttonText}> 
                    {topRightButton.title}
                </Text>
            </TouchableOpacity>
        )
    }
    renderMiddleRightButton(middleRightButton) {
        
        return(
            <TouchableOpacity activeOpacity ={1} style = {[styles.middleRightButton, {top: (bannerHeight - buttonHeight)/2, right: 10}]} onPress = {()=>this.props.callBack(middleRightButton)}>
                <Text style = {styles.buttonText}> 
                    {middleRightButton.title}
                </Text>
            </TouchableOpacity>
        )
    }
    renderMiddleLeftButton(middleLeftButton) {
        return(
            <TouchableOpacity activeOpacity ={1} style = {[styles.middleLeftButton, {top: (bannerHeight - buttonHeight)/2, left: 10}]} onPress = {()=>this.props.callBack(middleLeftButton)}>
                <Text style = {styles.buttonText}> 
                    {middleLeftButton.title}
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        
        let imageWidth = this.props.data.imageWidth;
        let imageHeight = this.props.data.imageHeight;
        let aspectRatio = imageWidth/imageHeight;
        bannerHeight = dimensions.width / aspectRatio;
        let ctaData = this.props.data.ctaData;
        return (
            <View style={[styles.containerView, {height: bannerHeight, width: dimensions.width}]}>
            <ImageBackground style = {styles.imageView} 
            source = {{uri: this.props.data.imageUrl}}>
                {ctaData.topRight && String(ctaData.topRight.title).length > 0 &&
                this.renderTopRightButton(ctaData.topRight)}
                {ctaData.middleRight && String(ctaData.middleRight.title).length > 0 &&
                this.renderMiddleRightButton(ctaData.middleRight)}
                {ctaData.middleLeft && String(ctaData.middleLeft.title).length > 0 &&
                this.renderMiddleLeftButton(ctaData.middleLeft)}
            </ImageBackground>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    containerView: {
        backgroundColor: 'transparent'
    },
    imageView: {
        flex: 1
    },
    topRightButton: {
        position: 'absolute',
        top: 15,
        right: 10,
        height: buttonHeight,
        justifyContent: 'center'
    },
    middleRightButton: {
        position: 'absolute',
        height: buttonHeight,
        justifyContent: 'center'
        
        
        
    },
    middleLeftButton: {
        position: 'absolute' ,
        height: buttonHeight,
        justifyContent: 'center'
        
        
        
    },
    buttonText: {
        color: 'white',
        paddingTop: 3,
        paddingBottom: 2,
        paddingHorizontal: 2,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 2,
        fontSize: 12,
        fontFamily: GLOBAL.FONTS.default,
        justifyContent: 'center',
        textAlign: 'center'
    }
});