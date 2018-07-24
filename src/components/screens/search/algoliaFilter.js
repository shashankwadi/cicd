/**
 * Created by Manjeet Singh on 01-17-2018 17:03 24
 */

'use strict';

import React, { Component, PureComponent } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  //requireNativeComponent,
  //ListView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import SearchBar from '../../views/searchBar';
import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";;
import Colors from 'Wadi/src/utilities/namespaces/colors';

//common components
import {EmptyView, HeaderDown, Loader} from '../../common';

//import { FilterActions } from '../../reducers/filter';
import {getFilters} from 'Wadi/src/actions/filterActions';

import LeftHeaderButton from 'Wadi/src/components/helpers/leftHeaderButton';

let list1Width = 120
let list2Width = dimensions.width - 120;

const getCategories = (obj)=>{
    let categories = Object.keys(obj).map((key) => { return { key: key, data:obj[key] } });
    //console.log('categories are -', categories);
    return categories;
}

class AlgoliaFilter extends PureComponent {

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
      queryString:''
    };
    this.selectCategory = this.selectCategory.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
    this.updateFilterData = this.updateFilterData.bind(this);
  }

  componentDidMount() {
      this.props.navigation.setParams({clearFilter: () => this.clearFilter(), isClearButton:false});
      this.setInitialStates(this.props.facets);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.facets && nextProps.facets !== this.props.facets) {
        this.setInitialStates(nextProps.facets);
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
    // if (prevState.selected !== this.state.selected && prevState.previousCount !== this.state.selectedCount) {
    //   this.updateFilterData();
    // }
  }

  setInitialStates=(facets)=>{
    let categories = getCategories(facets);
    if (categories && categories.length) {
      let selectTabData = categories[this.state.selectedTabIndex]
      this.setState((prevState) => ({
        categories: (!Object.keys(prevState.subSelected).length)?categories:categories.map((item)=>{
            //we need to update previosly selected count for that particular category
            let subSelected = prevState.subSelected[item.key];
            let count = (subSelected)?Object.values(subSelected).filter(value=>value).length:0
            return {...item, count:count}
        }),
        selected: { ...prevState.selected, [selectTabData.key]: !prevState.selected[selectTabData.key] }, //setting 1st category as selected
        subcategory: {key:selectTabData.key, data:getCategories(selectTabData.data)},
        selectedTab: selectTabData.key,
        subSelected:prevState.subSelected,
      }));
    }else{
      this.setState({
        categories:[]
      })
    }
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
        isClearButton:true
      }
    });
    this.props.navigation.setParams({isClearButton:true});
  }

  generateQueryString(){
    let { subSelected } = this.state;
    let queryString = '';
    if (subSelected) {
      let data = Object.entries(subSelected);
      if (data.length) {
        data.map((item, index) => {
          let categoryName = item[0];
          let subcategories = item[1];
          queryString += `&${categoryName.toLowerCase()}=`;
          if (subcategories) {
            let qs = Object.entries(subcategories).map((elem) => {
              return (elem[1]) ? elem[0].toLowerCase() : "";
            }).join(',')
              .replace(/,\s*$/, "");   //removing last comma
            queryString += qs;
          }
        });
      }
    }
    return queryString;
  }
  updateFilterData() {
     let queryString = this.generateQueryString();
     if(queryString !==""){
      this.props.getFilters(queryString);
      this.setState({
        queryString:queryString,   //send it to plp when user click on apply filters
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
        subcategory: {key:item.key, data:getCategories(item.data)},
        previousCount: prevState.selectedCount
      }));
    }
  }
  clearFilter() {
    this.setState({
      categories:getCategories(this.props.facets),
      subSelected: {},
      selectedCount: 0,
      queryString:'',
      previousCount:0,
      isClearButton:false
    });
    this.props.navigation.setParams({isClearButton:false});
  }


  render() {
    //let { fetching, error } = this.props.filter;
    let { data, subcategory, subSelected, selectedTab, categories, selectedCount } = this.state;
    if(categories && categories.length ===0){
      return <EmptyView/>
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
              keyExtractor={(item, index) => {return `categories-${item.key}-${index}`}}
              renderItem={this.renderRowForListOne.bind(this)}
              selected={this.state.selected} />
          </View>
          {!!subcategory && <SubCategory data={subcategory} updateSelected={(key, selected, nextState) => this.updateSelected(key, selected, nextState)} selected={subSelected[selectedTab]} />}
        </View>}
        <View>
        </View>
        {(categories && categories.length>0) &&
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity activeOpacity ={1} style={[styles.applyView, { borderRightWidth: 1, borderColor: '#FFF', backgroundColor: (selectedCount > 0) ? 'red' : '#cfcfcf' }]} onPress={this.clearFilter.bind(this)} disabled={selectedCount === 0}>
              {<Text style={[styles.applyText]}>{'Clear Filters'}</Text>}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity ={1} style={[styles.applyView, { backgroundColor: (selectedCount > 0) ? '#6bbebe' : '#cfcfcf' }]} disabled={selectedCount === 0}>
              {<Text style={styles.applyText}>{'Apply Filters'}</Text>}
            </TouchableOpacity>
        </View>}

      </View>
    )
  }

  renderRowForListOne({ item, index }) {
    let { selectedTab, selected } = this.state;
    let { name, type, data, count, key } = item;
    let backgrndcolor = 'white'
    let txtcolor = '#333';
    let fontWeight="normal";
    let isSelected = !!selected[item.key]; // renderItem depends on state

    if (isSelected) {
      backgrndcolor = '#eaf8f8';
      txtcolor = '#333';
      fontWeight="bold";
    }

    return (
      <TouchableOpacity activeOpacity ={1} style={[styles.title1Container, { backgroundColor: backgrndcolor }]} onPress={() => this.selectCategory(item, index)}>
        {<Text style={[styles.list1title, { color: txtcolor,fontWeight:fontWeight }]}>{key}</Text>}
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
    //let queryString = this.generateQueryString();
    //state.params.callBack(queryString);
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

AlgoliaFilter.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: false,
    headerTitle: <Image source={wadiNavBarIcon} style={{ alignSelf: 'center' }} />,
    headerTintColor: Colors.black,
    mode: 'modal',
    headerLeft:<HeaderDown navigation={navigation}/>,
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
      let isMultiSelect= true;
      //let isMultiSelect = (type === "multiselect") ? true : false;
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
    let { selected = {} } = this.props;
    let { name, key, count } = item
    let selectorClr = '#ededed'
    let txtcolor = '#333';
    let fontWeight ="normal";
    let isSelected = !!selected[item.key]; // renderItem depends on state
    if (isSelected) {
      selectorClr = '#6bbebe';
      txtcolor = '#333';
      fontWeight="bold"
    }
    return (
      <TouchableOpacity activeOpacity ={1} style={styles.title2Container} onPress={() => this.selectItem(item)}>
        {<Text style={[styles.list2title, { color: txtcolor, fontWeight:fontWeight }]}>{key}</Text>}
        {<View style={[styles.list2Selector, { borderColor: selectorClr, backgroundColor: selectorClr }]}></View>}
      </TouchableOpacity>
    );
  }

  render() {
    let { searchText, searchResult } = this.state;
    let data = (!searchText) ? this.props.data.data : searchResult;
    return (
      <View style={styles.list2Container}>
        <View style={styles.searchBar}>
          <SearchBar onChangeText={this.searchFilter.bind(this)} onCancel={() => { this.setState({ searchText: '', searchResult: null }) }} />
        </View>
        <FlatList
          style={styles.list2}
          data={data}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          selected={this.state.selected}
          ItemSeparatorComponent={() => <View style={{ height: 0.5, width: "100%", backgroundColor: "#CED0CE", }} />}
          keyExtractor={(item, index) => {return `subCategories-${item.key}-${index}`}}
          renderItem={this.renderItem.bind(this)} />
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
    paddingLeft: 10,
    width: list2Width - 22,
    marginBottom: 5,
    marginTop: 10
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
    facets: state.searchReducer.searchFacets
  }
}

function mapDispatchToProps(dispatch) {
  return {
    //getFilters: (filters) => dispatch(getFilters(filters)),
    //changeCategory:()=>dispatch(FilterActions.changeCategory(filters))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AlgoliaFilter)




