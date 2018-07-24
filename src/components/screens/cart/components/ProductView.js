'use strict';

import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';

import * as GLOBAL from 'utilities/constants';
import { strings} from 'utilities/uiString';
import images from 'assets/images';

import styles, {deleteFlex} from '../styles';
import {getCartItem} from 'Wadi/src/actions/cartActions';
import {ProgressImage} from '../../../common';
import ItemOffer from './ItemOffer';
import DiscountView from './DiscountView';

import { EmptyView, Loader, PriceView, SizeSelector, VectorIcon } from 'Wadi/src/components/common';



export default class ProductView extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let {sku, name, imageUrl, imageKey}= this.props.item;
        if(!(!!name && !!imageKey)){
            this.props.getCartItemData(sku);
        }
    }

   
    render() {
        let {item, index} = this.props;
        let { name, quantity, sku, imageUrl, offerPrice, price, specialPrice, imageKey, discount, attributes, message, available_quantity, size, simples, sizes, delivery_info, tax_info, is_express } = item;
        
            specialPrice = (specialPrice && specialPrice != 0) ? specialPrice : 0
            price = (!!price && price != 0) ? price : 0;
            imageUrl = (imageKey) ? `https://b.wadicdn.com/product/${imageKey}/1-product.jpg` : imageUrl;
        return (
            <View style={styles.cartItem}>
                <View style={[styles.itemContainer]}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.openProductDetails(item)}
                            style={[styles.imageStyle]}>
                            {/* <Image style={{ height: 150}} resizeMode='contain'
                                source={{ uri: imageUrl || '' }} /> */}
                            <ProgressImage 
                                style={{ height: 150}} resizeMode='contain'
                                uri={imageUrl || '' }/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailsViewStyle}>
                        <Text style={[styles.titleText, { marginTop: 5 }]}>
                            {name || ''}
                        </Text>

                        {(attributes && attributes.color) &&
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {(!!size) &&
                                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                        <Text style={[styles.colorTitleText, { marginTop: 8, marginRight: 5 }]}
                                            numberOflines={1}>{strings.Size}</Text>
                                        <TouchableOpacity activeOpacity={1} style={styles.sizeButton}
                                            disabled={(!simples || (simples && simples.length === 0) || (!sizes || sizes && sizes.length === 0))}
                                            onPress={() => this.props.handleSelectSize(item)}
                                        >
                                            <Text style={styles.underlineText}>{size}</Text>
                                        </TouchableOpacity>
                                    </View>}
                                <Text style={[styles.colorTitleText]} numberOflines={1}>
                                    {strings.Color}
                                </Text>
                                <Text style={styles.titleText} numberOflines={1}>
                                    {attributes.color}
                                </Text>
                            </View>}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                            <Text style={[styles.colorTitleText, { marginVertical: 0, paddingTop: 3, }]}>
                                {strings.Quantity}
                            </Text>
                            <TouchableOpacity activeOpacity={1}
                                disabled={quantity <= 1}
                                onPress={() => this.props.updateQuantityClicked(false, item)}>
                                <View style={[styles.quantitySelectionButton, { opacity: (quantity <= 1) ? 0.3 : 1 }]}>
                                    <VectorIcon groupName={'FontAwesome'} name={'minus'} size={16}
                                        style={{ color: 'gray' }} />
                                </View>
                            </TouchableOpacity>
                            {<Text style={[styles.colorTitleText, {
                                //height: 20,
                                paddingTop: 3,
                                marginLeft: 12,
                                marginRight: 4,
                                fontSize: 16
                            }]}>{quantity}</Text>}

                            <TouchableOpacity activeOpacity={1}
                                disabled={(quantity > 2 || (available_quantity && available_quantity == quantity))}
                                onPress={() => this.props.updateQuantityClicked(true, item)}>
                                {<View
                                    style={[styles.quantitySelectionButton, { opacity: (quantity > 2 || (available_quantity && available_quantity == quantity)) ? 0.3 : 1 }]}>
                                    <VectorIcon groupName={'FontAwesome'} name={'plus'} size={16}
                                        style={{ color: 'gray', fontWeight: '200' }} />
                                </View>}
                            </TouchableOpacity>
                        </View>
                        {(available_quantity && available_quantity < 3) && <Text
                            style={styles.lessItem}>{`Only ${available_quantity} ${available_quantity > 1 ? 'items' : 'item'} available`}</Text>}

                        {(!!price || !!specialPrice) &&
                            <PriceView
                                price={price}
                                specialPrice={specialPrice}
                                priceTextStyle={styles.priceText}
                                specialPriceTextStyle={styles.specialPriceText}
                                containerStyles={{
                                    marginLeft: 5,
                                    marginTop: 0,
                                    marginBottom: 3,
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    display: 'flex'
                                }}
                            />}
                        <DiscountView  
                            discount= {discount}
                            offerPrice={offerPrice}
                            price={price}
                            specialPrice={specialPrice}/>
                        {/*this.renderDiscountView({ discount, offerPrice, price, specialPrice, })*/}

                        {!!tax_info &&
                            <View>
                                <Text style={[styles.infoText, { marginBottom: 0, marginLeft: 5, marginTop: 2 }]} numberOfLines={1}>
                                    {tax_info}
                                </Text>
                            </View>
                        }

                    </View>
                    <View style={{ flex: deleteFlex }}>
                        <TouchableOpacity activeOpacity={1}
                            onPress={() => this.props.deleteProductClicked(item)}
                            style={styles.deleteButton}>
                            <Image source={images.Trash} />
                            {/* <VectorIcon groupName={"FontAwesome"} name={"trash-o"} size={16} color={'#333'} size={20} /> */}
                        </TouchableOpacity>
                    </View>
                </View>
                <ItemOffer 
                    delivery_info={delivery_info}
                    tax_info={tax_info}
                    is_express={is_express}/>
            </View>
        );
    }
}
    