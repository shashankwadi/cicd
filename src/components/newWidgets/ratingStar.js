import React, {Component} from 'react';
import {View, Image} from 'react-native';


const Star = ({flexProp, index}) => {
    return (<View style={{width: 20}} key ={`ratimngStar-${index}`}>

        <View style={{backgroundColor: '#FFDC50', height: 20, width: 20 * flexProp.flexProp}}/>
        <Image resizeMode={"cover"}
               style={{width: 20, height: 20, position: 'absolute', tintColor: '#FFFFFF',}}
               source={require('../../icons/general/star1.png')}
        />
    </View>)
}
export default Star