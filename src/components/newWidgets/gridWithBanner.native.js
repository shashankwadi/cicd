/*
 * @Author: Manjeet Singh 
 * @Date: 2017-12-06 7:45:35 
 * 
 * changes according to doodle api
 */
'use strict';

import React, {Component} from 'react';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import {dimensions} from 'utilities/utilities';
import ProgressiveImage from 'Wadi/src/helpers/progressiveImage';
import images from 'assets/images';



export default class GridWithBanner extends Component {
  constructor(props) {
    super(props);
    this.renderGridItem = this.renderGridItem.bind(this);
  }
  componentDidMount() {

  }

  render() {
    let widgetData = (this.props.widgetData)?this.props.widgetData:null;
    let json = (widgetData && widgetData.json && widgetData.json)?widgetData.json:null;
    let imagesData = (json && json["images.bind"])?json["images.bind"]:null;
    if(imagesData){
        let {mainBanner, colorTheme, banners, secondright}= imagesData;
        colorTheme = (imagesData.colorTheme)?imagesData.colorTheme:"#FFF";
        let options = (json && json["options.bind"])?json["options.bind"]:{};
        return (
          <View style={{backgroundColor: colorTheme}}>
            {mainBanner && this.renderBanner(mainBanner)}
            {((banners && banners.length >0) || (secondright && secondright.length>0)) && this.renderGridView(banners, secondright, options)}
          </View>
        );
    }
    return null;

  }

  /**
   *
   * @param {*} banner
   */
  renderBanner(banner){
        let {path, width, height, url, title} = banner;
        let aspectRatio = height/width;
        if(!path){
          return null;
        }
        return(
          <TouchableOpacity activeOpacity={1} onPress={()=>this.itemPressed(banner)}>
              <ProgressiveImage source={{uri: `https:${path}`}} style={{height:aspectRatio*dimensions.width, width:dimensions.width}} />
          </TouchableOpacity>
        )
  }

  /**
   *
   * @param {*} banners
   * @param {*} secondright
   * @param {*} options
   */
  renderGridView(banners=[], secondright=[], options){
    if((banners && banners.length >0) || (secondright && secondright.length>0)){
      let numColumns = (options && options.columnOptions)?options.columnOptions:1;
      if(numColumns ===1){
        return (
          <FlatList
           key={this.props.widgetData.uid}
           data ={[...banners, ...secondright]}
           numColumns = {numColumns}
           renderItem ={({item, index})=>this.renderGridItem({item, index, options})}
           keyExtractor={(item, index)=> {return `gridview-${item.path}-${index}`}}
          />)
      }else{
        return (
          <FlatList
           key={this.props.widgetData.uid}
           columnWrapperStyle={{justifyContent:'space-around', marginVertical:4, paddingHorizontal: 3}}
           data ={[...banners, ...secondright]}
           numColumns = {numColumns}
           renderItem ={({item, index})=>this.renderGridItem({item, index, options})}
           keyExtractor={(item, index)=> {return `gridview-${item.path}-${index}`}}
          />)
      }
    }
    return null;

  }
  renderGridItem({item, index, options}){
      let columns = (options && options.columnOptions)?options.columnOptions:1;
      let {path, url, text, id, dimensionsRatio, creative, alttitle} =item;
      if (!!path){
        let aspectRatio = dimensionsRatio.height/dimensionsRatio.width;
        let marginHorizontal = (columns)*7
        let imageWidth = (dimensions.width-marginHorizontal)/columns;
          return (
              <TouchableOpacity activeOpacity={1} style={{marginHorizontal: 5}} onPress={() => this.itemPressed(item)}>
                  <ProgressiveImage source={{uri: `https:${path}`}}
                                    style={{height: aspectRatio * imageWidth, width: imageWidth}}/>
              </TouchableOpacity>
          );
        }
  }

  /**
   *
   * @param {*} item conatins url for navigation;
   */
  itemPressed = (item) =>{
    this.props.callBack(item);
  }
}
