'use strict';
import React, {PureComponent} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import {VectorIcon} from '../../common';
import {connect} from 'react-redux';
import {_getFirstDefaultSupplier, getPDPPromiseDetails} from "../../../actions/productDetailAction";
import * as GLOBAL from '../../../utilities/constants';
import images from "../../../icons/images";
import {strings} from '../../../utilities/uiString'


var refThis;

class subProductInfo extends PureComponent {

    constructor(props) {
        super(props);
        refThis = this;
        this.state = {
            selected: {},
            selectedSize: null,
            isCityDropdownVisible: false,
            defaultSelectedSize: null
        };

        this.renderColorView = this.renderColorView.bind(this);
        this.renderSizeView = this.renderSizeView.bind(this);
        this.toggleSelectedSize = this.toggleSelectedSize.bind(this);
    }

    render() {


        return (
            //size info is including the simples array
            <View style={styles.textBlock} enableEmptySections={true}>
                {(this.props.groupsInfo && this.props.groupsInfo.color && this.props.groupsInfo.color.length > 0) && this.renderColorView(this.props.groupsInfo.color)}
                {(this.props.sizesInfo && this.props.sizesInfo.length > 0) && this.renderSizeView()}
                {this.props.sizesInfo && this.props.sizesInfo.length > 0 && (this.props.selectedSize !== '' || this.props.defaultSelectedSize) && this.renderSellerInfo()}
            </View>
        );
    }

    renderColorView(colors) {
        return (
            <View>
                <Text style={styles.headTitle}>{"COLOR:"}</Text>
                <FlatList
                    numColumns={3}
                    data={colors}
                    contentContainerStyle={styles.listview}
                    renderItem={this.renderColorRow.bind(this)}
                    keyExtractor={(item, index) => {
                        return `colors-${item.sku}-${item.key}-${index}`
                    }}
                    scrollEventThrottle={1}
                    showsVerticalScrollIndicator={false}
                    stickySectionFootersEnabled={true}
                />
            </View>
        );
    }

    renderSellerInfo() {
        var self = this;
        let starImage = GLOBAL.CONFIG.isGrocery ? images.star_black : images.star_white
        return (
            <View style={{marginTop: 10}}>
                {

                    this.props.sizesInfo.map((simple) => {
                        let prices = simple.suppliers.map(s => s.specialPrice ? s.specialPrice : s.price),
                            selectedSize = ((this.props.selectedSize && this.props.selectedSize !== '') ? this.props.selectedSize : this.props.defaultSelectedSize);
                        if (simple.size === selectedSize) {
                            let supplier = _getFirstDefaultSupplier(simple.suppliers);

                            return (
                                <View key={simple.sku}>
                                    <View
                                        style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                        <Text style={styles.headTitle}>{strings.SOLDBY}</Text>
                                    </View>
                                    {
                                        supplier && <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.supplierNameText}>
                                                {supplier.supplier_name}
                                            </Text>
                                            <View style={styles.vendorRatingView}>
                                                <Image source={starImage} resizeMode='contain'
                                                       style={styles.vendorRatingStarImage}/>
                                                <Text style={styles.vendorRatingText}>
                                                    {supplier.vendor_rating} / 5
                                                </Text>


                                            </View>


                                        </View>
                                    }

                                    {
                                        (simple.suppliers.length - 1 > 0)
                                        &&
                                        <TouchableOpacity activeOpacity={1}
                                                          onPress={() => this.props.handleSelectSeller(simple.suppliers)}
                                                          style={{
                                                              flexDirection: 'row',
                                                              justifyContent: 'space-between',
                                                              alignItems: 'center',
                                                              marginTop: 10
                                                          }}>
                                            <Text style={{
                                                fontSize: 14,
                                                fontFamily: GLOBAL.FONTS.default_font,
                                                color: GLOBAL.COLORS.wadiDarkGreen,
                                            }}>
                                                {`${simple.suppliers.length - 1} other ${simple.suppliers.length - 1 > 1 ? 'Sellers' : 'Seller'} from ${Math.min(...prices)} ${this.props.featureMapAPIReducer && this.props.featureMapAPIReducer.featureMapObj && this.props.featureMapAPIReducer.featureMapObj.currency && this.props.featureMapAPIReducer.featureMapObj.currency.label ? this.props.featureMapAPIReducer.featureMapObj.currency.label : ''}`}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )

                        }
                    })
                }
            </View>
        );
    }

    renderSizeView() {

        //const groupds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        //dataSource = groupds.cloneWithRows(this.props.sizesInfo);
        let sizes = this.props.sizesInfo.map(s => s.size);
        if (sizes.length === 1 && sizes[0].toUpperCase() === 'OS') {
            return (<View/>); // don't show if only OS is coming?
        }

        return (
            <View>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                    <Text style={styles.headTitle}>{"SIZE:"}</Text>
                    {
                        (!!this.props.sizeChartAvailable) &&
                        <TouchableOpacity activeOpacity={1}
                                          onPress={() => this.props.handleSizeChart()}
                                          style={{
                                              flexDirection: 'row',
                                              justifyContent: 'space-between',
                                              alignItems: 'center'
                                          }}>
                            <VectorIcon groupName={"FontAwesome"} name={"question-circle"} size={20}
                                        style={{color: 'grey'}}/>

                            <Text style={[{color: 'grey'}]}>{"Size Guide"}</Text>
                        </TouchableOpacity>
                    }


                </View>

                <FlatList
                    style={{justifyContent: 'center', width: '100%'}}
                    numColumns={8}
                    data={this.props.sizesInfo}
                    contentContainerStyle={styles.listview}
                    renderItem={this.renderSizeRow.bind(this)}
                    keyExtractor={(item, index) => {
                        return `sizes-${item.size}-${item.sku}-${index}`
                    }}
                    scrollEventThrottle={1}
                    showsVerticalScrollIndicator={false}
                    stickySectionFootersEnabled={true}
                />
            </View>
        );
    }

