/*
 * @Author: shahsank sharma 
 * @Date: 2017-07-27 11:46:08 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2017-08-22 10:59:10
 *
 * @Last Modified by:Akhil Choudhary
 * @Last Modified date: 2018-02-07
 */

'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform,
    ScrollView
} from 'react-native';
import PropTypes from 'prop-types';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import {getTabData} from "../../actions/TabsAction";

import WidgetHandler from './oldWidgetHandler';

import {EmptyView, Loader} from '../../components/common';

const NAVBAR_HEIGHT = 100;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 24});
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);



export default class Tabs extends Component {
    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);
        this.state = {
            extendedUrl: GLOBAL.API_URL.Wadi_Home,
            scrollAnim,
            offsetAnim,
            clampedScroll: Animated.diffClamp(
                Animated.add(
                    scrollAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolateLeft: 'clamp',
                    }),
                    offsetAnim,
                ),
                0,
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            ),
            tabId: 0,
            tabData: null, //its an object
            widgetData: null,


        };
    }

    componentDidMount() {
        this.setState({widgetData: (this.props.widgetData) ? this.props.widgetData : null}, () => {
            this.loadContainer();
        })

    }

    render() {
        return (
            <ScrollView>
                {this.state.widgetData ? <View style={styles.parentContainer}>
                    {this.renderTab()}
                    {this.state.tabData ? this.renderListView(): <Loader/>}
                </View> : <EmptyView/>}

            </ScrollView>
        )
    }

    renderCategoryRow({item, index}) {


        return (
            <TouchableOpacity
                activeOpacity ={1}
                onPress={() => this.rowPressed(item, index)}>
                <View>
                    <View>
                        {item.title.length > 0 && <Text
                            style={[styles.title, {color: this.state.tabId == index ? "#0FB0AA" : "#666"}]}>{item.title}</Text>}
                    </View>
                    <View style={styles.blankView}></View>
                </View>
                <View
                    style={[styles.bottomSelectionView, {backgroundColor: this.state.tabId == index ? "#0FB0AA" : 'white'}]}></View>

            </TouchableOpacity>
        );
    }

    /**
     * Action on clicking any tab.
     *
     * @param  {obj} item  - Row object.
     */
    rowPressed = (item, index) => {
        this.setState({tabId: index}, () => {
            this.loadContainer();
        })


    }

    renderListView() {

        {
            let widgetList = this.state.tabData;
            if (widgetList && widgetList.length > 0) {
                const {clampedScroll} = this.state;

                return (
                    <View style={styles.container}>
                        <AnimatedFlatList
                            data={widgetList}
                            renderItem={this.renderRow.bind(this)}
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
                                {useNativeDriver: true},
                            )}
                            keyExtractor={(item, index) => {
                                return `homePage-${item.widgetId}-${index}`
                            }}
                            initialNumToRender={4}
                        />
                    </View>
                );
            } else {
                return (<EmptyView/>);
            }
        }
    }

    renderRow({item, index}) {
        let rowData = item;
        return (
            <View>
                <View>
                    <WidgetHandler data={rowData} elementTap={this.props.callBack} />
                </View>
            </View>
        )
    }

    renderTab = () => {
        console.log("renders tab::",this.state.widgetData)
        return (<FlatList
            extraData={this.state.tabId}
            data={this.state.widgetData.json["links.bind"]["assets"]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            renderItem={this.renderCategoryRow.bind(this)}/>);
    }


    loadContainer = () => {
        if (this.state.widgetData) {
            this.setState({
                tabData: null
            }, () => {
                getTabData(this.state.widgetData.json["links.bind"]["assets"][this.state.tabId].redirectUrl).then((response) => {
                    // this.setState({tabData: response.data.render.json});
                    console.log("getTabData::", response);
                    this.setState({ tabData: response.data.widgets })

                })
                    .catch(error => {
                    })
            })
        }
    }
}




const styles = StyleSheet.create({
    parentContainer: {backgroundColor: "#F7FAFA"},
    container: {
        backgroundColor: 'white',
    },
    title: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        padding: 10,
        backgroundColor: "white"
    },
    blankView: {
        flex: 0.2,
    },
    bottomSelectionView: {
        height: 2,
        marginBottom: 0
    }
});