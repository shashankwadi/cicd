'use strict';

import React, { Component } from 'react';
import {View, } from 'react-native';

//widgets
import Banner from './banner';
import Tabs from './tabs';
import HorizontalMixWithText from './horizontalMixWithText';
import VerticalWidget from './verticalMixWidget';
import OrderTrack from './orderTrack';
import ProductCarousel from './productCarousel';
import ProductGrid from './productGrid';
import ProductListWidget from './productList';
import OffersGrid from './offersGrid';
import CartAndWishlist from './cartAndWishlist';
import RichText from './richText';
import SuperSmashigProduct from './superSmashing';
import GridWithBanner from '../newWidgets/gridWithBanner.native';
import Video from '../newWidgets/video.native';
import FlashSaleWidget from './flashSale';

const Widgets = {
    'banner_widget': Banner,
    'tabbed-pages-element': Tabs,
    'horizontal_mix_widget': HorizontalMixWithText,
    'vertical_mix_widget': VerticalWidget,
    'track_order_widget': OrderTrack,
    'product_carousel_widget': ProductCarousel,
    'product_grid_widget': ProductGrid,
    'product_list_widget': ProductListWidget,
    'offers_grid': OffersGrid,
    'cart_widget': CartAndWishlist,
    'wishlist_widget': CartAndWishlist,
    'text_widget': RichText,
    'super_smashing_product': SuperSmashigProduct,
    'banner_with_grid': GridWithBanner,
    'video_banner': Video,
    'flash_sale_widget': FlashSaleWidget,
  };
  const WidgetHandler = ({ data, elementTap }) => {
    let type = data.type;
    let Widget = type ==='tabbed-pages-element'?Tabs:Widgets[type];
    if (Widget) {
      return (
        <View>
          <Widget widgetData={data} callBack={(dataEntity) => elementTap(dataEntity, type)} />
        </View>
      );
    }
    return <View />
  }

  export default WidgetHandler;

  