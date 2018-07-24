import React, {PureComponent} from 'react';
import {Animated, FlatList, I18nManager, Linking, ListView, Platform, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {EmptyView, Loader} from '../../common';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {clearCurrentData, getHomeWidget} from 'Wadi/src/actions/homePageActions';
import {addToCart} from 'Wadi/src/actions/cartActions';
import {selectors} from 'Wadi/src/reducers/reducers';
import {dimensions, isIos, isIphoneX} from 'utilities/utilities';
import WidgetComponent from './WidgetComponent';
import AnimatedHeader from './AnimatedHeader';

import * as Constants from 'Wadi/src/components/constants/constants';
import {screens} from 'Wadi/src/components/constants/constants';
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {WidgetActions} from 'Wadi/src/actions/trackingActionTypes';
import TrackingEnum from 'Wadi/src/tracking/trackingEnum';
import {strings} from 'utilities/uiString';

import deeplinkHandler, {setCurrentScreen} from 'Wadi/src/utilities/managers/deeplinkHandler';
import {customHeaderStyle} from "../../navigators/tabbedApp";
import {Navigation} from "react-native-navigation";

const IPHONE_X_PADDING_TOP = (isIphoneX) ? 15 : 0;
const NAVBAR_HEIGHT = GLOBAL.CONFIG.isGrocery?150:100+IPHONE_X_PADDING_TOP;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});
const AnimatedListView = Animated.createAnimatedComponent(ListView);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const CURRENT_SCREEN = screens.Home;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class HomePage extends PureComponent {
    static navigatorStyle = {
        tabBarHidden: false,
    };

    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

            this.props.navigator.setStyle({
                navBarHidden: true
            });

        this.state = {
            isLoading: true,
            extendedUrl: GLOBAL.API_URL.Wadi_Home,
            city: '',
            data: null,
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
            list_padding_top: NAVBAR_HEIGHT
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.headerCategoryPressed = this.headerCategoryPressed.bind(this);
        this.renderLisItem = this.renderLisItem.bind(this);
    }

    menuPressed =()=>{
        this.props.navigator.switchToTab({
            tabIndex: I18nManager.isRTL ? 4 : 0
        });
    };

    cartPressed =()=>{
        this.props.navigator.switchToTab({
            tabIndex: I18nManager.isRTL ? 1 : 3
        });
    };


    viewAllTapped = (dataWidget) => {
        if (!!dataWidget.viewAllfetchUrl) {
            let params = {screenName: dataWidget.screenName};
            this.props.deepLinkActions({
                tracking: dataWidget,
                url: dataWidget.viewAllfetchUrl,
                navigator: this.props.navigator,
                currentScreen: CURRENT_SCREEN,
                params: params
            });
        }
    };

    elementTap = (data, actionType) => {
        if(data){
            if(data.url ==="/") return true;
            if (!!data.url || !!data.action) {
                let params = {screenName: data.name ? data.name : data.title ? data.title : data.screenName ? data.screenName : data.alttitle ? data.alttitle : null};
                let trackingObj = {
                    ...data,
                    logType: TrackingEnum.TrackingType.ALL,
                    eventType: WidgetActions[actionType]
                };
                this.props.deepLinkActions({
                    tracking: trackingObj,
                    url: data.action || data.url,
                    navigator: this.props.navigator,
                    currentScreen: CURRENT_SCREEN,
                    params: {...params, data:data}
                });
            }
        }
    };

    searchPressed() {
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: screens.Home,
            toScreen: screens.Search
        });

    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.renderWidgetList()}
                <AnimatedHeader
                    scrollY = {this.state.scrollAnim}
                    subLocality={this.props.accounts.subLocality? this.props.accounts.subLocality.toUpperCase() : (this.props.accounts.selectedCityGrocery) ? this.props.accounts.selectedCityGrocery.toUpperCase() : ''}
                    cartPressed ={this.cartPressed}
                    menuPressed ={this.menuPressed}
                    searchPressed={this.searchPressed.bind(this)}
                    openLocationModal={this.openLocationModal}/>
            </View>
        )
    }


    headerCategoryPressed(rowData){
        deeplinkHandler(this.props.navigator, rowData.smallImageUrl, null, null, null, false);
    }

    componentDidMount() {
        let {extendedUrl} = this.props;
        extendedUrl = (extendedUrl) ? extendedUrl : GLOBAL.API_URL.Wadi_Home;
        this.setState({
            extendedUrl: extendedUrl
        });
        this.props.getHomeWidget({extendedUrl: extendedUrl})
            .then(response => {
                if (response && response.status === 200) {
                    this.setState({
                        isLoading: false,
                        data:response.data,
                    })
                }
            })
            .catch(error => {
                this.setState({isLoading: false});
            });
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.homePage.errorInFetch == true) {
            return false;
        } else {

            return true;
        }
    }

    componentWillUnmount() {
        // if (this.state.extendedUrl) {
        //     this.props.clearCurrentData(this.state.extendedUrl);
        // }
    }

    retryRequest() {
        this.props.getHomeWidget();
    }
    renderLisItem = ({item, index})=>{
        return(
            <WidgetComponent
                item={item}
                index={index}
                elementTap={this.elementTap}
                viewAllTapped={this.viewAllTapped}/>
        );
    };
    handleMapEvent = (latitude, longitude, userLocation, city, subLocality) => {
        this.setState({
            latitude: latitude,
            longitude: longitude,
            userLocation: userLocation,
            city: city,
            subLocality: subLocality
        }, () => {
        });
    };
    renderFlatList = (widgetList) => {
        
        return (
            <AnimatedFlatList
                //legacyImplementation={true}
                key={`homeFlatListLayout`}
                //removeClippedSubviews={false}
                data={widgetList}
                style={[styles.listview]}
                renderItem={this.renderLisItem}
                scrollEventThrottle={16}
                scrollsToTop={true}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => {
                    return `homePage-${item.uid}-${item.widgetId}`
                }}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
                    {
                        useNativeDriver: true,
                    }
                )}
                shouldItemUpdate={(prev, next) => {
                    return prev.item !== next.item
                }}
                initialNumToRender={10}
            />
        );
    };
    homeDidAppear = () => {
        if (isIos()) {
            Linking.getInitialURL()
                .then((url) => {
                    if (url && !this.props.firtsLaunch.initial) {
                        this.handleOpenURL({url});
                    }
                })
                .catch(err => {
                });
        } else if (this.props.firtsLaunch && this.props.firtsLaunch.url) {
            setTimeout(() => {
                this.handleOpenURL({url: this.props.firtsLaunch.url});
            }, 100);
        }
    };


    _handleScroll = (event) => {
        // const currentOffset = event.nativeEvent.contentOffset.y;
        // const dif = currentOffset - (this.offset || 0);
        // if (Math.abs(dif) < 3) {
        //     //   console.log('unclear');
        //     // if(!isIos()){
        //     //     this.setState({list_padding_top: NAVBAR_HEIGHT});
        //     // }
        // } else if (dif < 0) {
        //     this.setState({list_padding_top: NAVBAR_HEIGHT});
        // } else {
        //     this.setState({list_padding_top: 0});
        // }
    };
    openLocationModal=()=> {

        Navigation.showModal({
            screen: Constants.screens.GooglePlaces, // unique ID registered with Navigation.registerScreen
            title: 'Enter your location', // title of the screen as appears in the nav bar (optional)
            animationType: 'slide-up',
            backButtonHidden: true,
            navigatorButtons: {
                rightButtons: [
                    {
                        component: 'MapsBackButton',
                        id: 'closeButton'
                    }

                ]
            },
            navigatorStyle: {navBarTextColor: '#FFFFFF', navBarHeight: 1, navBarHidden: true},
            passProps: {
                callback: (latitude, longitude, userLocation, city, subLocality) => this.handleMapEvent(latitude, longitude, userLocation, city, subLocality),
            },
            transparent: false,
            overrideBackPress: true
        });
    };

    /**
     *Renders either loader when loading data from api or home page which constitutes of many widgets
     */
    renderWidgetList() {

        if (this.state.isLoading) {
            return (
                <Loader containerStyle={{flex: 1}}/>
            );
        } else {
            //let widgetList = selectors.getItemOnUrl(this.props.homePage, this.state.extendedUrl);
            let {data: widgetList} = this.state;
            if (widgetList && widgetList.length > 0) {
                let navbarTranslate = this.state.scrollAnim.interpolate({
                    inputRange: [0, 150],
                    outputRange: [NAVBAR_HEIGHT, 0],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View style={[styles.container, {transform: [{translateY: navbarTranslate}]}]}>
                        {this.renderFlatList(widgetList)}
                    </Animated.View>
                );
            } else {
                return (<EmptyView/>);
            }
        }
    }
    onNavigatorEvent(event) {
        // handle a deep link
        let {navigator,} = this.props;
        if (event.type === 'DeepLink') {
            const parts = event.link.split('/'); // Link parts

            if (parts[0] == 'pushDeepLink') {
                const {Screen, title, passProps, titleImage} = event.payload; // (optional) The payload
                switch (Screen) {
                    case screens.Cart:
                        navigator.switchToTab({
                            tabIndex:  I18nManager.isRTL ? 1 : 3
                        });
                        break;
                    case screens.Category:
                        navigator.switchToTab({
                            tabIndex: I18nManager.isRTL ? 4 : 0
                        });
                        break;
                    case screens.Account:
                        navigator.switchToTab({
                            tabIndex: I18nManager.isRTL ? 0 : 4
                        });
                        break;
                    default:
                        navigator.switchToTab({
                            tabIndex: I18nManager.isRTL ? 3 : 1
                        });
                        this.props.navigator.push({
                            screen: Screen,
                            passProps: passProps,
                            titleImage: titleImage,
                            navigatorStyle: customHeaderStyle(title),
                        });
                        break;
                }
            } else if (parts[0] == 'switchTabToCart') {
                this.props.navigator.switchToTab({
                    tabIndex: I18nManager.isRTL ? 1 : 3
                });
                this.props.navigator.pop();
            } else if (parts[0] == 'home') {
                const {Screen, title, passProps, titleImage} = event.payload; // (optional) The payload
                this.props.navigator.push({
                    screen: Screen,
                    passProps: passProps,
                    titleImage: titleImage,
                    navigatorStyle: customHeaderStyle(title)
                });
            }
        } else {
            switch (event.id) {
                case 'willAppear':
                    break;
                case 'didAppear':
                    this.homeDidAppear();
                    break;
                case 'willDisappear':
                    break;
                case 'didDisappear':
                    break;
                case 'willCommitPreview':
                    break;
            }
        }
    }

    handleOpenURL = (event) => {
        deeplinkHandler(this.props.navigator, event.url, null, null, null, true);
        this.props.firtsTimeLaunch();
    }
}

