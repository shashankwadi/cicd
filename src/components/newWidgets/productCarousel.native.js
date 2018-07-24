'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    FlatList
} from 'react-native';

import { connect } from 'react-redux';

import {getCarouselProducts} from '../../actions/homePageActions';
import { dimensions } from 'utilities/utilities';
import CarouselProduct from '../common/carouselProduct.native';
import {ViewLoadingIndicator} from '../common';

let screenToCellWidthRatio = 2.25;
let interCellMargin = 0.0;
let imageHeightToWidthRatio = 1.3;

let initialTotalRightMargin = Math.ceil(screenToCellWidthRatio) * interCellMargin
let screenWidthWithoutMargin = dimensions.width - initialTotalRightMargin
let cellWidth = screenWidthWithoutMargin / screenToCellWidthRatio
let imageHeight = cellWidth * imageHeightToWidthRatio;
let loaderData=[1, 2, 3, 4] //when loading data shows four loading placeholders in list

class ProductCarousel extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            uid:"",
            url:"",
            isLoading:true,
            data:null,
        }
    }

    componentDidMount(){
        if(!this.state.data){
            this.fetchData();
        }
    }

    fetchError =(error)=>{
        this.setState({
            isLoading:false,
        });
    }

    /**
     * Fetches carousal data
     */
    fetchData = async ()=>{
        try{
            if(this.props.widgetData && this.props.widgetData.json && this.props.widgetData.json["options.bind"] && this.props.widgetData.json && this.props.widgetData.json["options.bind"]["url"]){
                let url = this.props.widgetData.json["options.bind"]["url"]
                let {uid} = this.props.widgetData
                this.props.getCarouselProducts({uid, url})
                    .then(response=>{
                        this.setState({
                            data:response.data,
                            isLoading:false
                        });
                    });
            }
        }catch(error){
            this.fetchError(error);
        }
    }

    _getItemLayout = (data, index) => {
        return {length: cellWidth, offset: cellWidth * index, index};
    }

    render() {
        return (
            <View>
                <FlatList
                    key ={`productCarousel-${this.state.uid}-${this.state.url}`}
                    style={this.getAppropriateStyle()}
                    data={this.getProductCarousalData()}
                    horizontal={true}
                    removeClippedSubviews={false}
                    renderItem={({item, index})=> this.getAppropriateRowView(item)}
                    keyExtractor={(item, index)=>{return this.getKeyExtractor(item,index)}}
                    bounces = {false}
                    windowSize={10}
                    maxToRenderPerBatch={5}
                    initialNumToRender={3}
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={this._getItemLayout}
                />
            </View>
        );
    }

    /**
     *Returns appropriate data to the list based on the if we have got data from the api or not
     */
    getProductCarousalData() {
        if(this.isDataAvailable())
            return (this.state.data)
        else
            return (loaderData)

    }

    /**
     * Returns appropriate view for the list's item
     * @param item
     */
    getAppropriateRowView(item) {
        if(this.isDataAvailable())
            return(<CarouselProduct data = {item} callBack={() => this.props.callBack({...item, url: `/product/${item.sku}`})}/>)
        else
            return(<ViewLoadingIndicator style={{width:cellWidth, height:imageHeight*1.3}} imageHeight={imageHeight}/>)

    }

    /**
     * Returns appropriate key extractor for list's item
     * @param item
     */
    getKeyExtractor(item,index) {
        if(this.isDataAvailable())
            return (`${this.state.uid}-${this.state.url}-${item.sku}`)
        else
            return (`${this.state.uid}-${this.state.url}-${index}`)
    }

    /**
     * Returns appropriate style for the list
     * @param item
     */
    getAppropriateStyle() {
        if(this.isDataAvailable())
            return({ width: dimensions.width, backgroundColor: 'white' })
        else
            return ({ width: dimensions.width, backgroundColor: 'white', height:imageHeight*1.5 })
    }

    /**
     * Checks if we have got the data from the api or not
     * @returns {null|boolean}
     */
    isDataAvailable() {
        return (this.state.data && this.state.data.length >0)
    }
}



function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        getCarouselProducts: (params) => dispatch(getCarouselProducts(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProductCarousel)