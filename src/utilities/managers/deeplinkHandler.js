'use strict';

import React from 'react';
import {Navigation} from 'react-native-navigation';
import {I18nManager} from 'react-native';
import {debounce} from "lodash"

import {screens} from 'Wadi/src/components/constants/constants';
import store from 'Wadi/src/reducers/store';

import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";
import {customHeaderStyle} from "../../components/navigators/tabbedApp";

var previosParams = {},
  current_screen = '';

export function setCurrentScreen(cs) {
  current_screen = cs;
}

export function resetPreviosParams() {
  previosParams = {};
}

const launchDeeplink = debounce((navigator, url, currentScreen, toScreen, params = {}, isDeepLink = false)=>{

  let extendedUrl = '';

  let Screen = screens.Home;
  if (toScreen && (toScreen !== "" || toScreen.length > 0)) {
    Screen = toScreen;
  } else if (url == null || (url.length <= 0)) {
      if (currentScreen === screens.Cart
          || currentScreen === screens.Checkout) {
      navigator.switchToTab({
        tabIndex: I18nManager.isRTL ? 3 : 1
      });
        navigator.popToRoot({}); //Changed to fix empty cart crash.
    }
    return;
  } else if (url.startsWith('accounts')) {
    if (url.includes('country')) {
      Screen = screens.CountryView
    } else if (url.includes('')) {

    } else {

    }
  } else if (url.includes('category')) {
    Screen = screens.Category
  } else if (url.includes('cart')) {
    Screen = screens.Cart
  } else if (url.includes('https://track.wadi.com/')) {
    Screen = screens.AccountsToWebView;
    params = { ...params, type: 'trackOrder' };
  } else if (url.includes('checkout')) {
    Screen = screens.AccountsToWebView;
  } else if (url.includes('plp')) {
    Screen = screens.ProductList;
    params = { ...params, extendedUrl: extendedUrl };
  } else if (url.includes('catalog')) {
    extendedUrl = getExtendedUrl(url);
    params = { ...params, extendedUrl: extendedUrl, searchString: 'iphone' };
    Screen = screens.ProductList;
  } else if ((url.includes('.html')) || (url.includes('/product/'))) {
      let queryParam = '';
      let sku = '';
    extendedUrl = getExtendedUrl(url);
    Screen = screens.ProductDetail;
    params = { ...params, productSKU: sku, extendedUrl: extendedUrl };
  } else if (url === 'wadi://home') {
    Screen = screens.Home
  } else if (!isHomePageUrl(url)) {
    Screen = screens.ProductList;
    extendedUrl = getExtendedUrl(url);
    params = { ...params, extendedUrl: extendedUrl };
  } else {
    extendedUrl = getExtendedUrl(url);
    Screen = screens.Home;
    params = { ...params, extendedUrl: extendedUrl };
  }

    if (isDeepLink) {
        Navigation.handleDeepLink({
            link: 'pushDeepLink/',
            payload: {Screen, title: Screen, passProps: {...params}, titleImage: wadiNavBarIcon} // (optional) Extra payload with deep link
        });
    } else if (currentScreen === screens.Category || currentScreen === screens.Cart) {
        //If the current selected tab is category then switch tab to home
        navigator.switchToTab({
            tabIndex: I18nManager.isRTL ? 3 : 1
        });
        navigator.handleDeepLink({
          link: 'home/',
          payload: {Screen, title: params.screenName?params.screenName:Screen, passProps: {...params}, titleImage: wadiNavBarIcon} // (optional) Extra payload with deep link
      });

    } else {
        navigator.push({
            screen: Screen,
            title: Screen,
            passProps: {...params},
            titleImage: wadiNavBarIcon,
            navigatorStyle: customHeaderStyle(params.screenName ? params.screenName : null,Screen),
        });
    }
}, 250);

function getQueryFromUrlString() {

}

/**
 * 
 * @param {*} url pass url to check if it is home/static page or not
 */
const isHomePageUrl = (url) => {
  if(url.includes("wadi:/")){
    url = url.replace("wadi:/", "");
  }
  let result = false;
  let homePageUrls = landingPages;
  let state = store.getState();
  if (state && state.featureMapAPIReducer && state.featureMapAPIReducer.featureMapObj.landingPages) {
    homePageUrls = state.featureMapAPIReducer.featureMapObj.landingPages;
  }
  if (homePageUrls && homePageUrls.length > 0) {
    for (let i = 0; i < homePageUrls.length; i++) {
      //let currentUrl = "/" + homePageUrls[i];
        let currentUrl = "/" + homePageUrls[i].slice(0, -1);
      //result = url.includes(currentUrl) || currentUrl.includes(url);
      result = url === currentUrl;
      if (result) return result;
    }
  }

  return result;
};

const getExtendedUrl = (url) => {
    let extendedUrl = '';
  if (url.includes('wadi://')) {
      let pathparams = url.split('://');
    extendedUrl = pathparams[1]
  } else if (url.includes('wadi.com/')) {
    //includes wadi.com
      let pathparams = url.split('wadi.com/');
    extendedUrl = pathparams[1]
  } else {
    extendedUrl = url;
  }
  return extendedUrl;
};


