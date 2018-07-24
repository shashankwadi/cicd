

'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    WebView
} from 'react-native';
import HTMLView from 'react-native-htmlview';

import isHtml from 'libs/isHtml';
import images from 'assets/images';
import { dimensions } from 'utilities/utilities';
import VideoView from '../../common/videoView';
import * as GLOBAL from '../../../utilities/constants';


/**
 * following script is taken from https://github.com/iou90/react-native-autoheight-webview/blob/master/autoHeightWebView/index.ios.js
 * if webview doesn't work properly than please check code at that link
 */

const script =`; 
(function () {
    var i = 0;
    var height = 0;
    var wrapper = document.createElement('div');
    wrapper.id = 'height-wrapper';
    while (document.body.firstChild) {
        wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
    function updateHeight() {
        if(document.body.offsetHeight !== height) {
            height = wrapper.clientHeight;
            document.title = wrapper.clientHeight;
            window.location.hash = ++i;
        }
    }
    updateHeight();
    window.addEventListener('load', updateHeight);
    window.addEventListener('resize', updateHeight);
} ());`;



export default class productDescription extends Component {

    constructor(props) {
        super(props);
        this.state = {
            webViewHeight: 10
        }
        this.descriptionView = this.descriptionView.bind(this);
    }


    onNavigationStateChange(event) {
        if (event.title) {
            const htmlHeight = Number(event.title) //convert to number
            this.setState({ webViewHeight: htmlHeight });
        }

    }
    _onMessage(e) {
        this.setState({
            webViewHeight: parseInt(e.nativeEvent.data)
        });
    }
    descriptionView({ data, index }) {
        let text = data["text"];
        return (
            <View key={index} style={{flex:1}}>
                {!!data["title"] && <Text key={index} style={styles.boldText} >{data["title"]}</Text>}
                {isHtml(text) ?
                <View style={{height:this.state.webViewHeight, backgroundColor:'transparent', marginVertical:10}}>
                    <WebView
                        ref={(ref) => { this.webview = ref; }}
                        //startInLoadingState={true}
                        source={{ html: text}}
                        javaScriptEnabled={true}                 //this distort images in some cases
                        scrollEnabled={false}
                        //automaticallyAdjustContentInsets={true}
                        scalesPageToFit={true}                      //to resize content and images
                        injectedJavaScript={script}
                        //onMessage={this._onMessage.bind(this)}
                        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    />
                </View> : <Text style={styles.normalText}>{data["text"]}</Text>}
                {data["media"] && <VideoView url = {data["media"]}/>}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.textBlock}>
                {(this.props.bulletData && this.props.bulletData.length > 0) && this.props.bulletData.map((item, index) => {
                    return this.descriptionView({ data: item, index: index });
                })}
            </View>
        )
    }
}

var styles = StyleSheet.create({
    textWrapper: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    textBlock: {
        padding: 10
    },
    boldText: {
        color: GLOBAL.COLORS.wadiDarkGreen,
        fontFamily: GLOBAL.FONTS.default_font,
        marginTop: 10,
        marginBottom: 10,
        textAlign:'left'
    },
    headTitle: {
        fontWeight: 'bold',
        marginTop: 10
    },
    normalText: {
        marginRight: 10,
        textAlign:'left',
        color: GLOBAL.COLORS.darkGreyColor,
        fontFamily: GLOBAL.FONTS.default_font
    }
});