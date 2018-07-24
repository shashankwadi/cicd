'use strict';

import React from 'react';
import {View, Text, Image} from 'react-native';


import { strings} from 'utilities/uiString';
import images from 'assets/images';
import ExpressWidget from 'Wadi/src/components/widgets/expressWidget';

import styles from '../styles';


const ItemOffer = ({delivery_info, tax_info, is_express, cartReview })=>{
    return (
        <View style={styles.bottomHalf}>
            {(cartReview && cartReview.giftwrap && cartReview.giftwrap.allowed) &&
            <View style={{flexDirection:'row', paddingVertical:5}}>
                <Image source ={images.Gift} resizeMode={'cover'} style={{marginRight:7}}/>
                <Text style={[styles.infoText]}>{strings.GiftWrap}</Text>
            </View>
            }
            {!!delivery_info &&
            <View style={{flexDirection:'row'}}>
                <Image source ={images.Truck} resizeMode={'contain'} style={{marginRight:5}}/>
                <Text style={[styles.infoText, {flex:1}]}>{delivery_info}</Text>
            </View>
            }
            {!!is_express &&
                <View style={styles.expressWidgetContainer}>
                    <ExpressWidget />
                </View>
            }
        </View>
    )
}

export default ItemOffer;