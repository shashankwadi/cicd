/*
 * @Author: shahsank sharma 
 * @Date: 2017-08-22 10:46:08 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2018-02-07 13:16:29
 */

'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import {connect} from 'react-redux';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions, isEmptyObject} from 'utilities/utilities';
import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";
import Colors from 'Wadi/src/utilities/namespaces/colors';

import {getFilters} from '../../actions/filterActions';
import {filterApplied, clearFilter, getFinalUrl} from '../../actions/plpActions';

//common components
import {EmptyView, HeaderDown} from '../common';
import {strings} from '../../utilities/uiString'
import SubCategory from './subCategory'

let list1Width = 120
let list2Width = dimensions.width - 120




class FilterPage extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: '',
            selectedTabIndex: 0,
            categories: null,
            selectedTabdata: null,
            selected: {},
            subSelected: {},
            oldSubSelected: null, //to keep track of subselected
            subcategory: null,
            selectedCount: 0,
            previousCount: 0,
            queryString: '',
            pathParams: '',
            search: null,
        };
        this.selectCategory = this.selectCategory.bind(this);
        this.updateSelected = this.updateSelected.bind(this);
        this.updateFilterData = this.updateFilterData.bind(this);
    }

    componentDidMount() {
        if (this.props.filter && this.props.filter.categories) {
            this.setInitialState(this.props.filter.categories, this.props.filter.search);
        } else {
            this.getFilters({});
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filter.categories && nextProps.filter.categories !== this.props.filter.categories) {
            this.setInitialState(nextProps.filter.categories, nextProps.filter.search);
        }
    }

    /**
     * @param {*} categories is the array of filter categories
     */
    setInitialState = (categories, search) => {
        /**
         * 1.get arrays of catgories from object of categories using
         * Object.values (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values);
         * 2.update selected object to reflect either category #1 or whatever slected previosly
         * 3.update subcategories accordingly
         */

        if (categories && categories.length > 0) {
            let previousCount = 0;
            let prevSubSelected = getSubSelected(search);
            let selectTabData = categories[this.state.selectedTabIndex]
            this.setState((prevState) => ({
                categories: categories.map((item) => {
                    let subSelected = search[item.key];
                    let count = (subSelected && subSelected.length) ? subSelected.length : 0
                    previousCount += count;
                    return {...item, count: count}
                }),
                previousCount: previousCount,
                subcategory: (selectTabData) ? selectTabData : null,
                selectedTab: (selectTabData && selectTabData.key) ? selectTabData.key : "",
                search: search,
                subSelected: prevSubSelected,
                selected:(!!selectTabData && isEmptyObject(prevState.selected))?{[selectTabData.key]:true}:prevState.selected
            }));
        } else {
            this.setState({
                categories: []
            });
        }
    }

    /**
     * Get the previously applied filter
     * @param pathParams
     * @param queryString
     */
    getFilters = ({pathParams = '', queryString = ''}) => {
        let extendedUrl = getFinalUrl(this.state.search)
        this.props.getFilters(extendedUrl);
    }

    /**
     *updates the selected list of filter with the key coming from subcategory
     */
    updateSelected(key, selected, isSelected) {
        let selectedArr = Object.keys(selected);
        let count = selectedArr.length;
        this.setState((prevState) => {
            let categories = prevState.categories;
            let subSelected = {...prevState.subSelected, [key]: selected};
            let index = categories.findIndex((item) => item.key === key);
            let currentData = categories[index];
            let updatedData = [...categories.slice(0, index), {
                ...currentData,
                count: count
            }, ...categories.slice(index + 1),]
            return {
                oldSubSelected: prevState.subSelected,
                categories: updatedData,
                subSelected: subSelected,
                selectedCount: (isSelected) ? prevState.selectedCount + 1 : prevState.selectedCount - 1,
                isClearButton: true,
                search: {...prevState.search, [key]: selectedArr}
            }
        });
    }


    /**
     * Updates the filter data
     * @param key
     */
    updateFilterData(key) {
        let {subSelected, oldSubSelected, categories} = this.state;
        let currentKey = (key) ? key : (categories && categories.length ? categories[0].key : "");
        if (isUpdates(subSelected, oldSubSelected, currentKey)) {
            this.getFilters({});
        }
    }

    /**
     * Add the item to the list of selected category
     * @param item
     * @param index
     */
    selectCategory(item, index) {
        if (item) {
            let currentKey = Object.keys(this.state.selected)[0]
            this.setState((prevState) => ({
                selected: {
                    [item.key]: true
                },
                selectedTabIndex: index,
                selectedTab: item.key,
                subcategory: item,
                previousCount: prevState.selectedCount
            }), () => this.updateFilterData(currentKey));
        }
    }

    /**
     *Clears selected filters
     */
    clearFilter() {
        this.setState((prevState) => {
            return {
                subSelected: {},
                selectedCount: 0,
                queryString: '',
                previousCount: 0,
                isClearButton: false,
                search: {
                    'category': prevState.search['category'],
                    'searchKey': prevState.search['searchKey']
                }
            }
        }, () => this.getFilters({}));

    }


    render() {
        let {fetching, error} = this.props.filter;
        let {data, subcategory, subSelected, selectedTab, categories, selectedCount, previousCount} = this.state;
        if (!fetching && this.props.filter.categories && this.props.filter.categories.length === 0) {
            return <EmptyView/>
        }

        return (
            <View style={styles.mainContainerView}>
                {(categories) && <View style={styles.listsContainerView}>
                    <View style={styles.list1container}>
                        <FlatList
                            data={categories}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={false}
                            keyExtractor={(item, index) => item.key}
                            renderItem={this.renderRowForListOne.bind(this)}
                            selected={this.state.selected}/>
                    </View>
                    {!!subcategory && <SubCategory data={subcategory}
                                                   updateSelected={(key, selected, nextState) => this.updateSelected(key, selected, nextState)}
                                                   selected={subSelected[selectedTab]} fetching={fetching}/>}
                </View>}
                {this.renderFilterActionRow(selectedCount,previousCount,fetching)}


            </View>
        )
    }

    /**
     * Renders row for the super category
     * @param item
     * @param index
     * @returns {*}
     */
    renderRowForListOne({item, index}) {
        let {selectedTab, selected} = this.state;
        let {name, type, data, count, key} = item;
        if (data && data.length === 0) return null;
        let backgrndcolor = '#F5F4F6'
        let txtcolor = '#333';
        let fontWeight = "normal";
        let isSelected = !!selected[item.key]; // renderItem depends on state

        if (isSelected) {
            backgrndcolor = 'white';
            txtcolor = '#333';
            fontWeight = "bold";
        }

        return (
            <TouchableOpacity activeOpacity={1} style={[styles.title1Container, {backgroundColor: backgrndcolor}]}
                              onPress={() => this.selectCategory(item, index)}>
                {isSelected &&
                <View style={styles.filterRowText}><Text></Text></View>}
                <View style={{paddingVertical: 1, flexDirection: 'row', alignItems: 'center'}}>
                    {<Text style={[styles.list1title, {color: txtcolor, fontWeight: fontWeight}]}>{name.trim()}</Text>}
                    {!!count && <View style={styles.list1box}>
                        <Text style={[styles.list1subTitle, {color: '#94969f'}]}>{count}</Text>
                    </View>}
                </View>
            </TouchableOpacity>
        );
    }


    /**
     * send queryString back to plp page
     */
    applyClicked() {
        const {navigator, callBack} = this.props
        this.props.filterApplied(this.state.search);//pass current selected filters
        callBack(this.state.search);
        navigator.pop();
    }


    /**
     * Action on clicking any tab.
     *
     * @param  {obj} item  - Row object.
     */
    rowPressed = (item) => {

    }
    /**
     * Renders filters action button(apply and cancel) at the bottom of the screen
     * @param selectedCount
     * @param previousCount
     * @param fetching
     * @returns {XML}
     */
    renderFilterActionRow = (selectedCount,previousCount,fetching) => {
        return(<View style={styles.applyFilterRow}>
            <TouchableOpacity activeOpacity={1} style={[styles.applyView, styles.clearFilterTouchable]} onPress={this.clearFilter.bind(this)}
                              disabled={!(selectedCount > 0 || previousCount > 0 || !fetching)}>
                {<Text style={[styles.applyText, {color: '#696B79'}]}>{strings.ClearFilters}</Text>}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.applyView}
                              onPress={this.applyClicked.bind(this)}
                              disabled={fetching}>
                {<Text style={[styles.applyText, {color: 'white'}]}>{strings.ApplyFilters}</Text>}
            </TouchableOpacity>
        </View>)
    }
};



