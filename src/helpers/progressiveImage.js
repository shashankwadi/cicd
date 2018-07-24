import React, { Component, PropTypes } from 'react';
import {
    Animated,
    View,
    Image,
    ImageBackground,
    StyleSheet
} from 'react-native';
//import { bindActionCreators } from 'redux';
//import { connect } from 'react-redux';

import { Loader } from '../components/common';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

class progressiveImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thumbnailOpacity: new Animated.Value(1),
            imageOpacity:new Animated.Value(0.1),
            color: '',
            isLoaded: false,
            isError: false
        }
        this.onLoad = this.onLoad.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onError = this.onError.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);

        this.onThumbnailLoad = this.onThumbnailLoad.bind(this)
    }

    onProgress({loaded, total}){

    }
    onLoad() {
        Animated.parallel([
            Animated.timing(this.state.thumbnailOpacity, {
                toValue: 0,
                duration : 250,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.imageOpacity, {
                toValue: 1,
                duration : 350,
                useNativeDriver: true,
            }),
          ]).start(()=> this.setState({
            color: '#ffffff',
            isLoaded:true
        }));
    }
    onLoadEnd() {
        console.log('on image loadeend')
        this.setState({
            color: '#ffffff',
            isLoaded: false,
        });
    }
    onError({error}) {
        console.log('on image error- ',error);
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 0,
            duration : 250,
            useNativeDriver: true,
        }).start()
        this.setState({
            isError: true,
            isLoaded: false,
        });
    }
    onThumbnailLoad() {
        this.setState({isLoaded:false});
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    render() {
        let { source, style, children, resizeMode } = this.props;
        let {imageOpacity, thumbnailOpacity}= this.state;
        let colorArray = ['rgba(255,0,0,0.08)', 'rgba(0,255,0,0.08)', 'rgba(0,0,255,0.08)', 'rgba(255,255,0,0.08)', 'rgba(255,0,255,0.08)', 'rgba(0,255,255,0.08)'];
        let colorVal = (this.state.color) ? this.state.color : colorArray[Math.random() * colorArray.length >> 0]

        return (
            <View style={[style, {backgroundColor:colorVal}]}>
                <AnimatedImageBackground
                    resizeMode={resizeMode?resizeMode:'contain'}
                    style={[style]}
                    source={source}
                    onLoad={this.onLoad}
                    //onProgress={this.onProgress}
                    //onLoadEnd={this.onLoadEnd}
                    onError={this.onError}
                    >
                </AnimatedImageBackground>
            </View>
        )
    }
}
export default progressiveImage


const styles = StyleSheet.create({
    loadingView:{
        flex:1, 
        padding:10,  
        alignItems:'center', 
        justifyContent:'center', 
    },
    loadingConatainer:{
        flex:1,
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'center', 
    },
    leftHalf:{
        backgroundColor:'grey', 
        width:'20%', 
        height:'70%',
        marginRight:10, 
        maxHeight:200, 
        maxWidth:100
    },
    righthalf:{
        backgroundColor:'white', 
        flex:1, 
        height:'70%', 
        maxHeight:200
    },
    greyRow:{
        flex:1, 
        backgroundColor:'grey',
    }
});