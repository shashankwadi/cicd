'use strict';

import React, {PureComponent} from 'react';
import {
    FlatList,
    I18nManager,
    Image,
    NativeModules,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Vibration,
    View,
} from 'react-native';
import {connect} from 'react-redux';

import {
    clearCurrentData,
    getFrequentlyBought,
    getProductDetail,
    getSimilarProducts,
    getSizeChart,
    isOutOfStock,
    trackCarousalSwipe,
    updateCurrentProduct,
} from 'Wadi/src/actions/productDetailAction';
import {selectors} from 'Wadi/src/reducers/reducers';
import {addToCart} from 'Wadi/src/actions/cartActions';
import {dimensions} from 'utilities/utilities';
import ImagePage from 'Wadi/src/components/views/pdp/imagePage'
import BulletObjectInfo from 'Wadi/src/components/views/pdp/bulletObjectInfo'
import BulletListInfo from 'Wadi/src/components/views/pdp/bulletListInfo';
import LoadingOverlay from '../../views/LoadingOverlay';
import TitleSection from '../../views/pdp/titleSection'
import ProductDescription from '../../views/pdp/productDescription'
import SubProductInfo from '../../views/pdp/subProductInfo'
import {strings} from 'Wadi/src/utilities/uiString';


import Panel from 'Wadi/src/helpers/expandCollapse';
import {CarouselProduct, CartBadge, Loader, SizeSelector, VectorIcon} from '../../common';
import FrequentlyBoughtItem from './frequentlyBoughtItem';
import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {
    _getFirstDefaultSupplier,
    _getSupplierForDeliveryPromise,
    getPDPPromiseDetails
} from "../../../actions/productDetailAction";
import Types from '../../../actions/actionTypes';
// import CarouselProduct from '../../views/carouselProduct';
import TrackingEnum from '../../../tracking/trackingEnum';
import {isEmptyObject, isEmptyString, isIos} from "../../../utilities/utilities";
import isHtml from "../../../libs/isHtml";
import RatingsAndReviews from "../../newWidgets/ratingsAndReviews";

const isIphoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
const CART_BUTTON = "cartButton";
const SHARE_BUTTON = "shareButton";
const vibrationDuration = 500;
const ProductDetailItemType = {
    Images: "Images",
    TitleSection: "TitleSection",
    SubProductInfo: "SubProductInfo",
    ProductDescription: "ProductDescription",
    GeneralFeature: "GeneralFeature",
    Highlights: "Highlights",
    SellerDetails: "SellerDetails",
    FrequentlyBoughtTogether: "FrequentlyBoughtTogether",
    SimilarProducts: "SimilarProducts",
    ReviewAndRatings: "ReviewAndRatings",
};
let CURRENT_SCREEN = Constants.screens.ProductDetail;

/**
 * Opens share dialog on app.
 *
 * @param product object
 */
const shareProduct = (product) => {
    let message = "https://www.wadi.com/product/{sku}?utm_source=share_product&utm_medium=app&utm_campaign=share_product&utm_term={sku}".replace(/{sku}/g, product.sku);
    Share.share({
        message: product.name + "\n" + message,
        url: message,
        title: product.name
    }, {
        // Android only:
        dialogTitle: 'Share',
        // iOS only:
        excludedActivityTypes: []
    })
};


