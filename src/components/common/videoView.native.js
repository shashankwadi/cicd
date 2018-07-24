/**
 * Created by Manjeet Singh
 * Created on 2017-12-12 16:53:21
 * This component can be used as reusable vector icon solution
 * can save you from importing multiple icons in your view files
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
    WebView,
    StyleSheet,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';

/**
 * 
 * @param {*} url to be shown as video
 * @param {*} style to override default style
 */
export default class VideoView extends Component{
    constructor(props){
        super(props);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    }

    onNavigationStateChange(event){
        /** */
        if(event && event.url && event.url.includes("m.youtube.com/watch")){
            this.webview.stopLoading();
        }
    }

    render(){
        let {style, url}= this.props;
        url = (url.indexOf("youtube")!==-1)?`${url.replace("watch?v=", "embed/")}?modestbranding=1&rel=0&showinfo=0&showsearch=0`:url; 
        return (
            <View style={[{ height: 250, backgroundColor: 'transparent', width: '100%' }, style]}>
                <WebView
                    ref={(ref) => { this.webview = ref; }}
                    javaScriptEnabled={true}
                    source={{ uri:url}}
                    mediaPlaybackRequiresUserAction={true} 
                    //onShouldStartLoadWithRequest={this.onNavigationStateChange.bind(this)} //for ios only
                    onNavigationStateChange = {this.onNavigationStateChange.bind(this)}    //for android and ios
                    />  
            </View>
        );
    }
}
VideoView.propTypes = {
    url: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

VideoView.defaultProps = {
    url: "",
    style: undefined,
};


//export default VideoView