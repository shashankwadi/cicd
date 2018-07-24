/*
 * @Author: shahsank sharma 
 * @Date: 2017-08-22 10:46:08 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2018-02-07 13:16:29
 */

'use strict';

import React, { Component, PureComponent } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  requireNativeComponent,
  //ListView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import SearchBar from '../views/searchBar';
import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";;
import Colors from 'Wadi/src/utilities/namespaces/colors';

//import { FilterActions } from '../../reducers/filter';
import { getFilters } from '../../actions/filterActions';
import {filterApplied, clearFilter} from '../../actions/plpActions';

import LeftHeaderButton from 'Wadi/src/components/helpers/leftHeaderButton';

//common components
import { EmptyView, HeaderDown, Loader, Checkbox } from '../common';

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
      subcategory: null,
      selectedCount: 0,
      previousCount: 0,
      queryString: '',
      pathParams: '',
    };
    this.selectCategory = this.selectCategory.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
    this.updateFilterData = this.updateFilterData.bind(this);
  }

  componentDidMount() {
    //remove it from here, better to load from redux
    this.props.navigation.setParams({clearFilter: () => this.clearFilter(), isClearButton:false});
    //&brand=apple
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
   * I am trying to check if after changing category do I really need to send sever request
   * 1)need to check be toggled the main category 
   * 2)check if we selected any new subcategory than call server request with updated query string
   * @param {*} prevProps 
   * @param {*} prevState 
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected !== this.state.selected && prevState.previousCount !== this.state.selectedCount) {
      this.updateFilterData();
    }
  }

  /**
   * @param {*} categories is the array of filter categories
   */
  setInitialState = (categories) => {
    /**
       * 1.get arrays of catgories from object of categories using 
       * Object.values (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values);
       * 2.update selected object to reflect either category #1 or whatever slected previosly 
       * 3.update subcategories accordingly
       */
    if (categories && categories.length > 0) {
      let selectTabData = categories[this.state.selectedTabIndex]
      this.setState((prevState) => ({
        categories: (!Object.keys(prevState.subSelected).length) ? categories : categories.map((item) => {
          //we need to update previosly selected count for that particular category
          let subSelected = prevState.subSelected[item.key];
          let count = (subSelected) ? Object.values(subSelected).filter(value => value).length : 0
          return { ...item, count: count }
        }),
        //categories:categories,
        //selected: { ...prevState.selected, [selectTabData.key]: !prevState.selected[selectTabData.key] }, //setting 1st category as selected
        subcategory: (selectTabData) ? selectTabData : null,
        selectedTab: (selectTabData && selectTabData.key) ? selectTabData.key : "",
        //subSelected:prevState.subSelected
      }));
    } else {
      this.setState({
        categories: []
      });
    }
  }

  _getFinalUrl = ({ pathParams = '', queryString = '' }) => {
    let extendedUrl = (this.props && this.props.extendedUrl) ? this.props.extendedUrl : "";
    if (!!pathParams) {
      extendedUrl = pathParams + extendedUrl;
    }
    if (queryString) {
      //&vertical=women--men&price=560-670--410-450--329-370
      queryString = (queryString.indexOf("&") === 0) ? queryString.substring(1) : queryString;
      extendedUrl = (extendedUrl.includes("?") ? `${extendedUrl}&${queryString}` : `${extendedUrl}?${queryString}`);
    }
    return extendedUrl;
  }

  getFilters = ({ pathParams = '', queryString = '' }) => {
    let extendedUrl = this._getFinalUrl({ pathParams, queryString })
    this.props.getFilters(extendedUrl);
  }

  /**
   * @param {*} name of the category for which we need to update count
   * @param {*} count updated count
   */
  updateSelected(key, selected, isSelected) {
    let selectedArr = Object.values(selected)
    let count = selectedArr.filter(value => value === true).length;
    this.setState((prevState) => {
      let categories = prevState.categories;
      let subSelected = { ...prevState.subSelected, [key]: selected };
      let index = categories.findIndex((item) => item.key === key);
      let currentData = categories[index];
      let updatedData = [...categories.slice(0, index), { ...currentData, count: count }, ...categories.slice(index + 1),]
      return {
        categories: updatedData,
        subSelected: subSelected,
        selectedCount: (isSelected) ? prevState.selectedCount + 1 : prevState.selectedCount - 1,
        isClearButton: true
      }
    });
    //this.props.navigation.setParams({isClearButton:true});
  }

  _generateUrlParameters() {
    let { subSelected } = this.state;
    let queryString = '';
    let pathParams = '';
    let selectedFilters = [];
    if (subSelected) {
      let data = Object.entries(subSelected);
      if (data.length) {
        data.map((item, index) => {
          let categoryName = item[0];
          let subcategories = item[1];
          if (categoryName === 'brand' || categoryName === 'category') {
            let qs = Object.entries(subcategories).map((elem) => {
              if (elem[1]) {
                selectedFilters = [...selectedFilters, elem[0]];
                return elem[0].toLowerCase();
              } else {
                return "";
              }
            }).join('--')
              .replace(/--\s*$/, "");   //removing last comma
            pathParams += `/${qs}`;
          } else {
            queryString += `&${categoryName.toLowerCase()}=`;
            if (subcategories) {
              let qs = Object.entries(subcategories).map((elem) => {
                if (elem[1]) {
                  selectedFilters = [...selectedFilters, elem[0]];
                  return elem[0].toLowerCase();
                } else {
                  return "";
                }
                //return (elem[1]) ? elem[0].toLowerCase() : "";
              }).join('--')
                .replace(/--\s*$/, "");   //removing last comma
              queryString += qs;
            }
          }
        });
      }
    }
    return { queryString: queryString, pathParams: pathParams, selectedFilters: selectedFilters };
  }
  updateFilterData() {
    let { queryString, pathParams } = this._generateUrlParameters();
    if (queryString !== "" || pathParams !== "") {
      this.getFilters({ pathParams, queryString });
      this.setState({
        queryString: queryString,   //send it to plp when user click on apply filters
        pathParams: pathParams
      });
    }
  }

  selectCategory(item, index) {
    if (item) {
      this.setState((prevState) => ({
        selected: {
          [item.key]: true
        },
        selectedTabIndex: index,
        selectedTab: item.key,
        subcategory: item,
        previousCount: prevState.selectedCount
      }));
    }
  }
  clearFilter() {
    this.setState({
      subSelected: {},
      selectedCount: 0,
      queryString: '',
      previousCount: 0,
      isClearButton: false
    });
    //this.props.navigation.setParams({isClearButton:false});
    this.getFilters({});
  }


  render() {
    let { fetching, error } = this.props.filter;
    let { data, subcategory, subSelected, selectedTab, categories, selectedCount } = this.state;
    if (!fetching && this.props.filter.categories && this.props.filter.categories.length === 0) {
      return <EmptyView />
    }

    return (
      <View style={styles.mainContainerView}>
        {(categories) && <View style={styles.listsContainerView}>
          <View style={styles.list1container}>
            <FlatList
              data={categories}
              horizontal={false}
              //enableEmptySections={true}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
              keyExtractor={(item, index) => item.key}
              renderItem={this.renderRowForListOne.bind(this)}
              selected={this.state.selected} />
          </View>
          {!!subcategory && <SubCategory data={subcategory} updateSelected={(key, selected, nextState) => this.updateSelected(key, selected, nextState)} selected={subSelected[selectedTab]} fetching={fetching} />}
        </View>}
        <View>
        </View>
        {!fetching &&
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity activeOpacity={1} style={[styles.applyView, { borderRightWidth: 1, borderColor: '#FFF', backgroundColor: (selectedCount > 0) ? 'red' : '#cfcfcf' }]} onPress={this.clearFilter.bind(this)} disabled={selectedCount === 0}>
              {<Text style={[styles.applyText]}>{'Clear Filters'}</Text>}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={[styles.applyView, { backgroundColor: (selectedCount > 0) ? '#6bbebe' : '#cfcfcf' }]} onPress={this.applyClicked.bind(this)} disabled={selectedCount === 0}>
              {<Text style={styles.applyText}>{'Apply Filters'}</Text>}
            </TouchableOpacity>
          </View>}

      </View>
    )
  }

  renderRowForListOne({ item, index }) {
    let { selectedTab, selected } = this.state;
    let { name, type, data, count, key } = item;

    if(data && data.length ===0) return null;
    let backgrndcolor = 'white'
    let txtcolor = '#333';
    let fontWeight = "normal";
    let isSelected = !!selected[item.key]; // renderItem depends on state

    if (isSelected) {
      backgrndcolor = '#eaf8f8';
      txtcolor = '#333';
      fontWeight = "bold";
    }

    return (
      <TouchableOpacity activeOpacity={1} style={[styles.title1Container, { backgroundColor: backgrndcolor }]} onPress={() => this.selectCategory(item, index)}>
        {<Text style={[styles.list1title, { color: txtcolor, fontWeight: fontWeight }]}>{name.trim()}</Text>}
        {!!count && <View style={styles.list1box}>
          <Text style={[styles.list1subTitle, { color: 'green' }]}>{count}</Text>
        </View>}
      </TouchableOpacity>
    );
  }


  _keyExtractor = (item, index) => item;

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  searchFilter(searchText) {
    // this.props.navigation.navigate(Constants.screens.ProductList, { searchString: searchText });
  }

  /**
   * send queryString back to plp page
   */
  applyClicked() {
    const { state, goBack } = this.props.navigation;
    let { queryString, pathParams, selectedFilters } = this._generateUrlParameters();
    let finalUrl = this._getFinalUrl({ queryString, pathParams });
    this.props.filterApplied(this.props.filter.search);//pass current selected filters 
    state.params.callBack(finalUrl, selectedFilters);
    goBack(null);
  }


  /**
   * Action on clicking any tab.
   *
   * @param  {obj} item  - Row object.
   */
  rowPressed = (item) => {

  }
};

