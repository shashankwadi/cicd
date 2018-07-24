'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import WidgetHeader from './widgetHeader';
import WidgetHandler from '../../newWidgets';
import * as GLOBAL from 'Wadi/src/utilities/constants';


export default class WidgetComponent extends PureComponent {

    constructor(props) {
      super(props)
    }

    render() {
      let { item, index } = this.props;
      let rowData = item;
      return (
        <View>
          <View>
            {this.renderWidgetHeader(rowData)}
            <WidgetHandler widgetId={rowData.widgetId} data={rowData} elementTap={(data, type) => this.props.elementTap(data, type)} key={`WidgetHandler-${item.widgetId}-${index}`} />
          </View>
        </View>
      )
    }

    /**
     * Renders header of every widget. Basically its consists of a header and a view all button which is visible if we get url as one of the key rowData
     * @param rowData
     */
    renderWidgetHeader = (rowData) => {

      if(rowData.json){
          if ((rowData.json['datalinks.bind'] && !!rowData.json['datalinks.bind'].title) && (rowData.widgetId != 'category-links-element')) {
              return this.renderWidgetHeaderContainer('datalinks.bind',rowData)
          }
          else if ((rowData.json['options.bind'] && !!rowData.json['options.bind'].title)) {
              return this.renderWidgetHeaderContainer('options.bind',rowData)
          }
          else if ((rowData.json['images.bind'] && !!rowData.json['images.bind'].title)) {
              return this.renderWidgetHeaderContainer('images.bind',rowData)
          }else if((rowData.json['banners.bind'] && !!rowData.json['banners.bind'].title)){
                return this.renderWidgetHeaderContainer('banners.bind',rowData)
          }
          else{
              return this.renderEmptyView()
          }
      }
      else {
          return this.renderEmptyView()
      }

    }

    /**
     * Renders widget header based on the key
     * @param key
     * @param rowData
     * @returns {XML}
     */
    renderWidgetHeaderContainer = (key,rowData) => {
        return(<WidgetHeader
                title={rowData.json[key].title}
                url={rowData.json[key].url}
                style={{ marginTop: 30, marginBottom: 10 }}
                colorTheme={!!rowData.json[key].colorTheme ? rowData.json[key].colorTheme : GLOBAL.COLORS.wadiDarkGreen}
                viewAllTapped={(url) => this.props.viewAllTapped({ viewAllfetchUrl: url, type: rowData.widgetId,screenName: rowData.json[key].title})} />
        )
    }

    /**
     * Renders empty view if we dont get the expected keys in the rowData object
     * @returns {XML}
     */
    renderEmptyView=()=>{
        return(<View style = {styles.emptyViewStyle}/>)
    }
  }

  const styles = StyleSheet.create({

      emptyViewStyle:{
          height: 1,
          marginTop: 5,
          backgroundColor: 'white'
      }
  })