const getSelected = (data) => {
    let result = {};
    for (let i = 0; i < data.length; i++) {
        result[data[i]] = true;
    }
    return result;
}

const getSubSelected = (search) => {
    let result = {};
    for (let key in search) {
        if (!(key === 'limit' || key === 'page' || key === 'searchKey' || key === 'sort')) {
            result[key] = getSelected(search[key]);
        }
    }
    return result;
}

const isUpdates = (current = {}, old, key = "") => {
    if (!old) return false;
    /**
     * equality checks on objects always done using by refrences so it is better to convert them into strings before checking for equality;
     * refs1:- http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html,
     * refs2:- https://stackoverflow.com/questions/14368596/how-can-i-check-that-two-objects-have-the-same-set-of-property-names,
     *
     */

    let currentData = JSON.stringify(current[key]);
    let oldData = JSON.stringify(old[key]);
    return currentData !== oldData;
}


FilterPage.navigationOptions = ({navigation}) => {
    return {
        //tabBarVisible: false,
        headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
        headerTintColor: Colors.black,
        mode: 'modal',
        headerLeft: <HeaderDown navigation={navigation}/>,
        headerRight: <TouchableOpacity activeOpacity={1} style={{padding: 10}}
                                       disabled={!navigation.state.params.isClearButton}
                                       onPress={() => navigation.state.params.clearFilter()}>
            <Text style={styles.clearAll}>{(navigation.state.params.isClearButton) ? "Clear All" : ""}</Text>
        </TouchableOpacity>,

    }
}



