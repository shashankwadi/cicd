'use strict';
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {VectorIcon} from '../../common';
import {strings} from 'Wadi/src/utilities/uiString';
import ExpressWidget from '../../widgets/expressWidget'
import {connect} from 'react-redux';


const checkedSquare = (<VectorIcon groupName={"MaterialCommunityIcons"} name={"checkbox-marked"}
                                   style={{
                                       fontSize: 20,
                                       color: GLOBAL.COLORS.wadiDarkGreen,
                                       display: 'flex'
                                   }}/>),
    uncheckedSquare = (<VectorIcon groupName={"MaterialCommunityIcons"} name={"checkbox-blank-outline"}
                                   style={{fontSize: 20, color: GLOBAL.COLORS.wadiDarkGreen}}/>),
    disabledSquare = (<VectorIcon groupName={"MaterialCommunityIcons"} name={"checkbox-marked"}
                                  style={{
                                      fontSize: 20,
                                      color: GLOBAL.COLORS.bordergGreyColor,
                                      display: 'flex'
                                  }}/>);


class FrequentlyBoughtItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{
                display: 'flex', flexDirection: 'column', borderBottomWidth: 1,
                borderBottomColor: GLOBAL.COLORS.lightGreyColor,
            }}>
                <View style={styles.parentStyle}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.onHandleClick()}
                                      style={styles.descriptionHolder}>
                        <View style={{flex: 1}}>
                            <Text style={styles.productText}
                                  ellipsizeMode={'tail'}>{this.props.data.name}</Text>
                            <View style={styles.priceHolder}>
                                {this.props.data.specialPrice &&
                                <Text style={styles.priceText}>{this.props.data.price}</Text>}
                                <Text
                                    style={styles.specialPriceText}>{`${this.props.data.specialPrice ? this.props.data.specialPrice : this.props.data.price} ${this.props.featureMapAPIReducer.featureMapObj.currency.label}`}</Text>

                            </View>
                            {!!this.props.data.is_express && this.props.data.is_express == 1 &&
                            <View style={styles.expressWidgetContainer}>
                                <ExpressWidget/>
                            </View>}
                        </View>
                        {this.props.inCart &&
                        <View style={{backgroundColor: GLOBAL.COLORS.bordergGreyColor}}>
                            <Text style={styles.alreadyInCart}>{strings.AlreadyAddedToYourCart}</Text></View>}
                    </TouchableOpacity>
                    <View style={{backgroundColor: GLOBAL.COLORS.lightGreyColor, width: 0.75, height: '100%'}}/>
                    <TouchableOpacity activeOpacity={1} style={{marginRight: 20, marginLeft: 20}}
                                      onPress={() => this.props.onClick()}
                                      disabled={this.props.inCart}>
                        {this.props.inCart ? disabledSquare : this.props.state ? checkedSquare : uncheckedSquare}
                    </TouchableOpacity>

                </View>
            </View>

        )
    }

    onHandleClick() {
        if (this.props.index != 0) {
            //this.props.navigator.navigate('ProductDetail', {extendedUrl: 'product/' + this.props.data.sku})
            this.props.openProductDetail();
        }
    }
}


var styles = StyleSheet.create({
    parentStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,

    },
    descriptionHolder: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    productText: {
        marginLeft: 10,
        marginTop: 10,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
    },
    priceHolder: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'darkgray',
        textDecorationLine: 'line-through',
        marginRight: 2,
        textAlign: 'left'

    },
    specialPriceText: {
        marginLeft: 3,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        color: 'black',
        marginRight: 5,
        textAlign: 'left'

    },
    expressWidgetContainer: {
        marginLeft: 10,
        display: 'flex',
        flex: 0,
        flexDirection: 'row',
        marginBottom: 10,
    },
    alreadyInCart: {
        color: GLOBAL.COLORS.darkGreyColor,
        textAlign: 'center',
        padding: 2,
        fontStyle: 'italic',
        fontFamily: GLOBAL.FONTS.default_font,
    }
});

function mapStateToProps(state) {

    return {
        featureMapAPIReducer: state.featureMapAPIReducer,
    }
}


export default connect(mapStateToProps)(FrequentlyBoughtItem)
