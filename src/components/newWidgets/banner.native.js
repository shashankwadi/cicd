/*
 * @Author: shahsank sharma 
 * @Date: 2017-07-27 11:45:35 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2017-07-28 16:54:33
 *
 */
'use strict';
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ListView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { dimensions } from 'utilities/utilities';
import PageControl from 'react-native-page-control'
import TimerMixin from 'react-timer-mixin';

import * as GLOBAL from 'Wadi/src/utilities/constants';


const hairlineWidth = StyleSheet.hairlineWidth;
let screenToCellWidthRatio = 2.25;
const defulatDimRatio = 1.3

let autoScrollWidth = dimensions.width;
const smallWidth = autoScrollWidth/screenToCellWidthRatio;

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentPage: 0
    });
    this._listView = ListView;
  }
  componentDidMount() {
   //Auto scroll banner
   let widgetData = (this.props.widgetData)?this.props.widgetData:{};
    let isSelfScrolling = (widgetData && widgetData.json && widgetData.json['options.bind'] && widgetData.json['options.bind']["autoplay"])?true:false;
    let scrollTime = (widgetData && widgetData.json && widgetData.json['options.bind'] && widgetData.json['options.bind']["sliderOptions"] && widgetData.json['options.bind']["sliderOptions"]["slidesPerView"])?widgetData.json['options.bind']["sliderOptions"]["slidesPerView"]:2;
     if (isSelfScrolling) {
       this.timer = TimerMixin.setInterval(
        () => { this.bannerAutoScroll() },
        scrollTime*4000
      );
     }
  }
  
  componentWillUnmount() { 
      TimerMixin.clearInterval(this.timer);
  }

  render() {

    let widgetData = (this.props.widgetData)?this.props.widgetData:{};
    let options = (widgetData && widgetData.json && widgetData.json['options.bind'])?widgetData.json['options.bind']:{};
    let {width, height} = (options && options.dimensionsRatio)?options.dimensionsRatio:{width:0, height:0};
    let dimensionsRatio = height/width;
    return (
      <View style={styles.container}>
        {this.renderView(widgetData, dimensionsRatio, width, height)}
      </View>
    );
  }

  /**
   * Renders banner horizontal list
   * @param {*} widgetData passed from previous function
   * @param {*} dimensionsRatio is passed from above instead of calculating from props;
   * dataSource is calculated from this.props.widgetData['banners.bind']["assets"]
   */
  renderView(widgetData, dimensionsRatio, width, height) {
    let leftMargin = this.props.widgetData.marginLeft || 0;
    let rightMargin = this.props.widgetData.marginRight || 0;
    //autoScrollWidth = Math.min(dimensions.width, width);
    autoScrollWidth = dimensionsRatio<=1?autoScrollWidth:smallWidth;

    let bannerWidth = autoScrollWidth - leftMargin - rightMargin;
    let bannerHeight = (dimensionsRatio<1)?dimensionsRatio * bannerWidth:defulatDimRatio*bannerWidth;
    let data = (widgetData && widgetData.json && widgetData.json['banners.bind'] && widgetData.json['banners.bind']["assets"])?widgetData.json['banners.bind']["assets"]:[];
    let options = (widgetData && widgetData.json && widgetData.json['options.bind'])?widgetData.json['options.bind']:{};
    if (data.length >= 1) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let dataSource = ds.cloneWithRows(data);
    let pagingEnabled = (options.hidePagination)?false:true
      return (
        <View>
          <ListView
            style={{ height: bannerHeight, width: dimensions.width, marginTop: 5, marginBottom: 5 }}
            ref={(listView) => { this._listView = listView; }}
            dataSource={dataSource}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={pagingEnabled}
            removeClippedSubviews={false}
            onMomentumScrollEnd={(this.onScrollAnimationEnd).bind(this)}
            renderRow={(rowData) => this.renderBannerRow(bannerHeight, bannerWidth, leftMargin, rightMargin, rowData, options)
            }
          />
          {this.renderPageControl(options, data.length)}
        </View>);
    }
  }
  onScrollAnimationEnd(event) {
    let offsetX = event.nativeEvent.contentOffset.x
    var index = offsetX / autoScrollWidth;
     this.setState({
      currentPage: index
    })
  }
  /**
   * Action on clicking any banner.
   *
   * @param   {obj} item  - Row object.
   */
  onPressItem(item) {
      // console.log(item);
      this.props.callBack({...item, url: item.redirectUrl})
  }
  //Auto Scrolling of carousel
  bannerAutoScroll() {
    var scrollToPoint;
    let widgetData = (this.props.widgetData)?this.props.widgetData:{};
    let data = (widgetData && widgetData.json && widgetData.json['banners.bind'] && widgetData.json['banners.bind']["assets"])?widgetData.json['banners.bind']["assets"]:[];
    if (this.state.currentPage >= data.length - 1) {
      scrollToPoint = 0;
    } else {
        scrollToPoint = (this.state.currentPage + 1) * autoScrollWidth
    }
     this._listView.scrollTo({
            y: 0,
            x: scrollToPoint,
            animated: true,
          });
  }
  /**
   * 
   * @param {*} options are passed from behined
   * @param {*} count passed from behined is images count
   */
  renderPageControl(options, count =0) {
    if (options && options.sliderOptions  || this.props.widgetData.showPageControll == true) {
      return (
        <PageControl 
          style={styles.paginationContainer}
          numberOfPages={count}
          currentPage={parseInt(this.state.currentPage)}
          hidesForSinglePage={true}
          pageIndicatorTintColor='gray'
          currentPageIndicatorTintColor='white'
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 5 }}
          indicatorSize={{ width: 8, height: 8 }}
          onPageIndicatorPress={this.onItemTap} />
      )
      
    } else {
      return (<View />)
    }
  }

    /**
     * Renders row of banner list
     * @param bannerHeight
     * @param bannerWidth
     * @param leftMargin
     * @param rightMargin
     * @param rowData
     */
  renderBannerRow = (bannerHeight,bannerWidth,leftMargin,rightMargin,rowData, options) => {
    let {freeMode, hideIndexer, hidePagination, hidePrevNext, showTextContent} = options;
    let {imageUrl, content, creative, redirectUrl, title, id} = rowData;
    bannerHeight = (!!showTextContent)?bannerHeight*0.8:bannerHeight;
      return( 
        <TouchableOpacity activeOpacity ={1} onPress={() => this.onPressItem(rowData)}>
            <View style={styles.mainView}>
                <Image style={{ height: bannerHeight, width: bannerWidth, marginLeft: leftMargin, marginRight: rightMargin }} source={{ uri: `https:${imageUrl}` }} resizeMode="contain"/>
                {!!showTextContent &&
                  <View style={styles.titleContainer}>
                    {!!title && <Text style={styles.titleText}>{title}</Text>}
                    {!!content && <Text style={styles.contentText}>{content}</Text>}
                  </View>
                }
            </View>
        </TouchableOpacity>
      );
  }
}

const styles = StyleSheet.create({
  container:{ 
    flex:1, 
    backgroundColor: GLOBAL.COLORS.white 
  },
  paginationContainer:{ 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 10 
  },
  mainView:{
    flex:1, 
    borderColor:GLOBAL.COLORS.bordergGreyColor, 
    borderLeftWidth:hairlineWidth, 
    borderRightWidth:hairlineWidth, 
    borderTopWidth:2*hairlineWidth, 
    borderBottomWidth:2*hairlineWidth
  },
  titleContainer:{
    flex:1, 
    justifyContent:'center', 
    alignItems:'center'
  },
  titleText:{
    color:GLOBAL.COLORS.black,
    fontFamily:GLOBAL.FONTS.default_font,
    backgroundColor:'transparent',
    fontSize:16,
  },
  contentText:{
    color:GLOBAL.COLORS.wadiDarkGreen,
    fontFamily:GLOBAL.FONTS.default_font_bold,
    backgroundColor:'transparent',
    fontSize:14,
  }
});