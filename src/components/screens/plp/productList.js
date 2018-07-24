'use strict';

import React, {PureComponent} from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Image,
    LayoutAnimation,
    ListView,
    Platform,
    RefreshControl,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';

import * as GLOBAL from 'Wadi/src/utilities/constants';

import {dimensions} from 'utilities/utilities';
import * as Constants from 'Wadi/src/components/constants/constants';
// Basic PLP
import {
    filterApplied,
    formatPLPData,
    getFinalUrl,
    getProduct,
    productReceived,
    quantitySelected,
    sizeSelected,
    sortSelected,
} from 'Wadi/src/actions/plpActions';
//removed in favour of sagas
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {addToCart} from 'Wadi/src/actions/cartActions';
import PLPSortView, {sortIcons} from '../../views/plp/plpSort';

import {EmptyView, Loader} from '../../common';
//Flash Sale PLP
import FlashSaleProduct from 'Wadi/src/components/views/flashSaleProduct';
import FlashBanner from 'Wadi/src/components/views/flashBanner';
import ListItem from './ListItem'
//styles
import styles, {NAVBAR_HEIGHT, STATUS_BAR_HEIGHT} from './styles';
import ExpressWidget from '../../widgets/expressWidget';
import FilterIcon from '../../../icons/FilterIcons/filter.png'
import SortIcon from '../../../icons/SortIcons/new/new.png'
import images from 'assets/images';

const AnimatedListView = Animated.createAnimatedComponent(ListView);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

var pageNumber = 1;
var sortKey = "";
let isGrocery = GLOBAL.CONFIG.isGrocery;

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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

