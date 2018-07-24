import React, {PureComponent} from 'react';
import {Alert, FlatList, I18nManager, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import images from 'assets/images';
import * as GLOBAL from '../../../utilities/constants';
import {selectors} from "../../../reducers/reducers";
import {getCodePushVersion} from "../../../utilities/utilities";

const text = require('./text.json');
export default class EnglishPartial extends PureComponent {

    renderEasterEgg = () => {
        return (
            <TouchableOpacity style={{height: 40,}}
                              onPress={() => {
                                  this.setState((prevState) => {
                                      prevState.easterEggCount++
                                  }, () => {
                                      if (this.state.easterEggCount === 10) {
                                          this.setState({
                                              easterEggCount: 0,
                                          });
                                          getCodePushVersion().then((res) => {
                                              Alert.alert("You have reached here!", "Your lucky number is " + JSON.stringify(res));
                                          })
                                      }
                                  })
                              }}/>
        )
    };


    componentWillMount() {

    }
    componentDidMount(){
        this.state && !!this.state.dataSource && this.props.onPressItem(this.state.dataSource[0])

    }




    _onPressItem = (item) => {
        if (item.isEnabled === true) {
            this.props.onPressItem(item); //callback to parent view to set selected country
        }
    };

    _onPressArabic = () => {
        this.props.onPressArabic(); // callback to parent view to set arabic language and change view
    };

    _onPressEnglish = () => {
        this.props.onPressEnglish(); // callback to parent view to set english language and change view
    };

    _applyButtonTapped = () => {
        this.props.applyButtonTapped();
    };

    _renderRow = ({item, index}) => {
        let rowData = item;
        let disabledStyle = (rowData.isEnabled === false) ? {color: GLOBAL.COLORS.lightGreyColor} : {};
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPressItem(rowData)}>
                <View style={styles.container}>
                    <Image source={selectors.getCountryFlag(rowData.countryCode)} style={styles.photo}/>
                    <Text style={[styles.nameText, disabledStyle]}>
                        {rowData.name.toUpperCase()}
                    </Text>
                    {
                        this.props.selectedCountry.countryCode == rowData.countryCode
                        &&
                        <Image style={styles.checkMark} source={images.checkMark}/>
                    }
                    {
                        rowData.isEnabled == false &&
                        <Text style={[styles.subtitle, disabledStyle]}>
                            {text.en.coming_soon}
                        </Text>
                    }
                </View>
            </TouchableOpacity>
        )
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: this.props.selectedIndex,
            selectedCountry: this.props.selectedCountry,
            dataSource: this.props.dataSource,
            isRTL: I18nManager.isRTL,
            easterEggCount: 0,
        }
    }

    render() {
        let engTxtColor = (this.props.selectedIndex === 0) ? 'white' : 'black';
        let engBgColor = (this.props.selectedIndex === 0) ? 'black' : 'white';
        let iphoneXStyleTop = (this.props.isIphoneX)?{paddingTop:50}:undefined;
        let iphoneXStyleBottom = (this.props.isIphoneX)?{paddingBottom:60,paddingTop:25}:undefined;
        let topMargin =  this.props.isIphoneX ?15:40;
        let containerViewTopMargin = 0;

        return (
            <View style={[{flex: 1, backgroundColor: GLOBAL.COLORS.screenBackgroundGray}]}>
                <Text style={styles.selectLanguageText}>
                    {text.en.choose_your_language}
                </Text>

                <View style={{height: 50, flexDirection: 'row'}}>
                    <View style={{flex: .5, justifyContent: 'center'}}>
                        <TouchableOpacity activeOpacity={1} style={[styles.engLngSelectionButtonStyle, {backgroundColor: engBgColor}]}
                                          onPress={this._onPressEnglish}>
                            <Text style={{color: engTxtColor, textAlign: 'center'}}>
                                {text.en.english.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: .5, justifyContent: 'center'}}>
                        <TouchableOpacity style={[styles.arLngSelectionButtonStyle, {backgroundColor: engTxtColor}]}
                                          activeOpacity={1} onPress={this._onPressArabic}>
                            <Text style={{color: engBgColor, textAlign: 'center'}}>
                                {text.en.arabic.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.selectCountryText}>
                    {text.en.choose_your_country}
                </Text>

                {
                    this.state
                    &&
                    !!this.state.dataSource
                    &&
                    <FlatList
                        key={`englishCountries`}
                        data={this.state.dataSource}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator}/>}
                        keyExtractor={(item, index) => {
                            return `englishCountries-${item}-${index}`
                        }}
                        renderItem={({item, index}) => this._renderRow({item, index})}
                    />
                }
                {this.renderEasterEgg()}
                <View style={[styles.applyContainer, iphoneXStyleBottom]}>
                    <TouchableOpacity activeOpacity={1} onPress={this._applyButtonTapped}
                                      style={styles.applyButton}>
                        <Text style={[styles.applyButtonText,{color:GLOBAL.CONFIG.isGrocery? 'black':'white'}]}>
                            {text.en.apply_btn.toUpperCase()}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
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
        flexDirection:I18nManager.isRTL ?  'row-reverse' : 'row',
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
        marginHorizontal: 10,
        flex: 1,
        fontSize: 16,
        textAlign: I18nManager.isRTL ? 'right' : 'left'
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
        fontSize: 20,
        fontFamily: GLOBAL.FONTS.default_font,

    },
    subtitle: {
        flex: 1,
        fontSize: 16,
        textAlign: I18nManager.isRTL ? 'left' : 'right',
    },
    photo: {
        height: 23,
        width: 35,
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
        marginBottom: 15
    },
    selectLanguageText: {
        color: 'black',
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginTop: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        textAlign: I18nManager.isRTL ? 'right' : 'left'

    },
    selectCountryText: {
        color: 'black',
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        marginTop: 10,
        marginHorizontal: 10,
        textAlign: I18nManager.isRTL ? 'right' : 'left'
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
    }
});