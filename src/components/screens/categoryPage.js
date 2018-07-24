/*
 * @Author: shahsank sharma 
 * @Date: 2017-08-22 10:46:08 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2018-02-21 13:53:42
 * 
 * @Last modified by :Manjeet Singh 
 * @Last modilfied time : 2017-11-03 4:52
 * #1modified style of renderRowForListOne to show image properly
 * Replaced Listview with Flatlist
 */

'use strict';

import React, {Component, PureComponent} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import {getCategoriesStack} from 'Wadi/src/actions/menuAction';
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import Panel from '../../helpers/expandCollapse';
import Loader from '../common/loader';

let list1Width = 80;
let list2Width = dimensions.widget - list1Width;

class CategoryPage extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            selected: {},
            subcategory: null,
            categoryWithoutOption: null,
        };

        this.selectCategory = this.selectCategory.bind(this);
    }

    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
        this.props.getMenu();
        //});
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.menu && nextProps.menu !== this.props.menu) {
            /**
             *need to set 1st as selected category
             */
            let menu = nextProps.menu;
            if (menu && menu.length) {
                let selectedData = menu[this.state.selectedIndex];
                this.setState((prevState) => ({
                    selected: {[selectedData.title]: !prevState.selected[selectedData.title]}, //setting 1st category as selected
                    subcategory: selectedData.children,
                    categoryWithoutOption:!selectedData.children?selectedData:null
                }));
            }
        }
    }


    selectCategory(item, index) {
        if (item) {
            this.setState((prevState) => ({
                selected: {
                    [item.title]: true
                },
                selectedIndex: index,
                subcategory: item.children
            }));
            if (!item.children) {
                //no childrens at root level, send user to plp
                this.setState({categoryWithoutOption: item});
                // this.rowPressed(item);
                // setTimeout(()=>{
                //   this.rowPressed(item);
                // },500);
            }
        }
    }


    render() {
        let {subcategory} = this.state;
        let {menu, isFetching} = this.props;

        return (
            <View style={styles.mainContainerView}>
                {isFetching && <Loader containerStyle={{flex: 1}}/>}
                {!isFetching && menu &&
                <View style={styles.list1}>
                    <FlatList
                        data={menu}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                        selected={this.state.selected}
                        keyExtractor={(item, index) => {return `${item.title}-${index}`}}
                        renderItem={this.renderRowForListOne.bind(this)}/>
                </View>}

                {subcategory ?
                    <View style={{flex: 1}}>
                        <SubCategory data={subcategory}
                                     rowPressed={(item) => this.rowPressed(item)}/>
                    </View> : this.state.categoryWithoutOption &&
                    <View style={{ flex: 1}}>
                        <TouchableOpacity activeOpacity={1}
                                          onPress={() => this.rowPressed(this.state.categoryWithoutOption)}><Text
                            style={{fontSize: 16,marginTop:20,marginLeft:15,color:'#565656'}}>View
                            All</Text></TouchableOpacity></View>
                }
            </View>
        )
    }

    renderRowForListOne({item, index}) {
        let {selected} = this.state;
        let {title, action, image_url, textColor, selectedTextColor} = item;
        let isSelected = !!selected[title];
        let backgrndcolor = GLOBAL.COLORS.categoryBackgroundGray;
        let selectionColor = GLOBAL.COLORS.categoryBackgroundGray;
        if (isSelected) {
            backgrndcolor = 'white';
            selectionColor = GLOBAL.COLORS.wadiDarkGreen
        }

        return (
            <View>
                <View style={{flexDirection: 'row', height: 60}}>
                    <View style={{width: 4, backgroundColor: selectionColor}}/>
                    <TouchableOpacity activeOpacity={1}
                                      style={[styles.list1Selection, {backgroundColor: backgrndcolor}]}
                                      onPress={() => this.selectCategory(item, index)}>
                        {image_url && <Image
                            style={styles.list1Image}
                            resizeMode='cover'
                            source={{uri: image_url}}
                        />}
                        {<Text
                            style={[styles.itemTitle, {color: (isSelected) ? selectedTextColor : textColor,}]}
                            numberOfLines={2} ellipsizeMode={'tail'}>{title}</Text>}
                    </TouchableOpacity>
                    {/*</View>*/}
                </View>
                <View style={{height: 1.0, backgroundColor: GLOBAL.COLORS.lightGreyColor}}/>
            </View>
        );
    }

    /**
     * Action on clicking any tab.
     *
     * @param  {obj} item  - Row object.
     */
    rowPressed = (item) => {
        let {url,title} = item;
        this.props.deepLinkActions({
            url: url,
            navigator: this.props.navigator,
            currentScreen: Constants.screens.Category,
            params: {screenName : title}
        });
    }
}