export class ProductList extends PureComponent {


/***
 * This function renders the top header of plp
 *
 ***/
    renderFilterRow = () => {
        var switchIcon;
        switch(this.state.selectedLayout){ //change plp widget switch icon based on currently selected icon
            case 1:{
                switchIcon = images.gridSwitchCell;
                break;
            }
            case 2:{
                switchIcon = images.listSwitchCell;
                break;
            }
            default:{
                switchIcon = images.singleSwitchCell;
                break;
            }

        }
        return (
            <View style={styles.topFilterParentContainer}>
                <View style={styles.topFilterSubContainer}>
                    <View style={{flexDirection: 'row'}}>

                        <TouchableOpacity style={styles.topFilterContainer} activeOpacity={1.0}
                                          onPress={this.filterPressed}>
                            <Image source={FilterIcon} style={styles.filterIconStyle}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topFilterContainer} activeOpacity={1.0}
                                          onPress={this.sortViewPressed}>
                            <Image source={SortIcon} style={{marginRight: 5}}/>
                        </TouchableOpacity>
                    </View>

                    {!isGrocery && <View style={styles.expressWidgetContainer}>
                        <ExpressWidget/>
                        <Switch
                            onValueChange={() => this.applyWadiExpress()}
                            value={this.state.wadiExpressEnabled}
                            onTintColor={GLOBAL.COLORS.wadiDarkGreen}
                            style={{transform: Platform.OS == 'ios' ? [{scaleX: .8}, {scaleY: .8}] : [{scaleX: 1}, {scaleY: 1}]}}/>
                    </View>}
                    {!isGrocery ?
                        <TouchableOpacity activeOpacity={1} onPress={this.layoutChanges}>
                            <Image style={styles.plpViewTypeIcon}

                                   resizeMode='contain'
                                   source={switchIcon}/>
                        </TouchableOpacity> :
                        <View/>
                    }

                </View>
            </View>);
    }

    componentDidMount() {
        if (this.props.isFlashSalePLP) {

        } else {
            this.getProducts({ page: 1, isOnStart: true, search: null });
        }
    }

    topRightButtonTapped() {
        this.props.deepLinkActions({ toScreen: Constants.screens.ProductList, navigator: this.props.navigator, currentScreen: Constants.screens.ProductList, params: { isFlashSalePLP: true, widgetData: this.props.widgetData }});
    }

    /***
     *Returns flash sale product list
     */
    renderView() {
        var dataSource;
        var background;
        var bannerData;
        if (this.props.widgetData) {
            var flashWidgetDatasource = [];
            let flashPLPDatasource = this.props.widgetData.data;
            var dataLength = (flashPLPDatasource.length < 4) ? flashPLPDatasource.length : 4;
            for (var index = 0; index < dataLength; index++) {
                var element = flashPLPDatasource[index];
                flashWidgetDatasource.push(element)
            }
            dataSource = flashWidgetDatasource;
            bannerData = this.props.widgetData.bannerData;
            background = (this.props.widgetData.style.backgroundColor) ? this.props.widgetData.style.backgroundColor : GLOBAL.COLORS.flashSaleDefaultBackground;
        } else if (this.props.widgetData) {
            bannerData = this.props.widgetData.bannerData;
            dataSource = this.props.widgetData.data
            background = (this.props.widgetData.style.backgroundColor) ? this.props.widgetData.style.backgroundColor : GLOBAL.COLORS.flashSaleDefaultBackground;
        }
        return (
            <View style={{ backgroundColor: background }}>
                <FlashBanner topRightButtonTapped={this.topRightButtonTapped.bind(this)} navigation={this.props.navigator} data={bannerData} style={styles.flashBanner} />
                <FlatList
                    contentContainerStyle={{ backgroundColor: 'transparent', paddingBottom: 5 }}
                    data={dataSource}
                    removeClippedSubviews={false}
                    renderItem={this.renderFlashSaleRow.bind(this)}
                    keyExtractor={(item, index) => { return `${item.sku}-${index}` }}
                    bounces={false}
                    enableEmptySections={true}
                />
            </View>
        )
    }

    /**
     *Returns flash sale view for the particular item in the list
     */
    renderFlashSaleRow({ item, index }) {
        return (
            <FlashSaleProduct data={item} />
        )
    }

    /***
     * returns plp list view
     *
     */
    renderFlatList = (data) => {
        return (
            <AnimatedFlatList
                key={`plpFlatList-${this.state.selectedLayout}`}
                contentContainerStyle={{ /*paddingTop: NAVBAR_HEIGHT + 80*/ }}
                data={data}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                scrollsToTop={true}
                numColumns={this.state.selectedLayout == 1 ? 2 : 1}
                scrollEventThrottle={10}
                windowSize={6}
                maxToRenderPerBatch={3}
                initialNumToRender={6}
                onEndReachedThreshold={2}
                ListFooterComponent={this.renderFooter.bind(this)}
                renderItem={({ item, index }) => <ListItem
                    rowData={item}
                    selectedLayout={this.state.selectedLayout}
                    widgetClicked={this.widgetClicked}
                    index={index}
                />}
                keyExtractor={(item, index) => { return `plpLayout-${this.state.selectedLayout}-${item.sku}-${index}` }}
                onEndReached={this.scrollReachedEnd.bind(this)}
                viewabilityConfig={this.viewabilityConfig}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                    { useNativeDriver: true },
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                } />
        );
    }

    /***
     * returns plp list view
     *
     */
    renderListView = (data) => {
        let dataSource = ds.cloneWithRows(data);
        return (
            <AnimatedListView
                key={`plpListView-${this.state.selectedLayout}`}
                contentContainerStyle={[styles.list, { /*paddingTop: NAVBAR_HEIGHT + 80 */}]}

                dataSource={dataSource}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                scrollsToTop={true}
                scrollEventThrottle={10}
                ListFooterComponent={this.renderFooter.bind(this)}
                renderRow={(rowData, sectionID, rowID) => <ListItem
                    rowData={rowData}
                    selectedLayout={this.state.selectedLayout}
                    widgetClicked={this.widgetClicked}
                    index={rowID}
                />}
                onEndReached={this.scrollReachedEnd.bind(this)}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                    { useNativeDriver: true },
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                } />
        );
    }

    /***
     *Returns plp list view
     */
    renderDifferentViews = () => {

        if (this.props.isFlashSalePLP) {
            return (
                <View>
                    {this.renderView()}
                </View>
            )
        }
        let dataSource = this.state.dataSource;

        let dataCount = this.state.count;
        if (this.state.isLoading) {
            return <Loader containerStyle={{ flex: 1, backgroundColor: GLOBAL.COLORS.screenBackgroundGray }} />
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {(dataCount > 0) ? <View>{this.state.isFlatList ? this.renderFlatList(dataSource) : this.renderListView(dataSource)}</View>
                    : ((this.props.productList.isFetching) ? <Loader containerStyle={{ flex: 1, backgroundColor: GLOBAL.COLORS.screenBackgroundGray }} /> : <EmptyView />)}

                <PLPSortView visible={this.state.sortViewVisible} sortSelected={this.sortSelected} sortClosed={() => this.setState({ sortViewVisible: false })} selected={this.state.selectedSort} sortData={(this.props.config && this.props.config.content && this.props.config.content.sort) ? this.props.config.content.sort : []} />


            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderFilterRow()}
                {this.renderDifferentViews()}
            </View>
        );
    }


    /**
     *
     * @param {*} page is the current number of pages for pagination
     * by default I am showing all-products plp,
     * plp is either for search strings or urls;
     */
    getProducts({ page = 1, isOnStart = false, search }) {

        let { filterString, selectedSort, finalUrl } = this.state;
        let { searchString, extendedUrl } = this.props;
        let url = "";
        if (isOnStart) {
            url = (searchString) ? `catalog?&q=${searchString}` : (extendedUrl || "");
        } else {
            url = getFinalUrl(search);
            url = (url !=="")?url:extendedUrl;
        }
        sortKey = Object.keys(selectedSort)[0];
        let sortObj = (this.props.config && this.props.config.content && this.props.config.content.sort && this.props.config.content.sort.length > 0) ? this.props.config.content.sort.filter((item) => item.name === sortKey)[0] : null;
        if (sortObj) {
            sortKey = `${sortObj.value.by}&dir=${sortObj.value.dir}`;
        }

        this.props.getProduct({
            url: url,
            pageNumber: page,
            alreadyProduct: this.props.productList.dataSource,
            sortKey: sortKey,
            filters: filterString,
            searchString: searchString,
            isExpress: this.state.wadiExpressEnabled ? this.state.wadiExpressEnabled : null
        })
            .then(response => {
                let responseData = response.data;
                this.setState((prevState) => {
                    let dataSource = formatPLPData(responseData, prevState.dataSource, pageNumber);
                    return {
                        isLoading: false,
                        dataSource: dataSource,
                        count: dataSource.length,
                        totalCount: responseData.totalCount,
                    }
                })
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                });
            });

    }

    /***
     *pull to refresh function which fetches the updated product list
     */
    _onRefresh = () => {
        if (this.props.productList.isFetching == false) {
            this.setState({
                isLoading: true
            });
            pageNumber = pageNumber + 1;
            this.getProducts({ page: pageNumber, search: this.props.productList.search });
        }
    }

    /**
     * Fetches more items on reaching the end of the list
     */
    scrollReachedEnd() {
        if (this.props.productList.isFetching == false && this.state.count < this.state.totalCount) {
            pageNumber = pageNumber + 1;
            this.getProducts({ page: pageNumber, search: this.props.productList.search });
        }
    }

    /***
     * Save the category to sort by in redux and fetches the products based on the sort selected
     * @param item - sort by category
     */
    sortSelected = (item) => {
        pageNumber = 1;
        //updating sort states
        this.setState((prevState) => ({
            selectedSort: {
                [item.name]: true,
            },
            sortViewVisible: false,
            sortIcon: (item.icon) ? item.icon : sortIcons[item.name]["icon"]
        }), () => {
            this.props.sortSelected({ sortkey: item.name });
            this.getProducts({ page: pageNumber, search: this.props.productList.search });
        });
    }

    /***
     * Changes the layout of list item
     *
     */
    layoutChanges = () => {
        LayoutAnimation.configureNext(CustomLayoutAnimation);
        if (this.state.selectedLayout == 1) {
            this.setState({ selectedLayout: 2 })
        } else if (this.state.selectedLayout == 2) {
            this.setState({ selectedLayout: 3 })
        } else {
            this.setState({ selectedLayout: 1 })
        }
    }

    /***
     * Makes sort view visible
     */
    sortViewPressed() {

        LayoutAnimation.configureNext(CustomLayoutAnimation);

        this.setState({ sortViewVisible: true })

    }

    /**
     * Applies the selected filter
     * @param filters -- selected filters
     */
    applyFilter(filters) {
        pageNumber = 1;
        this.getProducts({ page: pageNumber, search: filters });

    }

    /**
     * Opens the filter view
     */
    filterPressed() {
        let { searchString, extendedUrl } = this.props;
        let url = (searchString) ? `/catalog?&q=${searchString}` : (extendedUrl || "");

        this.props.deepLinkActions({ toScreen: Constants.screens.Filter, navigator: this.props.navigator, currentScreen: Constants.screens.ProductList, params: { callBack: (filters) => this.applyFilter(filters), extendedUrl: url } });

    }


    /**
     * Opens product detail page of the selected item
     * @param data -- selected item on plp screen
     */
    widgetClicked(data) {
        //check on url type right here
        this.props.deepLinkActions({ url: `/product/${data.sku}`, navigator: this.props.navigator, currentScreen: Constants.screens.ProductList, params: { extendedUrl: 'product/' + data.sku, trackingObj: data, screenName : data.name, data:data } });
    }


    /***
     *Returns loader view
     */
    renderFooter = () => {
        return (
            <View style={styles.loaderContainer}>
                {(!!this.props.productList.isFetching) ?
                    <ActivityIndicator
                        animating={true}
                        style={[styles.centering, { height: 80 }]}
                        size="large"
                    /> : null}
            </View>
        )
    }

    /**
     * Apply wadi express on the current list of products
     */
    applyWadiExpress() {
        this.setState((prevState) => ({
            wadiExpressEnabled: !prevState.wadiExpressEnabled,
            isLoading: true
        }), () => {
            this.getProducts({ page: pageNumber, search: this.props.productList.search })
        });
    }

    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);
        this.state = {
            isFlatList: true,
            selectedLayout: isGrocery ? 2 : 1,
            sectionVisible: true,
            sortViewVisible: false,
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
            selectedSort: {Popularity: true},
            sortIcon: images.popularityIcon,
            filterString: '',
            finalUrl: '',
            selectedFilters: null,
            isLoading: true,
            dataSource: [],
            count: 0,
            totalCount: 0,
        };
        this.viewabilityConfig = {
            //doc - https://github.com/facebook/react-native/blob/master/Libraries/Lists/ViewabilityHelper.js
            minimumViewTime: 5000,
            itemVisiblePercentThreshold: 100,
            waitForInteraction: true,
            wadiExpressEnabled: false
        }
        this.filterPressed = this.filterPressed.bind(this);
        this.sortViewPressed = this.sortViewPressed.bind(this);
        this.topRightButtonTapped = this.topRightButtonTapped.bind(this)
        this.getProducts = this.getProducts.bind(this);
        this.widgetClicked = this.widgetClicked.bind(this);
        this._onRefresh = this._onRefresh.bind(this)
    }
}

function mapStateToProps(state) {
    return {
        productList: state.productList,
        config: state.configAPIReducer.configObj,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProduct: (params) => dispatch(getProduct(params)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
        sortSelected: (params) => dispatch(sortSelected(params)),
        filterApplied: (params) => dispatch(filterApplied(params)),
        sizeSelected: (params) => dispatch(sizeSelected(params)),
        quantitySelected: (params) => dispatch(quantitySelected(params)),
        addProductToCart: (params) => dispatch(addToCart(params)), // params is {sku, product, tracking} 1st 2 keys are compulsory
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)


