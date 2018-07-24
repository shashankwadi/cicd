'use strict';
import React, {PureComponent, Component} from 'react';
import {
    View,
    StyleSheet,
    Image
} from 'react-native';

import * as GLOBAL from '../../utilities/constants';

export default class LoadingIndicator extends PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        let {style, imageHeight} = this.props;
        return(
            <View style={[styles.loadingView, style]}>
                <Image source={require('../../icons/placeholderImage.png')} style={{height:imageHeight*0.8, width:'100%'}} resizeMode={"contain"}/>
                <View style={styles.loadingConatainer}>
                    <View style={styles.leftHalf}/>
                    <View style={styles.righthalf}>
                        <View style={[styles.greyRow, {marginBottom:10, width:'30%'}]}/>
                        <View style={[styles.greyRow, {marginBottom:10, width:'70%'}]}/>
                        <View style={[styles.greyRow, {width:'100%'}]}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingView:{
        padding:10,  
        alignItems:'center', 
        justifyContent:'center',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: GLOBAL.COLORS.itemLoaderBackground,
    },
    loadingConatainer:{
        flex:1,
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'center', 
    },
    leftHalf:{
        backgroundColor: GLOBAL.COLORS.itemLoaderBackground,
        aspectRatio: 1,
        height:'70%',
        marginRight:10, 

    },
    righthalf:{
        justifyContent:'space-around',
        backgroundColor:'white', 
        flex:1, 
        height:'60%', 
        maxHeight:200
    },
    greyRow:{
        flex:1, 
        backgroundColor: GLOBAL.COLORS.itemLoaderBackground,
    }
});