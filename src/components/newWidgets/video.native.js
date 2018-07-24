'use strict';

import React, {Component} from'react';
import {
    View,
    WebView,
    StyleSheet,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';

export default class Video extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let {json} = this.props.widgetData;
        let url = (json && json["content.bind"] && json["content.bind"]["video"] )?json["content.bind"]["video"]:undefined;
        url = (url.indexOf("youtube")!==-1)?`${url.replace("watch?v=", "embed/")}?modestbranding=1&rel=0&showinfo=0&showsearch=0}`:url;
        return (
            <WebView
            javaScriptEnabled={true}
            style={{height:250, backgroundColor:'yellow', width:'100%' }}
            source={{uri:url}}
            mediaPlaybackRequiresUserAction={true}/>
        )
    }
}


