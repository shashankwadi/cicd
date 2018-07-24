
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';


import * as Constants from 'Wadi/src/components/constants/constants';
import { dimensions } from 'utilities/utilities';
import * as GLOBAL from 'Wadi/src/utilities/constants';

export default class HorizontalMixWithText extends Component {

  render() {

    var horizontalViews = [];
    let data = this.props.widgetData.data;
    let padding = this.props.widgetData.padding || 0;
    let spacing = this.props.widgetData.spacing || 0;
    let rows = data.length;
    let firstData = data[0];
    var totalWidth = 0;

    for (let rowIndex = 0; rowIndex < firstData.length; rowIndex++) {

      totalWidth = totalWidth + firstData[rowIndex].width;
    }


    let widgetsPace = ((dimensions.width - 2 * padding) * spacing) / (totalWidth + ((firstData.length - 1) * spacing));
    let imageWidth = (dimensions.width - ((firstData.length - 1) * widgetsPace) - 2 * padding);

  
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {

      var rowWidget = data[rowIndex];
      var columnViews = [];


      let columns = rowWidget.length;

      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {

        var leftpadding = widgetsPace;
        if (columnIndex == 0) {
          leftpadding = padding;
        }

        let columnWidget = rowWidget[columnIndex];
        let rowWidth = (columnWidget.width * imageWidth) / totalWidth;
        let columnTitle = (columnWidget.title && columnWidget.title.length > 0) ? columnWidget.title : '';
        if (columns == 2) {
        }
        columnViews.push(
          <View key={columnIndex} style={{ marginLeft: leftpadding }}>
            <TouchableOpacity activeOpacity ={1} style={{ width: rowWidth }} onPress={()=>this.props.callBack(columnWidget)}>
              <Image
                style={{ width: rowWidth, height: (columnWidget.height * rowWidth) / columnWidget.width }}
                resizeMode='contain'
                source={{ uri: columnWidget.imageUrl }}
              />
              {columnTitle.length > 0 &&
                <Text style={[styles.itemTitle, { width: rowWidth }]}>{columnTitle}</Text>}
            </TouchableOpacity>
          </View>)
      }


      var toppadding = widgetsPace;
      if (rowIndex == 0) {
        toppadding = 0;
      }
      horizontalViews.push(

        <View key={rowIndex} style={{ flexDirection: 'row', marginTop: toppadding }}>
          {columnViews}
        </View>
      )
    }

    return (
      <View style={styles.continerView}>
        {horizontalViews}
      </View>
    );
  }

  widgetTapped() {

    this.props.navigation.navigate(Constants.screens.ProductList);
  }
}

const styles = StyleSheet.create({
  /*
   * Removed for brevity
   */
  continerView: {
    flex: 1,
    flexDirection: 'column',
  },
  itemTitle: {
    textAlign: 'center',
    fontFamily: GLOBAL.FONTS.default_font,
    fontSize: 10,
    marginVertical: 8,
  }
})
