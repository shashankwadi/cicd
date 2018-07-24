'use strict';

/**
 * Created by Manjeet Singh on 8/11/2017
 * this file is to make navigation state available within redux
 * setting up with redux can help us to create custom actions and track our stack
 * doc - https://reactnavigation.org/docs/guides/redux
 */
import React from 'react';
import { BackHandler, View} from 'react-native';


import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'


import LoginModal from '../screens/authentication/loginModal';


//navigators
import SplashScreen from "../screens/splashScreen";

class AppWithNavigationState extends React.Component {

    constructor(props) {
        super(props);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentDidMount() {
        //BackAndroid is depricated

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    //added to handle back button functionality on android
    handleBackButton() {
        const { nav, dispatch } = this.props;

        if (nav && nav.routes && nav.routes.length > 1) {
            dispatch(NavigationActions.back());
            return true;
        }
        return false;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SplashScreen navigation={addNavigationHelpers({
                    ...this.props,
                    dispatch: this.props.dispatch,
                    state: this.props.nav
                })} />
                <LoginModal />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        nav: state.navigatorReducer,
        //cartItemsCount: state.cart.itemsCount
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState)