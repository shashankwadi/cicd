/***
 * author: Akhil Choudhary
 * date: 08/03/2018
 */

import React, {PureComponent} from 'react'
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {VectorIcon} from '../common';

const closeModalIcon = <VectorIcon groupName={"Ionicons"} name={"ios-arrow-down"}
                                   style={{
                                       marginRight: 10,
                                       fontSize: 25,
                                       color: "#FFFFFF",
                                   }}/>;
export default class MapsBackButton extends PureComponent {

    render() {
        return (<View style={styles.parentContainer}>
            <TouchableOpacity style ={{justifyContent:'center',alignItems:'center'}}activeOpacity={1}
                              onPress={() => this.closeModal()}>
                {/*  <Image resizeMode='contain' style={styles.backIconStyle}
                       source={require('../../icons/navbar/arrow-down.png')}/>*/}
                {closeModalIcon}
            </TouchableOpacity>
        </View>)
    }

    closeModal = () => {
        Navigation.dismissModal({
            animationType: 'slide-down'
        })
    }


}
const styles = StyleSheet.create({
    parentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 0,
        flex: 1,
    },
    backIconStyle: {
        height: 20,
        width: 20,
        marginRight: 10,
        fontSize: 30,
        color: "#FFFFFF",
    }

})