const styles = StyleSheet.create({
    mainContainerView: {
        flex: 1,
        backgroundColor: 'white'
    },
    listsContainerView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    clearAll: {
        color: Colors.wadiRoseColor,
        fontSize: 16
    },
    applyView: {
        flex: 1,
        backgroundColor: Colors.wadiDarkGreen,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    applyText: {
        marginLeft: 20,
        marginRight: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    list1container: {
        width: list1Width
    },
    title1Container: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    list1title: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        paddingLeft: 5,
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'left',
        width: list1Width - 25
    },
    list1box: {
        minWidth: 15,
        height: 15,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list1subTitle: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 10,
        textAlign: 'center'
    },

    searchBar: {
        width: list2Width
    },
    filterRowText:{
        width: 2,
        height: '100%',
        backgroundColor: '#FF3E6C'
    },
    applyFilterRow:{
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth:1,
        borderBottomColor:Colors.authenticationTextFieldPlaceholderColor,
        borderTopColor: Colors.authenticationTextFieldPlaceholderColor
    },
    clearFilterTouchable:{
        borderRightWidth: 1,
        borderRightColor: Colors.authenticationTextFieldPlaceholderColor,
        backgroundColor: 'white'
    }

});

function mapStateToProps(state) {
    return {
        filter: state.filter
    }

}

function mapDispatchToProps(dispatch) {
    return {
        getFilters: (filters) => dispatch(getFilters(filters)),
        filterApplied: (filters) => dispatch(filterApplied(filters)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FilterPage)




