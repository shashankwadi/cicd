/**
 * Created by Manjeet Singh
 * Created on 2017-11-24 16:53:21
 * This component can be used as reusable vector icon solution
 * can save you from importing multiple icons in your view files
 */

'use strict';

import React from 'react';
import {
  View,StyleSheet, 
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

import Banner from './banner';
import ProductCarousel from './productCarousel.native';
import GridWithBanner from './gridWithBanner';
import Video from './video';
import Tabs from '../widgets/tabs';

/**
 * Map with key representing the value we get from the api and value corresponding to the widget to be rendered
 * @type {{carousel-element, products-carousel-element: *, banner-element, info-element, tabbed-pages-element: Tabs}}
 */
const Widgets = {
  'carousel-element':Banner,
  'products-carousel-element':ProductCarousel,
  'banner-element':GridWithBanner,
  'info-element':Video,
  'tabbed-pages-element':Tabs,
};


const WidgetHandler = ({widgetId, data, style, elementTap})=>{

    let Widget = Widgets[widgetId];
    if(Widget){
        return (
        <View style={[style]}>
            <Widget widgetData={data} callBack={(dataEntity) => elementTap(dataEntity, widgetId)}/>
        </View>)
    }
    return <View/>
}
WidgetHandler.propTypes = {
    widgetId: PropTypes.string,
    data: PropTypes.object,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

WidgetHandler.defaultProps = {
    widgetId: "",
    data: {},
    style: undefined,
};

const styles =StyleSheet.create({
    shadow:{
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: { width: 1, height: 1 },
        elevation: (Platform.OS === 'ios') ? 0 : 5,
    }
})
export default WidgetHandler