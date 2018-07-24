'use strict';

import React from 'react';
import {View, Text} from 'react-native';


import { strings} from 'utilities/uiString';
import {getCurrency} from '../helper';

import styles from '../styles';


const DiscountView = ({ discount, offerPrice, price, specialPrice, })=>{
    if (!!discount) {
        return (
            <View style={styles.discountView}>
                <Text style={styles.discountText}>
                    {`${strings.Save} ${parseInt(price - specialPrice)} ${getCurrency()} (${discount}%)`}
                </Text>
            </View>
        );
    }
    return null;
}

export default DiscountView;