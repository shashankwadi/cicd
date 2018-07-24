import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    TextInput,
    View,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    TabBarIOS,
    Image,
    Text,
    LayoutAnimation,
    FlatList,
    NativeModules,
    Platform, Linking
} from 'react-native';
import { connect } from 'react-redux';
// import { getProduct, productReceived } from 'Wadi/src/actions/actions';
import { fetchSearchResultStart } from 'Wadi/src/actions/searchAction';
import { fetchAutocompleteResultStart } from 'Wadi/src/actions/searchAction';
import { deepLinkActions } from 'Wadi/src/actions/globalActions';

import { dimensions } from 'utilities/utilities';
import SearchBar from 'Wadi/src/components/views/searchBar'
import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import { strings } from 'utilities/uiString';
import GridProductAlgolia from '../../views/gridProductAlgolia';
import Loader from 'Wadi/src/components/common/loader';
const dataBridge = NativeModules.WDIDataBridge;
//common
import { VectorIcon } from '../../common';
import * as CONFIG from "../../../utilities/namespaces/config";

var pageNumber = 1;
var receivedPage = 0;
var thisRef;
let CURRENT_SCREEN = Constants.screens.Search;

var CustomLayoutAnimation = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.linear,
  },
};

export class SearchPage extends Component {

  constructor(props) {
    super(props);
    thisRef = this;
    this.state = {
      selectedTab: 'redTab',
      isFetching: true,
      algoliaResponseList: {},
      algoliaResponsFacets: {},
      selectedFilters: {},
      sectionVisible: true,
      searchText: ""
    };
    
  }
  componentDidMount() {
    //console.log('search didMount'- Date());
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.searchState.errorInFetch == true) {

      // this.props.navigation.navigate(Constants.screens.ErrorView,{retryRequest:this.retryRequest.bind(this)});
      return false;
    } else {

      return true;
    }
  }
  componentWillUnmount()   {
    this.onSearchCancel();
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let dataSource = ds.cloneWithRows(this.props.searchState.searchResult);
    let autoCompleteSource = ds.cloneWithRows(this.props.searchState.searchAutocompleteResult)
    let marginBottomTop = (this.state.sectionVisible == true) ? dimensions.height : dimensions.height - 180;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SearchBar
          placeholder ={strings.What_are_you_searching_for}
          placeholderTextColor={GLOBAL.COLORS.lightGreyColor}
          backgroundColor={GLOBAL.COLORS.wadiDarkGreen}
          onSearch={this.searchPressed.bind(this)}
          onChangeText={this.searchProduct.bind(this)}
          onCancel={this.onSearchCancel.bind(this)}
          inputStyle={{fontFamily: GLOBAL.FONTS.default_font, fontSize: 15, color:GLOBAL.COLORS.black }}
          serachIconVisible={false}
        />
          {!GLOBAL.CONFIG.isGrocery && !this.state.searchText ? this.renderSuggestions() :
          <View style={{ flex:1 }}>
            {this.props.isFetching && <Loader containerStyle={{flex:1}} />}
            {!this.props.isFetching && 
            <View>
            <ListView
              contentContainerStyle={styles.autocompleteList}
              dataSource={autoCompleteSource}
              enableEmptySections={true}
              removeClippedSubviews={false}
              renderRow={this.renderAutocompleteSuggestions.bind(this)}
              renderSeparator={this.renderSeparatorForAutocomplete.bind(this)}
              scrollsToTop={true}
              keyboardDismissMode={'on-drag'}
            />
            {true ? <View></View> : <ListView
              contentContainerStyle={styles.list}
              dataSource={dataSource}
              enableEmptySections={true}
              removeClippedSubviews={false}
              renderRow={this.renderRow.bind(this)}
              scrollsToTop={true}
              keyboardDismissMode={'on-drag'}
            /*onChangeVisibleRows={(visibleRows, changedRows) => {
                  var newState = true;
                  if (changedRows["2"]) {
                    newState = true;
                  } else {
                    newState = false;
                  }
                  if (this.state.sectionVisible != newState) {
                    LayoutAnimation.configureNext(CustomLayoutAnimation);
                    this.setState({
                      sectionVisible: newState
                    })
                  }
                }}*/
            />}
            </View>}
          </View>}
        {/* !!this.state.searchText && 
        <View style={[styles.filterButtonContainer, {marginTop: marginBottomTop, }]}>
          <TouchableOpacity activeOpacity ={1} style={styles.filterButton} activeOpacity={0.8} onPress={this.filterPressed.bind(this)}>
            <VectorIcon groupName={"FontAwesome"} name={"filter"} size={24} style={{ color: '#FFF' }} />
          </TouchableOpacity>
       </View>*/}
      </View>
    )
  }


  renderRow(rowData) {
    return (
      <GridProductAlgolia data={rowData} callBack={() => this.widgetClicked(rowData)} />
    )
  }

  renderAutocompleteSuggestions(rowData) {
      let colorValue = CONFIG.isGrocery ? GLOBAL.COLORS.black : GLOBAL.COLORS.wadiDarkGreen;

    return (
      <TouchableOpacity activeOpacity={1} style={styles.suggestionsRow} onPress={() => this.searchPressed(rowData)}>
        <Text style={[styles.autocompleteSuggestions, {color:colorValue}]}>{rowData}</Text>
      </TouchableOpacity>
    );
  }

  renderSeparatorForAutocomplete() {

    return (
        <View style={{ height: 1, backgroundColor:'#ededed', flex: 1 }}></View>
    )
  }

  renderSuggestions = () => {
      let colorValue = CONFIG.isGrocery ? GLOBAL.COLORS.black : GLOBAL.COLORS.wadiDarkGreen;

    let suggestions = GLOBAL.CONFIG.isGrocery ? [
        "Ariel",
        "Shampoo",
        "Tide",
        "Soap",
        "Detergent",
        "Conditioner",
        "Gillette",
        "Cleaning",
        "Pantene"
    ] : ((this.props.featureMapObj && this.props.featureMapObj.searchSuggestions && this.props.featureMapObj.searchSuggestions.length > 0) ? this.props.featureMapObj.searchSuggestions : []);
    return (
      <View style={styles.suggestionsContainer}>
        <FlatList
          key={`searchSuggestions`}
          data={suggestions}
          showsHorizontalScrollIndicator={false}
          //ItemSeparatorComponent={() => <View style={{ height: 0.5, width: "100%", backgroundColor: "#CED0CE", }} />}
          keyExtractor={(item, index) => { return `searchSuggestions-${item}-${index}` }}
          renderItem={this.suggestionsRow.bind(this)}
        />
      </View>
    );
  }

  suggestionsRow = ({ item, index }) => {
      let colorValue = CONFIG.isGrocery ? GLOBAL.COLORS.black : GLOBAL.COLORS.wadiDarkGreen;

    return (
      <TouchableOpacity activeOpacity={1} style={styles.suggestionsRow} onPress={() => this.searchPressed(item)}>
        <Text style={[styles.suggestions, {color:colorValue}]}>{item}</Text>
      </TouchableOpacity>
    );
  }

  widgetClicked = (data) => {
    this.props.deepLinkActions({
      url: `/product/${data.sku}`,
      navigator: this.props.navigator,
      currentScreen: CURRENT_SCREEN,
      params: {
        extendedUrl: 'product/' + data.sku,
        trackingObj: data
      }
    });
  }
  onSearchCancel = () => {
    this.setState({
      searchText: ""
    });
  }

  searchProduct = (searchText) => {
    //filters: '(brand:adidas OR brand:puma) AND offerPrice:699 AND attributes.color_family:black'
    //facets: ['*']
    this.setState({
      searchText: searchText
    });
    if((searchText === "*shashankwadi*") && (Platform.OS === 'ios')){
        dataBridge.getString("pushToken").then(value => {
            Linking.openURL('mailto:shashank.sharma@wadi.com?subject=pushToken&body='+"" +
                "Token "+ value + " ");
        }).catch(error =>{
            //console.warn('error', error)
        })
    }
    else if (searchText.length > 2) {
      //this.props.fetchSearchResult(searchText)
      this.props.fetchAutocompleteResult(searchText)
    }
  }

  searchPressed(searchText) {
    this.props.deepLinkActions({
      navigator: this.props.navigator,
      currentScreen: CURRENT_SCREEN,
      toScreen:Constants.screens.ProductList,
      params: { searchString: searchText,screenName: searchText}
    });
  }

  filterPressed = () => {
    this.props.deepLinkActions({
      //url:`/product/${data.sku}`, 
      toScreen: Constants.screens.SearchFilters,
      navigator: this.props.navigator,
      currentScreen: CURRENT_SCREEN,
    });
  }


}

