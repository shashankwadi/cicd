/**
 * Created on 10-05-2018
 * Akhil Choudhary
 * Created while refactoring of filter page
 */


import React, {PureComponent} from 'react';


import {

    Text,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet
} from 'react-native';


import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import SearchBar from '../views/searchBar';

//common components
import {EmptyView, Checkbox} from '../common';

let list2Width = dimensions.width - 120

class SubCategory extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            selected: {},
            searchResult: null
        }
        this.selectItem = this.selectItem.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.searchText && prevProps.data.key !== this.props.data.key) {
            if (this.searchBar && this.searchBar.onCancel) {
                this.searchBar.onCancel();
            } else {
                this.onSearchCancel();
            }
        }
    }

    /**
     * Clears the search text on cancel the search request
     */
    onSearchCancel = () => {
        this.setState({
            searchText: '',
            searchResult: null,
        });
    }



    /**
     * Triggers on selecting an item in the subcategory and updates the list of selected filter
     * @param item
     */
    selectItem(item) {
        /*
         * for multiselect type just toggle key for current item
         * for single select we just need to have single element in selected array
         */
        if (item) {
            let {data, selected} = this.props;
            let {name, type, key} = data;
            let isMultiSelect = (type === "multiselect") ? true : false;
            let updateSelected = {};
            let nextState = false;
            let prevSelected = (!!selected) ? selected : {};
            let _key = item.key.toLowerCase()
            if (prevSelected[_key]) {
                let {[_key]: current, ...remaining} = prevSelected;
                updateSelected = remaining;
            } else {
                nextState = true
                updateSelected = (!isMultiSelect) ? {[_key]: true} : {...prevSelected, [_key]: true};

            }
            this.props.updateSelected(key, updateSelected, nextState)
        }
    }

    /**
     * Finds the search text in props data
     * @param searchText
     */
    searchFilter(searchText) {
        let text = searchText.toLowerCase();
        let searchResult = this.props.data.data.filter((item, index) => {
            let name = item.name.toLowerCase();
            return (name.search(text) !== -1);
        });
        this.setState({
            searchText: searchText,
            searchResult: searchResult
        });
    }

    /**
     * Renders item of the subcategory
     * @param item
     * @param index
     * @returns {XML}
     */
    renderItem({item, index}) {
        let {selected = {}, data} = this.props;
        let {name, key, count} = item
        let selectorClr = '#ededed'
        let txtcolor = '#333';
        let fontWeight = "normal";
        let isSelected = !!selected[item.key.toLowerCase()]; // renderItem depends on state
        if (isSelected) {
            selectorClr = '#6bbebe';
            txtcolor = '#333';
            fontWeight = "bold"
        }
        return (
            <TouchableOpacity activeOpacity={1} style={styles.title2Container} onPress={() => this.selectItem(item)}>
                {(data.type !== "multiselect") ?
                    <View style={[styles.list2Selector, {
                        borderColor: selectorClr,
                        backgroundColor: selectorClr
                    }]}></View> : <Checkbox isSelected={isSelected} containerStyle={{marginLeft: 5,}}/>
                }
                <View style={styles.list2Parent}>
                    <Text style={[styles.list2title, {color: txtcolor, fontWeight: fontWeight}]}>{name.trim()}</Text>
                </View>

                <Text style={{color: 'gray', fontSize: 10, marginRight: 5}}>{count}</Text>
            </TouchableOpacity>
        );
    }

    /**
     *Renders loader view while fetching the data
     */
    renderSubCategoryHeader = () => {
        if (this.props.isFetching) {
            return (
                <View style={styles.loaderIndicatorContainer}>
                    <ActivityIndicator
                        animating={true}
                        style={[styles.centering, {height: 80}]}
                        size="large"
                    />
                </View>
            )
        }
        return null;
    }

    render() {
        let {searchText, searchResult} = this.state;
        let data = (!searchText) ? this.props.data.data : searchResult;
        return (
            <View style={styles.list2Container}>
                <View style={styles.searchBar}>
                    <SearchBar ref={(ref) => this.searchBar = ref} onChangeText={this.searchFilter.bind(this)}
                               onCancel={this.onSearchCancel}/>
                </View>
                {(data && data.length > 0) ?
                    <FlatList
                        style={styles.list2}
                        data={data}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        selected={this.state.selected}
                        ItemSeparatorComponent={() => <View
                            style={styles.itemSeparatorStyle}/>}
                        keyExtractor={(item, index) => item.key}
                        renderItem={this.renderItem.bind(this)}
                        ListHeaderComponent={this.renderSubCategoryHeader}/> :
                    <EmptyView containerStyles={{backgroundColor: 'white'}}/>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    list2Container: {
        width: list2Width,
        borderRadius: 4,
        borderLeftWidth: 0.4,
        borderColor: '#CED0CE'
    },
    list2: {
    },
    searchBar: {
        width: list2Width
    },
    title2Container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    list2title: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        marginRight: 5

    },
    list2Parent: {
        paddingLeft: 10,
        width: list2Width - 22,
        marginBottom: 5,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    list2Selector: {
        width: 12,
        height: 12,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 6,
        borderWidth: 1
    },
    itemSeparatorStyle:{
        height: 0.5,
        width: "100%",
        backgroundColor: "#CED0CE",
        marginLeft: 10,
        marginRight: 10
    },
    loaderIndicatorContainer:{
        height: 50,
        width: dimensions.width,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default SubCategory