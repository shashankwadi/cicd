import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';


import { dimensions } from 'utilities/utilities';
import * as GLOBAL from 'Wadi/src/utilities/constants';

export default class RichText extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style = {styles.containerView}>
                {this.props.widgetData.data.length > 0 &&
                    this.renderDetails()}
            </View>
        )
    }

    renderDetails() {
        var rowViews = [];

        let rows = this.props.widgetData.data.length;

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let titleData = this.props.widgetData.data[rowIndex];
            let fontSize = (titleData.fontSize && String(titleData.fontSize).length > 0) ? Number(titleData.fontSize) : 10;
            let fontWeight = (titleData.isBold) ? "bold" : "normal";
            let fontStyle = (titleData.isItalics) ? "italic" : "normal";
            let backgroundColor = (titleData.backgroundColor && titleData.backgroundColor.length > 0) ? titleData.backgroundColor : 'transparent';
            let titleColor = (titleData.titleColor && titleData.titleColor.length > 0) ? titleData.titleColor : "black";
            let padding = 0;
            if (backgroundColor != 'transparent') {
                padding = 3;
            }
            let interspacing = 3.0;
            if (titleData.title.length > 0) {
                rowViews.push(
                    <Text key={rowIndex} style={{ textAlign:'center',width:dimensions.width, marginTop: 0, padding: padding, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle, backgroundColor: backgroundColor, color: titleColor, fontFamily: GLOBAL.FONTS.default, borderRadius: 2 }}>
                        {titleData.title}
                    </Text>)
            }
            
        }
        return (
            <View style={styles.textContainerView}>
                {rowViews}
            </View>

        )

    }
}

var styles = StyleSheet.create({
    containerView: {
        alignItems: 'center',
        flex: 1,
    },
    textContainerView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});