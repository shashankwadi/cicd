'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ListView,
    FlatList,
    I18nManager,
    Button
} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import {PriceView} from '../common';

const imageFlex = 0.3;
const detailsFlex = 1.0 - imageFlex;


export default class CartAndWishlist extends Component {

    constructor(props) {
        super(props);
    }

    renderRow({item, index}) {
        let rowData = item;
        let imageWidthAndHeight = imageFlex * dimensions.width;
        let discountValue = rowData.discount ? String(rowData.discount) : ''
        let priceValue = rowData.price ? String(rowData.price) : ''
        let specialPriceValue = rowData.specialPrice ? String(rowData.specialPrice) : ''

        return (
            <View style={[styles.itemContainer, {height: imageWidthAndHeight}]}>

                <TouchableOpacity activeOpacity={1} onPress={() => this.props.callBack(item)} style={styles.imageStyle}>
                    <Image style={{flex: 1, margin: 20}} resizeMode='cover' source={{uri: rowData.imageUrl}}/>
                </TouchableOpacity>
                <View style={styles.detailsViewStyle}>
                    <Text style={styles.titleText} numberOflines={2}>
                        {rowData.title}
                    </Text>
                    <View style={styles.detailContainer}>
                        {discountValue.length > 0 &&
                        <View style={styles.discountView}>
                            <View style={styles.discountUpperView}>
                                <Text style={styles.discountText}>
                                    {discountValue}%
                                </Text>
                            </View>
                            <View style={styles.discountLowerView}>
                                <Text style={styles.discountText}>
                                    OFF
                                </Text>
                            </View>
                        </View>}
                        {(!!rowData && !!rowData.price) &&
                        <PriceView
                            {...rowData}
                            priceTextStyle={styles.priceText}
                            specialPriceTextStyle={styles.specialPriceText}
                            containerStyles={styles.priceView}
                        />
                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {

        //const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        //let dataSource = ds.cloneWithRows(this.props.widgetData.data);
       // let price = this.props.widgetData.data ? this.props.widgetData.data.reduce((total, amount) => total + amount) : 0;


        return (
            <View style={{borderBottomWidth: 1, borderBottomColor: 'lightgray'}}>

                <FlatList
                    contentContainerStyle={styles.container}
                    data={this.props.widgetData.data}
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                    renderItem={this.renderRow.bind(this)}
                    keyExtractor={(item, index) => item.sku + index}
                    scrollsToTop={true}
                />
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: GLOBAL.COLORS.wadiLightGreen,alignItems:'center'}}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center'    ,
                        height: 70
                    }}>
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10, marginLeft: 10}}>
                            <Text style={styles.titleText} numberOflines={2}>
                                Discount:
                            </Text>
                            <Text style={[styles.titleText, {color: 'red'}]} numberOflines={2}>
                                78 SAR
                            </Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', marginBottom: 10, marginLeft: 10}}>
                            <Text style={styles.titleText} numberOflines={2}>
                                Total:
                            </Text>
                            <Text style={[styles.titleText, {
                                color: GLOBAL.COLORS.wadiDarkGreen,
                                fontFamily: GLOBAL.COLORS.default_font_bold,
                                fontWeight: 'bold'
                            }]} numberOflines={2}>
                                78 SAR
                            </Text>

                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.callBack({}, "cartAndWishList")}>
                        <View style={{
                            backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
                            height: 40,
                            justifyContent: 'center',
                            marginRight:10,
                            padding:10,
                            borderRadius:5,
                            flexDirection:'row',
                            alignItems:'center'
                        }}>
                            <Image source={require('Wadi/src/icons/tabbar/tab_bag_unselected.png')}  style={{width: 20, height: 20,marginRight:5}}/>
                            <Text style={{color: 'white'}}>CHECKOUT</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgray'
    },
    itemContainer: {
        marginBottom: 0.75,
        flexDirection: 'row',
        backgroundColor: 'white'

    },
    imageStyle: {
        flex: imageFlex,
        margin: 1
    },
    detailsViewStyle: {
        flex: detailsFlex,
        justifyContent: 'center',
    },
    titleText: {
        marginTop: 5,
        marginLeft: 5,
        textAlign: 'left',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 16,
        color: 'black'
    },
    discountView: {
        height: 45,
        width: 45,
        flexDirection: 'column',
        borderRadius: 5,
        backgroundColor: GLOBAL.COLORS.discountViewBackground,
        marginRight: 10
    },
    priceValue: {

        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discountText: {
        color: 'black',
        fontSize: 11,
        fontFamily: GLOBAL.COLORS.default_font,
        fontWeight: 'bold'
    },
    discountUpperView: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discountLowerView: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailContainer: {
        marginTop: 7.5,
        flexDirection: 'row',
        alignItems:'center'
    },
    priceView: {
        height: 45,
        flexDirection: 'column',
        marginLeft: 5
    },
    priceUpperView: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    specialPriceLowerView: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceText: {
        color: 'darkgray',
        fontSize: 12,
        fontFamily: GLOBAL.COLORS.default_font,
        textDecorationLine: 'line-through'
    },
    specialPriceText: {
        color: GLOBAL.COLORS.headerViewAllColor,
        fontSize: 12,
        fontFamily: GLOBAL.COLORS.default_font,
    }

});