class SubCategory extends PureComponent {
    renderChildrens = (title, data) => {
        return (
            <Panel
                title={title}
                collapsed={true}>
                <FlatList
                    key={title}
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={false}
                    keyExtractor={(item, index) => item.title}
                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                paddingVertical: 5,
                                paddingLeft: 10,
                                marginLeft: 10,
                                height: 40,
                                justifyContent: 'center'
                            }}
                            onPress={() => this.props.rowPressed({...item}) //change this line in production
                            }>
                            <Text>{item.title}</Text>
                        </TouchableOpacity>}/>
            </Panel>
        )
    };

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            selected: {},
        };
        this.renderBrands = this.renderBrands.bind(this);
        //this.renderSubcategories = this.renderSubcategories.bind(this)
    }

    /**
     *
     * @param {*} item
     * @param {*} index
     * this method will render collipsible if there are some children
     */
    renderSubcategories({item, index}) {
        let {title, imageUrl, action, iconImageUrl, children} = item;
        let selectorClr = '#ededed';
        let txtcolor = '#CED0CE';
        let iconUrl = (iconImageUrl) ? iconImageUrl : (imageUrl && imageUrl.length > 0 ? "https://2.bp.blogspot.com/-DTFmvVZf77E/T9mQFYk8t8I/AAAAAAAABs4/aw7qN1EfJWQ/s400/Lacoste-logo.gif" : null);
        if (children) {
            return (
                <View style={styles.title2Container} key={title}>
                    {imageUrl && <Image
                        style={styles.list2Image}
                        resizeMode='cover'
                        source={{uri: iconUrl}}
                    />}
                    {this.renderChildrens(title, children)}
                </View>);
        }
        return (
            <TouchableOpacity
                key={title}
                activeOpacity={1}
                style={styles.title2Container}
                onPress={() => this.props.rowPressed(item)}>
                {imageUrl && <Image
                    style={styles.list2Image}
                    resizeMode='cover'
                    source={{uri: iconUrl}}
                />}
                <Text style={styles.list2title}>{title}</Text>
            </TouchableOpacity>
        );
    }

    renderBrands(brands) {
        if (brands) {
            return (
                <View style={{padding: 16}}>
                    <Text style={{color: '#aaabb0', paddingVertical: 8}}>Recommended Brands</Text>
                    <FlatList
                        data={brands}
                        numColumns={3}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        keyExtractor={(item, index) => item.name}
                        renderItem={({item, index}) => <Image
                            source={{uri: "https://2.bp.blogspot.com/-DTFmvVZf77E/T9mQFYk8t8I/AAAAAAAABs4/aw7qN1EfJWQ/s400/Lacoste-logo.gif"}}
                            resizeMode='cover' style={{width: 100, height: 70}}/>}/>
                </View>)
        }
    }

    render() {
        let {data} = this.props;
        return (
            <ScrollView style={styles.list2Container}>
                {data && data.length > 0 && data.map((item, index) => {
                    return this.renderSubcategories({item, index})

                })}
                {/*data && data.brands && this.renderBrands(data.brands)*/}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    mainContainerView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    list1: {
        width: list1Width,
        backgroundColor: '#f0f0f0'
    },
    list1Selection: {
        flex: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list1Image: {
        width: 30,
        height: 30,
        marginTop: 5,
    },
    list2Container: {
        flexDirection: 'column',
        width: list2Width
    },
    searchBar: {
        width: dimensions.width - 130
    },
    list2Image: {
        width: 30,
        height: 30,
        marginLeft: 10
    },
    list1title: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list1subTitle: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        width: 20,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        borderColor: 'gray',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
    },
    list2title: {
        flex: 1,
        padding: 10,
        margin: 10,
        color: GLOBAL.COLORS.darkGreyColor,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        marginLeft: 0
    },

    list2Selector: {
        width: 12,
        height: 12,
        marginTop: 9,
        marginBottom: 9,
        marginLeft: 5,
        marginRight: 5,
        borderColor: 'orange',
        backgroundColor: 'orange',
        borderRadius: 10,
        borderWidth: 1,
    },
    title1Container: {
        flexDirection: 'row',
        height: 30,
    },
    title2Container: {
        alignContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#CED0CE',
    },
    itemTitle: {
        textAlign: 'center',
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 10,
        marginTop: 2,
        marginLeft: 5,
        marginRight: 5,
    }
});


function mapStateToProps(state) {

    return {
        //currentScreen: state.currentScreen,
        menu: state.menus.menu,
        isFetching: state.menus.isFetching
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getMenu: () => dispatch(getCategoriesStack()),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage)