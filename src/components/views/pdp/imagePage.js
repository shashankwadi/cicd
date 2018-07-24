'use strict';
import React, {PureComponent} from 'react';
import {
    FlatList,
    I18nManager,
    Image,
    NativeModules,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import dimensions from 'utilities/namespaces/dimensions';
import {VectorIcon, VideoView, ProgressImage} from '../../common';
import {selectors} from 'Wadi/src/reducers/reducers';

const thumbnail_width = 38,
    thumbnail_margin = 7,
    no_of_thumbnails_in_viewport = Math.floor((dimensions.width) / ((thumbnail_margin * 2) + thumbnail_width));

export default class ImagePage extends PureComponent {
    constructor() {

        super();
        this.state = {
            selectedIndex: 0
        };
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.sku && nextProps.sku !== this.props.sku) {
            this.setState({
                selectedIndex: 0
            });
        }
    }

    /*to move thumbnail list by left if last thumbnail of viewport reaches*/
    _handleThumbnailMove = (selectedThumbnailIndex) => {
        if (selectedThumbnailIndex > (no_of_thumbnails_in_viewport - 2) && this.props.maxImage > no_of_thumbnails_in_viewport) {
            this.refs.flatlist.scrollToIndex({animated: true, index: 2})
        }
        else if (selectedThumbnailIndex < no_of_thumbnails_in_viewport && this.props.maxImage > no_of_thumbnails_in_viewport) {
            this.refs.flatlist.scrollToIndex({animated: true, index: 0})
        }
    };

    /*thumbnail items*/
    renderItem({item, index}) {
        let selectedStyle = (item.rowIndex === this.state.selectedIndex) ? styles.selected : undefined;
        return (
            <View style={[{
                margin: thumbnail_margin,
                padding: 3,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: '#e6e6e6',
                backgroundColor: '#FFF'
            }, selectedStyle]}>
                <TouchableOpacity activeOpacity={1} onPress={() => this.handleThumbnailTap(item)}>
                    <Image resizeMode='contain' style={{height: 60, width: thumbnail_width}}
                           source={{uri: item.rowURL}}/>
                </TouchableOpacity>
            </View>
        )

    }

    /*when carousel scrollview stops*/
    _onMomentumScrollEnd(e) {
        let selectedIndex = e.nativeEvent.contentOffset.x / dimensions.width;
        this.setState({selectedIndex: selectedIndex});
        this._handleThumbnailMove(selectedIndex);
    };

    /*Handle click of thumbnail of carousel*/
    handleThumbnailTap(rowData) {
        if (rowData.rowIndex >= 0 && rowData.rowIndex < this.props.maxImage) {
            this.refs.listView.scrollTo({x: (rowData.rowIndex * dimensions.width), animated: true});
            this.setState({selectedIndex: rowData.rowIndex});
            this._handleThumbnailMove(rowData.rowIndex)
        }
    }

    /*Navigation left right button for carousel*/
    _renderCarouselNavigationButtons = () => {

        return <View pointerEvents='box-none'
                     style={[styles.carouselNavigationButtonsWrapper, {width: dimensions.width, height: 300}]}>
            <TouchableOpacity activeOpacity={1}
                              onPress={() => this.handleThumbnailTap({rowIndex: this.state.selectedIndex - 1})}>
                <View>
                    <Text
                        style={[styles.carouselNavigationButtonsText, {color: this.state.selectedIndex !== 0 ? GLOBAL.COLORS.wadiDarkGreen : 'grey'}]}>{I18nManager.isRTL ? '›' : '‹'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}
                              onPress={() => this.handleThumbnailTap({rowIndex: this.state.selectedIndex + 1})}>
                <View>
                    <Text
                        style={[styles.carouselNavigationButtonsText, {color: this.state.selectedIndex !== this.props.maxImage - 1 ? GLOBAL.COLORS.wadiDarkGreen : 'grey'}]}>{I18nManager.isRTL ? '‹' : '›'}</Text>
                </View>
            </TouchableOpacity>
        </View>
    };

    /*Images of a carousel*/
    _renderCarouselImages(carouselItems) {
        return <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={1}
            ref='listView'
            pagingEnabled={true}
            scrollsToTop={false}
            bounces={false}
            onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}>
            {carouselItems}
        </ScrollView>
    }

    render() {
        var carouselItems = [];
        var images = [];
        var defaultImage = require('../../../icons/product/placeholder.png');
        let isOutOfStock = selectors.isOutOfStock(this.props);
        let imageHeight = (dimensions.height - (dimensions.pdpImageOffset + this.props.offsetHeight));
        if(!this.props.maxImage){
            return(
                <View style={[styles.slide1]}>
                    <Image 
                        source = {defaultImage} 
                        resizeMode='cover' style={{ height: imageHeight, width: dimensions.width }}/>
                </View>
            )
        }
        for (let currentIndex = 1; currentIndex <= this.props.maxImage; currentIndex++) {
            let imageExtention = (this.props.isFetching)?'.jpg':'-zoom.jpg';
            let imageLink = 'https://b.wadicdn.com/product/' + this.props.imageKey + "/" + currentIndex + '-zoom.jpg';
            let imageData = {rowIndex: currentIndex - 1, rowURL: imageLink};
            carouselItems.push(
                <View key={currentIndex} style={[styles.slide1]}>
                    <ProgressImage resizeMode='contain' style={{height:imageHeight , width: dimensions.width}}
                           uri={imageLink} defaultImage = {defaultImage}/>

                </View>);
            images = [...images, imageData];
        }
        if (this.props.media) {
            images = [...images, {rowIndex: this.props.maxImage - 1, type: 'media', rowURL: ""}];
            carouselItems.push(
                <View key={this.props.maxImage + 1} style={styles.slide1}>
                    <VideoView url={this.props.media}/>
                </View>
            )
        }
        return (
            <View style={{paddingVertical: 5}}>
                <View style={styles.carouselContainer}>
                    {this._renderCarouselImages(carouselItems)}
                    {/* Removed after Mayanks review 23/03/18 */}
                    {/*{this._renderCarouselNavigationButtons()}*/}
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {this._renderCarouselThumbnails(images)}
                </View>
                {(this.props.media && (this.selectedIndex.selectedIndex !== this.props.maxImage)) &&
                <TouchableOpacity activeOpacity={1}
                                  style={styles.thumbnailContainer}
                                  onPress={() => {
                                      this.handleThumbnailTap({rowIndex: this.props.maxImage, type: 'media'})
                                  }}>
                    <VectorIcon groupName={"MaterialIcons"} name={"play-circle-outline"} size={60}
                                style={{color: GLOBAL.COLORS.wadiDarkGreen}}/>
                </TouchableOpacity>}
                {isOutOfStock && <View style={[styles.outOfStockContainer]}>
                    <View style={styles.outOfStock}>
                        <Text style={styles.outOfStockText}>{`Out of\nStock`}</Text>
                    </View>
                </View>}
            </View>
        )
    }

    /*Thummbnails for a carousel*/
    _renderCarouselThumbnails = (images) => {
        return <FlatList
            removeClippedSubviews={false}
            data={images}
            ref='flatlist'
            horizontal={true}
            showsHorizontalScrollIndicator = {false}
            style={styles.listview}
            renderItem={this.renderItem.bind(this)}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.rowURL + index}
        />
    }
}

