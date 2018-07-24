'use strict';
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, Vibration, View} from 'react-native';
import {dimensions} from 'utilities/utilities';
import ExpressWidget from 'Wadi/src/components/widgets/expressWidget';
import {strings} from 'Wadi/src/utilities/uiString';
import {connect} from 'react-redux';
import {detailsFlex, imageFlex} from "./styles";
import {updateProductInCart} from 'Wadi/src/actions/cartActions';
import {selectors} from 'Wadi/src/reducers/reducers';
import {PriceView, VectorIcon} from 'Wadi/src/components/common'
import * as GLOBAL from 'Wadi/src/utilities/constants';

const vibrationDuration = 500;

class GroceryProductPLP extends PureComponent {

    constructor(props) {
        super(props);
    }


    /**
     * Renders empty view on the top half of the image
     *
     */
    renderTopImageOverlay() {
        return (
            <View style={styles.imageOverlayTopView}>

            </View>
        )
    }

    /**
     * Renders the product image
     * @param imageUrl
     * @param imageWidthAndHeight
     *
     */
    renderProductImage = (imageUrl, imageWidthAndHeight) => {
        return (<View activeOpacity={1}
                      style={[styles.imageStyle, {height: imageWidthAndHeight, alignSelf: 'center'}]}>
            <Image style={{flex: 1}} resizeMode='contain'
                   source={{uri: imageUrl}}/>
        </View>)

    };

