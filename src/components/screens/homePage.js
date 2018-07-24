import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Image,
  requireNativeComponent,
  ListView,
  ActivityIndicator,
  Platform,
  Animated,
  ScrollView,
  TouchableOpacity,
    I18nManager
} from 'react-native';
import { connect } from 'react-redux';

import { HeaderBack, Loader, EmptyView } from '../common';
import Header from '../../components/widgets/header';
import { getHomeWidget, getMockableHomeWidget } from 'Wadi/src/actions/homePageActions';    //removed in favour of sagas;
import {addToCart} from 'Wadi/src/actions/cartActions';
import { selectors } from 'Wadi/src/reducers/reducers';


import { dimensions } from 'utilities/utilities';
import SearchBar from 'Wadi/src/components/views/searchBar'
import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";
import RichHtml from 'Wadi/src/components/widgets/richHtml';
import AnimatedHeader from './home/AnimatedHeader';
import deeplinkHandler from '../../utilities/managers/deeplinkHandler';
import { deepLinkActions } from 'Wadi/src/actions/globalActions';
import { WidgetActions } from '../../actions/trackingActionTypes'

import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import CartManager from 'Wadi/src/utilities/managers/cartHandler';
const NAVBAR_HEIGHT = 100;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const AnimatedListView = Animated.createAnimatedComponent(ListView);
const AnimatedSearchBar = Animated.createAnimatedComponent(SearchBar);
import TrackingEnum from '../../tracking/trackingEnum';

import WidgetHandler from '../widgets/oldWidgetHandler';

export class HomePage extends Component {

  constructor(props) {
    super(props);
    // this.props.navigator.setStyle({
    //   navBarHidden: true
    // });

    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      data: null,
      isLoading:true,
      extendedUrl: GLOBAL.API_URL.Wadi_Home,
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,

      ),
    };
  }

  componentDidMount() {
    /**
     * mutlip level destructing
     * please see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment for multi level destructing
     */
    let {extendedUrl} = this.props;
    extendedUrl = (extendedUrl) ? extendedUrl : 'homepage';
    this.setState({
      extendedUrl: extendedUrl
    });
    this.props.getMockableHomeWidget({ extendedUrl: extendedUrl})
      .then(response => {
        if (response && response.status === 200) {
          this.setState({
            isLoading: false,
            data: response.data,
          })
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }

  viewAllTapped = (dataWidget) => {
    let params = {};
    if (dataWidget.type === 'flash_sale_widget') {
      params = {
        isFlashSalePLP: true,
        widgetData:dataWidget,
      }
    }
    this.props.deepLinkActions({ 
      tracking: dataWidget, 
      url: dataWidget.headerData.viewAllfetchUrl, 
      navigator: this.props.navigator, 
      currentScreen: Constants.screens.Home, 
      params: params 
    });

  }

  addToCart = (product, quantity=1) => {
    if (!selectors.isOutOfStock(product)) {
        let defaultSupplier = selectors.getFirstDefaultSupplier(product.simples[0]);
        let sku = (defaultSupplier)?defaultSupplier.sku:selectors.getDefaultSimpleSku(product);
        this.props.addProductToCart({
            //sku: product.sku,
            sku: sku,
            product: { ...product, sku: sku, quantity: quantity, }
        })
    } else {
        return false;
    }

}

  elementTap = (data, actionType) => {
    let params ={};
    let trackingObj = { 
      ...data,
      logType: TrackingEnum.TrackingType.ALL,
      eventType: WidgetActions[actionType]
    };
    
    switch (actionType) {
      //tracking obj for different widgets
      case 'flash_sale_widget':
        params = {
          isFlashSalePLP: true,
          widgetData:data,
        }
        break;
      case 'cart_widget':
            // this.props.deepLinkActions({toScreen:Constants.screens.Cart, navigator: this.props.navigator, currentScreen: Constants.screens.Home, params: params })
          this.cartPressed();
            break;
    }
    if(actionType ==='super_smashing_product' && data.addToCartClicked){
      if(data.isAlreadyInCart){
        this.props.deepLinkActions({toScreen:Constants.screens.Cart, tracking: trackingObj, navigator: this.props.navigator, currentScreen: Constants.screens.Home, params: params });
      }else{
        this.addToCart(data, 1);
      }
    }else{  
      this.props.deepLinkActions({ 
        tracking: trackingObj, 
        url: data.action || data.url, 
        navigator: this.props.navigator, 
        currentScreen: Constants.screens.Home, 
        params: {...params, data:data} 
      });
    }
  }

  menuPressed = () => {
    this.props.navigator.switchToTab({
      tabIndex: I18nManager.isRTL ? 4 : 0
    });
  };

  cartPressed = () => {
    this.props.navigator.switchToTab({
      tabIndex: I18nManager.isRTL ? 1 : 3
    });
  };

  render() {
    const { clampedScroll } = this.state;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    let initialHomePage = (this.state.extendedUrl === 'homepage')?true:false;
    return (
      <View style={{ flex: 1 }}>
        {this.renderListView()}
      </View>
    )


  }


  renderFooter() {
    return (
      <View style={{ height: 50, width: dimensions.width }}>
        <ActivityIndicator
          animating={true}
          style={[styles.centering, { height: 80 }]}
          size="large"
        />
      </View>
    )
  }

  retryRequest = () => {
    this.props.getHomeWidget();
  }
  renderListView() {
    let {data: widgetList, isLoading} = this.state;
    if (isLoading) {
      return (
        <Loader containerStyle={{flex: 1}}/>
      );
    } else {
      if (widgetList && widgetList.length > 0) {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        dataSource = ds.cloneWithRows(widgetList);
        return (
          <View style={styles.container}>
            <ListView
              enableEmptySections={true}
              removeClippedSubviews={false}
              dataSource={dataSource}
              contentContainerStyle={styles.listview}
              renderRow={this.renderRow.bind(this)}
              scrollEventThrottle={1}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      } else {
        return (<EmptyView />)
      }
    }
  }

  searchPressed() {
    this.props.deepLinkActions({ navigator: this.props.navigator, currentScreen: Constants.screens.Home, toScreen: Constants.screens.Search });

  }

  renderHeader(rowData) {
    return (
      <Header headerData={rowData.headerData} widgetData={rowData} viewAllTap={this.viewAllTapped} />
    )
  }

  renderRow(rowData) {
    let topSpace = rowData.topSpace != null ? rowData.topSpace : 5;

    return (
      <View style={{ marginTop: topSpace, }}>
        {(rowData.data && rowData.headerData && (rowData.headerData.headerTitle.length > 0 || rowData.headerData.viewAllTitle.length > 0)) &&
          this.renderHeader(rowData)}
        <WidgetHandler data={rowData} elementTap={this.elementTap} />
      </View>
    )
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>{sectionData}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listview: {
    backgroundColor: 'white',
    //paddingTop: NAVBAR_HEIGHT,
    paddingTop:10,
    paddingBottom: 50,
    //marginBottom:60
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
  },
});


function mapStateToProps(state) {

  return {
    homePage: state.homePageReducers,
    accounts: state.accounts
    //nav: state.navigator
  }

}

function mapDispatchToProps(dispatch) {

  return {
    getMockableHomeWidget: (params) => dispatch(getMockableHomeWidget(params)),
    deepLinkActions: (params) => dispatch(deepLinkActions(params)),
    addProductToCart: (params) => dispatch(addToCart(params)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



