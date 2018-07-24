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
import {getSavedCards} from '../../../actions/accountActions'
import Loader from '../../common/loader.native'
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import * as Constants from 'Wadi/src/components/constants/constants';

const CURRENT_SCREEN = CreditCardScreen;
export class CreditCardScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            input: {},
        }
    }
    
    componentDidMount() {
        this.props.getSavedCards();
    }


    render() {
        if (this.props.isFetching) {
            return (
                <Loader />
            )
        } else {

            return (   
                <ScrollView style={{backgroundColor: GLOBAL.COLORS.screenBackgroundGray, flexDirection: 'column', padding: 5}}>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', padding: 5}}>
                        <View style={{flexDirection:'row', paddingTop: 10}}>
                            <VectorIcon style={{color: '#222', paddingRight: 5}}
                                        groupName={"MaterialIcons"} name={"credit-card"} size={20}/>

                            <Text style={styles.titleText}>My Saved Cards</Text>
                        </View>
                    </View>

                    <View style={{backgroundColor: '#333', height: 0.5}} />
                    <FlatList
                        data={this.props.cards}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        renderItem={this.renderRowForList.bind(this)}
                        keyExtractor={(item, index) => item.number} />
                    {(!this.props.cards || this.props.cards.length==0)?<Text>No cards found. Add cards from below for faster checkout</Text>:null}
                    {this.renderCardInputForm()}
                </ScrollView>
            )
        }
    }

    renderRowForList({ item, index }) {
        return(
            <View
                style={[styles.cardItem, {backgroundColor: (index%2!==0?'white':'#F3F3F3')}]}>
                <View style={styles.row}>
                    <View style={{flex: 1, flexDirection:'row'}}>
                    <VectorIcon style={{color: 'grey', margin: 10}}
                                    groupName={"FontAwesome"} name={item.cardLabel==="MasterCard"?"cc-mastercard"
                                    :(item.cardLabel==="Visa"?"cc-visa":"credit-card")} 
                                    size={40}/>
                    <Text style={{paddingLeft: 5}}>{item.cardLabel+"\nXXXX-XXXX-XXXX-"+item.last4}</Text>
                    </View>
                </View>
                <View style={[styles.row, {flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end'}]}>
                    <TouchableOpacity activeOpacity ={1} style={{flexDirection: 'row', padding: 10}}
                        onPress={(event) => this.deleteCard(item.number)}>
                        <VectorIcon style={{color: GLOBAL.COLORS.lightGreyColor, paddingRight: 5}}
                                groupName={"MaterialIcons"} name={"delete"} size={20}/>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: '#333', height: 0.5}} />
            </View>
        )
    }
    renderCardInputForm() {
        return (
            <View>
                <View style={{flexDirection:'row', paddingTop: 10}}>
                        <VectorIcon style={{color: '#222', paddingHorizontal: 5}}
                                    groupName={"MaterialIcons"} name={"credit-card"} size={20}/>
                        <Text style={styles.titleText}>Add New Card</Text>
                </View>

                <View style={{backgroundColor: '#AAA', height: 1, marginTop: 10,}} />
            
                <View style={{margin: 10}}>
                    
                    <Text style={styles.inputLabel}>Enter Card Number*</Text>
                    <TextInput style={styles.inputField} 
                        ref="cardNumber"
                        maxLength= {16}
                        // onSubmitEditing={() => this.refs.lastName.focus()}
                        onChangeText={(value)=>this.updateInputField('cardNumber', value)}>
                        {this.state.input.firstName}
                    </TextInput>


                    <Text style={styles.inputLabel}>Expiry Date*</Text>
                    <View style={{flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end'}}>
                        <View 
                            ref="expiryMonth"
                            style={[styles.inputField, {height: 40, flex: 1, marginRight: 10}]}>
                            <Picker
                                style={{height: 30}}
                                // mode='dropdown'
                                selectedValue={this.state.input.expiryMonth}
                                onValueChange={(value)=>this.updateInputField('expiryMonth', value)}>
                                <Picker.Item label="Month" value="" color="#AAA" />
                                <Picker.Item label="January" value="jan" />
                                <Picker.Item label="Febrary" value="feb" />
                                <Picker.Item label="March" value="mar" />
                                <Picker.Item label="April" value="apr" />
                                <Picker.Item label="May" value="may" />
                                <Picker.Item label="June" value="jun" />
                                <Picker.Item label="July" value="jul" />
                                <Picker.Item label="August" value="aug" />
                                <Picker.Item label="September" value="sep" />
                                <Picker.Item label="October" value="oct" />
                                <Picker.Item label="November" value="nov" />
                                <Picker.Item label="December" value="dec" />
                            </Picker>
                        </View>
                        <View 
                            ref="expiryYear"
                            style={[styles.inputField, {height: 40, flex: 1, marginLeft: 10}]}>
                            <Picker
                                style={{height: 30}}
                                // mode='dropdown'
                                selectedValue={this.state.input.expiryYear}
                                onValueChange={(value)=>this.updateInputField('expiryYear', value)}>
                                <Picker.Item label="Year" value="" color="#AAA" />
                                <Picker.Item label="2018" value="2018" />
                                <Picker.Item label="2019" value="2019" />
                                <Picker.Item label="2020" value="2020" />
                                <Picker.Item label="2021" value="2021" />
                                <Picker.Item label="2022" value="2022" />
                                <Picker.Item label="2023" value="2023" />
                                <Picker.Item label="2024" value="2024" />
                                <Picker.Item label="2025" value="2025" />
                            </Picker>
                        </View>
                    </View>


                    <Text style={styles.inputLabel}>CVV*</Text>
                    <TextInput style={[styles.inputField, {width: 60}]} 
                        ref="cvv"
                        maxLength= {3}
                        secureTextEntry= {true}
                        onSubmitEditing={() => this.refs.name.focus()}
                        onChangeText={(value)=>this.updateInputField('cvv', value)}>
                        {this.state.input.cvv}
                    </TextInput>
                    <Text style={styles.inputLabel}>Name on Card*</Text>
                    <TextInput style={styles.inputField} 
                        ref="name"
                        onChangeText={(value)=>this.updateInputField('name', value)}>
                        {this.state.input.name}
                    </TextInput>
                    
                    <TouchableOpacity activeOpacity ={1} style={{}}
                        onPress={this.saveAddress.bind(this)}>
                        <Text style={styles.checkoutButtonText}>
                            SAVE CARD
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

    deleteCard(addressId) {
        
    }
    saveAddress() {

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
    cardItem: {
        paddingTop: 10,
        backgroundColor: 'white'
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
        cards: state.accounts.userData.cards,
        isFetching: state.accounts.isFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSavedCards: () => dispatch(getSavedCards()),
        deepLinkActions: (params) => dispatch(deepLinkActions(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardScreen)