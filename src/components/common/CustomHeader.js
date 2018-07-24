// 'use strict';
import React, {PureComponent} from 'react';
import {Image, View, Text, AsyncStorage, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import * as GLOBAL from '../../utilities/constants';
import * as Constants from 'Wadi/src/components/constants/constants';
import {Navigation} from 'react-native-navigation'
import {dimensions} from "../../utilities/utilities";


class CustomHeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {userSelectedPlace: "Loading..."}
    }

    /*componentWillMount() {
        this.userSelectedLocation().then(res =>
            res.userSelectedPlace ? this.setState({userSelectedPlace: res.userSelectedPlace}) : "").catch(error => {
            console.log("Something went wrong in fetching data");
        })
    }*/


    render() {
        return (
            <View style={{display: 'flex', flex: 1}}>
                {this.setAppropriateHeader()}
            </View>

        );
    }

    openLocationModal() {
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
            transparent: false// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });

    }

    setAppropriateHeader() {
        if (!!this.props.homescreen && GLOBAL.CONFIG.isGrocery) {
            return (
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginRight:10

                }}>
                    <View style={{display: 'flex', flexDirection: 'column', flex: 0.7}}>
                        <Text style={{color: 'white'}}>Deliver to:</Text>
                        <Text style={{fontSize: 12, color: 'white'}} numberOfLines={1}
                              ellipsizeMode={'tail'}>{this.props.accounts.userLocation}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.openLocationModal()}>
                        <Image source={require('../../icons/editLocation/edit.png')} style={{height: 20, width: 20}}
                               resizeMode={"contain"}/>
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            let title = `${this.props.screenName}`;
            return (
                <View
                    style={{alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1, display: 'flex'}}>
                    {this.props.screenName ?
                        <Text style={{
                            color: GLOBAL.CONFIG.isGrocery ?'black':'white',
                            fontSize: 18,
                            textAlign: 'center',
                            fontFamily: GLOBAL.FONTS.default_font_bold
                        }} numberOfLines={1}
                              ellipsizeMode={'tail'}>{title}</Text> : <Image resizeMode='contain'
                                                                             source={GLOBAL.CONFIG.isGrocery ? (this.props.langauge === 'ar' ? require('../../icons/navbar/wadigrocery_en.png') : require('../../icons/navbar/wadigrocery_en.png')) : (this.props.langauge === 'ar' ? require('Wadi/src/icons/navbar/Logo_ar.png') : require('Wadi/src/icons/navbar/Logo_en.png'))}
                                                                             style={{
                                                                                 height: 35,
                                                                                 width: 80
                                                                             }}/>
                    }
                </View>);
        }

    }


}

CustomHeader.propTypes = {
    logoImg: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

CustomHeader.defaultProps = {
    logoImg: undefined,
};

function mapStateToProps(state) {
    return {
        langauge: state.configAPIReducer.selectedLanguage,
        accounts: state.accounts
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader)

