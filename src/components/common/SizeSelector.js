/**
 * Created by Manjeet Singh
 * Created on 2018-01-22 13:27:21
 * This component can be used as reusable size selector
 *
 */

'use strict';

import React, { PureComponent, Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';


import * as GLOBAL from 'Wadi/src/utilities/constants';

import VectorIcon from './VectorIcon';

//add proptypes here
const propTypes = {
    updateItem: PropTypes.func,  //pass function to update particular item in parent
    callBack: PropTypes.func,    //call back on done pressed
    simples: PropTypes.array,    //array of simples
    handleSizeChart: PropTypes.func,     //function to handle size chart actions;
    cancelable: PropTypes.bool,
};

const defaultProps = {
    updateItem: undefined,
    callBack: undefined,
    simples: [],
    handleSizeChart: undefined,
    cancelable: true
};


class SizeSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            selectedSize: "",
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => { this.closeModal() }}
                presentationStyle={'overFullScreen'}
            >
                <TouchableWithoutFeedback onPress={() => { (this.props.cancelable) ? this.closeModal() : console.log("not closeable") }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.sizeContainer}>
                            <View style={styles.header}>
                                <Text>Select Size</Text>
                                {(!!this.props.sizeChartAvailable) &&
                                    <TouchableOpacity activeOpacity ={1}
                                        onPress={() => this.showSizeChart()}
                                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <VectorIcon groupName={"FontAwesome"} name={"question-circle"} size={20}
                                            style={{ color: 'grey' }} />
                                        <Text style={[{ color: 'grey' }]}>{"Size Guide"}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={styles.content}>
                                <FlatList
                                    selected={this.state.selectedSize}
                                    horizontal={true}
                                    data={this.props.simples}
                                    renderItem={this.renderItem.bind(this)}
                                    keyExtractor={(item, index) => {return `sizeselector-${item.sku}-${index}}`}}
                                />
                            </View>
                            <View style={styles.footer}>
                                <TouchableOpacity
                                disabled ={!(this.state.selectedSize && this.state.selectedSize !== "")}
                                 activeOpacity ={1} style={{ padding: 16 }} onPress={() => this.donePressed()}>
                                    <Text style={[styles.doneText, {color:(this.state.selectedSize && this.state.selectedSize !== "")?GLOBAL.COLORS.wadiDarkGreen:GLOBAL.COLORS.lightGreyColor}]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    renderItem = ({ item, index }) => {
        let { sku, size, quantity } = item;
        let isSelected = (this.state.selectedSize && this.state.selectedSize.sku === sku) ? true : false;
        let disabled = (!quantity || (quantity && quantity === 0)) ? true : false;
        return (
            <TouchableOpacity activeOpacity ={1}
                disabled={disabled}
                style={{ justifyContent: 'center', alignItems: 'center', }}
                onPress={() => this.updateItem(item)}>
                <View style={{
                    marginHorizontal: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor:(disabled)? GLOBAL.COLORS.screenBackgroundGray:((isSelected) ? '#333' : '#FFF')
                }}>
                    <Text style={{
                        textAlign: 'center',
                        color: (isSelected) ? "#FFF" : "#333"
                    }}>{item.size}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    updateItem = (item) => {
        this.setState({ selectedSize: item });
        if (this.props.updateItem) {
            this.props.updateItem(item);
        }
    }

    closeModal = () => {
        this.setState((prevState) => {
            return {
                selectedSize:"",
                visible: false
            }
        });
    }
    openModal = () => {
        this.setState((prevState) => {
            return {
                selectedSize:"",
                visible: true
            }
        });
    }

    donePressed = () => {
        this.closeModal();
        if (this.props.callBack) {
            this.props.callBack(this.state.selectedSize);
        }
    }
    showSizeChart = () => {
        this.closeModal();
        if (this.props.handleSizeChart) {
            this.props.handleSizeChart();
        }
    }
}

SizeSelector.propTypes = propTypes;
SizeSelector.defaultProps = defaultProps;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    sizeContainer: {
        //height: 200,
        width: '100%',
        backgroundColor: GLOBAL.COLORS.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,

    },
    content: {
        padding: 10,
    },
    footer: {
        borderColor: GLOBAL.COLORS.lightGreyColor,
        borderTopWidth: 1
    },
    doneText: {
        textAlign: 'center',
        color: GLOBAL.COLORS.wadiDarkGreen,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 16
    }
})
export default SizeSelector