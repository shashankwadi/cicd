import {
    Alert,
    AsyncStorage,
    DeviceEventEmitter,
    Image,
    NativeModules,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    NativeEventEmitter
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNGooglePlaces from 'react-native-google-places';
import MapView from 'react-native-maps';
import {getLatLongFromAddress, googleGetCityName, getGroceryCities} from "../../utilities/utilities";
import 'rxjs/add/operator/debounceTime';
import SearchUnSelIcon from '../../icons/tabbar/Shape.png'
import mapPicker from '../../icons/mapPicker/Group.png'
import pickerDraggedIcon from '../../icons/mapPicker/pickerOnDrag/Group2.png'
import {VectorIcon} from '../common';
import {debounce} from "lodash"
import {_groceryUserSelectedCity} from 'Wadi/src/actions/accountActions';
import {NativeEventsReceiver, Navigation} from 'react-native-navigation'
import * as GLOBAL from '../../utilities/constants';
import {strings} from '../../utilities/uiString'
import * as prefs from 'Wadi/src/utilities/sharedPreferences';

const {WDIDataBridge} = NativeModules;
const userLocationIcon = <VectorIcon groupName={"Ionicons"} name={"md-locate"}
                                     style={{
                                         fontSize: 30,
                                         color: "#565656",
                                     }}/>;
const isIphoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;

var thisRef;

class googlePlaces extends Component {


    static navigatorStyle = {

        drawUnderTabBar: false,
    };
    onRegionChangeCompleted = debounce(((region) => {
        if (!this.state.fromGooglePlaces) {
            this.setState(
                {
                    region: region,
                    pointerImageSource: 0,
                    isLoading:true

                }
                , () => {

                    googleGetCityName
                    (this.state.region.longitude, this.state.region.latitude, this.getCities()).then(data => {
                        this.setState({city: data.cityName, userLocation: data.address, inService: data.inService,isLoading:false,subLocality:data.subLocality});
                    })
                        .catch(error => console.log("error while fetching data from google", error))


                })
        }
        else {
            this.setState({fromGooglePlaces: false})
        }


    }), this.state ? (this.state.fromGooglePlaces ? 12000 : 2000) : 2000);

    constructor() {
        super();
        this.state = {
            region: {
                latitude: 24.774265,
                longitude: 46.738586,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            userLocation: null,
            inService: false,
            pointerImageSource: 0,
            city: null,
            fromGooglePlaces: false,
            isLoading:true,
            subLocality:"riyadh"


        }
        thisRef = this;


    }

    componentWillUnmount() {
        thisRef.subscription.remove();

    }

    componentWillMount() {
        //this.getUserSavedLocation()
    }

    componentDidMount() {
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

    openAutoCompleteModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                this.setState((prevState) => {
                    return {
                        // region: {...prevState.region, longitude: place.longitude, latitude: place.latitude}
                        userLocation: place.name + ', ' + place.address,
                        fromGooglePlaces: true,
                        isLoading:true
                    }
                }, () => {
                    getLatLongFromAddress(place.address, this.getCities()).then(res => {
                        if (res.latlng && res.latlng.lat) {
                            this.setState(prevState => {
                                return {
                                    city:res.cityName,
                                    inService: res.inService,
                                    region: {...prevState.region, latitude: res.latlng.lat, longitude: res.latlng.lng},
                                    isLoading:false,
                                    subLocality:res.subLocality

                                }
                            })
                        }
                    }).catch(error => {
                    })

                })
            })
            .catch(error => {

            });
    }

    render() {

        let iphoneXStyleTop = isIphoneX? 40 : 10;

        return (
            <View style={{flex: 1, backgroundColor: 'white', position: 'relative', paddingTop: iphoneXStyleTop}}>
                <View style={styles.launchHeader}>
                    <Text style={styles.launchHeaderText}>
                        {strings.EnterLocation}
                    </Text>
                    {!this.props.onLaunch && <TouchableOpacity style = {{justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, height: 50, width: 50}} onPress = {()=>  Navigation.dismissModal({
                        animationType: 'slide-down'
                    })}>
                        <VectorIcon groupName={"Ionicons"} name={"ios-arrow-down"}
                                    style={{
                                        fontSize: 22,
                                        color: GLOBAL.COLORS.darkGreyColor,
                                    }}/>
                    </TouchableOpacity>}
                </View>

                <MapView style={{flex: 1}}
                         region={this.state.region}
                         onRegionChange={(region) => this.onRegionChangeCalled()}
                         onRegionChangeComplete={(region) => this.onRegionChangeCompleted(region)}
                         zoomEnabled={true}
                         minZoomLevel={5}
                         maxZoomLevel={20}
                >
                </MapView>
                <TouchableOpacity style={styles.userLocationButton} activeOpacity={1}
                                  onPress={() => this.requestUserLocation()}>
                    <View>
                        {userLocationIcon}
                    </View>
                </TouchableOpacity>
                <View style={{position: 'absolute', display: 'flex', top: '50%', left: '50%'}}>
                    <Image source={this.state.pointerImageSource == 0 ? mapPicker : pickerDraggedIcon}/>
                </View>

                <View style={{
                    position: 'absolute',
                    top:70 + iphoneXStyleTop,
                    left: 10,
                    right: 10,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#9e9e9e',
                    paddingTop: 4,
                    paddingBottom: 4,
                }}>
                    <TouchableOpacity style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',

                    }} activeOpacity={1}
                                      onPress={() => this.openAutoCompleteModal()}>
                        <Image source={SearchUnSelIcon} style={[styles.iconSearch]}/>
                        {Platform.OS=="ios"&&<View style = {styles.separator}>
                        </View>}
                        <Text style={{
                            padding: 4,
                            borderLeftColor: '#9e9e9e',
                            borderLeftWidth: 1,
                            color: 'black',
                            flex: 1,
                            marginTop: 3,
                            fontFamily: GLOBAL.FONTS.default_font
                        }}
                              numberOfLines={1}
                              ellipsizeMode={'tail'}
                        >{this.state.userLocation ? this.state.userLocation : ""}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.applyButton,{backgroundColor: this.state.isLoading?GLOBAL.COLORS.lightGreyColor:GLOBAL.COLORS.wadiDarkGreen,}]}
                                  onPress={() => this.applySelectedCity()}
                                  disabled={this.state.isLoading}>
                    <Text
                        style = {styles.applyText}>
                        {strings.APPLY}
                    </Text>
                </TouchableOpacity>
            </View>

        );
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

        }

    }

    onRegionChangeCalled() {
        if (this.state.pointerImageSource == 1) {

        }
        else {
            this.setState({pointerImageSource: 1})
        }
    }

    getUserCurrentLocation() {

        prefs.getUserLocation().then()
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

    applySelectedCity() {

        !this.state.inService ? this.handleUnavailability() : this.setUserSelectedCity()
            .then(res => res ? (
                    this.props.launchMainApp ?
                        this.props.launchMainApp() : Navigation.dismissModal({
                            animationType: 'slide-down'
                        })
                ) :
                ''
            )

    }

    getCities() {

        return this.props.configAPI && this.props.configAPI.configObj && this.props.configAPI.configObj.content && this.props.configAPI.configObj.content.groceryCities ? this.props.configAPI.configObj.content.groceryCities : [];
    }


    async setUserSelectedCity() {
        let x = this.showComingSoon();
        try {
            if (!x) { //if not coming soon then save location and hit callbacks


                await AsyncStorage.setItem('latitude', this.state.region.latitude + '');
                await AsyncStorage.setItem('longitude', this.state.region.longitude + '');
                await AsyncStorage.setItem('userSelectedPlace', this.state.userLocation);
                await AsyncStorage.setItem('userSelectedCity', this.state.city);
                await AsyncStorage.setItem('subLocality', this.state.subLocality);
                this.props.groceryUserSelectedCity(this.state.city, this.state.userLocation,this.state.subLocality);
                this.props.callback ? this.props.callback(this.state.region.latitude, this.state.region.longitude, this.state.userLocation, this.state.city,this.state.subLocality) : '';
                return true;
            }
            else{
                return false; //if coming soon country
            }


        } catch (error) {
            return false;
        }

    }

    handleUnavailability() {
        Alert.alert(strings.unavailableInCity)
    }

    getComingSoonCities() {
        var groceryCities = this.getCities();
        var comingSoonCities = [];
        groceryCities.forEach((cityObj) => {
            if(cityObj.inService == false) {
                comingSoonCities.push(cityObj.city);
            }
        })
        return comingSoonCities;
    }

    showComingSoon() {

        let comingSoonCities = this.getComingSoonCities();
        comingSoonCities.forEach((city) => {
           if (city === this.state.city) {
               Alert.alert(strings.ComingSoon);
               return true;
           }
        });
        return false;

    }

    async userDefaultSelectedLocation() {
        try {
            this.setState({fromGooglePlaces: true});

            const longitude = await AsyncStorage.getItem('longitude');
            const latitude = await AsyncStorage.getItem('latitude');
            const userSelectedPlace = await AsyncStorage.getItem('userSelectedPlace');
            const userSelectedCity = await AsyncStorage.getItem('userSelectedCity');
            const userSubLocality  = await AsyncStorage.getItem('subLocality');
            return {longitude, latitude, userSelectedPlace, userSelectedCity, userSubLocality}
        }
        catch (error) {
            return false;
        }

    }

    getUserSavedLocation() {
        this.userDefaultSelectedLocation().then(res =>
            res.latitude && res.longitude ? (
                this.setState(prevState => {
                    return {
                        region: {
                            ...prevState.region,
                            fromGooglePlaces: true,
                            longitude: Number(res.longitude),
                            latitude: Number(res.latitude),


                        },
                        userLocation: res.userSelectedPlace,
                        city: res.userSelectedCity,
                        subLocality :res.userSubLocality
                    }
                })) : googleGetCityName(this.state.region.longitude, this.state.region.latitude, this.getCities()).then(data => {
                this.setState({
                    city: data.cityName,
                    userLocation: data.address,
                    inService: data.inService,
                    isLoading:false,
                    subLocality:data.subLocality
                });
            })
                .catch(error => console.log("error while fetching data from google", error))).catch(error => {
        })
    }

    getNativeUserLocation=(e)=> {

           if(e.longitude){
                   this.setState((prevState) => {
                       return {
                           region: {
                               ...prevState.region,
                               longitude: e.longitude,
                               latitude: e.latitude,
                               isLoading:true
                           }
                       }
                   }, () => {
                       googleGetCityName
                       (this.state.region.longitude, this.state.region.latitude, this.getCities()).then(data => {

                           this.setState({city: data.cityName, userLocation: data.address, inService: data.inService,isLoading:false,subLocality:data.subLocality});
                       })
                   })
           }
           else{
               Alert.alert("Location","Please enable your location ")
           }

         }


}

const styles = StyleSheet.create({
    iconSearch: {
        //flex: 1,
        //position: 'absolute',
        //top: 13,
        height: 15,
        width: 15,
        marginLeft: 6,
        marginRight: 4
    },
    userLocationButton: {
        position: 'absolute',
        bottom: 80,
        height: 50,
        width: 50,
        borderRadius: 25,
        right: 20,
        backgroundColor: 'white',
        shadowOpacity: 0.5,
        shadowRadius: 2.5,
        shadowOffset: {width: 2, height: 2},
        elevation: (Platform.OS === 'ios') ? 0 : 5,
        justifyContent: 'center',
        alignItems: 'center'

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
        position: 'absolute'
    },
    separator: {
        height: 20,
        width: 0.5,
        marginHorizontal: 1,
        backgroundColor: GLOBAL.COLORS.darkGreyColor
    },
    applyButton: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    applyText: {
        fontSize: 20,
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'black',
        marginTop: 1
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
        groceryUserSelectedCity: (selectedCity, userLocation, sublocality) => dispatch(_groceryUserSelectedCity(selectedCity, userLocation, sublocality)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(googlePlaces)