    /**
     * Updates the quantity of the product
     * @param increase
     * @param product- product whose quantity has to be updated
     */
    updateQuantityClicked(increase = false, product) {

        let {sku, quantity} = product;
        let defaultSupplier = null;
        if (selectors.hasOnlyOS(product)) {
            defaultSupplier = selectors.getFirstDefaultSupplier(product.simples[0].suppliers);
            sku = (defaultSupplier) ? defaultSupplier.sku : selectors.getDefaultSimpleSku(product);
        } else {
            sku = selectors.getDefaultSimpleSku(product);
        }
        let newQuantity = (increase) ? parseInt(quantity) + 1 : parseInt(quantity) - 1;
        this.props.updateProductInCart({
            sku,
            product: {
                ...product,
                sku: sku,
                quantity: parseInt(newQuantity),
                productSku: product.sku
            },
            increase
        });
    }
    /**
     * Renders price view
     * @param price
     * @param specialPrice
     * @returns {XML}
     */
   renderPriceView = (price,specialPrice) => {

       return(<PriceView
           price={price}
           specialPrice={specialPrice}
           priceTextStyle={styles.priceText}
           specialPriceTextStyle={styles.specialPriceText}
           containerStyles={styles.priceViewStyleProp}
       />)
   };
       renderSizeView = (simples,sizes) => {
        return(<View style={{flexDirection: 'row', marginRight: 10}}>
            <Text style={[styles.colorTitleText, {marginTop: 8}]}
                  numberOflines={1}>{strings.Size}</Text>
            <TouchableOpacity activeOpacity={1} style={styles.sizeButton}
                              disabled={(!simples || (simples && simples.length === 0)
                                  || (!sizes || sizes && sizes.length === 0))}
                              onPress={() => this._handleSelectSize(item)}
            >
                <Text>{size}</Text>
            </TouchableOpacity>
        </View>)

       };
    /**
     * Renders quantity updation view for the product
     * @param quantity
     * @param available_quantity
     * @returns {XML}
     */
       renderQuantityUpdationView=(quantity,available_quantity)=>{
        return(<View style={styles.quantityUpdationViewContainer}>
            <TouchableOpacity activeOpacity={1}
                              style={{}}
                              onPress={() => this.updateQuantityClicked(false, {
                                  ...this.props.data,
                                  quantity
                              })}>
                <View
                    style={[styles.quantityRemoveSelectionButton, {opacity: 1}]}>
                    <VectorIcon groupName={'FontAwesome'} name={'minus'} size={12}
                                style={styles.reduceQuantity}/>
                </View>
            </TouchableOpacity>
            {<Text style={[styles.colorTitleText, styles.quantityStyling]}>{quantity}</Text>}

            <TouchableOpacity activeOpacity={1}
                              disabled={(quantity > 2 || (available_quantity && available_quantity == quantity))}
                              onPress={() => this.updateQuantityClicked(true, {
                                  ...this.props.data,
                                  quantity
                              })}>
                {<View
                    style={[styles.quantityAddSelectionButton, {opacity: (quantity > 2 || (available_quantity && available_quantity == quantity)) ? 0.3 : 1}]}>
                    <VectorIcon groupName={'FontAwesome'} name={'plus'} size={12}
                                style={styles.addMoreButtonStyling}/>
                </View>}
            </TouchableOpacity>
        </View>)
       };
    /**
     * Renders add to cart button for the product which is already not in cart
     * @param quantity
     * @returns {XML}
     */
    renderAddToCartButton=(quantity)=>{
        return(<TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                this.updateQuantityClicked(true, {
                    ...this.props.data,
                    quantity
                });
                Vibration.vibrate(vibrationDuration)
            } }>
            <Text
                style={styles.addSelectionButton}>
                ADD
            </Text>
        </TouchableOpacity>)
       }

    render() {
        let {
            name, sku, imageUrl, offerPrice,
            price, specialPrice, imageKey, discount,
            attributes, message, available_quantity,
            size, simples, sizes, delivery_info, tax_info, is_express
        } = this.props.data;

        let quantity = (this.props.cartData[selectors.getDefaultSimpleSku(this.props.data)]
            && this.props.cartData[selectors.getDefaultSimpleSku(this.props.data)].quantity) || 0;

        specialPrice = specialPrice ? specialPrice : 0;
        price = !!price ? price : 0;
        let imageWidthAndHeight = imageFlex * dimensions.width;
        imageUrl = (imageKey) ? `https://b.wadicdn.com/product/${imageKey}/1-product.jpg` : imageUrl;
        return (
            <View>
                <TouchableOpacity activeOpacity={1}
                                  onPress={this.props.callBack}>
                    <View style={[styles.itemContainer]}>
                        {this.renderProductImage(imageUrl, imageWidthAndHeight)}
                        <View style={styles.detailsViewStyle}>
                            <Text style={[styles.titleText]} numberOfLines={2}>
                                {name}
                            </Text>

                            {!!is_express && is_express === 1 && <View style={styles.expressWidgetContainer}>
                                <ExpressWidget/>
                            </View>}

                            {(attributes && attributes.color) &&
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {(!!size) &&
                                this.renderSizeView(simples, sizes)
                                }
                                <Text style={[styles.colorTitleText, {marginTop: 8}]} numberOflines={1}>
                                    {strings.Color}
                                </Text>
                                <Text style={styles.titleText} numberOflines={1}>
                                    {attributes.color}
                                </Text>
                            </View>}
                            <View style={styles.priceAndQuantityContainer}>
                                {(!!price || !!specialPrice) &&
                                this.renderPriceView(price, specialPrice)
                                }
                                {quantity !== 0 ?
                                    this.renderQuantityUpdationView(quantity, available_quantity) :
                                    this.renderAddToCartButton(quantity)
                                }
                            </View>
                            {(available_quantity && available_quantity < 3) && <Text
                                style={styles.lessItem}>{`Only ${available_quantity} ${available_quantity > 1 ? 'items' : 'item'} available`}</Text>}

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: 7,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#efeff2',
    },
    imageStyle: {
        flex: imageFlex,
        margin: 10
    },
    detailsViewStyle: {
        flex: detailsFlex,
        alignSelf: 'center'
    },
    colorTitleText: {
        marginVertical: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: 'gray'
    },
    lessItem: {
        marginTop: 5,
        marginLeft: 5,
        fontFamily: GLOBAL.FONTS.default_font,
        textAlign: 'left',
        color: GLOBAL.COLORS.wadiRoseColor,
    },
    quantityAddSelectionButton: {
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 7,
        marginLeft: 10,
        borderRadius: 50,
        borderColor:'black',
        borderWidth: 1,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 14,
        color: 'white',
    },
    quantityRemoveSelectionButton: {
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 7,
        marginLeft: 10,
        borderRadius: 50,
        borderColor:'black',
        borderWidth: 1,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        fontSize: 14,
        color: 'white',
    },
    quantitySelectionButtonText: {
        fontSize: 7,
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'white'
    },
    priceText: {
        color: 'darkgray',
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font,
        textDecorationLine: 'line-through',
    },
    specialPriceText: {
        color: GLOBAL.COLORS.black,
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font_bold,
    },
    addSelectionButton: {
        marginTop: 5,
        paddingVertical: 10,
        width: 100,
        paddingHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderColor:'black',
        borderWidth: 1,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        color: 'black'
    },
    quantityStyling:{
        height: 20,
        paddingTop: 3,
        marginLeft: 12,
        marginRight: 4,
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
    },
    addMoreButtonStyling:{
        color: 'black',
        fontWeight: '200',
        padding: 5
    },
    quantityUpdationViewContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
    },
        reduceQuantity:{
            color: 'black',
            padding: 5
    },
    priceViewStyleProp:{
        marginLeft: 5,
        marginBottom: 3,
        alignItems: 'center',
        justifyContent: 'flex-start',
        display: 'flex'
    },
    priceAndQuantityContainer:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginTop: 30,
    }

}


);

function mapStateToProps(state) {

    return {
        featureMapAPIReducer: state.featureMapAPIReducer,
        cartData: state.cart.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProductInCart: (params) => dispatch(updateProductInCart(params)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroceryProductPLP)