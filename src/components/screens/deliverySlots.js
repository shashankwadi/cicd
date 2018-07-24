import React, {Component} from "react";
import {Loader, Modal, SectionList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {connect} from 'react-redux';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {beginCheckout, getProductReview} from "../../actions/cartActions";
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {backAction, navigateAction} from '../../actions/navigatorAction';
import {strings} from 'Wadi/src/utilities/uiString';
import * as Constants from 'Wadi/src/components/constants/constants';
import VectorIcon from "../common/VectorIcon.native";

let delivery_options;
let CURRENT_SCREEN = Constants.screens.DeliverySlots;

export class DeliverySlotsPage extends Component {

    static navigatorStyle = {
        drawUnderTabBar: false,
    };



    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            selectedSlot: {},
            selectedDate: {},
        };

        this.renderRowForList = this.renderRowForList.bind(this);
        this.onSlotSelected = this.onSlotSelected.bind(this);
        delivery_options = this.props.cartReviewData.delivery_options;
    }


    componentWillMount() {
        const selected_date = this.props.cartReviewData.selected_date;
        const selected_slot = this.props.cartReviewData.selected_slot;
        const is_express_delivery = this.props.cartReviewData.is_express_delivery;

        let selectedDay = {};
        let selectedSlot = {};
        delivery_options.forEach(function (option) {
            option.slots.forEach(function (slot) {
                slot.timing.forEach(function (timeslot) {
                    if (timeslot.selected && timeslot.selected === true) {
                            selectedSlot = timeslot;
                        selectedDay = slot;
                        }
                    })

            })
        });

        this.setState({
            selectedSlot: selectedSlot,
            selectedDate: selectedDay,
            slots: this.getSlots(),
        });

    }


    render() {
        let {isFetching, orderPlaced} = this.props.cart;
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                {/*<FlatList*/}
                {/*data={delivery_options}*/}
                {/*horizontal={false}*/}
                {/*showsHorizontalScrollIndicator={false}*/}
                {/*removeClippedSubviews={false}*/}
                {/*renderItem={(item) => this.renderRowForList(item)}*/}
                {/*keyExtractor={(item, index) => item.label} />*/}
                {this.renderRowForList(delivery_options[0])}
                <View style={{
                    backgroundColor: (isFetching || orderPlaced) ? 'grey' : GLOBAL.CONFIG.isGrocery ? GLOBAL.COLORS.wadiDarkGreen : GLOBAL.COLORS.wadiGroceryNavBar,
                    margin: 10,
                    borderRadius: 5,
                    height: 45,
                    justifyContent: 'center',
                }}>

                    <TouchableOpacity
                        style={{}} activeOpacity={1}
                        disabled={isFetching || orderPlaced}
                        onPress={this.reviewProduct.bind(this)}>
                        <Text style={styles.CheckoutButtonText}>{strings.CHECKOUT}</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.isModalVisible}
                    onRequestClose={()=>this.togglePicker()}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(52, 52, 52, 0.6)'
                    }}>
                        <View
                            style={{
                                backgroundColor: '#50000000',
                                margin: 20,
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'}}>

                            <SectionList
                                renderItem={({section, item}) => this.renderSlotItem(section, item)}
                                renderSectionHeader={({section}) =>
                                    <Text
                                        style={{
                                            color: '#000',
                                            textAlign: 'center',
                                            padding: 8,
                                            backgroundColor: GLOBAL.COLORS.wadiDarkGreen,
                                        }}>{section.key}</Text>
                                }
                                sections={this.state.slots}
                            /> 
                        </View>
                    </View>
                    
                    
                </Modal>
            </View>
        )
    }

    renderRowForList(item) {
        return (
                <View
                    style={styles.deliveryTypeBox}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <VectorIcon style={{color: 'black', paddingRight: 5}}
                                    groupName={"MaterialCommunityIcons"} name={"truck-delivery"} size={20}/>
                        <Text style={styles.deliveryLabel}>{item.label}</Text>
                    </View>
                    {/*<View style={styles.row}>*/}
                    {/**/}
                    {/*<Text style={styles.deliveryLabel}>{item.applied_items.length + ' items(s)'} </Text>*/}
                    {/*</View>*/}
                    <Text>Delivery Time:</Text>
                    <TouchableOpacity style={styles.selectedSlot}
                                      onPress={() => this.togglePicker()}>
                        <Text style={{color: 'black'}}>{
                            this.state.selectedDate.date || this.state.selectedDate.key ?
                                ((this.state.selectedDate.date || this.state.selectedDate.key)
                                    + ' ' + this.state.selectedSlot.label) : ""
                        }
                        </Text>
                        <VectorIcon style={{color: 'black', paddingRight: 5}}
                                    groupName={"FontAwesome"} name={"angle-down"} size={20}/>
                    </TouchableOpacity>
                </View>

        );

    }

    getSlots() {
        const slotDays = []; // Create the blank map
        if (delivery_options) {
            const x = delivery_options[0].slots;
            x.forEach(function (x) {
                var temp = {};
                temp['key'] = x.date;
                temp['data'] = x.timing;
                slotDays.push(temp)
            });
        }
        return slotDays;
    }

    renderSlotItem(section, item) {
        return (
            <Text style={{
                color: "#666",
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 15,
                backgroundColor: '#FFFFFF',
            }}
                  onPress={() => this.onSlotSelected(section, item)}>{(item.label)}</Text>
        )
    }

    onSlotSelected(selectedDay, selectedSlot) {
        this.togglePicker();
        this.setState({
            selectedSlot: selectedSlot,
            selectedDate: selectedDay,
        })
    }

    togglePicker() {
        this.setState((prevState)=>{
            return{
                isModalVisible: !prevState.isModalVisible,
            }
        });
    }

    reviewProduct() {
        let {data, itemsCount} = this.props.cart;
        let selected_slot = (this.state.selectedSlot && this.state.selectedSlot.id) ? this.state.selectedSlot.id : "";
        let selected_date = this.state.selectedDate ? (this.state.selectedDate.date ? this.state.selectedDate.date : this.state.selectedDate.key) : "";
        this.props.productReview({data: data, slot: { selected_slot: selected_slot, selected_date: selected_date }});
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.cart.isFetching === true
            && nextProps.cart.isFetching === false
            && nextProps.cart.cartReview) {
            this.checkoutClicked();
        }
    }


    checkoutClicked() {

        this.props.beginCheckout();

        this.props.deepLinkActions({
            navigator: this.props.navigator,
            currentScreen: CURRENT_SCREEN,
            toScreen: Constants.screens.Checkout,
        });
        //this.props.navigation.navigate(Constants.screens.Checkout);
    }
}
const styles = StyleSheet.create({
    deliveryTypeBox: {
        backgroundColor: GLOBAL.COLORS.wadiYellow,
        padding: 20,
        marginTop: 10,
    },
    deliveryLabel: {
        color:'#000000',
        fontWeight: 'bold',
        fontFamily: GLOBAL.COLORS.default_font_bold,
    },
    row: {
        marginBottom: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "red"
    },
    selectedSlot: {
        marginTop: 10,
        padding: 5,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#000000',
        fontFamily: GLOBAL.COLORS.default_font,
        color: GLOBAL.COLORS.lightGreyColor,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    CheckoutButtonText: {
        color: GLOBAL.CONFIG.isGrocery ? 'black': 'white',
        fontSize: 14,
        fontFamily: GLOBAL.COLORS.default_font,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});
function mapStateToProps(state) {
    return {
        cartReviewData: state.cart.cartReview,
        cart: state.cart,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        /*navigate Action imported*/
        navigateAction: (routeName, params) => dispatch(navigateAction(routeName, params)),
        backAction: (routeName) => dispatch(backAction(routeName)),

        productReview: (params) => dispatch(getProductReview(params)),
        beginCheckout: () => dispatch(beginCheckout()),
        deepLinkActions: (params) => dispatch(deepLinkActions(params)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliverySlotsPage)