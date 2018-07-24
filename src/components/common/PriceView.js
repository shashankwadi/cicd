/**
 * Created by Manjeet Singh
 * Created on 2018-01-25 16:53:21
 * This component can be used as reusable price view
 *
 */

'use strict';

import React from 'react';
import {
    View, StyleSheet, Text
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';


import * as GLOBAL from 'Wadi/src/utilities/constants';

const propTypes = {
    price: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
    specialPrice: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
    currency: PropTypes.string,
    priceTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    specialPriceTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    currencyTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    containerStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
    price: "",
    specialPrice: "",
    currency: "SAR",
    priceTextStyle: undefined,
    specialPriceTextStyle: undefined,
    currencyTextStyle: undefined,
    containerStyles: undefined
};


const PriceView = ({price, specialPrice, currency, containerStyles, priceTextStyle, specialPriceTextStyle, currencyTextStyle, ...props}) => {
    if (price || specialPrice) {
        return (
            <View>
                {(!!price && !!specialPrice) ?
                    <View style={[styles.priceView, containerStyles]}>
                        <Text
                            style={[styles.priceText, priceTextStyle]}>{`${price} ${props.featureMapAPIReducer.featureMapObj.currency.label} `} </Text>
                        <Text
                            style={[styles.specialPriceText, specialPriceTextStyle]}>{`${specialPrice} ${props.featureMapAPIReducer.featureMapObj.currency.label} ` || ''}</Text>
                    </View> :
                    <View style={[styles.priceView, containerStyles]}>
                        <Text
                            style={[styles.specialPriceText, specialPriceTextStyle]}>{`${price} ${props.featureMapAPIReducer.featureMapObj.currency.label} ` || ''}</Text>
                    </View>
                }
            </View>
        );
    }else{
        return <View/>
    }
}


const styles = StyleSheet.create({
    priceView: {
        flexDirection: 'row',
        marginTop: 2,
        //marginLeft: 5,
    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 11,
        textAlign: 'left',
        color: GLOBAL.COLORS.wadiDarkGreen,
        marginTop: 5,
    },
    priceText: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        color: '#999',
        textAlign: 'left',
        marginTop: 5,
        textDecorationLine: 'line-through'

    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        marginTop: 5
    },
});
PriceView.propTypes = propTypes;
PriceView.defaultProps = defaultProps;

function mapStateToProps(state) {

    return {
        featureMapAPIReducer: state.featureMapAPIReducer,
    }
}


export default connect(mapStateToProps)(PriceView)
