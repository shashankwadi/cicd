'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ListView,
  TouchableOpacity
} from 'react-native';

import * as Constants from 'Wadi/src/components/constants/constants';
import { dimensions } from 'utilities/utilities';



export default class verticalMixWidget extends Component {

  render() {


    var verticalView = [];
    let data = this.props.widgetData.data;
    let padding = this.props.widgetData.padding || 0;
    let spacing = this.props.widgetData.spacing || 0;
    let columns = data.length;

    var totalWidth = 0;
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      totalWidth = totalWidth + data[columnIndex][0].width;
    }

    let widgetsPace = ((dimensions.width - 2 * padding) * spacing) / (totalWidth + ((columns - 1) * spacing));
    let imageWidth = (dimensions.width - ((columns - 1) * widgetsPace) - 2 * padding);

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {

      var columnWidget = data[columnIndex];

      var rowViews = [];
      let rows = columnWidget.length;
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {

        var toppadding = widgetsPace;
        if (rowIndex == 0) {
          toppadding = 0;
        }
        let rowWidth = (columnWidget[rowIndex].width * imageWidth) / totalWidth;
        rowViews.push(
          <View key={rowIndex} style={{ marginTop: toppadding }}>
            <TouchableOpacity activeOpacity ={1}
            onPress={()=>this.props.callBack(columnWidget[rowIndex])}>
              <Image
                style={{ width: rowWidth, height: (columnWidget[rowIndex].height * rowWidth) / columnWidget[rowIndex].width }}
                resizeMode='cover'
                source={{ uri: columnWidget[rowIndex].imageUrl }}
              />
            </TouchableOpacity>
          </View>)
      }

      var leftpadding = widgetsPace;
      if (columnIndex == 0) {
        leftpadding = padding;
      }
      verticalView.push(

        <View key={columnIndex} style={{ flexDirection: 'column', marginLeft: leftpadding }}>
          {rowViews}
        </View>
      )
    }

    return (
      <View style={styles.continerView}>
        {verticalView}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  /*
   * Removed for brevity
   */
  continerView: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'red'
  }
})



