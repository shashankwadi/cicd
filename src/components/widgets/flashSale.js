'use strict';

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
import * as GLOBAL from 'Wadi/src/utilities/constants';
import FlashSaleProduct from 'Wadi/src/components/views/flashSaleProduct';
import FlashBanner from 'Wadi/src/components/views/flashBanner';


export default class FlashSaleWidget extends Component {

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
    const background = (this.props.widgetData.style.backgroundColor) ? this.props.widgetData.style.backgroundColor : GLOBAL.COLORS.flashSaleDefaultBackground;
    return(
        <View style = {{backgroundColor: background}}>
            <FlashBanner data = {this.props.widgetData.bannerData} style = {{backgroundColor: 'red', height: 100, width: 200}} callBack={(dataEntity)=>this.props.callBack(dataEntity)}/>
        <View style = {{ height: 50, width: dimensions.width, backgroundColor: 'white', bottom: -30, position: 'absolute'}}/>
        <FlatList 
            contentContainerStyle={{backgroundColor: 'transparent', paddingBottom: 5}}
            data={this.props.widgetData.data}
            removeClippedSubviews={false}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={(item, index) => {return `flashsale-${item.sku}-${index}`}}
            bounces = {false}
        /> 
        

        </View>
    )
  }

    renderRow({item, index}) {
        return(
            <FlashSaleProduct data = {item} callBack={() => this.props.callBack({...item, action:`/product/${item.sku}`})}/>
        )
    }

}