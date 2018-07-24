import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {dimensions} from 'utilities/utilities';
import TitleSection from '../../views/pdp/titleSection';
import {connect} from 'react-redux';
import {addToCart} from '../../../actions/cartActions';
import * as GLOBAL from '../../../utilities/constants';
import {VectorIcon} from '../../common';
import {selectors} from 'Wadi/src/reducers/reducers';
import {deepLinkActions} from "../../../actions/globalActions";

class MultiSeller extends Component {
    static navigatorStyle = {
        tabBarHidden: true,
    };

    constructor(props) {
        super(props);
        //let params = this.props;
        let {product, suppliers} = this.props;

        this.state = {
            product: product ? product : null,
            suppliers: suppliers?suppliers:null,
        };
    }

    /**
     * pass quantity, data and sku to sagas and reducers to do desired actions
     */
    addToCart = (supplier) => {
        this.props.addProductToCart({
            sku: supplier.sku,
            product: {
                ...this.state.product,
                quantity: 1,
                price: supplier.price,
                specialPrice: supplier.specialPrice ? supplier.specialPrice : supplier.price,
                sku: supplier.sku, //it seems feaisble to save simple's sku
                productSku: this.state.product.sku
            },
            changeInQuantity: 1,
        });
        //Alert.alert('Added to cart');
        //this.props.navigator.back();
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TitleSection data={this.state.product} isMultiseller={true}/>
                    {
                        this.state.suppliers.map((supplier, index) => {
                            if (supplier && supplier.availableQty && parseInt(supplier.availableQty) > 0)
                                return (

                                    <View
                                        key={supplier.sku}
                                        style={{padding: 15, borderWidth: 1, borderColor: '#c9c9c9'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <View>
                                                <Text style={{
                                                    paddingTop: 2.0,
                                                    fontSize: 18,
                                                    fontFamily: GLOBAL.FONTS.default_font_bold,
                                                    color: GLOBAL.COLORS.darkGreyColor
                                                }}>{supplier.supplier_name}</Text>
                                            </View>
                                            <View style={styles.vendorRatingView}>
                                                <VectorIcon groupName={"FontAwesome"} name={"star"} size={12}
                                                            style={{paddingLeft: 4}}/>

                                                <Text style={styles.vendorRatingText}>
                                                    {supplier.vendor_rating} / 5
                                                </Text>


                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 5}}>
                                            <VectorIcon groupName={"MaterialCommunityIcons"} name={"truck-delivery"}
                                                        size={16}
                                                        style={{color: 'black'}}/>
                                            <Text
                                                style={[styles.infoText, {marginLeft: 5}]}>{supplier.delivery_info}</Text>
                                        </View>
                                        {supplier.warranty_period && <View style={{flexDirection: 'row', marginTop: 5}}>
                                            <VectorIcon groupName={"SimpleLineIcons"} name={"shield"}
                                                        size={14}
                                                        style={{color: 'black'}}/>
                                            <Text
                                                style={[styles.infoText, {marginLeft: 5}]}>{supplier.warranty_period}</Text>
                                        </View>}
                                        <TouchableOpacity activeOpacity={1}
                                                          onPress={() =>
                                                              !selectors.isAlreadyInCart(this.props.cart, null, supplier)
                                                                  ?
                                                                  this.addToCart(supplier) :
                                                                  this.props.deepLinkActions({
                                                                      navigator: this.props.navigator,
                                                                      currentScreen: 'HomeToMultiSeller',
                                                                      toScreen: 'Cart'
                                                                  })}
                                                          style={{
                                                              marginBottom: 0,
                                                              marginTop: 15,
                                                              width: '80%',
                                                              alignSelf: 'center',
                                                              borderRadius: 5,
                                                              borderWidth: 1.0,
                                                              padding: 15,
                                                              backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
                                                              borderColor: GLOBAL.COLORS.wadiDarkGreen
                                                          }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 12,
                                                width: '100%',
                                                textAlign: 'center',
                                                fontFamily: GLOBAL.FONTS.default_font_bold,
                                                paddingTop: 2
                                            }}>
                                                {selectors.isAlreadyInCart(this.props.cart, null, supplier) ? `CHECKOUT NOW` : `ADD TO CART (${supplier.specialPrice ? supplier.specialPrice : supplier.price} SAR)`}</Text>
                                        </TouchableOpacity>
                                    </View>

                                )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'white',
    },
    vendorRatingView: {
        borderRadius: 10,
        borderWidth: 1.0,
        borderColor: GLOBAL.COLORS.black,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        padding: 2
    },
    vendorRatingText: {
        fontSize: 11,
        textAlign: 'left',
        marginLeft: 4,
        marginRight: 5,
        marginTop: 3,
        color: GLOBAL.COLORS.black,
        fontFamily: GLOBAL.FONTS.default_font_bold
    },
    infoText: {
        fontSize: 12,
        fontFamily: GLOBAL.FONTS.default_font,
        color: GLOBAL.COLORS.darkGreyColor
    }

});


function mapStateToProps(state) {
    return {
        //product: state.productDetailReducers,
        cart: state.cart
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProductToCart: (params) => dispatch(addToCart(params)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MultiSeller)