const styles = StyleSheet.create({
    cartButtonContainer: {
        flex: 0.2,
        justifyContent: 'center',
    },
    cartButtonImage: {
        position: 'absolute',
        right: 15
    },
    categoryHeaderButton: {
        flex: 0.2,
        justifyContent: 'center'
    },
    homeHeaderContainer: {
        paddingTop: 20,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        height: 130,
        width: dimensions.width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        height: 30,
        width: 160,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    categoryImage: {
        marginLeft: 10
    },
    locationText: {
      alignItems: 'center',
        paddingTop: 2,
        fontSize: 12,
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'white'
    },
    container: {
        backgroundColor: 'white',
    },
    listview: {
        backgroundColor: 'white',
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    navbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        height: NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingTop: STATUS_BAR_HEIGHT,
    },
    searchContainer:{
        height: 40,
        opacity: 1,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,
    },
    searchTextStyle: {
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'grey',
        fontSize: 13,
        marginRight: -10
    },
    searchViewStyle: {
        width: dimensions.width - 10,
        height: 30,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        borderColor: '#444',
        backgroundColor: 'white',//'#DBF3F3',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSearch: {
        height: 14,
        width: 14,
    },
    innerSearchBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20
    }
});


function mapStateToProps(state) {
    return {
        homePage: state.homePageReducers,
        firtsLaunch: state.firtsLaunch,
        accounts: state.accounts
    }

}

function mapDispatchToProps(dispatch) {
    return {
        saveInitialUrl: (url) => dispatch({type: 'SAVE_INITIAL_DEEPLINK_URL', url: url}),
        firtsTimeLaunch: () => dispatch({type: 'FIRST_TIME_LAUNCH'}),
        getHomeWidget: (params) => dispatch(getHomeWidget(params)),
        clearCurrentData: (url) => dispatch(clearCurrentData(url)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
        addProductToCart: (params) => dispatch(addToCart(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);






