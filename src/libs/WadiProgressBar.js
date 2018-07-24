import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import * as GLOBAL from 'Wadi/src/utilities/constants';

class WadiProgressBar extends Component {
    render() {
        let progress = this.props.progress;
        return (
            <View style={styles.progressBarContainerView}>
                <View
                    style={[styles.progressDoneView, {flex: progress}]}>
                </View>
                <View
                    style={[styles.progressPendingView, {flex: 1 - progress}]}>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    progressBarContainerView: {
        height: 5,
        flexDirection: 'row',
    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.lightGreyColor
    },
    progressDoneView: {
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen

    },
});
//const wadiProgressBar = new WadiProgressBar.js();
export default WadiProgressBar;