export default launchDeeplink;

//in case store don't have featureMapReducer data
const landingPages = [
  "home_kitchen/",
  "mobile_phones/",
  "women_fashion/",
  "fragrances/",
  "gifting_store/",
  "eid_store/",
  "zuri_mobiles/",
  "highvoltagesale/",
  "honor8/",
  "iphone7/",
  "honor8/",
  "iphone7/",
  "sass/",
  "googlepixel/",
  "laptops/",
  "winter_essentials/",
  "infinix_note3/",
  "bestproducts_year/",
  "infinix_zero_four_plus/",
  "universal_store/",
  "mobile_accessories/",
  "electronicssale/",
  "wadi-al-nassr/",
  "office_must_haves/",
  "babycare_toys/",
  "baby_care_toys/",
  "brand_deals/",
  "apple_store/",
  "samsung_store_online/",
  "time_out_deals/",
  "march_mania/",
  "rog_swift/",
  "infinix_store/",
  "offer_zone_all_products/",
  "mobile_accessorie/",
  "kenwood_hnk/",
  "Mothers_day/",
  "launchpad/",
  "Theprettybigsale/",
  "top100deals/",
  "big_sale/",
  "big_sale_all/",
  "big_sale_mobile/",
  "big_sale_electronics/",
  "big_sale_beauty/",
  "big_sale_gaming/",
  "big_sale_hnk/",
  "big_sale_fashion/",
  "big_sale_kids/",
  "flash_sale_active_page/",
  "fashion_carnival/",
  "alrajhi/",
  "flash_sale_static/",
  "Super_smartphone_sale/",
  "watches_store/",
  "sports/",
  "game_store/",
  "smart_watches_bands/",
  "womens_fashion_store/",
  "mens_fashion_store/",
  "mesuit_battery_case/",
  "tv_gaming/",
  "arabian_store/",
  "nokia_store_online/",
  "fifa-18/",
  "sports_getfit/",
  "upcoming-gaming/",
  "xbox-one-x/",
  "batman-the-enemy-within/",
  "travel_luggage/",
  "kitchen_dining/",
  "oneplus-5/",
  "televisions/",
  "tv-buying-guide/",
  "tv_buying_guide_size/",
  "tv_buying_guide_screenType/",
  "tv_buying_guide_smasrtFt/",
  "tv_buying_guide_Connectivity/",
  "footwear_store/",
  "womens_footwear/",
  "beauty_store/",
  "fragrances_cosmetics/",
  "fragrances_personalCare/",
  "Forza-motorsport-7/",
  "baby_deals/",
  "daily_needs_store/",
  "daily_needs/",
  "grocery_store/",
  "indoor_entertainment/",
  "infinix-note-4/",
  "handbag_store/",
  "fashion_clearance/",
  "toysrus/",
  "bigpayday/",
  "sunglasses_store/",
  "flash_sale/",
  "bpg/",
  "499store/",
  "mobile-cases-and-covers/",
  "chicco_store/",
  "bigfashionsale/",
  "onederful_sale/",
  "bestdealswatches/",
  "sunglasses_handbags/",
  "clothing_footwear/",
  "big_savings_days/",
  "mega_electronics_sale/",
  "car_seat_store/",
  "lg-q6/",
  "book_store/",
  "backtoschool/",
  "tablets/",
  "electronics_store/electronics_store/",
  "baby_sale/",
  "samsung-official-store/",
  "samsung-note-8/",
  "wadi_wonderful_sale/",
  "stc_sim_card/",
  "iphone-x/",
  "iphone8/",
  "jewellery_store/",
  "kitchen_carnival/",
  "nokia-8/",
  "nationaldaysale/",
  "nationaldaysale_all/",
  "nationaldaysale_electronics/",
  "nationaldaysale_mobiles/",
  "nationaldaysale_fashion/",
  "nationaldaysale_beauty/",
  "nationaldaysale_gaming/",
  "nationaldaysale_hnk/",
  "nationaldaysale_kids/",
  "captoglove/",
  "clearance_sale/",
  "pc-gaming/",
  "bigbrandfest/",
  "bigfashionsale_prebuzz/",
  "bigbeautysale/",
  "mashreq/",
  "beauty_sale/",
  "super_smartphone_deals/",
  "iphones/",
  "latest-android-phones/",
  "best-android-phones/",
  "lenovo-star-wars-jedi-challenges-vr/",
  "buy1get1free_home/",
  "wadi_worldwide_store/",
  "mobiles-tablets-accessories/",
  "fitbit-store/",
  "shopathon/",
  "shopathon_all/",
  "shopathon_electronics/",
  "shopathon_mobiles/",
  "shopathon_fashion/",
  "shopathon_beauty/",
  "shopathon_gaming/",
  "shopathon_hnk/",
  "shopathon_kids/",
  "shopathon_dailyneeds/",
  "howto_loyaltypoints/",
  "mini-ps4-controller/",
  "marvels-spider-man-game/",
  "b1g1/",
  "gaming-microsoft-xbox/",
  "betravelready/",
  "far-cry-5/",
  "best-of-2017/",
  "best_home/",
  "honor-7x/",
  "bestof2017/",
  "camping_central/"
];