export class ProductDetail extends PureComponent {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../icons/navbar/handbag.png'),
                id: CART_BUTTON,
            },
            {
                icon: require('../../../icons/navbar/share.png'),
                id: SHARE_BUTTON
            }
        ]
    };

    static navigatorStyle = {
        drawUnderTabBar: false,
        tabBarHidden: true, //Hide bottom tab bar on pdp.
        drawUnderNavBar: true,
        navBarTranslucent: true,
        navBarHidden:true,
    };

    getProductDetailOrder = () => {
        return [
            {"type": ProductDetailItemType.Images},
            {"type": ProductDetailItemType.TitleSection},
            {"type": ProductDetailItemType.SubProductInfo},
            {"type": ProductDetailItemType.ProductDescription},
            {"type": ProductDetailItemType.GeneralFeature},
            {"type": ProductDetailItemType.Highlights},
            {"type": ProductDetailItemType.SellerDetails},
            {"type": ProductDetailItemType.FrequentlyBoughtTogether},
            {"type": ProductDetailItemType.SimilarProducts},
            {"type": ProductDetailItemType.ReviewAndRatings},
        ];
    };
    /**
     * Renders frequently bought together wigdet
     * @returns {*}
     */
    renderFrequentlyBought = () => {
        let FBTAddNowButtonBackground = (this.state.frequentlyBoughtallProduct || this.state.comboPrice === 0) ? GLOBAL.COLORS.lightGreyColor : GLOBAL.COLORS.wadiDarkGreen;
        return (
            <View>
                <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                {this.state.frequentlyBought.length > 1 && <View>
                    <Text
                        style={[styles.wigdetTitle, {marginLeft: 10}]}>{strings.FrequentlyBoughtTogether}</Text>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: 10,
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: GLOBAL.COLORS.lightGreyColor,
                    }}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: GLOBAL.COLORS.lightGreyColor,
                            }}>

                            {(!this.state.frequentlyBoughtallProduct && this.state.comboPrice === 0) ?
                                <View style={{
                                    height: 60,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginTop: 10,
                                    marginBottom: 10
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        textAlign: 'center'
                                    }}>{strings.SelectItemsToBuyTogether}
                                    </Text></View> : this.state.frequentlyBoughtItemState.map((item, index) => {
                                    return this.renderFBTTopView(item, index)
                                })}

                        </View>
                        {this.state.frequentlyBought && this.state.frequentlyBought.length > 1 &&
                        this.state.frequentlyBought.map((item, index) => {
                            return (
                                <FrequentlyBoughtItem data={item}
                                                      state={this.state.frequentlyBoughtItemState[index]}
                                                      onClick={() => this.handleFrequentlyBoughtClick(index)}
                                                      inCart={this.props.cart.data.hasOwnProperty(selectors.getDefaultSimpleSku(item))}
                                                      index={index}
                                                      key={`fb-${index}`}
                                                      openProductDetail={() => this.openProductDetail(index)}/>)
                        })}
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: 10
                        }}>

                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                <Text style={{
                                    color: GLOBAL.COLORS.darkGreyColor,
                                    fontFamily: GLOBAL.FONTS.default_font_bold,
                                    fontSize: 14,
                                }}>{strings.ComboPrice} </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: 'black',
                                    textAlign: 'left',
                                    fontFamily: GLOBAL.FONTS.default_font_bold
                                }}>{this.state.frequentlyBoughtallProduct ? 0 : this.state.comboPrice} {this.props.featureMapAPIReducer.featureMapObj.currency.label}</Text>
                            </View>

                            <TouchableOpacity
                                disabled={this.state.frequentlyBoughtallProduct || this.state.comboPrice === 0}
                                onPress={() => this.addProductsToCart()}
                                activeOpacity={1}
                                style={{
                                    backgroundColor: FBTAddNowButtonBackground,
                                    paddingHorizontal: 7,
                                    paddingVertical: 5
                                }}>
                                <Text style={{
                                    fontFamily: GLOBAL.FONTS.default_font_bold,
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: 12,
                                    padding: 5
                                }}>
                                    {strings.ADDNOW}
                                </Text>

                            </TouchableOpacity>

                        </View>
                    </View>
                </View>}
            </View>
        );
    };

    componentWillReceiveProps(nextProps) {
        // let dataSource = selectors.getItemOnUrl(nextProps.product, this.state.extendedUrl);
        // let oldDataSource = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
        // if (dataSource && dataSource.sku && dataSource !== oldDataSource) {
        //     this.setState((prevState) => {
        //         return {
        //             sku: dataSource.sku,
        //             isReloading: false,
        //             quantity: 1,
        //         }
        //     })
        // }
    }

    /***
     * Get callback of navigation (react-native-navigation) button clicks
     * @param event
     */

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === CART_BUTTON) { // this is the same id field from the static navigatorButtons definition
                this.props.navigator.switchToTab({
                    tabIndex: GLOBAL.ENUM.TAB_POSITION.CART,
                });
            }
            if (event.id === SHARE_BUTTON) {
                //let dataSource = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
                let {dataSource}= this.state;
                shareProduct(dataSource);
            }
        } else if (event.type === 'ScreenChangedEvent') {

        }
    }
    renderActionButton = (dataSource) => {
        if (dataSource) {
            dataSource = (this.state.selectedSimple) ? {...dataSource, ...this.state.selectedSimple} : dataSource;
            let addToCartTextColor = GLOBAL.CONFIG.isGrocery ? GLOBAL.COLORS.black : 'white';
            let isOutOfStock = selectors.isOutOfStock(dataSource);
            let isAlreadyInCart = selectors.isAlreadyInCart(this.props.cart, dataSource, this.state.selectedSimple);
            let disabled = (!isAlreadyInCart && isOutOfStock) ? true : false;
            let actionButtonStyle = (isAlreadyInCart) ? {backgroundColor: GLOBAL.COLORS.wadiDarkGreen} : (isOutOfStock) ? {backgroundColor: GLOBAL.COLORS.outOfStock} : (disabled?{backgroundColor:GLOBAL.COLORS.darkGreyColor}:{backgroundColor:GLOBAL.COLORS.wadiDarkGreen});
            let actionButtonText = disabled ? strings.OutOfStcok : (isAlreadyInCart ? strings.AlreadyInCart : strings.AddToCart);
            return (
                <View style={styles.bottomButtonContainer}>
                    {!(isOutOfStock || isAlreadyInCart) &&
                    <View style={styles.quantityContainer}>
                        <View style={[{flex: 1}, styles.centering]}>
                            <Text>{this.state.quantity}</Text>
                        </View>
                        <View style={{flex: 1, borderLeftWidth: 1, borderColor: '#cccccc', justifyContent: 'center',}}>
                            <TouchableOpacity activeOpacity={1} style={{alignItems: 'center'}}
                                              disabled={this.state.quantity > 2}
                                              onPress={() => {
                                                  this.updateQuantity(true)
                                              }}>
                                <VectorIcon groupName={"Ionicons"} name={"ios-arrow-up-outline"} size={18}
                                            style={{color: '#999999', fontWeight: 'bold'}}/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1}
                                              style={{borderTopWidth: 1, borderColor: '#cccccc', alignItems: 'center'}}
                                              disabled={this.state.quantity === 1}
                                              onPress={() => {
                                                  this.updateQuantity(false)
                                              }}>
                                <VectorIcon groupName={"Ionicons"} name={"ios-arrow-down-outline"} size={18}
                                            style={{color: '#999999', fontWeight: 'bold'}}/>
                            </TouchableOpacity>
                        </View>
                    </View>}
                    <TouchableOpacity activeOpacity={1}
                                      disabled={disabled}
                                      style={[styles.cartActionButton, actionButtonStyle]}
                                      onPress={() => {
                                          isAlreadyInCart ? this.props.navigator.switchToTab({
                                              tabIndex: GLOBAL.ENUM.TAB_POSITION.CART,
                                          }) : this.handleAddToCart(dataSource)
                                      }}>
                                    {!this.state.isReloading && <Text style={{color: {addToCartTextColor},fontFamily: GLOBAL.FONTS.default_font, fontSize: 16, textAlign: 'center', paddingTop: 2}}>{actionButtonText}</Text>}
                                    {this.state.isReloading && <Loader color = "lightgray" size="small"/>}
                    </TouchableOpacity>
                </View>
            );
        }
    };
    /**
     *
     * @param {*} product is the extended url
     * @param {*} quantity is the updated producted data;
     * @param {*} isSizeCheck is optional paramter, that will help us to look for selected size
     */

    addToCart = (product, quantity, isSizeCheck = false) => {
        if (!selectors.isOutOfStock(product)) {
            let sku = "";
            let selectedSimple = {};
            let defaultSupplier = null;
            let selectedColor = null;
            if (selectors.hasOnlyOS(product)) {
                defaultSupplier = selectors.getFirstDefaultSupplier(product.simples[0].suppliers);
                sku = (defaultSupplier) ? defaultSupplier.sku : selectors.getDefaultSimpleSku(product);
            } else if (isSizeCheck && this.state.selectedSimple && this.state.selectedSimple.sku) {
                let defaultSupplier = selectors.getFirstDefaultSupplier(this.state.selectedSimple.suppliers);
                sku = (defaultSupplier) ? defaultSupplier.sku : this.state.selectedSimple.sku;
                selectedSimple = this.state.selectedSimple;
            } else {
                sku = selectors.getDefaultSimpleSku(product);
            }
            if (product.groups && product.groups.color && product.groups.color.length > 0) {
                selectedColor = product.groups.color.filter((item) => item.sku === product.sku)[0];
            }
            let productObj = Object.assign({}, {...product});
            this.props.addProductToCart({
                //sku: product.sku,
                sku: sku,
                product: {
                    ...product, ...selectedSimple,
                    sku: sku,
                    quantity: quantity,
                    selectedSupplier: defaultSupplier,
                    selectedColor: selectedColor,
                    productSku: product.sku,
                },
                changeInQuantity: quantity,
            });

            this.setState({frequentlyBoughtItemState: Array(3).fill(false), comboPrice: 0});
        } else {
            return false;
        }

    };
    openProductDetail = (index) => {

        this.props.deepLinkActions({
            tracking: {},
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: 'ProductDetail',
            params: {extendedUrl: 'product/' + this.state.frequentlyBought[index].sku,screenName : this.state.frequentlyBought[index].name}
        });
    };

    updateQuantity(increase) {
        this.setState((prevState) => {
            let {quantity} = prevState;
            //let updatedQuantity= (increase)?quantity+1:quantity-1
            return {
                quantity: (increase) ? quantity + 1 : quantity - 1
            }
        });
    }

    componentWillUnmount() {
        /*
            Clear product data from state, was added for react navigation, not sure for react native navigation
         */
        // if (this.state.extendedUrl) {
        //     this.props.clearCurrentData(this.state.extendedUrl);
        // }
    }

    elementTap = (data, index) => {
        //let currentProduct = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
        let {dataSource:currentProduct}= this.state;
        let tracking = Object.assign({}, {data: data}, {parentData: currentProduct}, {posOfReco: `${index}`}, {logType: TrackingEnum.TrackingType.MSD});

        this.props.deepLinkActions({
            tracking: tracking,
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: CURRENT_SCREEN,
            params: {extendedUrl: 'product/' + data.sku,screenName:data.name},
            type: Types.CAROUSAL_PRODUCT_CLICK

        });

    };
    handleAddToCart = (product) => {
        if (!this.state.selectedSimple && product && product.sizes && product.sizes.length > 0 && product.sizes[0] !== "OS") {
            this.sizeSelector.openModal();
        } else {
            Vibration.vibrate(vibrationDuration);
            this.addToCart(product, this.state.quantity, true)
        }
    };

    addProductsToCart() {
        this.state.frequentlyBoughtItemState.map((item, index) => {
            item ? this.addToCart(this.state.frequentlyBought[index], 1) : null
        });
    }

    updateSize = (selectedSimple, product, isFromSelector = false) => {
        let specialPrice = (selectedSimple.specialPrice) ? selectedSimple.specialPrice : (product.specialPrice ? product.specialPrice : null);
        this.setState({
            selectedSize: selectedSimple.size,
            selectedSimple: selectedSimple,
            dataSource:{...product, price: selectedSimple.price, specialPrice: specialPrice}
        });
    };
    handleSizeChange = (selected, product) => {
        this.setState((prevState) => {
            return {
                selectedSimple: selected,
                selectedSize: selected.size
            }
        }, () => {
            let selectedSeller = _getFirstDefaultSupplier(selected.suppliers);
            this.fetchDeliveryPromise(selectedSeller);
            this.addToCart(product, this.state.quantity, true)
        });
    };
    navigateToSellerScreen = (suppliers = []) => {
        //let dataSource = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
        let {dataSource}= this.state;
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: 'MultiSeller',
            params: {
                //product: this.props.product.dataSource,
                product: dataSource,
                suppliers: suppliers
            }
        });
    };
    navigateToSizeChart = () => {
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: 'HomeToSizeChart',
            params: {
                sizeChart: this.state.sizeChartData
            }
        });
    };
    /**
     * Renders similar products, horizontal scrolling
     * @returns {*}
     */
    renderSimilarProducts = () => {
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                {this.state.similarProducts && this.state.similarProducts.length > 0 &&

                <View style={styles.horizontalScrollContainer}>
                    <Text style={[styles.wigdetTitle, {paddingLeft: 10}]}>{strings.SimilarProducts}</Text>
                    <FlatList style={{width: dimensions.width, backgroundColor: 'white'}}
                              data={this.state.similarProducts}
                              horizontal={true}
                              removeClippedSubviews={false}
                              renderItem={this.renderSimilarProductItem.bind(this)}
                              showsHorizontalScrollIndicator={false}
                              onScrollBeginDrag={() => this.handleSimilarProductsCarousalSwiping()}
                              keyExtractor={(item, index) => {
                                  return `msd-${item.sku}-${index}`
                              }}/>
                </View>
                }
            </View>
        );
    };

    navigateToHTMLDescription(htmlText) {
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: 'HtmlDescription',
            params: {
                htmlText: htmlText,
            }
        });
    }

    render() {
        return this.renderProductDetailComponents()
    }

    /**
     * Renders general features in html only
     * @param data
     * @returns {*}
     */
    renderGeneralFeatures = (data) => {
        if (!(data && data.attributesMap && data.attributesMap.groups && data.attributesMap.groups["General Features"])) {
            return <View/>
        }
        return (
            <View>
                <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                <Panel title={strings.GENERALFEATURES} style={styles.wigdetTitle}>
                    <BulletObjectInfo bulletData={data.attributesMap.groups["General Features"]}/>
                </Panel>
            </View>
        )
    };
    /**
     * Renders the product highlights
     * @param data
     * @returns {*}
     */
    renderProductHighlights = (data) => {
        if (data.highlights && data.highlights.length > 0) {
            return (
                <View>
                    <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                    <Panel title={strings.KEYHIGHLIGHTS} style={styles.wigdetTitle}>
                        <BulletListInfo bulletData={data.highlights}/>
                    </Panel>
                </View>
            )
        } else {
            return <View/>;
        }
    };
    /**
     * Renders rating and reviews widget
     * @returns {*}
     */
    renderReviewAndRating = () => {
        return (
            <View>
                <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                {this.state.bestSeller && <RatingsAndReviews sku={this.state.bestSeller}/>}
            </View>
        );
    };
    /**
     * Renders grouping by variants and colors, renders seller info and multi seller.
     * @param data
     * @returns {*}
     */
    renderSubProductInfo = (data) => {
        let defaultSelectedSeller = _getSupplierForDeliveryPromise(data);
        if (defaultSelectedSeller) {
        }
        return (
            <View>
                <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                <SubProductInfo
                    groupsInfo={data.groups}
                    sizesInfo={data.simples} sku={data.sku}
                    reloadProduct={(sku) => this.reloadProduct(sku)}
                    selectedSize={this.state.selectedSize}
                    selectedSimple={this.state.selectedSimple}
                    defaultSelectedSize={defaultSelectedSeller && defaultSelectedSeller.size ? defaultSelectedSeller.size : undefined}
                    selectedCity={this.state.selectedCity}
                    handleSelectSeller={(suppliers, defaultSelectedSize) => {
                        this.navigateToSellerScreen(suppliers, defaultSelectedSize)
                    }}
                    sizeChartAvailable={this.state.sizeChartData}
                    handleSizeChart={() => this.navigateToSizeChart()}
                    selectSize={(selectedSize, selectedSimple) => {
                        this.updateSize(selectedSimple, data)
                    }}

                    handleSelectCity={(selectedCity, selectedSeller = null) => {
                        this.handleSelectCity(selectedCity, selectedSeller)
                    }}/>
            </View>
        )
    };
    /**
     * Fetch delivery promise date for selected city and selected variant.
     * @param selectedSeller
     */
    fetchDeliveryPromise = (selectedSeller = null) => {
        let postParams = selectedSeller ? {
            "catalog_simple": [{
                "sku_simple": selectedSeller.sku,
                "vendor_code": selectedSeller.vendor_code
            }],
            "destination": this.props.configStore.selectedCity,
            "shop": this.props.configStore.selectedCountry.countryCode
        } : null;
        let url = postParams ? null : this.state.extendedUrl;
        this.props.getPDPPromiseDetails({data: null, url: url, params: postParams});  // get new promise details
    };
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        let {data} = props;
        data = JSON.stringify(data);
        this.state = {
            dataSource:!!data?JSON.parse(data):null,
            extendedUrl: '',
            quantity: 1,
            isReloading: true,
            isLoading:false,
            selectedSize: null,
            selectedSimple: null,
            similarProducts: null,
            selectedCity: this.props.configStore.selectedCity, // change this when this functionality is live
            frequentlyBought: [],
            frequentlyBoughtItemState: Array(3).fill(false),
            frequentlyBoughtallProduct: false,
            comboPrice: 0,
            msdCarousalSwiped: false,
            imageOffsetHeight: 0,
            bestSeller: null,
            navBarColor:'rgba(34,182,181,0.0)',
            headerCartColor:'black',
            isNavBarHidden: true
        };
        this.updateQuantity = this.updateQuantity.bind(this);
        this.reloadProduct = this.reloadProduct.bind(this);
        this.renderSimilarProducts = this.renderSimilarProducts.bind(this);
        //this.setSelectedSize = this.setSelectedSize.bind(this);

    }

    /**
     * Renders the title, description, brand, prices, express badge, offer text, delivery promise.
     * @param data: product data
     * @returns {*}
     */
    renderTitleSection = (data) => {
        return (
            <TitleSection data={data}
                          selectedCity={this.state.selectedCity}
                          handleSelectCity={(selectedCity, selectedSeller = null) => {
                              this.handleSelectCity(selectedCity, selectedSeller)
                          }}
                          setOffsetHeight={(height) => this.handleUpdateImageOffsetHeight(height)}/>
        )
    };
    /**
     * Renders image slider and image zoom on tap.
     * @param data: product data
     **/
    renderProductImageSection = (data) => {
        return (
            <View>
                <ImagePage imageKey={data.imageKey}
                           maxImage={data.maxImages} {...data}
                           offsetHeight={this.state.imageOffsetHeight}
                           isFetching ={this.state.isReloading}/>
                {/* Show ribbon badge on images */}
                {data && data.ribbon &&
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {data.ribbon.name.toUpperCase()}
                    </Text>
                </View>}
            </View>
        );
    };
    handleSelectCity = (selectedCity, selectedSeller = null) => {
        this.setState({selectedCity}); // save state
        this.fetchDeliveryPromise(selectedSeller)
    };
    /**
     * Renders product description in html
     * @param data - product data
     * @returns {*}
     */
    renderProductDescription = (data) => {
        if (data.description && data.description.length > 0) {
            let firstDescriptionText = data.description && data.description.length > 0 && !isEmptyString(data.description[0].text) ? data.description[0].text : '';
            let isFirstDescriptionHtml = isHtml(firstDescriptionText);
            let isCollapsedDescription = ((isEmptyObject(data.description) || data.description.length < 1 || (isFirstDescriptionHtml && data.description.length < 2))) ? true : false;
            let textDescription = (isFirstDescriptionHtml && !isCollapsedDescription && !isEmptyObject(data.description)) ? data.description.slice(1) : data.description;

            return (
                <View>
                    <View style={{backgroundColor: '#e7e7e7', height: 1}}/>
                    <Panel title={strings.DESCRIPTION} style={styles.wigdetTitle}
                           collapsed={isCollapsedDescription}
                           navigate={() => this.navigateToHTMLDescription(firstDescriptionText)}>
                        <ProductDescription bulletData={textDescription}/>
                        {isFirstDescriptionHtml && !isCollapsedDescription && <View style={{height: 41}}>
                            <View style={{height: 0.5, backgroundColor: GLOBAL.COLORS.lightGreyColor}}/>

                            <TouchableWithoutFeedback style={{flex: 1, justifyContent: 'center'}}
                                                      onPress={() => this.navigateToHTMLDescription(firstDescriptionText)}>
                                <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                                    <Text style={styles.readMoreText}>
                                        Read More
                                    </Text>
                                    <VectorIcon groupName={"Ionicons"} name={"ios-arrow-forward"} size={25}
                                                style={{
                                                    position: 'absolute',
                                                    color: 'black',
                                                    fontWeight: 'bold',
                                                    right: 8
                                                }}/>
                                </View>
                            </TouchableWithoutFeedback>


                        </View>}
                    </Panel>
                </View>
            )
        } else {
            return <View/>
        }
    };
    renderSizeSelector = (dataSource) => {
        if ((!!dataSource && !selectors.hasOnlyOS(dataSource))) {
            return (
                <SizeSelector
                    ref={(sizeSelector) => {
                        this.sizeSelector = sizeSelector;
                    }}
                    handleSizeChart={() => this.navigateToSizeChart()}
                    sizeChartAvailable={this.state.sizeChartData}
                    updateItem={(selected) => {
                        this.updateSize(selected, dataSource, true)
                    }}
                    callBack={(selected) => {
                        this.handleSizeChange(selected, dataSource)
                    }}
                    simples={dataSource.simples}/>
            )
        } else {
            return <View/>
        }
    };

    componentDidMount() {
        if (this.props && this.props.extendedUrl) {
            let extendedUrl = this.props.extendedUrl;
            this.setState({
                extendedUrl: extendedUrl
            });
            this.getProductData(extendedUrl);
        }
    }

    /**
     * Render similar product item.
     * @param item
     * @param index
     * @returns {*}
     */
    renderSimilarProductItem({item, index}) {
        return (
            <CarouselProduct style={{flex: 1}} data={item} callBack={() => this.elementTap(item, index)}/>
        )


    }

    /**
     * Renders pdp components
     * @param item
     * @param index
     * @returns {*}
     */
    renderCustomComponents({item, index}) {
        let rowData = item;
        //let data = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
        let {dataSource:data}= this.state;
        // if (!(data && data.attributes)) {
        //     return <View/>
        // }
        if (!data) {
            return <View/>
        }

        switch (rowData.type) {
            case ProductDetailItemType.Images: {
                return this.renderProductImageSection(data);
            }
            case ProductDetailItemType.TitleSection: {
                return this.renderTitleSection(data);
            }
            case ProductDetailItemType.SubProductInfo: {
                return this.renderSubProductInfo(data);
            }
            case ProductDetailItemType.ProductDescription: {
                return this.renderProductDescription(data);
            }
            case ProductDetailItemType.GeneralFeature: {
                return this.renderGeneralFeatures(data);
            }
            case ProductDetailItemType.Highlights: {
                return this.renderProductHighlights(data);
            }
            case ProductDetailItemType.FrequentlyBoughtTogether: {
                return this.renderFrequentlyBought();
            }
            case ProductDetailItemType.SimilarProducts: {
                return this.renderSimilarProducts();
            }
            case ProductDetailItemType.ReviewAndRatings: {
                return this.renderReviewAndRating();
            }
            default: {
                return (<View/>)
            }
        }
    }

    /**
     * Reload product on selected simple change.
     * @param sku
     */
    reloadProduct(sku = this.state.sku) {
        //let currentProduct = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
        let {dataSource:currentProduct} = this.state;
        if (!sku) {
            sku = currentProduct.sku;
        }
        let extendedUrl = (sku === currentProduct.sku) ? this.state.extendedUrl : `product/${sku}`;
        this.setState((prevState) => {
            return {
                extendedUrl: (sku === currentProduct.sku) ? prevState.extendedUrl : `product/${sku}`,
                //extendedUrl:`product/${sku}`,
                sku: sku,
                isReloading: true,
                selectedSize: null,
                selectedSimple: null,
                frequentlyBought: [],
                frequentlyBoughtItemState: Array(3).fill(false),
                frequentlyBoughtallProduct: false
            }
        });
        this.getProductData(extendedUrl);
    }

    navigateToProductDetailPage(sku, index, name) {
        if (index !== 0) {
            this.props.deepLinkActions({
                tracking: {},
                navigator: this.props.navigator,
                currentScreen: CURRENT_SCREEN,
                toScreen: 'ProductDetail',
                params: {extendedUrl: 'product/' + sku, screenName: name}
            });
        }
    }

    /**
     * Fetch product data, similar products, frequently bought products
     * @param param
     */
    getProductData(param) {
        let fbtElements = 1;
        this.props.getProductDetail(param).then((response) => {
                if (response && response.status === 200) {

                    //this.props.navigation.product = response.data;
                    this.setState({
                        dataSource:response.data,
                        sku:response.sku?response.sku:"",
                        isLoading:false,
                        isReloading: false,
                        quantity: 1,
                        frequentlyBought: this.state.frequentlyBought.concat(response.data),
                        bestSeller: response.data.bestSeller?response.data.bestSeller.sku:response.sku
                    });

                    if (!this.props.cart.data.hasOwnProperty(selectors.getDefaultSimpleSku(this.state.frequentlyBought[0])))
                        this.handleFrequentlyBoughtClick(fbtElements - 1);


                    this.props.getSimilarProducts(response.sku).then((response) => {
                        if (response && response.status === 200) {
                            // console.log(response.response.data.data);
                            this.setState({
                                similarProducts: response.response.data.data
                            });
                        }
                        else {
                            //do nothing
                        }

                    });
                    this.props.getFrequentlyBought(response.sku).then((response) => {
                        this.setState({
                            frequentlyBought: this.state.frequentlyBought.concat(response.response.data.data)
                        });

                        let frequentlyBoughtallProduct = this.props.cart.data.hasOwnProperty(selectors.getDefaultSimpleSku(this.state.frequentlyBought[0]));
                        this.state.frequentlyBought.map((item, index) => {

                            if (index != 0) {
                                frequentlyBoughtallProduct = frequentlyBoughtallProduct && this.props.cart.data.hasOwnProperty(selectors.getDefaultSimpleSku(item));
                                fbtElements++;
                                this.handleFrequentlyBoughtClick(fbtElements - 1);
                            }
                        });
                        this.setState({frequentlyBoughtallProduct: frequentlyBoughtallProduct});

                    });
                    /*this.setState(prevState=>{
                       let ffb = prevState.ffb;
                       return{
                           frequentlyBoughtCartState:ffb
                       }
                    });*/

                    this.props.getSizeChart(response.sku).then((response) => {
                        if (response && response.status === 200) {
                            this.setState({
                                sizeChartData: response.response.data
                            });
                        }
                        else {
                            //do nothing
                        }
                    })
                }
                this.setState({
                    isReloading: false
                })
            }
        );
    }

    /**
     * Render frequently bought top image group
     * @param item
     * @param index
     * @returns {*}
     */
    renderFBTTopView(item, index) {
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10
            }}
                  key={`frequently_bought-${index}`}>{(item || this.state.frequentlyBoughtallProduct) && index <= this.state.frequentlyBought.length - 1 &&
            <TouchableOpacity activeOpacity={1}
                              onPress={() => this.navigateToProductDetailPage(this.state.frequentlyBought[index].sku, index, this.state.frequentlyBought[index].name)}>
                <Image
                    resizeMode={'contain'}
                    style={{width: 60, height: 60, marginLeft: 10, marginRight: 10}}
                    source={{uri: (this.state.frequentlyBought[index].imageKey) ? `https://b.wadicdn.com/product/${this.state.frequentlyBought[index].imageKey}/${1}-product.jpg` : this.state.frequentlyBought.imageUrl}}/></TouchableOpacity>
            }{this.state.frequentlyBoughtallProduct ? (this.state.frequentlyBought[index + 1]) && <Text style={{
                fontSize: 25,
                color: GLOBAL.COLORS.darkGreyColor
            }}>+</Text> : ((index + 1 <= this.state.frequentlyBought.length - 1 && this.state.frequentlyBoughtItemState[index + 1]) || (index + 2 <= this.state.frequentlyBought.length - 1 && this.state.frequentlyBoughtItemState[index + 2])) && item &&
                <Text style={{fontSize: 25, color: GLOBAL.COLORS.darkGreyColor}}>+</Text>}</View>)
    }

    /**
     * Handle frequently bought item click
     * @param i
     */
    handleFrequentlyBoughtClick(i) {
        const frequentlyBoughtItemState = this.state.frequentlyBoughtItemState.slice();
        frequentlyBoughtItemState[i] = !this.state.frequentlyBoughtItemState[i];
        const tempComboPrice = frequentlyBoughtItemState[i] ? this.state.comboPrice + (this.state.frequentlyBought[i].specialPrice ? this.state.frequentlyBought[i].specialPrice : this.state.frequentlyBought[i].price) : this.state.comboPrice - (this.state.frequentlyBought[i].specialPrice ? this.state.frequentlyBought[i].specialPrice : this.state.frequentlyBought[i].price);
        this.setState({frequentlyBoughtItemState: frequentlyBoughtItemState, comboPrice: tempComboPrice});
        // this.state.frequentlyBoughtItemState.map((item,index) => {item?this.state.comboPrice+this.state.frequentlyBought[index]:0})
    }

    /**
     * Callback for similar product widget swipe
     */
    handleSimilarProductsCarousalSwiping() {
        if (!this.state.msdCarousalSwiped) {
            let {dataSource:currentProduct} = this.state;
            //let currentProduct = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
            this.props.trackCarousalSwipe(currentProduct);
            this.setState((prevState) => {
                return {
                    msdCarousalSwiped: !prevState.msdCarousalSwiped
                }
            });

        }
    }

    /**
     * Get height of title view, used to set image page height dynamically to show page till price, always!
     * @param height
     */
    handleUpdateImageOffsetHeight(height) {
        this.setState({
            imageOffsetHeight: height,

        })
    }

    /**
     *   Render product detail page with flat list and components.
     **/
    renderProductDetailComponents() {
        //let dataSource = selectors.getItemOnUrl(this.props.product, this.state.extendedUrl);
        let {dataSource}= this.state;
        // if (!this.state.isReloading && this.props.product.isFetching === true && !(dataSource && dataSource.attributes)) {
        //     return (
        //         <Loader containerStyle={{flex: 1}}/>
        //     );
        // }
        let productDetailOrder = this.getProductDetailOrder();

        return (
            <View style={styles.container}>
                {this.renderCustomHeader(dataSource)}
                <FlatList
                    key={`ProductDetails-types`}
                    data={productDetailOrder}
                    style={styles.listview}
                    showsVerticalScrollIndicator={false}
                    renderItem={this.renderCustomComponents.bind(this)}
                    keyExtractor={(item, index) => item.type}
                    onScroll={(this.handleScrollOfMainList).bind(this)}
                    scrollEventThrottle={16}
                />
                {/* Action bottom button */}
                {this.renderActionButton(dataSource)}
                {/* Renders size selector modal */}
                {this.renderSizeSelector(dataSource)}
                {/* If product detail is reloading, show loader overlay */}
                {/*this.state.isReloading && <LoadingOverlay isLoading={this.props.product.isFetching}/>*/}
            </View>);

    }

    renderCustomHeader (dataSource) {

        let title = (dataSource && (!this.state.isNavBarHidden))? dataSource.name : '';
        let backIconGroup = isIos() ? 'SimpleLineIcons' : 'MaterialCommunityIcons';
        let backIconName = isIos() ? 'arrow-left' : 'keyboard-backspace';
        let headerHeight = isIos() ? (GLOBAL.DIMENSIONS.navBarHeight + GLOBAL.DIMENSIONS.statusBarHeight) : 54;

        return(
            <View style = {[styles.customHeaderStyle, {backgroundColor:this.state.navBarColor, height:headerHeight}]}>
                <TouchableOpacity style={styles.backButtonStyle} onPress={()=>this.backPressed()}>
                    <VectorIcon groupName={backIconGroup} name={backIconName}
                                size={16}
                                style={{color: this.state.headerCartColor, marginTop: 4}}/>
                </TouchableOpacity>
                <Text style={styles.headerTitleStyle} numberOfLines={1}>{title}</Text>
                <TouchableOpacity style={styles.cartContainerStyle} onPress={()=>this.cartPressed()}>
                    <VectorIcon groupName={"SimpleLineIcons"} name={"handbag"}
                                size={16}
                                style={{color: this.state.headerCartColor, marginTop: 4}}/>
                    <CartBadge badgeStyle={{marginTop: 0, marginLeft: -5}}/>
                </TouchableOpacity>

            </View>
        )
    }
    handleScrollOfMainList(event:Object) {

        if(event.nativeEvent.contentOffset.y >450) {
            this.setState({
                navBarColor: GLOBAL.CONFIG.isGrocery ? GLOBAL.COLORS.wadiGroceryNavBar : 'rgba(34,182,181,1.0)',
                headerCartColor:  GLOBAL.CONFIG.isGrocery ? 'black': 'white',
                isNavBarHidden: false

            })
        }else {
            this.setState({
                navBarColor: GLOBAL.CONFIG.isGrocery ? GLOBAL.COLORS.wadiGroceryNavBarWithoutAlpha : 'rgba(34,182,181,0.0)',
                headerCartColor: 'black',
                isNavBarHidden: true
            })
        }

            //console.warn(event.nativeEvent.contentOffset.y)
    }

    cartPressed =()=>{
        this.props.navigator.switchToTab({
            tabIndex: I18nManager.isRTL ? 1 : 3
        });
    };

    backPressed =()=>{
        this.props.navigator.pop();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: (isIphoneX) ? 25:0
    },
    listview: {
        backgroundColor: 'white',
        paddingBottom: 10,
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
        height: GLOBAL.DIMENSIONS.navBarHeight,
        justifyContent: 'center',
        paddingTop: 0
    },
    wigdetTitle: {

        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginTop: 10,
        marginBottom: 10,
        color: GLOBAL.COLORS.darkGreyColor,
        fontSize: 14

    },
    badge: {
        position: 'absolute',
        top: 70,
        left: 30,
        borderColor: GLOBAL.COLORS.darkGreyColor,
        borderWidth: 1,
        borderRadius: 15,
        padding: 4,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: GLOBAL.COLORS.white
    },
    cartActionButton: {
        flex: 1,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        borderRadius: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        height: 42,
        borderColor: '#cccccc',
        borderWidth: 1,
        width: 60,
        borderRadius: 4,
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#FDFDFD'
    },
    horizontalScrollContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',

    },
    badgeText: {
        color: GLOBAL.COLORS.darkGreyColor,
        fontSize: 12,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        backgroundColor: GLOBAL.COLORS.white,
        paddingLeft: 2,
        paddingTop: 2
    },
    readMoreText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        color: GLOBAL.COLORS.darkGreyColor,
    },
    cartContainerStyle: {
        flexDirection:'row',
        width:40,
        height:40,
        marginTop: isIos() ? 40 : 15,
    },
    headerTitleStyle:{
        width:dimensions.width-100,
        textAlign:'center',
        fontFamily:GLOBAL.FONTS.default_font_bold,
        fontSize:16,
        color: GLOBAL.CONFIG.isGrocery ? 'black': 'white',
        marginLeft:5,
        marginRight:15,
        marginTop: isIos() ? 45 : 17,
    },
    backButtonStyle:{
        width:35,
        height:40,
        marginLeft:5,
        marginTop: isIos() ? 40 : 15
    },
    customHeaderStyle:{
        flexDirection:'row',
        marginTop:0,
        position: 'absolute',
        width:dimensions.width,
        zIndex: 100000
    }

});


function mapStateToProps(state) {

    return {
        product: state.productDetailReducers,
        cart: state.cart,
        featureMapAPIReducer: state.featureMapAPIReducer,
        configStore: state.configAPIReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clearCurrentData:(extendedUrl)=>dispatch(clearCurrentData(extendedUrl)),
        getProductDetail: (extendedUrl) => dispatch(getProductDetail(extendedUrl)),
        addProductToCart: (params) => dispatch(addToCart(params)),
        getSimilarProducts: (params) => dispatch(getSimilarProducts(params)),
        getFrequentlyBought: (params) => dispatch(getFrequentlyBought(params)),
        getSizeChart: (params) => dispatch(getSizeChart(params)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
        getPDPPromiseDetails: (obj) => dispatch(getPDPPromiseDetails(obj)),
        updateCurrentProduct: (params) => dispatch(updateCurrentProduct(params)),
        trackCarousalSwipe: (product) => dispatch(trackCarousalSwipe(product)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)


