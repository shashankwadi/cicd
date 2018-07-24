import React, {Component} from 'react';
import {DeviceEventEmitter, Platform, requireNativeComponent, WebView} from 'react-native';

const AndroidWebView = requireNativeComponent('WADIWebView');

class WadiWebView2 extends Component {
    constructor(props) {
        super(props);
        this._onUrlChange = this._onUrlChange.bind(this);
    }

    render() {
        return (
            <AndroidWebView
                {...this.props}
                prefixCallBackUrls={["wadi://"]}
            />
        );
    }

    componentWillMount() {
        // DeviceEventEmitter.addListener('topLoadingFinish', this._onUrlChange);
        // DeviceEventEmitter.addListener('shouldOverrideUrlLoading', this._onUrlChange);
        // DeviceEventEmitter.addListener('emitFinishEvent', this._onUrlChange);
        // DeviceEventEmitter.addListener('onReceivedError', this._onUrlChange);
        DeviceEventEmitter.addListener('prefixCallBackUrls', this._onUrlChange);
    }

    componentWillUnmount() {
        // DeviceEventEmitter.removeListener('topLoadingFinish', this._onUrlChange);
        // DeviceEventEmitter.removeListener('shouldOverrideUrlLoading', this._onUrlChange);
        // DeviceEventEmitter.removeListener('emitFinishEvent', this._onUrlChange);
        // DeviceEventEmitter.removeListener('onReceivedError', this._onUrlChange);
        DeviceEventEmitter.removeListener('prefixCallBackUrls', this._onUrlChange);
    }

    _onUrlChange(event: Event) {
        this.props.onNavigationStateChange(event)
    }

}

const WadiWebView = Platform.select({
    ios: () => WebView,
    android: () => WadiWebView2,
})();

export default WadiWebView;