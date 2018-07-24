'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView
} from 'react-native';

import { dimensions } from 'utilities/utilities';
import OfferProduct from 'Wadi/src/components/views/offerProduct';

export default class OffersGrid extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let dataSource = ds.cloneWithRows(this.props.widgetData.data);
    return(
       <ListView 
        contentContainerStyle={styles.list}
        dataSource={dataSource}
        enableEmptySections = {true}
        removeClippedSubviews = {false}
        renderRow={this.renderRow.bind(this)}
        scrollsToTop={true}
      />
    )
  }

    renderRow(rowData) {
        return(
            <OfferProduct data = {rowData} callBack={() => this.props.callBack(rowData)}/>
        )
    }

}

var styles = StyleSheet.create({
	  list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: dimensions.width,
        backgroundColor: 'lightgray',
    },
});