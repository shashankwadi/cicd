

'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import * as  GLOBAL from '../../../utilities/constants';
import {dimensions} from "../../../utilities/utilities";

export default class bulletObjectInfo extends Component {

    render() {

    // <Text style={styles.HeaderTitle}>{this.props.bulletData["label"]}</Text>
        var verticalView = [];
        if (this.props.bulletData) {
            let allKeys = Object.keys(this.props.bulletData.attributes)

            for (let columnIndex = 0; columnIndex < allKeys.length; columnIndex++) {

                let dataKey = allKeys[columnIndex];
                let dataValue = this.props.bulletData.attributes[dataKey];
                verticalView.push(

                    <View key={columnIndex} style={{ flexDirection: 'row' }}>
                        <View style={{ width: 120}}>
                            <Text style={styles.boldText}>{dataValue.label}</Text>
                        </View>
                        <Text>{'   :  '}</Text>
                        <View style = {{ width: dimensions.width - 150, paddingRight: 25}}>
                            <Text style={styles.normalText}>{dataValue.value}</Text>
                        </View>
                    </View>
                )
            }

        }

        return (
            <View style={styles.textBlock}>
                {verticalView}
            </View>
        )
    }
}

var styles = StyleSheet.create({
    textWrapper: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    textBlock: {
        padding: 10
    },
    boldText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        color: GLOBAL.COLORS.black
    },
    normalText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: GLOBAL.COLORS.darkGreyColor,
        textAlign: 'left',
    }
});