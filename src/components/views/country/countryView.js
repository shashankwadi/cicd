import React, {Component} from 'react';
import {strings} from 'utilities/uiString';
import {Alert, Image, NativeModules, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import * as GLOBAL from '../../../utilities/constants';
import images from 'assets/images';
import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import {connect} from 'react-redux'
import {
    resetBundleWithUserCountryAndLanguage,
    setSelectedCountry,
    setSelectedLanguage
} from "../../../actions/configAPIActions";
import {isEmptyString} from '../../../utilities/utilities';
import EnglishPartial from './englishPartial';
import ArabicPartial from './arabicPartial';
import {Navigation} from 'react-native-navigation'
import VectorIcon from "../../common/VectorIcon.native";

let countrySelected = false;
const text = require('./text.json');
import {selectableCountries} from '../selectableCountries';
class CountryView extends Component {

    setNavigationTitle = () => {
        // if (this.props.navigation)
        //     this.props.navigation.setParams({customTitle: () => this.returnTitle()});
        if (this.props.navigator)
            this.props.navigator.setTitle({
                title: this.returnTitle() // the new title of the screen as appears in the nav bar
            });
    };

    static navigatorStyle = {
        navBarTextColor: '#FFFFFF',
        navBarHeight: 1,
        navBarHidden:true
    };


    componentDidMount() {
        if (this.props.configAPI && !isEmptyString(this.props.configAPI.selectedLanguage)) {
            this.setDefaultLanguage(this.props.configAPI.selectedLanguage)
        }

        if (this.props.configAPI && this.props.configAPI.selectedCountry && !isEmptyString(this.props.configAPI.selectedCountry.countryCode)) {
            this.setState({
                selectedCountry: this.props.configAPI.selectedCountry
            })
        }
    }
    returnTitle = () => {
        return this.state.selectedLanguage == 'en' ? text.en.country_language : text.ar.country_language;
    };

    constructor(props) {
        super();
        this.state = {
            selectedCountry: {},
            selectedIndex: 0,
            selectedLanguage: 'en'
        }

    }


    /*To Center align the logo => ios make it by default, this is for android*/
    // static navigationOptions = ({navigation}) => {
    //     return {
    //         headerTitle:
    //             <Text>{navigation && navigation.state && navigation.state.params && navigation.state.params.customTitle() ? navigation.state.params.customTitle() : text.en.country_language}</Text>
    //     }
    // };


    componentWillReceiveProps(nextProps) {
        if (this.props.configAPI !== nextProps.configAPI) {
            let selectedLanguage = '';
            if (this.state.selectedIndex === 0) {
                selectedLanguage = 'en'
            } else {
                selectedLanguage = 'ar'
            }
            if (this.props.configAPI
                && nextProps.configAPI
                && nextProps.configAPI.selectedCountry
                && this.isCountryLanguageUpdated(nextProps.configAPI, this.props.configAPI)
                && !countrySelected) {
                countrySelected = true;

                prefs.setLanguage(selectedLanguage).then(resultValue => {

                })
                    .catch(e => console.error(e));

            }

            if (!!nextProps.configAPI.selectedLanguage) {

                this.setDefaultLanguage(nextProps.configAPI.selectedLanguage)
            }
        }
    }

    isCountryLanguageUpdated(nextConfig, currentConfig) {
        if (nextConfig.selectedCountry && !currentConfig.selectedCountry) {
            return true
        }
        if (nextConfig.selectedCountry && currentConfig.selectedCountry) {

            if (currentConfig.selectedCountry != nextConfig.selectedCountry || currentConfig.selectedLanguage != nextConfig.selectedLanguage) {
                return true
            } else {
                return false
            }
        }

    }

    selectedCountriesData(configAPI) {
        return (configAPI && configAPI.configAPI && configAPI.configObj.content && configAPI.configObj.content.selectableCountries) ? configAPI.configObj.content.selectableCountries : selectableCountries.selectableCountries;

    }

    setDefaultLanguage(selectedLanguage) {
        let selectedIndex = (selectedLanguage === 'en') ? 0 : 1;
        this.setState({
            selectedIndex: selectedIndex,
            selectedLanguage: selectedLanguage
        }, () => {
            this.setNavigationTitle()
        })
    }

    renderHeader = ()=>{
        let iphoneXStyleTop = (this.props.isIphoneX)?{paddingTop:50}:undefined;
        let topMargin =  this.props.isIphoneX ?15:40;
        let {selectedLanguage}= this.state;
        return(
            <View style={[styles.launchHeader, iphoneXStyleTop,{flexDirection: 'row'} ]}>
                {!GLOBAL.CONFIG.enableMobileWeb &&
                <TouchableOpacity style = {[styles.closeButton]} onPress = {()=>  this.props.navigator.pop()}>
                    <VectorIcon groupName={"Ionicons"} name={"ios-arrow-back"}
                                style={{
                                    marginTop: 22,
                                    fontSize: 25,
                                    color: GLOBAL.COLORS.darkGreyColor,
                                }}/>
                </TouchableOpacity>}
            <Text style={[styles.launchHeaderText, {marginTop:topMargin}]}>
                {(selectedLanguage === 'ar')?text.ar.country_language : strings.Country}
            </Text>
            {!this.props.isOnLaunch && GLOBAL.CONFIG.enableMobileWeb &&
            <TouchableOpacity style = {[styles.downArrrow]} onPress = {()=>  Navigation.dismissModal({
                animationType: 'slide-down'
            })}>
                <VectorIcon groupName={"Ionicons"} name={"ios-arrow-down"}
                            style={{
                                marginTop: 22,
                                fontSize: 25,
                                color: GLOBAL.COLORS.darkGreyColor,
                            }}/>
            </TouchableOpacity>}
        </View>
        );
    }

    render() {

        let containerViewTopMargin = 0;

        if(GLOBAL.CONFIG.enableMobileWeb){
            //This will show as a modal
            containerViewTopMargin = (this.props.isIphoneX)?70:10;
        }

        return (
            <View style = {{flex: 1, backgroundColor: GLOBAL.COLORS.screenBackgroundGray}}>
                {this.renderHeader()}
                {this.state.selectedLanguage === 'en' &&
                    <EnglishPartial selectedCountry={this.state.selectedCountry}
                                    selectedIndex={this.state.selectedIndex}
                                    isOnLaunch={this.props.isOnLaunch}
                                    dataSource={this.selectedCountriesData(this.props.configAPI)}
                                    onPressItem={(item) => this.onPressItem(item)}
                                    applyButtonTapped={() => this.applyButtonTapped()}
                                    onPressArabic={() => this.onPressArabic()}
                                    onPressEnglish={() => this.onPressEnglish()}
                                    isIphoneX={NativeModules.DeviceInfo.isIPhoneX_deprecated}/>
                }
                {this.state.selectedLanguage === 'ar' &&
                    <ArabicPartial selectedCountry={this.state.selectedCountry}
                                   selectedIndex={this.state.selectedIndex}
                                   isOnLaunch={this.props.isOnLaunch}
                                   dataSource={this.selectedCountriesData(this.props.configAPI)}
                                   onPressItem={(item) => this.onPressItem(item)}
                                   applyButtonTapped={() => this.applyButtonTapped()}
                                   onPressArabic={() => this.onPressArabic()}
                                   onPressEnglish={() => this.onPressEnglish()}
                                   isIphoneX={NativeModules.DeviceInfo.isIPhoneX_deprecated}/>
                }
            </View>
        )
    }

    renderRow(rowData) {
        let disabledStyle = (rowData.isEnabled === false) ? {color: GLOBAL.COLORS.lightGreyColor} : {};
        return (
            <TouchableOpacity activeOpacity={1} onPress={() =>
                this.onPressItem(rowData)}>
                <View style={styles.container}>
                    <Image source={{uri: rowData.flagUrl}} style={styles.photo}/>
                    <Text style={[styles.nameText, disabledStyle]}>
                        {rowData.name.toUpperCase()}
                    </Text>
                    {this.state.selectedCountry.countryCode == rowData.countryCode &&
                    <Image style={styles.checkMark} source={images.checkMark}/>
                    }
                    {rowData.isEnabled == false &&
                    <Text style={[styles.subtitle, disabledStyle]}>
                        Coming Soon
                    </Text>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    applyButtonTapped() {
        if (!!this.state.selectedCountry.countryCode) {
            let selectedLanguage = '';
            if (this.state.selectedIndex == 0) {
                selectedLanguage = 'en'
            } else {
                selectedLanguage = 'ar'
            }

            if (!this.props.configAPI.selectedCountry || (this.props.configAPI.selectedLanguage != selectedLanguage || this.props.configAPI.selectedCountry.countryCode != this.state.selectedCountry.countryCode)) {
                //webview config handle

                if (this.props.callback) {
                    this.props.callback({
                        selectedCountry: this.state.selectedCountry,
                        language: this.state.selectedLanguage
                    })
                }
                this.props.resetAppWithLanguageAndCountry(this.state.selectedCountry, selectedLanguage);
                if (this.props.callback) {
                    Navigation.dismissModal({
                        animationType: 'slide-down'
                    })
                }

            } else {
                Navigation.dismissModal({
                    animationType: 'slide-down'
                })
            }


        } else {

            Alert.alert('Please select your Country to proceed.');
        }


    }


    onPressItem(item) {
        if (item.isEnabled === true) {

            this.setState({
                selectedCountry: item
            })
        }
    }

    onPressArabic() {
        this.setState({selectedIndex: 1, selectedLanguage: 'ar'}, () => {
            this.setNavigationTitle();
        });
    }

    onPressEnglish() {
        this.setState({selectedIndex: 0, selectedLanguage: 'en'}, () => {
            this.setNavigationTitle();
        });
    }

}

const styles = StyleSheet.create({
    /*
     * Removed for brevity
     */
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 50
    },
    applyContainer: {
        height: 56,
        padding: 3,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    nameText: {
        marginLeft: 10,
        flex: 1,
        fontSize: 16,
        textAlign: 'left'
    },

    applyButton: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
    },
    applyButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontFamily: GLOBAL.FONTS.default_font_bold,

    },
    subtitle: {
        flex: 1,
        fontSize: 16,
        textAlign: 'right',
    },
    photo: {
        height: 23,
        width: 35
    },

    selectLanguageText: {
        color: 'black',
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginTop: 15,
        marginLeft: 10,
        marginBottom: 10
    },
    selectCountryText: {
        color: 'black',
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginTop: 10,
        marginLeft: 10
    },
    checkMark: {
        width: 15,
        height: 15,
        alignSelf: 'center'
    },
    engLngSelectionButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        height: 40,
        marginRight: 5,
        borderRadius: 5,
    },
    arLngSelectionButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5, height: 40,
        marginRight: 10,
        borderRadius: 5,
    },
    launchHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.4,
        borderColor: GLOBAL.COLORS.lightGreyColor,
        backgroundColor: 'white'
    },
    launchHeaderText: {
        color: 'black',
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font,
        marginBottom: 10
    },
    downArrrow:{
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'absolute', 
        right: 10,
        height: 50, 
        width: 50
    },
    closeButton:{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        height: 50,
        width: 50
    }
});


function mapStateToProps(state) {
    return {
        configAPI: state.configAPIReducer
    }
}

function mapDispatchToProps(dispatch) {

    return {

        dispatch,
        setSelectedCountry: (selectedCountry) => dispatch(setSelectedCountry(selectedCountry)),
        setSelectedLanguage: (selectedLanguage) => dispatch(setSelectedLanguage(selectedLanguage)),
        resetAppWithLanguageAndCountry: (selectedCountry, selectedLanguage) => dispatch(resetBundleWithUserCountryAndLanguage(selectedCountry, selectedLanguage))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryView)
