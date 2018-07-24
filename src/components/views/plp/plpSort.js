import React, {Component} from 'react';
import {FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import images from '../../../icons/images'
import {strings} from 'utilities/uiString';
import {dimensions} from 'utilities/utilities';
import * as GLOBAL from '../../../utilities/constants';

const sortOn = [
  { name: "New", icon: images.newIcon },
  { name: "Discount", icon: images.discountIcon },
  { name: "Popularity", icon: images.popularityIcon },
  { name: "Price (High to Low)", icon: images.priceHighIcon },
  { name: "Price (Low to High)", icon: images.priceLowIcon },
];

export const sortIcons = {
  "New":{ name: "New", icon: images.newIcon },
  "Discount":{ name: "Discount", icon: images.discountIcon },
  "Popularity":{ name: "Popularity", icon: images.popularityIcon },
  "Price (High to Low)":{ name: "Price (High to Low)", icon: images.priceHighIcon },
  "Price (Low to High)":{ name: "Price (Low to High)", icon: images.priceLowIcon },
};

export default class PLPSortView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Modal animationType={"slide"}
             transparent={true}
             visible={this.props.visible}
             onRequestClose={() => {
             }}>
        <View style={styles.modalContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity ={1} disabled={true}>
                  <Text style={styles.sortTextStyle}>{strings.Sort}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity ={1} onPress={this.props.sortClosed}>
                  <Text style={styles.cancelTextStyle}>{strings.Cancel}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={(this.props.sortData && this.props.sortData.length>0)?this.props.sortData:sortOn}
              renderItem={this.renderItem.bind(this)}
              selected={this.props.selected}
              ItemSeparatorComponent={()=><View style={styles.itemSeparatorStyle}/>}
            />
          </View>
        </View>
      </Modal>);
  }

  renderItem({ item, index }) {
      let icon = (this.props.sortData && this.props.sortData.length > 0) ? sortIcons[item.name]["icon"] : item["icon"];
    let { selected } = this.props;
    let isSelected = !!selected[item.name];
    return (
      <TouchableOpacity activeOpacity ={1} style={[styles.sortItemStyle,{backgroundColor:(isSelected)?'#ececec':'#FFF'}]} onPress={() => this.sortTapped(item)}>
        {/*<Image style={{marginRight:10}} source={icon} resizeMode={"contain"}/>*/}
        <Text style={{fontWeight:(isSelected) ? 'bold':'normal', fontSize:16, color: (isSelected) ? GLOBAL.COLORS.wadiDarkGreen : GLOBAL.COLORS.darkGrayColor}}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  sortTapped(item) {
    this.props.sortSelected(item);
  }

}

const styles = StyleSheet.create({

  modalContent:{ 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end' , 
    alignItems:'center', 
    paddingHorizontal:16,
  },

  content:{ 
    width: '100%', 
    backgroundColor: '#FFF', 
    marginBottom:60,  
    borderRadius:8,
    paddingBottom:8,
  },
  applyContainer: {
    justifyContent: 'center',
    backgroundColor: 'green',
    height: 50,
    marginBottom: 0,
    flex: 1
  },
  applyButton: {
    textAlign: 'center',
    backgroundColor: 'green',

    fontSize: 16,
    padding: 0
  },
  header:{ 
    flexDirection: 'row',  
    width: '100%', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderColor:'#e6e6e6', 
    borderBottomWidth:1, 
    padding:16
  },
    sortTextStyle:{
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: GLOBAL.FONTS.default_font
  }  ,
    cancelTextStyle:{
       fontSize: 16,
       color: '#aeaeae',
       fontFamily: GLOBAL.FONTS.default_font,
       color: GLOBAL.COLORS.darkGreyColor
   },
    itemSeparatorStyle:{
    height:1,
    backgroundColor:'#e6e6e6'
  },
    sortItemStyle:{
    flexDirection: 'row' ,
    alignItems:'center',
    paddingHorizontal:16,
    paddingVertical:10,
    },

});