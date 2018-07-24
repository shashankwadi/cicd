/*
 * @Author: shahsank sharma 
 * @Date: 2017-08-22 10:46:08 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2018-02-08 16:28:36
 */

'use strict';

import React, {Component} from 'react';
import {Alert, FlatList, I18nManager, Text, TouchableOpacity, View,} from 'react-native';
import {connect} from 'react-redux';


import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'utilities/constants';
import {dimensions, getCurrency, isDifferentObject, screenManager} from 'utilities/utilities';
import {strings} from 'utilities/uiString';
import TrackingEnum from 'Wadi/src/tracking/trackingEnum';

import {toggleLoginModal} from 'Wadi/src/actions/accountActions';
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {
    beginCheckout,
    getCartItemData,
    getProductReview,
    removeFromCart,
    removeProductsFromCart,
    replaceProductInCart,
    updateProductInCart
} from 'Wadi/src/actions/cartActions';
import Types from 'Wadi/src/actions/actionTypes';

import CityDropdown from "Wadi/src/components/views/CityDropdown";
import CustomActivityIndicator from "../authentication/customActivityIndicator/CustomActivityIndicator.native";
import Panel from 'Wadi/src/helpers/expandCollapse';
import {EmptyView, Loader, PriceView, SizeSelector, VectorIcon} from 'Wadi/src/components/common';

import {BillView, EmptyCart, ProductView} from './components';
import {getTotal} from './helper';
import styles from './styles';


let CURRENT_SCREEN = Constants.screens.Cart;

export class CartPage extends Component {

    static navigatorStyle = {
        drawUnderTabBar: false,
        tabBarHidden: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: this.props.configStore.selectedCity, // change this when this functionality is live
            isCityDropdownVisible: false,
            selectedSimples: [],
            currentProduct: null,
        };
        this.deleteProductClicked = this.deleteProductClicked.bind(this);
        this.updateQuantityClicked = this.updateQuantityClicked.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    _handleToggleCityDropdown = () => {
        this.setState({ isCityDropdownVisible: !this.state.isCityDropdownVisible })
    };

    _handleSelectCity = (selectedCity) => {
        this.setState({ selectedCity });
        this.productReviewCall();
    };


