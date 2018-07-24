'use strict';

import React from 'react';
import {Text, View} from 'react-native';


import {strings} from 'utilities/uiString';
import * as COLORS from 'utilities/namespaces/colors';
import {getCurrency} from '../helper';
import styles from '../styles';
import * as GLOBAL from 'utilities/constants';


const BillView = ({cart})=>{
    let { isFetching, orderPlaced, message, cartReview, data } = cart;
    let subtotal = "", shipping = "", discount = "", total = "";
    if (!!cartReview && !!cartReview.invoice_app && !!cartReview.invoice_app.length) {
        return (
            <View style={styles.billViewContainer}>
                {cartReview.invoice_app.map((item, index) => {
                    let { label, value, type, discount } = item;
                    let isTotal = (type == "total") ? true : false;
                    if(isTotal){
                        total = value/100;
                    }
                    let totalLabelStyle = (isTotal) ? styles.totalLabel : undefined;
                    let shippingValueStyle = (type === "shipping") ?
                        ((!!value && parseInt(value) === 0) ? {color: (!GLOBAL.CONFIG.isGrocery ? COLORS.wadiDarkGreen : 'black')} : undefined) : undefined;
                    return (
                        <View style={styles.billViewBox}
                            key={type}>
                            {(isTotal) &&
                                <View style={styles.billViewBorder} />}
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.footerKeyTitle, totalLabelStyle]} numberOflines={1}>
                                    {label}
                                </Text>
                                <Text
                                    style={[styles.footerValueTitle, {fontWeight: (isTotal || type === "shipping") ? 'bold' : 'normal'}, shippingValueStyle]}>
                                    {(type === "shipping") && !!value && parseInt(value) === 0 ? strings.Free : `${value / 100} ${getCurrency()}`}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        )
    }
    return null;
};

export default BillView;