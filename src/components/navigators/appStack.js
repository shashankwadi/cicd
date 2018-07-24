'use strict';

//packages
import React from 'react';
import {
    View,
    Image
} from 'react-native';
import {
    TabNavigator,
    StackNavigator
} from 'react-navigation';


//screens 
import ProductDetail from '../screens/pdp/productDetail';
import CheckoutPage from '../screens/checkoutPage';
import DeliverySlotsPage from '../screens/deliverySlots';
import FilterPage from '../screens/filterPage';
//import FilterPage from '../screens/experimental';
import LanguageView from '../../components/views/language/languageView';


import MultiSeller from '../screens/pdp/multiSeller';
import SizeChart from '../screens/pdp/sizeChart';

import HTMLDescription from "../screens/pdp/productHTMLDescription";

//navigators
import TabStack, {AccountsStack, headerConfiguration} from './rootNavigator';

import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";
import Colors from 'Wadi/src/utilities/namespaces/colors';

const appStackConfig = {
    initialRouteName: "Tabs",
    headerMode:'none',
    cardStyle: { shadowColor: 'transparent' },
    ...headerConfiguration,
}

const FilterStack = StackNavigator({
    Filter: {
        screen: FilterPage,
    },
}, {
    //mode: "modal",
    ...headerConfiguration
});

const CheckoutStack = StackNavigator({
    Checkout: {
        screen: CheckoutPage,
    },
}, {
    //mode: "modal",
    ...headerConfiguration
});

const PDPStack = StackNavigator({
    ProductDetail: {
        screen: ProductDetail,
    },
    DeliverySlots: {
        screen: DeliverySlotsPage,
    },
    HomeToMultiSeller: {
        screen: MultiSeller,
        navigationOptions: {
            headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
            headerTintColor: Colors.black,
            //header:null,
        }
    },
    HomeToSizeChart: {
        screen: SizeChart,
        navigationOptions: {
            headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
            headerTintColor: Colors.black,
            //header:null,
        }
    },
    HtmlDescription: {
        screen: HTMLDescription,
        navigationOptions: {
            headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
            headerTintColor: Colors.black,
        }
    }
}, {
    ...headerConfiguration
});


const AppStack = StackNavigator({
    Tabs: {
        screen: TabStack,
    },
    ProductDetail: {
        screen: PDPStack,
    },
    Checkout: {
        screen: CheckoutStack,
    },
    Filter: {
        screen: FilterStack,
    },
}, appStackConfig);

export default AppStack;