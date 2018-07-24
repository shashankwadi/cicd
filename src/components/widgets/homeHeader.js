/*
 * @Author: shahsank sharma
 * @Date: 2018-03-17 11:45:35
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2018-03-17 16:54:33
 */
'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native';

import { dimensions } from 'utilities/utilities';
import TimerMixin from 'react-timer-mixin';
var _listView = ListView;
var timer;

export default class homeHeader extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // Auto scroll banner
        // if (this.props.widgetData.isSelfScrolling) {
        //     this.timer = TimerMixin.setInterval(
        //         () => { this.bannerAutoScroll() },
        //         this.props.widgetData.scrollTime
        //     );
        // }
    }

    componentWillUnmount() {
        TimerMixin.clearInterval(this.timer);
    }

    render() {

        return (
            <View style={{ height: 50 + 10, backgroundColor: 'red' }}>
                {/*{this.renderView()}*/}
            </View>
        );
    }
    renderView() {
        //values coming from the config.
        let leftMargin = this.props.widgetData.marginLeft;
        let rightMargin = this.props.widgetData.marginRight;
        bannerWidth = this.props.widgetData.widthRatioToScreen * dimensions.width - leftMargin - rightMargin;
        let bannerHeight = (this.props.widgetData.imageHeight / this.props.widgetData.imageWidth) * bannerWidth;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        dataSource = ds.cloneWithRows(this.props.widgetData.data);
        if (this.props.widgetData.data.length > 1) {
            return (
                <View>
                    <ListView
                        style={{ height: bannerHeight, width: dimensions.width, marginTop: 5, marginBottom: 5 }}
                        ref={(listView) => { _listView = listView; }}
                        dataSource={dataSource}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={this.props.widgetData.pagingEnabled}
                        removeClippedSubviews={false}
                        onMomentumScrollEnd={(this.onScrollAnimationEnd).bind(this)}
                        renderRow={(rowData) =>
                            <TouchableOpacity activeOpacity ={1} onPress={() => this.props.callBack(rowData)}>
                                <View>
                                    <Image style={{ height: bannerHeight, width: bannerWidth, marginLeft: leftMargin, marginRight: rightMargin }} source={{ uri: rowData.iconName }} />
                                </View>
                            </TouchableOpacity>
                        }
                    />
                    {this.renderPageControl()}
                </View>);
        }
    }
    onScrollAnimationEnd(event) {
        let offsetX = event.nativeEvent.contentOffset.x
        var index = offsetX / dimensions.width;
        this.setState({
            currentPage: index
        })
    }
    // /**
    //  * Action on clicking any banner.
    //  *
    //  * @param   {obj} item  - Row object.
    //  */
    // onPressItem(item) {

    // }
    //Auto Scrolling of carousel
    bannerAutoScroll() {
        var scrollToPoint;
        if (this.state.currentPage == this.props.widgetData.data.length - 1) {
            scrollToPoint = 0;
        } else {
            scrollToPoint = (this.state.currentPage + 1) * dimensions.width
        }
        _listView.scrollTo({
            y: 0,
            x: scrollToPoint,
            animated: true,
        });
    }
    //Show page Control driven from API
    renderPageControl() {
        if (this.props.widgetData.showPageControll == true) {
            return (
                <PageControl style={{ position: 'absolute', left: 0, right: 0, bottom: 10 }}
                             numberOfPages={this.props.widgetData.data.length}
                             currentPage={this.state.currentPage}
                             hidesForSinglePage={true}
                             pageIndicatorTintColor='gray'
                             currentPageIndicatorTintColor='white'
                             indicatorStyle={{ borderRadius: 5 }}
                             currentIndicatorStyle={{ borderRadius: 5 }}
                             indicatorSize={{ width: 8, height: 8 }}
                             onPageIndicatorPress={this.onItemTap} />
            );
        } else {
            return (<View />)
        }
    }
}