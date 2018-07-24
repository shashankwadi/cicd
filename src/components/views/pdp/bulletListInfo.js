

'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity
} from 'react-native';
import * as GLOBAL from "../../../utilities/constants";

export default class bulletListInfo extends Component {

    render() {
        let propStyles = this.props.parentStyle ? this.props.parentStyle : {};
        var verticalView = [];
        if(this.props.bulletData) {
        
        for (let columnIndex = 0; columnIndex < this.props.bulletData.length; columnIndex++) {
            
            verticalView.push(
                <View key={columnIndex} style={{ flexDirection: 'row' }}>
                <View style={{ width: 20}}>
                <Text key={columnIndex} style = {[{textAlign: 'center'}]}>{'\u2022'}</Text>
                    </View>
                <Text style={[ styles.normalText]}>{this.props.bulletData[columnIndex]}</Text>
              </View>)
                }

            }
        return(
            <View style={ styles.textBlock }>
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
    },
    boldText: {
        fontWeight: 'bold',
        marginTop:10,
        marginBottom:10,
        textAlign: 'center'
    },
    normalText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: GLOBAL.COLORS.darkGreyColor,
        textAlign: 'left',
        marginRight: 30,
        paddingTop: 2
    }
});