/**
 * Created by Akhil Choudhary
 * Created on 2018-05-23
 *
 */
'use strict'
import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Platform,
    AsyncStorage,
    DeviceEventEmitter,
    NativeModules,
    PermissionsAndroid,
    NativeEventEmitter,
    Alert,
    Dimensions,
    I18nManager,
} from 'react-native';
import {VectorIcon} from '../common';
import {NativeEventsReceiver, Navigation} from 'react-native-navigation'
import {strings} from '../../utilities/uiString'
import * as GLOBAL from '../../utilities/constants';
import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import wadiStylesheet from '../../utilities/namespaces/wadiStyles'
import {
    resetBundleWithUserCountryAndLanguage, setSelectedCountry,
    setSelectedLanguage
} from "../../actions/configAPIActions";
import {connect} from "react-redux";
import {googleGetCityName} from '../../utilities/utilities';
import CustomActivityIndicator from '../screens/authentication/customActivityIndicator';
import codePush from "react-native-code-push";

const {WDIDataBridge} = NativeModules;
var thisRef;
const isIphoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
let {width} = Dimensions.get('window')

const languageSelectionText = (currentLanguage = 'en')=>{
    return (currentLanguage !== 'ar')?'تابع باللغة العربية':'continue in english';
}

class CitySelectionScreen extends Component {

    saveSelectedCity = async () => {
        let {latitude, longitude, userSelectedCity, currentLanguage, subLocality, cities}= this.state
        let sublocality = subLocality ? subLocality : cities.filter(item=> item.city == userSelectedCity)[0].label
        try { //save the city name locally and send it to web too
            await AsyncStorage.setItem('latitude', latitude + '');
            await AsyncStorage.setItem('longitude', longitude + '');
            await AsyncStorage.setItem('userSelectedCity', userSelectedCity);
            await AsyncStorage.setItem('subLocality', sublocality);
            await prefs.setLanguage(currentLanguage);
        } catch (error) { //fail silently; Not able to save data locally so just send the city name to web
        }
        this.props.callback(userSelectedCity, latitude, longitude,sublocality, currentLanguage);
        this.props.resetAppWithLanguageAndCountry({'countryCode': 'sa'}, currentLanguage);
        return true
    }
    fetchUserSelectedCity = async () => {
        try {
            const userSelectedCity = await AsyncStorage.getItem('userSelectedCity');
            if(userSelectedCity!==null){
                return userSelectedCity
            }
            return null
        }
        catch (error) {
               return null
        }
    }
    getNativeUserLocation = (e) => {
        if (e.longitude) {
            this.setState({
                longitude: e.longitude,
                latitude: e.latitude,
                showLoader:false,
            }, () => {
                googleGetCityName
                (this.state.longitude, this.state.latitude, this.state.cities).then(data => {
                             if (data.inService) {
                                 this.setState({
                                     userLocation: data.address,
                                     subLocality: data.subLocality,
                                     userSelectedCity: data.cityName
                                 });
                             }
                             else {
                             }
                })
            })
        }
        else {
            Alert.alert("Location", "Please enable your location ");
            this.setState({
                showLoader:false
            })
        }

    }

    constructor(props) {
        super(props);
        this.state = {
            cities: this.getCities(),
            longitude: null,
            latitude: null,
            userLocation:null,
            showLoader:props.onLaunch,
            subLocality:"",
            userSelectedCity:null,
            currentLanguage: props.configAPI.selectedLanguage,
            easterEggCount: 0,
        }
        thisRef = this;
    }

    getCities() {
        return [
            {label:strings.Riyadh,city: "riyadh", selected_image: require('Wadi/src/icons/citySelection/riyadh.png'), unselected_image: require('Wadi/src/icons/citySelection/riyadh_unselected.png')},
            {label:strings.Dammam,city: "dammam", selected_image: require('Wadi/src/icons/citySelection/dammam.png'), unselected_image: require('Wadi/src/icons/citySelection/dammam_unselected.png')},
            {label:strings.Jeddah,city: "jeddah", selected_image: require('Wadi/src/icons/citySelection/jeddah.png'), unselected_image: require('Wadi/src/icons/citySelection/jeddah_unselected.png')}
        ];
    }