    /**
     * Renders action button in buttom of cart page
     * @param isFetching
     * @param orderPlaced
     * @param isOutOfStock
     * @returns {*}
     */
    renderActionButton = (isFetching, orderPlaced, isOutOfStock) => {
        return (
            <View style={{
                backgroundColor: (isFetching || orderPlaced || isOutOfStock) ? 'grey' : GLOBAL.COLORS.wadiDarkGreen,
                marginHorizontal: 10,
                marginBottom: 10,
                borderRadius: 5,
                height: 45,
                justifyContent: 'center',
            }}>
                <TouchableOpacity
                    style={{}} activeOpacity={1}
                    disabled={isFetching || orderPlaced || isOutOfStock}
                    onPress={this.handleCheckoutClicked.bind(this)}>
                    {(isFetching) ? <Text
                        style={styles.CheckoutButtonText}>{strings.CHECKOUT}</Text> : <Text
                        style={styles.CheckoutButtonText}>{(!orderPlaced) ? strings.CHECKOUT + ' > ' + getTotal(this.props.cart) : message}</Text>}
                </TouchableOpacity>
            </View>
        )
    };
    _checkForUpdates = async (currentProps, nextProps) => {
        try {
            const isVisible = await this.props.navigator.screenIsCurrentlyVisible();
            if (!!isVisible) {
                if (nextProps.cart.OOSData && JSON.stringify(nextProps.cart.OOSData) !== JSON.stringify(currentProps.cart.OOSData)) {
                    if (Object.keys(nextProps.cart.OOSData).length) {
                        let data = nextProps.cart.OOSData;
                        let title = strings.OutOfStcok;
                        let message = strings.OutOfStockProductUpdatingCart;
                        Alert.alert(
                            title,
                            message,
                            [
                                {
                                    text: strings.OK, onPress: () => {
                                        this.props.removeProductsFromCart(data)
                                    }
                                },
                            ],
                            {cancelable: false}
                        );
                    }
                } else if (nextProps.cart.OOSCount === 0) {
                    if ((nextProps.cart.cartReview && nextProps.cart.cartReview.errors
                            && nextProps.cart.cartReview.errors.items
                            && isDifferentObject(nextProps.cart.cartReview, currentProps.cart.cartReview))
                        || (nextProps.cart.itemsCount > 0
                            && currentProps.cart.itemsCount !== nextProps.cart.itemsCount)) {
                        this.productReviewCall()
                    }
                }
            }
        } catch (error) {

        }
    };
    updateCartBadgeCount = (count) => {
        this.props.navigator.setTabBadge({
            tabIndex: (!I18nManager.isRTL) ? 3 : 1, // (optional) if missing, the badge will be added to this screen's tab
            badge: count > 0 ? parseInt(count) : null, // badge value, null to remove badge
            badgeColor: 'red', // (optional) if missing, the badge will use the default color
        });
    };
    /**
     * Renders offers section on cart.
     * @param offer
     * @returns {*}
     */
    renderOfferHeaderItem = (offer) => {

        if (offer && offer.length > 0) {
            return <View style={styles.offerViewHeaderContainer}>
                {
                    offer.map((offer, index) => {
                        let borderTop = (index) ? {
                            borderTopWidth: 1,
                            borderTopColor: GLOBAL.COLORS.headerViewAllColor,
                        } : undefined;
                        return (
                            <View key={offer.key} style={{width:dimensions.width, backgroundColor:'#f7fafa'}}>
                            <View style={{backgroundColor:GLOBAL.COLORS.headerViewAllColor, height:1}}/>
                                {
                                    offer && !!offer.key && !!offer.message &&
                                    <View style={styles.offerViewHeaderRow} key={offer.key}>
                                        <View style ={{marginTop:5}}>
                                            <VectorIcon
                                                style={{color: GLOBAL.COLORS.headerViewAllColor, margin:5}}
                                                groupName={"FontAwesome"} name={"star"} size={15}/>
                                        </View>
                                        <Text style={styles.offerTextStyle}>{offer.message}</Text>
                                    </View>
                                }
                            </View>
                        )
                    })
                }
            </View>
        }
        else {
            return <View/>
        }

    };
    /**
     * Update size from size selector
     * @param selected
     */
    updateSizeFromModal = (selected) => {
        //updated item in cart and call review api right here;
        let product = this.state.currentProduct;
        this.props.replaceProductInCart({
            oldProduct: product,
            newProduct: {...product, ...selected, quantity: product.quantity,}
        });

    };
    /**
     * Handle size click on cart item
     * @param item
     * @private
     */
    _handleSelectSize = (item) => {
        this.setState((prevState) => {
            return {
                selectedSimples: item.simples,
                currentProduct: item
            }
        }, () => {
            this.sizeSelector.openModal();
        });
    };
    /**
     * Action on clicking any tab.
     * @param  {obj} item  - Row object.
     */
    rowPressed = (item) => {

    };

    productReviewCall(itemToBeDeletedSku = null) {
        let {data, itemsCount} = this.props.cart;
        this.props.productReview({data: data, itemToBeDeletedSku}) // pass items in cart // to handle delete review call it is written out of below if condition
    }

    emptyCartCallback = () => {
        this.props.deepLinkActions({
            tracking: {},
            url: GLOBAL.API_URL.Wadi_Home,
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
        });
    };

