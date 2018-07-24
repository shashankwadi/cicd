import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Picker,
    Modal,
    SectionList,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { connect } from 'react-redux';
import VectorIcon from 'Wadi/src/components/common/VectorIcon';
import * as GLOBAL from 'Wadi/src/utilities/constants';
// import { styles } from "../../views/Badge";
import { addAddress, getAddresses, deleteAddress } from '../../../actions/accountActions'
import Loader from '../../common/loader.native'
import { deepLinkActions } from 'Wadi/src/actions/globalActions';
import * as Constants from 'Wadi/src/components/constants/constants';

const CURRENT_SCREEN = AddressBookScreen;
export class AddressBookScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            input: {
                type: '',
                firstName: '',
                lastName: '',
                address1: '',
                city: '',
                fkCountry: '',
                cellPhone: '',
            },
            isModalVisible: false,
        }
    }

    componentDidMount() {
        this.props.getAddress();
    }


    render() {
        if (this.props.isFetching) {
            return (
                <Loader />
            )
        } else {

            return (
                <ScrollView style={{ backgroundColor: GLOBAL.COLORS.screenBackgroundGray, flexDirection: 'column', padding: 5 }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 5 }}>
                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <VectorIcon style={{ color: '#222', paddingRight: 5 }}
                                groupName={"MaterialIcons"} name={"book"} size={20} />

                            <Text style={styles.titleText}>Address book</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={styles.orangeButton}>
                            <VectorIcon style={{ color: 'white', paddingRight: 5 }}
                                groupName={"MaterialIcons"} name={"add-circle"} size={20} />

                            <Text style={{ color: 'white' }}>Add New Address</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ backgroundColor: '#333', height: 0.5 }} />
                    {(this.props.addresses && this.props.addresses.length > 0) ?
                        <FlatList
                            data={this.props.addresses}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={false}
                            renderItem={this.renderRowForList.bind(this)}
                            keyExtractor={(item, index) => item.idCustomerAddress} /> :
                        <Text>No address found. Add address from below</Text>}
                    {this.renderAddressInputForm()}
                </ScrollView>
            )
        }
    }

    renderRowForList({ item, index }) {
        return (
            <View
                style={[styles.addressItem, { backgroundColor: (index % 2 !== 0 ? 'white' : '#F3F3F3') }]}>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <VectorIcon style={{ color: 'grey' }}
                            groupName={"FontAwesome"} name={"home"} size={20} />
                        <Text style={{ paddingLeft: 5 }}>{item.firstName + ' ' + item.lastName}</Text>
                    </View>
                    {/* <Text style={styles.deliveryLabel}>{item.applied_items.length+' items(s)'} </Text> */}
                </View>

                <Text style={styles.row}>{item.address1 + ', ' + item.area + ', ' + item.city}</Text>

                <Text style={styles.row}>{item.cellPhone}</Text>
                <View style={[styles.row, { flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end' }]}>
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', padding: 10 }}
                        onPress={() => this.editAddress(item)}>
                        <VectorIcon style={{ color: GLOBAL.COLORS.lightGreyColor, paddingRight: 5 }}
                            groupName={"MaterialIcons"} name={"edit"} size={20} />

                        <Text style={{ color: GLOBAL.COLORS.lightGreyColor }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', padding: 10 }}
                        onPress={(event) => this.deleteAddress(item.idCustomerAddress)}>
                        <VectorIcon style={{ color: GLOBAL.COLORS.lightGreyColor, paddingRight: 5 }}
                            groupName={"MaterialIcons"} name={"delete"} size={20} />

                        <Text style={{ color: GLOBAL.COLORS.lightGreyColor }}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: '#333', height: 0.5 }} />
            </View>
        )
    }
    renderAddressInputForm() {
        return (
            <View>
                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                    <VectorIcon style={{ color: '#222', paddingRight: 5 }}
                        groupName={"MaterialIcons"} name={"add-circle"} size={20} />
                    <Text style={styles.titleText}>Add New Address</Text>
                </View>

                <View style={{ backgroundColor: '#AAA', height: 1, marginTop: 10, }} />

                <View style={{ margin: 10 }}>
                    <Text style={styles.inputLabel}>TYPE*</Text>
                    <View
                        ref="type"
                        style={[styles.inputField, { height: 40 }]}>
                        <Picker
                            style={{ height: 30 }}
                            // mode='dropdown'
                            selectedValue={this.state.input.type}
                            onValueChange={(value) => this.updateInputField('type', value)}>
                            <Picker.Item label="Select" value="" color="#AAA" />
                            <Picker.Item label="Home" value="Home" />
                            <Picker.Item label="Work" value="Office" />
                        </Picker>
                    </View>
                    <Text style={styles.inputLabel}>FIRST NAME*</Text>
                    <TextInput style={styles.inputField}
                        ref="firstName"
                        onSubmitEditing={() => this.refs.lastName.focus()}
                        onChangeText={(value) => this.updateInputField('firstName', value)} value={this.state.input.firstName}/>
                    <Text style={styles.inputLabel}>LAST NAME*</Text>
                    <TextInput style={styles.inputField}
                        ref="lastName"
                        onSubmitEditing={() => this.refs.address1.focus()}
                        onChangeText={(value) => this.updateInputField('lastName', value)} value={this.state.input.lastName}/>
                    <Text style={styles.inputLabel}>ADDRESS*</Text>
                    <TextInput style={styles.inputField}
                        ref="address1"
                        onSubmitEditing={() => this.refs.city.focus()}
                        onChangeText={(value) => this.updateInputField('address1', value)} value={this.state.input.address1}/>
                    <Text style={styles.inputLabel}>CITY*</Text>
                    <TextInput style={styles.inputField}
                        ref="city"
                        onChangeText={(value) => this.updateInputField('city', value)} value={this.state.input.city}/>
                    <Text style={styles.inputLabel}>COUNTRY*</Text>
                    <View
                        style={[styles.inputField, { height: 40 }]}>
                        <Picker
                            style={{ height: 30 }}
                            mode='dropdown'
                            selectedValue={this.state.input.fkCountry}
                            onSubmitEditing={() => this.refs.cellPhone.focus()}
                            onValueChange={(value) => this.updateInputField('fkCountry', value)}>
                            <Picker.Item label="Select" value="" color="#AAA" />
                            <Picker.Item label="Saudi Arabia" value="sa" />
                            <Picker.Item label="UAE" value="ae" />
                        </Picker>
                    </View>
                    <Text style={styles.inputLabel}>PHONE NUMBER*</Text>
                    <TextInput style={styles.inputField}
                        ref="cellphone"
                        onChangeText={(value) => this.updateInputField('cellPhone', value)} value={this.state.input.cellPhone}/>
                    <TouchableOpacity activeOpacity={1} style={{}}
                        onPress={this.saveAddress.bind(this)}>
                        <Text style={styles.checkoutButtonText}>
                            SAVE ADDRESS
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    updateInputField(key, value) {
        input = Object.assign({}, this.state.input);
        // console.log(value)
        input[key] = value;
        this.setState({ input: input });
    }

    deleteAddress(addressId) {
        this.props.deleteAddress(addressId)
    }
    editAddress(item) {
        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: Constants.screens.EditAddressPage,
            params: item
        });
    }
    saveAddress() {
        if (this.state.input.type === '') {
            Alert.alert("Select address type");
            return;
        } else if (this.state.input.firstName.length < 3) {
            Alert.alert("Enter first name");
            return;
        } else if (this.state.input.lastName.length < 3) {
            Alert.alert("Enter last name");
            return;
        } else if (this.state.input.address1.length < 5) {
            Alert.alert("Enter address ");
            return;
        } else if (this.state.input.city.length < 3) {
            Alert.alert("Enter city");
            return;
        } else if (this.state.input.cellPhone.length < 9) {
            Alert.alert("Enter cell phone");
            return;
        } else if (this.state.input.country === '') {
            Alert.alert("Select country");
            return;
        }
        this.props.addAddress(this.state.input);
    }

    togglePicker() {
        this.setState((prevState) => {
            return {
                isModalVisible: !prevState.isModalVisible,
            }
        });
    }
}
const styles = StyleSheet.create({
    orangeButton: {
        backgroundColor: 'orange',
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: 'white',
        alignItems: 'center',
        fontWeight: 'bold',
        flexDirection: 'row',
        borderRadius: 5
    },
    titleText: {
        color: '#333',
    },
    addressItem: {
        paddingTop: 10,
        backgroundColor: 'white',
    },
    row: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    inputLabel: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    inputField: {
        borderRadius: 5,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#CCC',
        marginBottom: 10,
        padding: 5,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: GLOBAL.COLORS.default_font,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen
    },
});
function mapStateToProps(state) {
    return {
        addresses: state.accounts.userData.addresses,
        isFetching: state.accounts.isFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addAddress: (body) => dispatch(addAddress(body)),
        getAddress: () => dispatch(getAddresses()),
        deleteAddress: (addressId) => dispatch(deleteAddress(addressId)),
        deepLinkActions: (params) => dispatch(deepLinkActions(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookScreen)