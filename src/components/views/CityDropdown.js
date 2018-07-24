import React, {Component} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {strings} from 'utilities/uiString';

import {dimensions} from 'utilities/utilities';
import {connect} from 'react-redux';
import {setSelectedCity} from "../../actions/configAPIActions";
import * as GLOBAL from '../../utilities/constants';

class CityDropdown extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //   selected: { Popularity: true }
        // }
    }

    _changeCityHandler = (cityObj) =>{
        this.props.setSelectedCity(cityObj.label_en)
        .then(() => {
            this.props.handleToggleCityDropdown();
            this.props.handleSelectCity(cityObj.label_en);
        })
        .catch(() => {
            // do nothing
        });

    };

    // componentWillMount(){
    //     console.log(this.props.configStore.selectedCity.toLowerCase())
    // }


    render() {
        return (
            <Modal animationType={"slide"}
                   transparent={true}
                   visible={this.props.isCityDropdownVisible}>
                <View style={styles.modalContent}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity activeOpacity ={1} disabled={true}>
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: GLOBAL.FONTS.default_font_bold,
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}>Cities</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity ={1} onPress={this.props.handleToggleCityDropdown}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: GLOBAL.FONTS.default_font,
                                    color: 'white'
                                }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {
                                this.props.cities.map((item) => {
                                    const isSelected = (this.props.configStore.selectedCity ? this.props.configStore.selectedCity.toUpperCase() == item.label_en.toUpperCase() : false);
                                    return (
                                        <TouchableOpacity activeOpacity ={1} key={item.label_en} onPress={() => {this._changeCityHandler(item)}} style={{
                                            backgroundColor: (isSelected) ? '#ececec' : 'white',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 16,
                                            paddingVertical: 10,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#e6e6e6'
                                        }}>
                                            <Text style={{
                                                fontWeight:  (isSelected) ? 'bold': 'normal',
                                                fontFamily: (isSelected) ?  GLOBAL.FONTS.default_font_bold: GLOBAL.FONTS.default_font,
                                                fontSize: 16,
                                                color: (isSelected) ? GLOBAL.COLORS.wadiDarkGreen : GLOBAL.COLORS.darkGreyColor
                                            }}>{item.label_en}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>);
    }

}

const styles = StyleSheet.create({

    modalContent: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: '100%'
    },

    content: {
        width: '100%',
        backgroundColor: '#fff',
        marginBottom: 60,
        marginTop: 160,
        paddingBottom: 8,
        display: 'flex',
    },
    applyContainer: {
        justifyContent: 'center',
        backgroundColor: 'green',
        height: 50,
        marginBottom: 0,
        flex: 1
    },
    applyButton: {
        textAlign: 'center',
        backgroundColor: 'green',
        fontSize: 16,
        padding: 0
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
        borderColor: '#e6e6e6',
        borderBottomWidth: 1,
        padding: 16
    }

});

function mapStateToProps(state) {

    return {
        product: state.productDetailReducers,
        configStore: state.configAPIReducer
    }
}


function mapDispatchToProps(dispatch){
    return {
        setSelectedCity: (city_en) => dispatch(setSelectedCity(city_en))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CityDropdown)