const styles = StyleSheet.create({
  list: {
    width: dimensions.width,
  },
  autocompleteList: {
    width: dimensions.width,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  container: {
    width: dimensions.width / 2,
    padding: 12,
    flexDirection: 'column',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderWidth: 0.3,
    borderColor: '#bbbbbb'
  },
  applyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    height: 150,
    marginBottom: 0
  },
  text: {
    flex: 1,
    fontSize: 16
  },

  applyButton: {
    textAlign: 'center',
    backgroundColor: 'green',
    flex: 1,
    fontSize: 16,
    padding: 0
  },
  actualPrice: {
    flex: 1,
    color: 'red'
  },
  filterButtonContainer: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    position: 'absolute',
    //marginLeft: 50, 
    width: 50,
    height: 50,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterButton: {
    //flex: 0.5, 
    //marginRight: 15, 
    //flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center'
  },

  suggestionsContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  suggestionsRow: {
    padding: 12,
    justifyContent: 'center'
  },
  trendingHeading: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 20,
    color: GLOBAL.COLORS.headerTitleColor,
    fontFamily: GLOBAL.FONTS.default_font_bold
  },
  suggestions: {
    textAlign: 'center',
      color: GLOBAL.COLORS.darkGreyColor,
    fontSize: 14,
    fontFamily: GLOBAL.FONTS.default_font
  },
  autocompleteSuggestions: {
    textAlign: 'left',
    fontSize: 14,
    fontFamily: GLOBAL.FONTS.default_font_bold
  }
});


function mapStateToProps(state) {
  return {
    searchState: state.searchReducer,
    featureMapObj: state.featureMapAPIReducer.featureMapObj,
    isFetching: state.searchReducer.isFetching
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearchResult: (searchText) => dispatch(fetchSearchResultStart(searchText)),
    fetchAutocompleteResult: (searchText) => dispatch(fetchAutocompleteResultStart(searchText)),
    deepLinkActions: (params) => dispatch(deepLinkActions(params)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)