    componentDidMount() {
        this.fetchUserSelectedCity().then(response => {
                if (response !== null ) {
                    this.setState({userSelectedCity: response})
                }
            }
        )

        this.requestUserCurrentLocation()

    }

    /*componentWillUnmount() {
        thisRef.subscription.remove();
    }*/

    showEasterEgg() {
        this.setState((prevState) => {
            prevState.easterEggCount++
        }, () => {
            if (this.state.easterEggCount === 10) {
                this.setState({
                    easterEggCount: 0,
                });


                codePush.getUpdateMetadata().then((metadata) => {
                    Alert.alert("You have reached here!", "Your lucky number is " + metadata.appVersion + "-" + metadata.label);
                });
            }
        })

    }

    render() {

        return ( <View style={styles.parentContainerStyle}>
            <View style={styles.launchHeader}>
                <TouchableOpacity onPress = {() => this.showEasterEgg()} activeOpacity = {1}>
                <Text style={styles.launchHeaderText}>
                    {strings.citySelectionHeader}
                </Text>
                </TouchableOpacity>
                {!this.props.onLaunch &&
                <TouchableOpacity style={styles.dismissModalStyle} onPress={this.closeCitySelectionModal}>
                    <VectorIcon groupName={"Ionicons"} name={"ios-arrow-down"}
                                style={{
                                    fontSize: 22,
                                    color: GLOBAL.COLORS.darkGreyColor,
                                }}/>
                </TouchableOpacity>}
            </View>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View>{this.renderCityList()}
                    <Text style={{textAlign: 'center', color: GLOBAL.COLORS.lightGreyColor, fontFamily: GLOBAL.FONTS.default_font, marginTop: 2}}>{strings.comingSoonInMoreCities}</Text>
                </View>
                {/*{this.props.onLaunch&&!!this.state.subLocality && <View><Text style={{textAlign:'center'}}>Locality: {this.state.subLocality}</Text></View>}*/}
                <View>
                <TouchableOpacity activeOpacity={1} onPress={() => this.handleLanguageChange()}>
                    <Text style={{textAlign: 'center', color: GLOBAL.COLORS.lightGreyColor, fontFamily: GLOBAL.FONTS.default_font, margin: 20}}>{languageSelectionText(this.state.currentLanguage)}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => this.citySelected()}>
                    <View style={styles.continueStyle}>
                        <Text style={styles.continueText}>{strings.continue}</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
            {this.state.showLoader && <CustomActivityIndicator/>}
        </View>)


    }

    closeCitySelectionModal = ()=>{
        if(this.state.currentLanguage !== this.props.configAPI.selectedLanguage){
            strings.setLanguage(this.props.configAPI.selectedLanguage);
        }
        Navigation.dismissModal({
            animationType: 'slide-down'
        });
    }

    handleLanguageChange = () => {
        let newLanguage = this.state.currentLanguage === 'ar'?'en':'ar';
        strings.setLanguage(newLanguage);
        this.setState({
            currentLanguage: newLanguage,
            cities: this.getCities(),
        });
    };

    renderCityItem({item, index}) {

        return (<TouchableOpacity activeOpacity={1} onPress={() => this.cityClicked(item.city)}>
            <View
                style={[styles.listItemContainer,{borderColor: this.state.userSelectedCity == item.city ? GLOBAL.COLORS.expressBackground : 'black',borderWidth: this.state.userSelectedCity == item.city ? 2 : 1}]}>
            <Image
            style={styles.imageStyle}
            source={this.state.userSelectedCity == item.city ? item.selected_image : item.unselected_image}
            resizeMode={'cover'}
        />

            <Text numberOfLines = {1} style={{fontSize: 13, fontFamily: GLOBAL.FONTS.default_font, marginTop: 8}}>{item.label}</Text></View></TouchableOpacity>)

    }

    renderCityList() {
        return (<FlatList data={this.state.cities}
                          renderItem={this.renderCityItem.bind(this)}
                          numColumns={3}
                          contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                          extraData={this.state.userSelectedCity || strings.getLanguage()}
                          bounces={false}
                          
        />)
    }

    cityClicked(city) {
        this.setState({userSelectedCity: city, subLocality : ""})

    }

    citySelected() {
        if(this.state.userSelectedCity!=null){
            this.saveSelectedCity().then(response => {
                Navigation.dismissModal({
                    animationType: 'slide-down'
                })
            })

        }
        else{
            Alert.alert(strings.citySelectionHeader)
        }

    }

    requestUserCurrentLocation() {
        if (Platform.OS === 'ios') {
            let userLocationEmitter = new NativeEventEmitter(WDIDataBridge);
            thisRef.subscription = userLocationEmitter.addListener('locationData', this.getNativeUserLocation);
        } else {

            thisRef.subscription = DeviceEventEmitter.addListener('locationData', this.getNativeUserLocation);
        }

        if (this.props.onLaunch) {
            setTimeout(() => {
                this.requestUserLocation()
            }, 2500);
        }
        else {
            this.getUserSavedLocation()
        }

    }

    requestUserLocation() {
        if (Platform.OS === "android") {
            this.requestLocationPermission()
        }
        else {
            navigator.geolocation.requestAuthorization();
            this.getUserCurrentLocation()
        }
    }

    async requestLocationPermission() {
        Promise.resolve(Navigation.isAppLaunched())
            .then((appLaunched) => {
                if (appLaunched) {
                    this.reqPermission();
                }
                new NativeEventsReceiver().appLaunched(() => {
                    this.reqPermission();
                });
            });

    }

    async reqPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'Wadi needs your current location'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) { //location access granted
                this.getUserCurrentLocation()

            } else {
                this.getUserSavedLocation()
            }
        } catch (err) {
            this.setState({showLoader:false})
        }

    }

    getUserCurrentLocation() {
        prefs.getUserLocation().then(()=>{
            setTimeout(()=>{
                this.setState({showLoader:false})
            }, 2500);
        });
    }

    getUserSavedLocation() {
        this.setState({
            showLoader:false
        });
        this.userDefaultSelectedLocation().then(res =>
            res.latitude && res.longitude ? this.setState({
                latitude: res.latitude,
                longitude: res.longitude,
            }, () => {

            }) : "").catch(error => {

        })
    }

    async userDefaultSelectedLocation() {
        try {
            const longitude = await AsyncStorage.getItem('longitude');
            const latitude = await AsyncStorage.getItem('latitude');
            return {longitude, latitude}
        }
        catch (error) {
            return false;
        }

    }

}
function mapStateToProps(state) {
    return {
        configAPI: state.configAPIReducer
    }
}