    render() {
        let {isFetching, orderPlaced, message, data, OOSCount} = this.props.cart;
        let isOutOfStock = !!OOSCount;

        let cartData = (data) ? Object.values(data) : []; //check for

        return (
            <View style={styles.mainContainerView}>
                <View style={styles.list1container}>
                    {(data && cartData.length > 0) ?
                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <FlatList
                                style={{ backgroundColor: '#f7f7f7' }}
                                data={cartData}
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                removeClippedSubviews={false}
                                ListHeaderComponent={this.renderListHeader.bind(this)}
                                renderItem={({ item, index }) => <ProductView item={item} index={index}
                                    deleteProductClicked={(item) => this.deleteProductClicked(item)}
                                    updateQuantityClicked={(increase, product) => this.updateQuantityClicked(increase, product)}
                                    openProductDetails={(item) => this.openProductDetails(item)}
                                    handleSelectSize={(item) => this._handleSelectSize(item)}
                                    getCartItemData={(sku) => this.props.getCartItemData({ sku: sku })} />}
                                keyExtractor={(item, index) => {
                                    return `cartItem-${item.sku}-${index}`
                                }}
                                showsVerticalScrollIndicator={false}/>
                            <View>
                                {this.renderListFooter()}
                                {this.renderActionButton(isFetching, orderPlaced, isOutOfStock)}
                            </View>

                        </View> : <EmptyCart callBack={() => this.emptyCartCallback()} />}
                </View>
                {this.props.cart.isFetching && <View style={styles.loaderGifContainer}><CustomActivityIndicator/></View>}
                <SizeSelector
                    ref={(sizeSelector) => {
                        this.sizeSelector = sizeSelector;
                    }}
                    callBack={(selected) => {
                        this.updateSizeFromModal(selected)
                    }}
                    simples={this.state.selectedSimples}/>
            </View>
        )
    }

    componentDidMount() {
        this.updateCartBadgeCount(this.props.cart.itemsCount);
    }

    componentWillReceiveProps(nextProps) {
        this.updateCartBadgeCount(nextProps.cart.itemsCount);
        this._checkForUpdates(this.props, nextProps);
    }

    onNavigatorEvent(event) {
        // handle a deep link
        if (event.type === 'DeepLink') {
            console.log(JSON.stringify(event));
            const parts = event.link.split('/'); // Link parts
            const { Screen = "", title = "", passProps = {}, titleImage = "" } = event.payload; // (optional) The payload

            if (parts[0] === 'cart') {
                this.props.navigator.push({
                    screen: Screen,
                    title: title,
                    passProps: passProps,
                    titleImage: titleImage,
                });
            }
        } else {
            switch (event.id) {
                case 'willAppear':
                    break;
                case 'didAppear':
                    this.productReviewCall();
                    break;
                case 'willDisappear':
                    break;
                case 'didDisappear':
                    break;
                case 'willCommitPreview':
                    break;
            }
        }

    }

    /**
     * Renders selected city, shipping delivery date.
     * @returns {*}
     */
    renderListHeader() {
        let offerText = '';
        let offer = (this.props
            && !!this.props.cart
            && !!this.props.cart.cartReview
            && !!this.props.cart.cartReview.offer) ? this.props.cart.cartReview.offer : [];
        return (
            <View>
                <View style={{ backgroundColor: 'white' }}>
                    {!GLOBAL.CONFIG.isGrocery &&
                    <View>
                        <CityDropdown isCityDropdownVisible={this.state.isCityDropdownVisible}
                                      handleToggleCityDropdown={this._handleToggleCityDropdown}
                                      handleSelectCity={(selectedCity) => {
                                          this._handleSelectCity(selectedCity)
                                      }}
                                      selectedCity={this.state.selectedCity}
                                      cities={this.props.configStore.configObj.content.deliveryCities}/>
                        {this.props.cart.data && Object.keys(this.props.cart.data).length > 0 &&
                        <View style={styles.shippingToContainer}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={styles.shippingTo}>{strings.shippingTo}</Text>
                                <Text style={styles.selectedCity}>{this.state && !!this.state.selectedCity
                                    ? this.state.selectedCity.toCapitalize() : ''}</Text>
                            </View>
                            <TouchableOpacity activeOpacity={1} onPress={this._handleToggleCityDropdown}>
                                <View style={{ marginHorizontal: 15, }}>
                                    <Text style={styles.underlineText}>{strings.ChangeCity}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        }
                        </View>
                    }
                    <View>

                        {offerText.length > 0 &&
                            <View style={{ backgroundColor: GLOBAL.COLORS.wadiYellow, margin: 20 }}>
                                <Text style={styles.colorTitleText}>
                                    {offerText}
                                </Text>
                            </View>
                        }
                    </View>
                </View>


                {this.renderOfferHeaderItem(offer)}

            </View>
        )
    }

    /**
     * Renders cart totals and breakups
     * @returns {*}
     */
    renderListFooter() {
        return (
            <Panel
                title={strings.ViewSubTotals}
                containerStyle={{backgroundColor: '#eef9f9', marginVertical: 0}}
                titleContainerStyle={{
                    backgroundColor: GLOBAL.COLORS.wadiBackgroundGreen,
                    paddingVertical: 5,
                    borderBottomWidth: 1,
                    borderColor: '#efeff2'
                }}
                bodyStyle={{paddingTop: 0, padding: 0}}
                collapsed={true}>
                <BillView cart={this.props.cart}/>
            </Panel>
        );
    }

    /**
     * Handle proceed to checkout
     */
    handleCheckoutClicked() {

        this.props.beginCheckout();

        if (this.props.user && this.props.user.loggedIn
            && this.props.user.userData.phoneNumber
            && this.props.user.userData.phoneNumber) {

            if (!GLOBAL.CONFIG.isGrocery) {
                let tracking = Object.assign({}, {logType: TrackingEnum.TrackingType.MSD});
                this.props.deepLinkActions({
                    tracking: tracking,
                    navigator: this.props.navigator,
                    currentScreen: CURRENT_SCREEN,
                    toScreen: Constants.screens.Checkout,
                    type: Types.ON_ORDER_PLACED
                });
            } else {
                this.props.deepLinkActions({
                    navigator: this.props.navigator,
                    currentScreen: CURRENT_SCREEN,
                    toScreen: Constants.screens.DeliverySlots,
                });
            }

        } else {
            this.props.toggleLoginModal(this.props.navigator, !GLOBAL.CONFIG.isGrocery
                ? Constants.screens.Checkout : Constants.screens.DeliverySlots);
        }
    }

    /**
     * Handle product deleted from cart
     * @param product
     */
    deleteProductClicked(product) {
        this.props.removeFromCart({ product: product })
            .then((res) => {
                let itemToBeDeletedSku = product.sku;
                this.productReviewCall(itemToBeDeletedSku)//pass sku of item to be deleted
            })
            .catch((err) => {
                // do nothing
            });
    }

    /**
     * Handle product quantity update
     * @param increase
     * @param product
     */
    updateQuantityClicked(increase = false, product) {
        let { sku, quantity } = product;
        let newQuantity = (increase) ? parseInt(quantity) + 1 : parseInt(quantity) - 1;
        this.props.updateProductInCart({ sku, product: { ...product, quantity: parseInt(newQuantity) }, increase })
            .then((res) => {
                this.productReviewCall()
            })
            .catch((err) => {
                //do nothing
            });
    }

    openProductDetails = (product) => {
        let { sku, name, productSku } = product;
        sku = (productSku) ? productSku : sku.split("-")[0];
        this.props.deepLinkActions({
            tracking: {},
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: Constants.screens.ProductDetail,
            params: { extendedUrl: 'product/' + sku, screenName: name , data:product}
        });
    }
}




function mapStateToProps(state) {

    return {

        user: state.accounts,
        cart: state.cart,
        currentScreen: state.currentScreen,
        product: state.productDetailReducers,
        configStore: state.configAPIReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCartItemData: (params) => dispatch(getCartItemData(params)),
        removeFromCart: (params) => dispatch(removeFromCart(params)),
        updateProductInCart: (params) => dispatch(updateProductInCart(params)),
        replaceProductInCart: (params) => dispatch(replaceProductInCart(params)),
        removeProductsFromCart: (params) => dispatch(removeProductsFromCart(params)),
        productReview: (params) => dispatch(getProductReview(params)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
        beginCheckout: () => dispatch(beginCheckout()),

        //toggle login modal
        toggleLoginModal: (params, toScreen) => {
            dispatch(toggleLoginModal(params, toScreen))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
