'use strict';

import React, { Component } from 'react';



import {

    WebView
} from 'react-native';

export default class DoodleScreen extends Component {

    render() {
        let { url, onMessage, headers,setWebViewRefs } = this.props;
        return (
            <WebView
                ref={setWebViewRefs}
                javaScriptEnabled={true}
                geolocationEnabled={false}
                builtInZoomControls={false}
                onNavigationStateChange={this.onNavigationStateChange}
                onMessage={onMessage}
                source={{ uri: url}}
                style={{ flex: 1 }}
                disableCookies={false}
                headers={headers}
            />
        )
    }
}