FilterPage.navigationOptions = ({ navigation }) => {
  return {
    //tabBarVisible: false,
    headerTitle: <Image source={wadiNavBarIcon} style={{ alignSelf: 'center' }} />,
    headerTintColor: Colors.black,
    mode: 'modal',
    headerLeft: <HeaderDown navigation={navigation} />,
    headerRight:<TouchableOpacity activeOpacity ={1} style={{padding:10}} 
                  disabled ={!navigation.state.params.isClearButton}
                  onPress={()=>navigation.state.params.clearFilter()}>
                  <Text>{(navigation.state.params.isClearButton)?"Clear":""}</Text>
                </TouchableOpacity>,

  }
}

class SubCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      selected: {},
      searchResult: null
    }
    this.selectItem = this.selectItem.bind(this);
    this.updateSelectedCount = this.updateSelectedCount.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchText && prevProps.data.key !== this.props.data.key) {
      //this.searchFilter(this.state.searchText);
      if(this.searchBar && this.searchBar.onCancel){
        this.searchBar.onCancel();
      }else{
        this.onSearchCancel();
      }
    }
  }
  // componentWillReceiveProps(nextProps){
  //   if(this.state.searchText && nextProps.data.key !== this.props.data.key){
  //     this.searchFilter(this.state.searchText);
  //   }
  // }

  onSearchCancel=()=>{
    this.setState({
      searchText:'',
      searchResult:null,
    });
  }
  updateSelectedCount() {
    let { type, name } = this.props.data;
    let { selected } = this.state;
    let count = 0;
    let isMultiSelect = (type === "multiselect") ? true : false;
    count = Object.values(selected).filter(value => value === true).length;
    //this.props.updateSelectedCount(name, count)
  }

  selectItem(item) {
    /*
     * for multiselect type just toggle key for current item
     * for single select we just need to have single element in selected array 
     */
    if (item) {
      let { data, selected } = this.props;
      let { name, type, key } = data;
      let isMultiSelect = (type === "multiselect") ? true : false;
      // this.setState((prevState) => {
      //   let updateSelected = (!isMultiSelect)?{[item.name]:!prevState.selected[item.name]}:{...prevState.selected, [item.name]:!prevState.selected[item.name]};
      //   return{
      //     selected:updateSelected
      //   }
      // }, function(){
      // });
      let prevSelected = (!!selected) ? selected : {};
      let nextState = !prevSelected[item.key]
      let updateSelected = (!isMultiSelect) ? { [item.key]: nextState } : { ...prevSelected, [item.key]: nextState };
      this.props.updateSelected(key, updateSelected, nextState)
    }
  }

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

  renderItem({ item, index }) {
    //let {subcategory}= this.state;
    let { selected = {}, data } = this.props;
    let { name, key, count } = item
    let selectorClr = '#ededed'
    let txtcolor = '#333';
    let fontWeight = "normal";
    let isSelected = !!selected[item.key]; // renderItem depends on state
    if (isSelected) {
      selectorClr = '#6bbebe';
      txtcolor = '#333';
      fontWeight = "bold"
    }
    return (
      <TouchableOpacity activeOpacity={1} style={styles.title2Container} onPress={() => this.selectItem(item)}>
        <View style={styles.list2Parent}>
          <Text style={[styles.list2title, { color: txtcolor, fontWeight: fontWeight }]}>{name.trim()}</Text>
          <Text style={{ color: 'gray' }}>({count})</Text>
        </View>
        {(data.type !== "multiselect") ?
          <View style={[styles.list2Selector, { borderColor: selectorClr, backgroundColor: selectorClr }]}></View> :
          <Checkbox isSelected={isSelected} containerStyle={{ marginRight: 5, }} />
        }
      </TouchableOpacity>
    );
  }

  renderSubCategoryHeader = () => {
    if (this.props.isFetching) {
      return (
        <View style={{ height: 50, width: dimensions.width, marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator
            animating={true}
            style={[styles.centering, { height: 80 }]}
            size="large"
          />
        </View>
      )
    }
    return null;
  }

  render() {
    let { searchText, searchResult } = this.state;
    let data = (!searchText) ? this.props.data.data : searchResult;
    return (
      <View style={styles.list2Container}>
        <View style={styles.searchBar}>
          <SearchBar ref = {(ref)=> this.searchBar = ref} onChangeText={this.searchFilter.bind(this)} onCancel={this.onSearchCancel} />
        </View>
        {(data && data.length > 0) ?
          <FlatList
            style={styles.list2}
            data={data}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            //enableEmptySections={true}
            selected={this.state.selected}
            ItemSeparatorComponent={() => <View style={{ height: 0.5, width: "100%", backgroundColor: "#CED0CE", }} />}
            keyExtractor={(item, index) => item.key}
            renderItem={this.renderItem.bind(this)}
            ListHeaderComponent={this.renderSubCategoryHeader} /> : <EmptyView containerStyles={{ backgroundColor: 'white' }} />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainerView: {
    flex: 1,
    backgroundColor: 'white'
  },
  listsContainerView: {
    //height: dimensions.height - 120,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  applyView: {
    flex: 1,
    backgroundColor: '#6bbebe',
    //marginLeft: 20,
    //marginRight: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyText: {
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    color: 'white'
  },
  list1container: {
    width: list1Width
  },
  list2Container: {
    width: list2Width,
    borderRadius: 4,
    borderLeftWidth: 0.4,
    borderColor: '#CED0CE'
  },
  title1Container: {
    flexDirection: 'row',
    alignItems: 'center'
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
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list1subTitle: {
    fontFamily: GLOBAL.FONTS.default_font,
    fontSize: 10,
    //width: 10,
    height: 10,
    textAlign: 'center'
  },
  list2: {
    marginBottom: 50
  },
  searchBar: {
    width: list2Width
  },
  title2Container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#CED0CE',
    alignItems: 'center'
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
    flex: 1
  },
  list2Selector: {
    width: 12,
    height: 12,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 6,
    borderWidth: 1
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
    filterApplied:(filters)=>dispatch(filterApplied(filters)),
    //changeCategory:()=>dispatch(FilterActions.changeCategory(filters))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(FilterPage)




