/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-08
 *
 */


import React, {Component} from 'react';
import {Image, View} from 'react-native';
import styles from './styles';
import images from 'assets/images';

export default class CustomActivityIndicator extends Component{
    render () {
        return (
            <View style={styles.activityIndicatorView}>
                {/*<ActivityIndicator*/}
                {/*animating={true}*/}
                {/*style={styles.activityIndicator}*/}
                {/*size="large"*/}
                {/*color={Colors.wadiDarkGreen}*/}
                {/*/>*/}
                <Image
                    source={images.loadingGif}
                />
            </View>
        )
    }
}