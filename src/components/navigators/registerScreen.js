'use strict';
import {Navigation} from 'react-native-navigation';
import React, {Component} from 'react';

import {screens} from 'Wadi/src/components/constants/constants'
import {CartBadge} from '../common';

import SplashScreen from "Wadi/src/components/screens/splashScreen";
import MockableHome from 'Wadi/src/components/screens/homePage'
import HomePage from 'Wadi/src/components/screens/home'
import CategoryPage from 'Wadi/src/components/screens/categoryPage'
import SearchPage from 'Wadi/src/components/screens/search/searchPage'
import CartPage from 'Wadi/src/components/screens/cart/cartPage'
import AccountsPage from 'Wadi/src/components/screens/accountsPage'

import CheckoutPage from 'Wadi/src/components/screens/checkoutPage'
import ProductList from 'Wadi/src/components/screens//plp/productList';
import ProductDetail from 'Wadi/src/components/screens/pdp/productDetail'
import MultiSeller from 'Wadi/src/components/screens/pdp/multiSeller';
import SizeChart from 'Wadi/src/components/screens/pdp/sizeChart';
import HTMLDescription from 'Wadi/src/components/screens/pdp/productHTMLDescription';
import FilterPage from 'Wadi/src/components/screens/filterPage';

import Authentication from 'Wadi/src/components/screens/authentication';
import LoginPage from 'Wadi/src/components/screens/authentication/loginPage/index';
import SignupScreen from 'Wadi/src/components/screens/authentication/signupPage';
import PhoneScreen from 'Wadi/src/components/screens/authentication/phonePage';
import OTPScreen from 'Wadi/src/components/screens/authentication/otpPage';
import PasswordScreen from 'Wadi/src/components/screens/authentication/passwordPage';
import ForgotPasswordScreen from 'Wadi/src/components/screens/authentication/forgotPasswordPage';
import SignupSuccessScreen from 'Wadi/src/components/screens/authentication/signupSuccessPage';

import CountryView from 'Wadi/src/components/views/country/countryView'
import LanguageView from 'Wadi/src/components/views/language/languageView'
import ErrorView from 'Wadi/src/components/views/error/errorView'
import AccountsPageWebView from 'Wadi/src/components/views/accountsPageWebView';
import MyOrders from "../screens/account/myOrders";
import OrderDetails from "../screens/account/orderDetails";
import walletPage from "../screens/wallet/walletPage";
import addressBookScreen from "../screens/account/addressBookScreen";
import addressEditScreen from "../screens/account/addressEditScreen";
import creditCardScreen from "../screens/account/creditCardScreen";

import pdpCartButton from "../views/pdp/pdpCartButton";
import googlePlaces from 'Wadi/src/components/screens/googlePlaces'
import deliverySlotsScreen from 'Wadi/src/components/screens/deliverySlots';

//import DoodleContainerScreen from 'Wadi/src/components/screens/doodleContainerScreen';
import DoodleContainerScreen from '../screens/doodle';
import CustomHeader from '../../components/common/CustomHeader';
import MapsBackButton from '../common/MapsBackButton'
import AccountsWebView from '../views/accountsPageWebView'
import DoodleWebHelperView from '../../components/screens/account/doodleWebHelperView';
import CitySelectionScreen from '../views/citySelectionScreen'
const registerScreen = (store, Provider) => {

    Navigation.registerComponent(screens.Home, () => HomePage, store, Provider);
    Navigation.registerComponent(screens.MockableHome, () => MockableHome, store, Provider);
    Navigation.registerComponent(screens.Category, () => CategoryPage, store, Provider);
    Navigation.registerComponent(screens.Search, () => SearchPage, store, Provider);
    Navigation.registerComponent(screens.Cart, () => CartPage, store, Provider);
    Navigation.registerComponent(screens.Account, () => AccountsPage, store, Provider);
    Navigation.registerComponent(screens.ProductDetail, () => ProductDetail, store, Provider);
    Navigation.registerComponent(screens.ProductList, () => ProductList, store, Provider);

    Navigation.registerComponent(screens.Checkout, () => CheckoutPage, store, Provider);
    Navigation.registerComponent(screens.MultiSeller, () => MultiSeller, store, Provider);
    Navigation.registerComponent(screens.SizeChart, () => SizeChart, store, Provider);
    Navigation.registerComponent(screens.Filter, () => FilterPage, store, Provider);
    Navigation.registerComponent(screens.Authentication, () => Authentication, store, Provider);
    Navigation.registerComponent(screens.LoginPage, () => LoginPage, store, Provider);
    Navigation.registerComponent(screens.SignupScreen, () => SignupScreen, store, Provider);

    Navigation.registerComponent(screens.PhoneScreen, () => PhoneScreen, store, Provider);
    Navigation.registerComponent(screens.OTPScreen, () => OTPScreen, store, Provider);
    Navigation.registerComponent(screens.PasswordScreen, () => PasswordScreen, store, Provider);
    Navigation.registerComponent(screens.ForgotPasswordScreen, () => ForgotPasswordScreen, store, Provider);
    Navigation.registerComponent(screens.SignupSuccessScreen, () => SignupSuccessScreen, store, Provider);
    Navigation.registerComponent(screens.CountryView, () => CountryView, store, Provider);
    Navigation.registerComponent(screens.LanguageView, () => LanguageView, store, Provider);
    Navigation.registerComponent(screens.ErrorView, () => ErrorView, store, Provider);
    Navigation.registerComponent(screens.AccountsToWebView, () => AccountsPageWebView, store, Provider);
    Navigation.registerComponent(screens.SplashScreen, () => SplashScreen, store, Provider);
    Navigation.registerComponent(screens.MyOrders, () => MyOrders, store, Provider);
    Navigation.registerComponent(screens.OrderDetails, () => OrderDetails, store, Provider);
    Navigation.registerComponent(screens.Wallet, () => walletPage, store, Provider);
    Navigation.registerComponent(screens.AddressPage, () => addressBookScreen, store, Provider);
    Navigation.registerComponent(screens.EditAddressPage, () => addressEditScreen, store, Provider);
    Navigation.registerComponent(screens.CreditCardScreen, () => creditCardScreen, store, Provider);
    Navigation.registerComponent(screens.HtmlDescription, () => HTMLDescription, store, Provider);
    Navigation.registerComponent(screens.CartBadge, () => CartBadge, store, Provider);
    Navigation.registerComponent(screens.CartButton, () => pdpCartButton, store, Provider);

    Navigation.registerComponent(screens.GooglePlaces, () => googlePlaces, store, Provider);
    Navigation.registerComponent(screens.DeliverySlots, () => deliverySlotsScreen, store, Provider);

    Navigation.registerComponent('CustomHeader', () => CustomHeader, store, Provider);
    Navigation.registerComponent(screens.DoodleContainerScreen, () => DoodleContainerScreen, store, Provider);
    Navigation.registerComponent(screens.MapsBackButton, () => MapsBackButton, store, Provider)
    Navigation.registerComponent(screens.AccountsWebView, () => AccountsWebView, store, Provider)
    Navigation.registerComponent(screens.DoodleWebHelperView, () => DoodleWebHelperView, store, Provider)
    Navigation.registerComponent(screens.CitySelectionScreen,()=>CitySelectionScreen,store,Provider)
}

export default registerScreen;