    renderColorRow({item, index}) {
        let {sku, imageKey, key} = item;
        let selectedSku = this.props.sku;
        //let imageLink = `https://b.wadicdn.com/product/${imageKey}/${index + 1}.jpg`;
        let imageLink = `https://b.wadicdn.com/product/${item.imageKey}/${index + 1}-zoom.jpg`;
        let isSelected = (selectedSku === sku) ? true : false;
        let selectedStyle = isSelected ? styles.selected : styles.unselected;
        return (
            <TouchableOpacity style={styles.colorContainerView}
                              onPress={() => this.props.reloadProduct(sku)}>
                <View style={selectedStyle}>
                    <Image source={{uri: imageLink}} style={[styles.colorItem]} resizeMode='contain'/>
                </View>
                <Text style={styles.colorNameText} numberOfLines={2}>{key.toUpperCase()}</Text>
            </TouchableOpacity>);
    }


    _handleSelectSize = (simple) => {
        var self = this;
        let defaultSupplier = _getFirstDefaultSupplier(simple.suppliers);
        let postParams = defaultSupplier ? {
            "catalog_simple": [{
                "sku_simple": defaultSupplier.sku,
                "vendor_code": defaultSupplier.vendor_code
            }],
            "destination": this.props.configStore.selectedCity,
            "shop": this.props.configStore.selectedCountry.countryCode
        } : null;
        self.setState({selectedSeller: defaultSupplier});
        this.props.selectSize(simple.size, simple);
        this.props.getPDPPromiseDetails({data: null, url: null, params: postParams});
    };

    renderSizeRow({item, index}) {
        let isSelected = this.props.selectedSize === item.size;
        var size = '';
        if (item.quantity > 0) {
            size = (
                <TouchableOpacity activeOpacity={1} style={{justifyContent: 'center', alignItems: 'center'}}
                                  onPress={() => this._handleSelectSize(item)}>
                    <View style={{
                        margin: 5,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: '#e6e6e6',
                        backgroundColor: (isSelected) ? '#333' : '#FFF'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            margin: 5,
                            color: (isSelected) ? "#FFF" : "#333"
                        }}>{item.size}</Text>
                    </View>
                </TouchableOpacity>);
        }
        else {
            size = (
                <View style={{justifyContent: 'center', alignItems: 'center',}}
                      onPress={() => this.toggleSelectedSize(item)}>
                    <View style={{
                        margin: 5,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: '#f2f2f2',
                        backgroundColor: (isSelected) ? '#333' : '#FFF'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            margin: 5,
                            color: (isSelected) ? "#FFF" : "#cccccc"
                        }}>{item.size}</Text>
                    </View>
                </View>)
        }
        return size;
    }

    /**
     * need to move this method a level up
     * @param {*} item
     */
    toggleSelectedSize(item) {
        this.setState((prevState) => {
            return {
                selected: {
                    [item.size]: !prevState.selected[item.size]
                }
            }
        });
    }
}

var styles = StyleSheet.create({
    textWrapper: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    textBlock: {
        padding: 10
    },
    headTitle: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginBottom: 10,
        color: GLOBAL.COLORS.darkGreyColor,
        fontSize: 14
    },
    boldText: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    normalText: {
        marginRight: 30
    },
    listview: {
        flexDirection: 'row',
    },
    selected: {
        shadowOpacity: 0.5,
        shadowRadius: 1.5,
        shadowOffset: {width: 2, height: 2},
        borderColor: GLOBAL.COLORS.black,
        borderWidth: 2.0,
        borderRadius: 10,
        padding:3
    },
    unselected: {
        borderColor: GLOBAL.COLORS.lightGreyColor,
        borderWidth: 1.5,
        borderRadius: 10,
        padding:3
    },
    colorItem: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderWidth: 0.0,
        borderRadius: 10
    },
    colorContainerView: {
        alignItems: 'center',
        flex: 0.33,
        marginVertical: 10
    },
    colorNameText: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 12,
        color: GLOBAL.COLORS.darkGreyColor
    },
    supplierNameText: {
        fontSize: 14,
        fontFamily: GLOBAL.COLORS.default_font,
        textAlign: 'left',
        color: GLOBAL.COLORS.darkGreyColor,
        paddingTop: 2
    },
    vendorRatingView: {
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        borderRadius: 10,
        borderWidth: 1.0,
        borderColor: GLOBAL.COLORS.wadiDarkGreen,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 22
    },
    vendorRatingText: {
        fontSize: 11,
        textAlign: 'left',
        marginLeft: 5,
        marginRight: 5,
        color: GLOBAL.CONFIG.isGrocery? 'black': 'white',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginTop: 2
    },
    vendorRatingStarImage: {
        height: 12,
        width: 12,
        marginLeft: 5,
    }

});


function mapStateToProps(state) {

    return {
        product: state.productDetailReducers,
        configStore: state.configAPIReducer,
        featureMapAPIReducer: state.featureMapAPIReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPDPPromiseDetails: (obj) => dispatch(getPDPPromiseDetails(obj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(subProductInfo)

