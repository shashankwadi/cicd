import {connect} from "react-redux";
import React, {Component} from "react";
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CartBadge, VectorIcon} from '../../common';
import {Navigation} from 'react-native-navigation';
import {isIos} from "../../../utilities/utilities";

class pdpCartButton extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <TouchableOpacity activeOpacity={1} style={isIos() ? styles.mainIos : styles.mainAndroid}
                              onPress={() => this.navigateToCart()}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <VectorIcon groupName={"SimpleLineIcons"} name={"handbag"} size={18} style={{color: 'white'}}/>
                    <CartBadge badgeStyle={{marginRight: -25, marginTop: -23}}/>
                </View>
            </TouchableOpacity>
        )
    }

    navigateToCart() {

        Navigation.handleDeepLink({
            link: 'switchTabToCart/',
            payload: {
                "Screen": "CartPage",
                "title": "CartPage",
                "passProps": {},
                "titleImage": ""
            } // (optional) Extra payload with deep link
        });
    }

}

function mapStateToProps(store) {
    return {
        cartItemsCount: store.cart.itemsCount
    }

}

var styles = StyleSheet.create({
    mainAndroid: {
        marginRight: 0, padding: Platform.OS === "android" ? 5 : 0, width: 40, marginTop: 10
    },
    mainIos: {
        marginRight: 20, padding: Platform.OS === "android" ? 5 : 0
    }
});

export default connect(mapStateToProps)(pdpCartButton)

