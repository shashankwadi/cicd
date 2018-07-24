import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import {getListOfOrders} from '../../../actions/accountActions'
import Loader from '../../common/loader.native'
import {deepLinkActions} from 'Wadi/src/actions/globalActions';
import {strings} from 'utilities/uiString';
import * as GLOBAL from 'Wadi/src/utilities/constants';

export default class MyOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataArr: [], //array []
            isLoading: true
        }
    }

    componentWillMount() {
        this.setState({dataArr: []})
        this._getOrders();
    }

    _getOrders = () => {
        getListOfOrders()
            .then((res) => {
                if (res.status === 200) {
                    this.setState({isLoading: false, dataArr: res.data});
                }
                else {
                    this.setState({isLoading: false, dataArr: []});
                    Alert.alert(strings.ServerError);
                }
            });
    };


    componentWillReceiveProps() {
        //this._getOrders();
    }


    _keyExtractor = (item, index) => item.order.orderNr;

    _onPressItem = (id: string) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return {selected};
        });
    };

    _formatDate = (timestamp) => {
        const d = new Date(timestamp),
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    };

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.orderContainer}
                              onPress={() => this.props.navigator.push({
                                      screen: 'OrderDetailsScreen',
                                      passProps: {orderDetails: item.orderDetails}
                                  }
                              )}>

                <View style={styles.imageContainer}>
                    <Image
                        style={{width: '100%', height: 100}}
                        source={{uri: item.orderDetails.items[0].imageUrl}}/>
                </View>
                <View style={styles.orderDetailsContainer}>
                    <View style={styles.orderDetail}>
                        <Text style={styles.label}>Order Number: </Text>
                        <Text style={[styles.value, styles.blueText]}>{item.order.orderNr}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                        <Text style={styles.label}>Order Date: </Text>
                        <Text style={styles.value}>{this._formatDate(item.order.createdAt)}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                        <Text style={styles.label}>Order Amount: </Text>
                        <Text style={styles.value}>{`${item.order.grandTotal} ${item.order.currency}`}</Text>
                    </View>
                    <View style={styles.itemNameContainer}>
                        <Text style={styles.itemName}>
                            {item.orderDetails.items[0].name}
                        </Text>
                        {
                            item.orderDetails.items.length - 1 > 0
                            &&
                            <Text style={{marginTop: 7, color: '#4daea7', fontWeight: '600'}}>
                                + {item.orderDetails.items.length - 1} More Items
                            </Text>
                        }
                    </View>
                    <View>
                        <Text style={{
                            textAlign: 'right',
                            color: '#fb8702',
                            fontWeight: '600'
                        }}>{item.orderDetails.items[0].status.toUpperCase()}</Text>
                    </View>
                </View>

            </TouchableOpacity>

        )
    };

    render() {
        return (
            <View style={styles.myOrdersContainer}>
                {!this.state.isLoading
                    ?
                    this.state.dataArr && this.state.dataArr.length > 0
                        ?
                        <FlatList
                            data={this.state.dataArr}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        />
                        :
                        <View style={{flex: 1, alignItems: 'center', paddingTop: 30}}>
                            <Text style={{fontFamily: GLOBAL.FONTS.default_font_bold, color: 'grey'}}>You have no past
                                orders to show</Text>
                        </View>
                    :
                    <Loader/>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    myOrdersContainer: {
        display: 'flex',
        flexDirection: 'column'
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
        marginRight: 20,
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
        width: 100,
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