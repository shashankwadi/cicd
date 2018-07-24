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
//import CarouselProduct from 'Wadi/src/components/views/carouselProduct';
import CarouselProduct from '../common/carouselProduct.native';
export default class ProductCarousel extends Component {

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
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let dataSource = ds.cloneWithRows(this.props.widgetData.data);
    return(
       <ListView style={{ width: dimensions.width, backgroundColor: 'lightgray' }}
          dataSource={dataSource}
          horizontal={true}
          removeClippedSubviews={false}
          renderRow={this.renderRow.bind(this)}
          bounces = {false}
          showsHorizontalScrollIndicator={false}
        /> 
    )
  }

    renderRow(rowData) {
      let item = rowData;
        return(
            <CarouselProduct data = {item} callBack={() => this.props.callBack({...item, url: `/product/${item.sku}`})}/>
        )
    }

}

var styles = StyleSheet.create({
	
});



