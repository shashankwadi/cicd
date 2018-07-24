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
import SuperSmashingProduct from 'Wadi/src/components/views/superSmashingProduct';

export default class SuperSmashing extends Component {

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

    /**
     *Renders list of super smashing product
     */
  renderView() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let dataSource = ds.cloneWithRows(this.props.widgetData.data);
    return(
       <ListView 
          style={styles.listViewStyle}
          dataSource={dataSource}
          removeClippedSubviews={false}
          renderRow={this.renderRow.bind(this)}
          bounces = {false}
        /> 
    )
  }

    renderRow(rowData) {
        return(
            <SuperSmashingProduct data = {rowData} callBack={(params) => this.props.callBack({...rowData, ...params})}/>
        )
    }

}

var styles = StyleSheet.create({
  listViewStyle:{ width: dimensions.width, backgroundColor: 'lightgray' }
});