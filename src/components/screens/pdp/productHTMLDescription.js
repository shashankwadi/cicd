import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    WebView,
} from 'react-native';
import {dimensions} from 'utilities/utilities';
import * as GLOBAL from '../../../utilities/constants';

export default class HTMLDescription extends Component {
    constructor(props) {

        super(props);
        let htmlText = '<font face="Gotham-Book" size="5">' + this.props.htmlText;
        this.state = {
            htmlText: htmlText
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    style = {styles.webView}
                    ref={(ref) => { this.webview = ref; }}
                    //startInLoadingState={true}
                    source={{ html: this.state.htmlText}}
                    javaScriptEnabled={true}                 //this distort images in some cases
                    scrollEnabled={true}
                    //automaticallyAdjustContentInsets={true}
                    scalesPageToFit={true}                      //to resize content and images
                    //onMessage={this._onMessage.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'white',
    },
    webView: {
        flex: 1
    }
});

