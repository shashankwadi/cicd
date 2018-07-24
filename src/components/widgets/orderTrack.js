import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView,
  I18nManager,
  FlatList
} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';

const imageFlex = 0.25;
const detailsFlex = 1.0 - imageFlex;
var statusBackgroundColor;
var statusSelectedBackgroundColor;
var statusFontColor;
var statusSelectedFontColor;
export default class OrderTrack extends Component {
  
    constructor(props) {
    super(props);
    }

    renderRow({item, index}) {
        let rowData= item;
        let imageWidthAndHeight = imageFlex * dimensions.width;
        var statusViews = [];

        if (rowData.statusData && rowData.statusData.length > 0) {
            statusData = rowData.statusData;
            
            for (let statusIndex = 0; statusIndex < statusData.length; statusIndex++) {
            
                var leftBorderRadius = 0;
                var rightBorderRadius = 0;
                if(statusIndex == 0) 
                    leftBorderRadius = 10;
                if(statusIndex == statusData.length - 1)    
                    rightBorderRadius = 10;
                var fontColor = (statusIndex <= rowData.currentStatus - 1) ? statusSelectedFontColor : statusFontColor;
                var backgroundColor = (statusIndex <= rowData.currentStatus - 1) ? statusSelectedBackgroundColor : statusBackgroundColor;
                var pointerColor = statusSelectedFontColor;
                statusViews.push(
                    <View key={statusIndex} style={[styles.statusView, {borderTopLeftRadius: leftBorderRadius, borderBottomLeftRadius: leftBorderRadius, borderTopRightRadius: rightBorderRadius, borderBottomRightRadius: rightBorderRadius, backgroundColor: backgroundColor}]}>               
                        {statusIndex == rowData.currentStatus - 1 && <View style = {[styles.triangle, {borderTopColor: pointerColor}]}/>}
                        <Text style = {[styles.statusText,{color: fontColor}]}> {statusData[statusIndex]} </Text>
                    </View>)
            }
        }

        return (
            <View style = {[styles.itemContainer, {height: imageWidthAndHeight}]}>
                <TouchableOpacity activeOpacity ={1} onPress={() => this.props.callBack(item)} style={styles.imageStyle}>
                    <Image style={{ flex: 1  }} resizeMode='contain' source={{uri : rowData.imageUrl}} />
                </TouchableOpacity>
                <View style = {styles.detailsViewStyle}>
                     <Text style = {styles.titleText} numberOflines = {2}>
                        {rowData.title}
                    </Text>
                    <View style = {styles.statusContainer}>
                        {statusViews}
                    </View>
                </View>
            </View>
        )
    }
    
    render() {
        statusBackgroundColor = (this.props.widgetData.style.backgroundColor && this.props.widgetData.style.backgroundColor.length > 0) ? this.props.widgetData.style.backgroundColor : 'rgb(234, 234, 234)';
        statusSelectedBackgroundColor = (this.props.widgetData.style.selectedBackgroundColor && this.props.widgetData.style.selectedBackgroundColor.length > 0) ? this.props.widgetData.style.selectedBackgroundColor : GLOBAL.colors.wadiDarkGreen;
        statusFontColor = (this.props.widgetData.style.fontColor && this.props.widgetData.style.fontColor.length > 0) ? this.props.widgetData.style.fontColor : 'rgb(159, 159, 159)';
        statusSelectedFontColor = (this.props.widgetData.style.selectedFontColor && this.props.widgetData.style.selectedFontColor.length > 0) ? this.props.widgetData.style.selectedFontColor : 'white';
        
        //const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        //let dataSource = ds.cloneWithRows(this.props.widgetData.data);
        
        return (
                <FlatList 
                    contentContainerStyle={styles.container}
                    data={this.props.widgetData.data}
                    enableEmptySections = {true}
                    removeClippedSubviews = {false}
                    renderItem={this.renderRow.bind(this)}
                    keyExtractor={(item, index) => {return `ordertarck-${item.sku}-${index}`}}
                    scrollsToTop={true}
                />
        )
        
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgray'
    },
    itemContainer: {
        marginBottom: 0.75,
        flexDirection: 'row',
        backgroundColor: 'white'

    },
    imageStyle: {
        flex: imageFlex,
        margin: 10
    },
    detailsViewStyle: {
        flex: detailsFlex,
    },
    titleText: {
        marginTop: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14
    },
    statusView: {
        marginLeft: 0.5,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]

    },
    statusContainer: {
        flex: 1,
        marginLeft: 5,
        marginTop: 10,
        flexDirection: 'row',
    },
    statusText: {
        fontFamily: GLOBAL.FONTS.default_font,
        marginRight: 7,
        marginLeft: 4,
        fontSize: 10,
        marginTop: 5,
        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]

    },
    triangle: {
        alignSelf: 'center',
        width: 4,
        marginTop: -5,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 3,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    }
});