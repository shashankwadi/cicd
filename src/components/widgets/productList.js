import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView,
  FlatList
} from 'react-native';


import { dimensions } from 'utilities/utilities';
import HorizontalProduct from 'Wadi/src/components/views/horizontalProduct';

export default class ProductListWidget extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {this.renderView()}
      </View>
    );
  }

  renderView() {
    //const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    //let dataSource = ds.cloneWithRows(this.props.widgetData.data);
    return(
       <FlatList 
          style={{ width: dimensions.width, backgroundColor: 'lightgray' }}
          data={this.props.widgetData.data}
          removeClippedSubviews={false}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={(item, index) => item.sku + index}
          bounces = {false}
        /> 
    )
  }

    renderRow({item, index}) {
      let rowData= item;
        return(
            <HorizontalProduct data = {rowData} callBack={() => this.props.callBack(rowData)}/>
        )
    }

}

var styles = StyleSheet.create({
  
});