var styles = StyleSheet.create({

    carouselContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        marginTop:5
    },
    carouselNavigationButtonsWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    carouselNavigationButtonsText: {
        fontSize: 50,
    },
    barContainer: {
        position: 'absolute',
        zIndex: 2,
        top: 40,
        flexDirection: 'row',
    },
    track: {
        backgroundColor: '#ccc',
        overflow: 'hidden',
        height: 2,
    },
    bar: {
        backgroundColor: '#5294d6',
        height: 2,
        position: 'absolute',
        left: 0,
        top: 0,
    },

    wrapper: {
        height: 300
    },
    slide1: {},

    text: {
        color: '#FFF',
        fontSize: 30,
        fontWeight: 'bold',
    },
    listview: {
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    selected: {
        shadowOpacity: 0.5,
        shadowRadius: 2.5,
        shadowOffset: {width: 2, height: 2},
        elevation: (Platform.OS === 'ios') ? 0 : 5,
        borderColor: GLOBAL.COLORS.lightGreyColor,
        borderWidth: 2,
    },
    outOfStockContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: dimensions.width - 120,
        height: 500,
        left: 50,
        right: 50,
    },
    outOfStock: {
        height: 125,
        width: 125,
        borderRadius: 62,
        backgroundColor: GLOBAL.COLORS.outOfStock,
        justifyContent: 'center',
        alignItems: 'center'
    },
    outOfStockText: {
        color: '#FFF',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 18
    },
    thumbnailContainer: {

        position: 'absolute',
        top: 20,
        right: 0,
        width: 80,
        height: 80,
        backgroundColor: 'transparent'

    },
    carouselImage: {
        height: 300,
        width: dimensions.width,
        backgroundColor: '#fff',
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center'
    },
});