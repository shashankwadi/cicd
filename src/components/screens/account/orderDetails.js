import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView
} from "react-native";
import {getListOfOrders, getTrackingOrderWebViewToken} from '../../../actions/accountActions'
import Loader from '../../common/loader.native'
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {strings} from 'utilities/uiString';
import store from 'Wadi/src/reducers/store';
import {screens} from "../../constants/constants";

export default class OrderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderDetails: null
        }
    }

    componentWillMount() {
        this.setState({orderDetails: this.props.orderDetails});

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.navigation && nextProps.navigation.state && nextProps.navigation.state.params && nextProps.navigation.state.params.orderDetails) {
            this.setState({orderDetails: nextProps.navigation.state.params.orderDetails});
            //console.log('order details', this.state.orderDetails);
        }

    }

    _navigateToTrackingWebView = () => {
        if (this.state && this.state.orderDetails && this.state.orderDetails.orderNr) {
            getTrackingOrderWebViewToken(this.state.orderDetails.orderNr)
                .then((res) => {
                    if (res.code === 200 && !!res.url) {
                        this.props.navigator.push({screen: screens.AccountsToWebView, passProps: {url: res.url}})
                    } else {
                        //do nothing
                    }
                })
                .catch((e) => {
                    this.props.navigator.pop();
                })
        }

    };


    render() {
        //console.log(this.state.orderDetails);
        return (
            <ScrollView style={styles.orderDetailContainer}>

                {
                    this.state.orderDetails
                        ?
                        <View>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Order Number</Text>
                                    <Text style={styles.tableField}>{this.state.orderDetails.orderNr}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Tracking</Text>
                                    <TouchableOpacity activeOpacity={1} onPress={this._navigateToTrackingWebView}>
                                        <Text
                                            style={[styles.tableField, styles.blueText]}>{this.state.orderDetails.orderNr}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Payment Method</Text>
                                    <Text style={styles.tableField}>{this.state.orderDetails.paymentMethod}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Grand Total</Text>
                                    <Text
                                        style={styles.tableField}>{`${this.state.orderDetails.grandTotal} ${this.state.orderDetails.currency}`}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Shipping Address</Text>
                                    <Text
                                        style={styles.tableField}>{`${this.state.orderDetails.shippingAddress.address1}, ${this.state.orderDetails.shippingAddress.city}`}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Billing Address</Text>
                                    <Text
                                        style={styles.tableField}>{`${this.state.orderDetails.shippingAddress.address1}, ${this.state.orderDetails.shippingAddress.city}`}</Text>
                                </View>
                            </View>
                            {this.state.orderDetails && this.state.orderDetails.items && this.state.orderDetails.items.length > 0 &&
                            <View style={styles.itemsContainer}>

                                {
                                    this.state.orderDetails.items.map((item) => {
                                        return (
                                            <View style={styles.orderContainer} key={item.sku}>

                                                <View style={styles.imageContainer}>
                                                    <Image
                                                        style={{width: '100%', height: 100}}
                                                        source={{uri: item.imageUrl}}/>
                                                </View>
                                                <View style={styles.orderDetailsContainer}>
                                                    <View style={styles.itemNameContainer}>
                                                        <Text style={styles.itemName}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.orderDetail}>
                                                        <Text style={styles.label}>Sku: </Text>
                                                        <Text style={[styles.value, styles.blueText]}>{item.sku}</Text>
                                                    </View>
                                                    <View style={styles.orderDetail}>
                                                        <Text style={styles.label}>Item Price: </Text>
                                                        <Text
                                                            style={styles.value}>{`${item.unitPrice} ${this.state.orderDetails.currency}`}</Text>
                                                    </View>
                                                    <View style={styles.orderDetail}>
                                                        <Text style={styles.label}>Item Status </Text>
                                                        <Text
                                                            style={[styles.value, styles.orangeText]}>{item.status}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        )
                                    })
                                }
                            </View>
                            }

                        </View>
                        :
                        <View/>
                }
            </ScrollView>
        );
    }


}


const styles = StyleSheet.create({
    orderDetailContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },

    tableContainer: {
        borderWidth: 2,
        borderTopWidth: 0,
        borderColor: '#d6d6d6',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        marginBottom: 20
    },

    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#d6d6d6',

        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 6,
        paddingRight: 6
    },

    tableLabel: {
        width: 130,
        color: '#333',
        fontWeight: '600',
        textAlign: 'left',
        fontSize: 14,
    },
    tableField: {
        width: 105,
        color: '#333',
        textAlign: 'left',
        flex: 1,
        fontSize: 12
    },

    itemsContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20
    },
    orderContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,

        backgroundColor: '#fff',
        borderRadius: 1,
        shadowOpacity: 0.3,
        shadowRadius: 2.5,
        shadowOffset: {width: 1, height: 2},
        padding: 20,
        marginBottom: 10
    },
    imageContainer: {
        borderWidth: 2,
        borderColor: '#d6d6d6',
        borderRadius: 4,
        width: '25%',
        paddingLeft: 3,
        paddingRight: 3,
        marginRight: 15,
        height: 113,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderDetailsContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    orderDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    label: {
        color: '#666',
        width: 65,
        marginRight: 15,
        fontSize: 12,
    },
    value: {
        flex: 1,
        textAlign: 'left',
        color: '#666',
        fontSize: 12
    },
    greyText: {
        color: '#666',
        textAlign: 'left'
    },
    blueText: {
        color: '#4DAEA7',
        textAlign: 'left'
    },
    orangeText: {
        color: '#fb8702',
        textAlign: 'left',
        fontWeight: '600'
    },
    itemNameContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    itemName: {
        color: '#333',
        fontWeight: '600',
        fontSize: 12
    }


});