function mapDispatchToProps(dispatch) {

    return {
        resetAppWithLanguageAndCountry: (selectedCountry, selectedLanguage) => dispatch(resetBundleWithUserCountryAndLanguage(selectedCountry, selectedLanguage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CitySelectionScreen)
const styles = StyleSheet.create({
    iconSearch: {
        height: 15,
        width: 15,
        marginLeft: 6,
        marginRight: 4
    },
    launchHeader: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.4,
        borderColor: GLOBAL.COLORS.lightGreyColor,
        backgroundColor: 'white',
        flexDirection: 'row',
        position: 'relative'
    },
    launchHeaderText: {
        color: 'black',
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font,
    },
    listItemContainer: {
        borderRadius: 15,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        width: width / 3 - 30,
    },
    imageStyle: {width: 50, height: 50},
    continueStyle: {
        backgroundColor: GLOBAL.COLORS.expressBackground,
        padding: 10,
        height:40,
        alignItems: 'center',
        justifyContent:'center',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        marginBottom: 20
    },
    continueText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font,
    },
    dismissModalStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        height: 50,
        width: 50
    },
    parentContainerStyle: {
        backgroundColor: 'white',
        flex: 1,
        position: 'relative',
        paddingTop: Platform.OS === 'ios' ? (isIphoneX? 40 : 20) : 0
    }
});