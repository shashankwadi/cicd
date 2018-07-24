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
import {editAddress} from '../../../actions/accountActions'
import Loader from '../../common/loader.native'
import {backAction} from '../../../actions/navigatorAction'
import * as Constants from 'Wadi/src/components/constants/constants';

let isFetching = false;
export class AddressEditScreen extends Component {
    constructor(props) {
        super(props);
        const params = this.props;
        // console.log(params);
        this.state = {
            input: params
        }
    }

    render() {
        if (isFetching === true
            && this.props.isFetching === false
            && this.props.errorInFetch === false){
            this.props.navigator.pop();
        }
    
        isFetching = this.props.isFetching;
        if (this.props.isFetching) {
            return (
                <Loader />
            )
        } else {

            return (   
                <ScrollView style={{backgroundColor: GLOBAL.COLORS.screenBackgroundGray, flexDirection: 'column', padding: 5}}>
                    {this.renderAddressInputForm()}
                
                </ScrollView>
            )
        }
    }

    renderRowForList({ item, index }) {
        return(
            <View
                style={[styles.addressItem, {backgroundColor: (index%2!==0?'white':'#F3F3F3')}]}>
                <View style={styles.row}>
                    <View style={{flex: 1, flexDirection:'row'}}>
                    <VectorIcon style={{color: 'grey'}}
                                    groupName={"FontAwesome"} name={"home"} size={20}/>
                    <Text style={{paddingLeft: 5}}>{item.firstName+ ' '+item.lastName}</Text>
                    </View>
                    {/* <Text style={styles.deliveryLabel}>{item.applied_items.length+' items(s)'} </Text> */}
                </View>

                <Text style={styles.row}>{item.address1+ ', '+ item.area+ ', ' + item.city}</Text>

                <Text style={styles.row}>{item.cellPhone}</Text>
                <View style={[styles.row, {flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end'}]}>
                    <TouchableOpacity activeOpacity ={1} style={{flexDirection: 'row', padding: 10}}
                        onPress={()=>this.togglePicker()}>
                        <VectorIcon style={{color: GLOBAL.COLORS.lightGreyColor, paddingRight: 5}}
                                groupName={"MaterialIcons"} name={"edit"} size={20}/>

                        <Text style={{color: GLOBAL.COLORS.lightGreyColor}}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity ={1} style={{flexDirection: 'row', padding: 10}}
                        onPress={(event) => this.deleteAddress(item.idCustomerAddress)}>
                        <VectorIcon style={{color: GLOBAL.COLORS.lightGreyColor, paddingRight: 5}}
                                groupName={"MaterialIcons"} name={"delete"} size={20}/>

                        <Text style={{color: GLOBAL.COLORS.lightGreyColor}}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: '#333', height: 0.5}} />
            </View>
        )
    }
    renderAddressInputForm() {
        return (
            <View>
                <View style={{flexDirection:'row', paddingTop: 10}}>
                        <VectorIcon style={{color: '#222', paddingRight: 5}}
                                    groupName={"MaterialIcons"} name={"add-circle"} size={20}/>
                        <Text style={styles.titleText}>Edit Address</Text>
                </View>

                <View style={{backgroundColor: '#AAA', height: 1, marginTop: 10,}} />
            
                <View style={{margin: 10}}>
                    <Text style={styles.inputLabel}>TYPE*</Text>
                    <View 
                        style={[styles.inputField, {height: 40}]}>
                        <Picker
                            style={{height: 30}}
                            // mode='dropdown'
                            selectedValue={this.state.input.type}
                            onValueChange={(value)=>this.updateInputField('type', value)}>
                            <Picker.Item label="Select" value="" color="#AAA" />
                            <Picker.Item label="Home" value="Home" />
                            <Picker.Item label="Work" value="Office" />
                        </Picker>
                    </View>
                    <Text style={styles.inputLabel}>FIRST NAME*</Text>
                    <TextInput style={styles.inputField} 
                        ref="firstName"
                        onSubmitEditing={() => this.refs.lastName.focus()}
                        onChangeText={(value)=>this.updateInputField('firstName', value)} valu={this.state.input.firstName}/>
                    <Text style={styles.inputLabel}>LAST NAME*</Text>
                    <TextInput style={styles.inputField} 
                        ref="lastName"
                        onSubmitEditing={() => this.refs.address1.focus()}
                        onChangeText={(value)=>this.updateInputField('lastName', value)} value={this.state.input.lastName}/>
                    <Text style={styles.inputLabel}>ADDRESS*</Text>
                    <TextInput style={styles.inputField} 
                        ref="address1"
                        onSubmitEditing={() => this.refs.city.focus()}
                        onChangeText={(value)=>this.updateInputField('address1', value)} value={this.state.input.address1}/>
                    <Text style={styles.inputLabel}>CITY*</Text>
                    <TextInput style={styles.inputField} 
                        ref="city"
                        onChangeText={(value)=>this.updateInputField('city', value)} value={this.state.input.city}/>
                    <Text style={styles.inputLabel}>COUNTRY*</Text>
                    <View 
                        style={[styles.inputField, {height: 40}]}>
                        <Picker
                            style={{height: 30}}
                            mode='dropdown'
                            selectedValue={this.state.input.fkCountry}
                            onSubmitEditing={() => this.refs.cellPhone.focus()}
                            onValueChange={(value)=>this.updateInputField('fkCountry',value)}>
                            <Picker.Item label="Select" value="" color="#AAA" />
                            <Picker.Item label="Saudi Arabia" value="sa" />
                            <Picker.Item label="UAE" value="ae" />
                        </Picker>
                    </View>
                    <Text style={styles.inputLabel}>PHONE NUMBER*</Text>
                    <TextInput style={styles.inputField} 
                        ref="cellphone"
                        onChangeText={(value)=>this.updateInputField('cellPhone', value)} value={this.state.input.cellPhone}/>
                    <TouchableOpacity activeOpacity ={1} style={{}}
                        onPress={this.saveAddress.bind(this)}>
                        <Text style={styles.checkoutButtonText}>
                            SAVE ADDRESS
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    updateInputField (key, value) {
        input = Object.assign({}, this.state.input);
        // console.log(value)
        input[key] = value;
        this.setState({input: input});
    }

    saveAddress() {
        if (this.state.input.type==='') {
            Alert.alert("Select address type");
            return;
        } else if (this.state.input.firstName.length<3) {
            Alert.alert("Enter valid first name");
            return;
        } else if (this.state.input.lastName.length<3) {
            Alert.alert("Enter valid last name");
            return;
        } else if (this.state.input.address1.length<5) {
            Alert.alert("Enter valid address ");
            return;
        } else if (this.state.input.city.length<3) {
            Alert.alert("Enter valid city");
            return;
        } else if (this.state.input.cellPhone.length<9) {
            Alert.alert("Enter valid cell phone");
            return;
        } else if (this.state.input.country==='') {
            Alert.alert("Select country");
            return;
        }
        this.props.editAddress(this.state.input);
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
    inputField : {
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
        padding:  10,
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen
    },
});
function mapStateToProps(state) {
    return {
        isFetching: state.accounts.isFetching,
        errorInFetch: state.accounts.errorInFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        editAddress: (body) => dispatch(editAddress(body)),
        backAction: (routeName) => dispatch(backAction(routeName)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressEditScreen)