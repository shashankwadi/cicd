/***
 * @Author: Akhil Choudhary
 * @Date: 2018-1-17
 *
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    FlatList,
    Button,
    InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { addCommonHeaders } from "../../../utilities/ApiHandler";
import TransactionRowInflator from "./transactionRowInflator"
import { getWalletSummary, getUpComingPoints, getTransactions, applyCouponCode } from '../../../actions/walletActions'
import Loader from '../../common/loader.native'

class WalletPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            coupon: "",
            walletSummary: null, //object type
            showTransaction: false,
            showUpcomingPoints: false,
            upComingPoints: null, //object type
            transaction: null,
            couponApplied: null, //object type
            currentTransactionPage: 1,
            totalTransactionPage: null,

        };
    }


    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
            if (this.props.accountStore && this.props.accountStore.userData && this.props.accountStore.userData.cookie) {
                //headers['cookie'] = 'identity=' + this.props.accountStore.userData.cookie;
                var cookie = 'identity=' + this.props.accountStore.userData.cookie;
                getWalletSummary(cookie).then((response) => {
                    if (response.success) {
                        this.setState({ walletSummary: response.data });

                        getUpComingPoints(cookie).then((response) => {
                            if (response.success) {
                                this.setState({ upComingPoints: response.data })
                            }
                        })
                        this.getTransactionData(1);
                    }
                })
            }
        //});
    }

    render() {
        if (this.state.walletSummary && this.state.upComingPoints && this.state.transaction) {
            return (<ScrollView><View style={styles.parent}>
                <Text style={[styles.parentHeader, styles.leftRightMargin]}>My Wallet</Text>
                <Text style={[styles.leftRightMargin, { fontSize: 16 }]}>Easily manage your refunds and rewards</Text>
                <View style={styles.totalBalanceContainer}>
                    <Text style={styles.totalBalanceHeader}>Total Balance</Text>
                    <Text style={styles.totalBalance}>{this.state.walletSummary.total_amount}</Text>
                </View>
                <View style={{ backgroundColor: '#eef9f9', paddingBottom: 10 }}>
                    <View style={styles.storeCreditsContainer}>
                        <Text style={styles.storeCreditsHeader}>Store Credits</Text>
                        <Text style={styles.storeCredits}>{this.state.walletSummary.real_money.amount}</Text></View>
                    <Text style={styles.leftRightMargin}>{'\u2022'} Added in your wallet post cancellations or
                        refunds</Text>
                    <Text style={styles.leftRightMargin}>{'\u2022'} 100% redeemable and no expiry</Text>
                </View>
                <View style={{ backgroundColor: '#fefce8', paddingBottom: 10 }}>
                    <View style={styles.storeCreditsContainer}>
                        <Text style={styles.storeCreditsHeader}>Loyalty Points</Text>
                        <Text style={styles.loyaltyPoints}>{this.state.walletSummary.loyalty.amount}</Text>
                    </View>
                    <Text style={styles.leftRightMargin}>{'\u2022'} Added when you shop during Wadi promotional
                        campaigns
                    </Text>
                    <Text style={styles.leftRightMargin}>{'\u2022'} 1 Loyalty point is worth 1 AED</Text>
                    <Text style={styles.leftRightMargin}>{'\u2022'} Maximum usage allowed: 10% of cart value up to 100
                        AED
                    </Text>
                    <Text style={styles.leftRightMargin}>{'\u2022'} Loyalty points expire as per applicable offer terms
                    </Text>
                    {this.state.walletSummary.loyalty.amount > 0 &&
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={styles.loyaltyPointsExpiry}>
                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Expiry
                                Starts {this.state.walletSummary.loyalty.expired_at}</Text>
                            </View>
                            <Text
                                style={{ display: 'flex', flex: 1 }} />
                        </View>}
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => this.showUpcomingPoints()}>
                    <View style={styles.storeCreditsContainer}>
                        <Text style={styles.storeCreditsHeader}>Upcoming Points</Text>
                        <Text style={styles.loyaltyPoints}>{this.state.upComingPoints.total_upcoming}</Text>
                    </View>
                </TouchableOpacity>
                {this.state.showUpcomingPoints && <FlatList
                    data={this.state.upComingPoints.loyalties}
                    renderItem={this.renderUpcomingPoints.bind(this)}
                />}
                <Text style={styles.redeemCouponHeading}>Redeem Coupon</Text>
                <View style={styles.redeemContainer}>
                    <TextInput
                        placeholder='Enter coupon/voucher'
                        onChangeText={(coupon) => this.setState({ coupon: coupon })}
                        underlineColorAndroid='transparent'
                        value={this.state.coupon} />
                    <Button
                        disabled={this.state.coupon == ""}
                        onPress={() => this.applyCoupon()}
                        title='Redeem'
                        color="#00C2B1"
                    />
                    {this.state.couponApplied &&
                        <Text
                            style={{
                                color: this.state.couponApplied.success ? '#0eb6b6' : 'red',
                                textAlign: 'center',
                                margin: 10
                            }}>{this.state.couponApplied.success ? "DONE!" : this.state.couponApplied.message}</Text>}
                    {this.state.couponApplied && this.state.couponApplied.success &&
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={styles.upComingPoints}>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>{this.state.couponApplied.data.amount}
                                    Loyalty Points</Text></View><Text style={{ color: '#0eb6b6' }}> added to your
                        wallet</Text>
                        </View>}
                </View>
                <View style={styles.viewTransactionContainer}>
                    <Text style={styles.myTransactionText}>My Transactions</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.showTransaction()}>
                        <Text
                            style={styles.viewAllTransactionText}>{this.state.showTransaction ? 'Hide' : 'View All'}</Text>
                    </TouchableOpacity></View>
                <View style={{ display: 'flex', flex: 1 }}>
                    {this.state.showTransaction && <FlatList
                        data={this.state.transaction.transactions}
                        renderItem={this.renderTransactions.bind(this)}
                        onEndReached={this.getMoreTransactionData.bind(this)}
                        onEndReachedThreshold={0.5}
                    />}</View>
            </View></ScrollView>)
        }

        else {
            return (<Loader containerStyle={{ flex: 1 }} />);
        }
    }

    renderUpcomingPoints({ item, index }) {
        return (<View style={styles.upComingPointsContainer}>
            <Text style={styles.upComingPoints}>{item.amount}</Text>
            <Text> points will be added on {item.available_from}</Text>
        </View>
        )

    }

    renderTransactions({ item, index }) {
        return (<TransactionRowInflator transaction={item} />)
    }

    applyCoupon = () => {
        if (this.props.accountStore && this.props.accountStore.userData && this.props.accountStore.userData.cookie) {
            //headers['cookie'] = 'identity=' + this.props.accountStore.userData.cookie;
            var cookie = 'identity=' + this.props.accountStore.userData.cookie;
            applyCouponCode(cookie, this.state.coupon).then((response) => {
                this.setState({ couponApplied: response });
            });
        }
    }


    showTransaction() {
        this.setState({ showTransaction: !this.state.showTransaction });
    }

    getMoreTransactionData() {
        //console.log("getMoretransaction called");
        if (this.state.totalTransactionPage) {
            var temp = this.state.currentTransactionPage + 1;
            if (temp <= this.state.totalTransactionPage) {
                this.setState({ currentTransactionPage: temp });
                this.getTransactionData(temp);
            }
        }
    }

    getTransactionData = (page) => {
        if (this.props.accountStore && this.props.accountStore.userData && this.props.accountStore.userData.cookie) {
            var cookie = 'identity=' + this.props.accountStore.userData.cookie;
            getTransactions(cookie, page).then((response) => {
                if (response.success) {
                    if (this.state.transaction) {
                        this.setState((prevState) => {
                            return {
                                transaction: {
                                    ...prevState.transaction,
                                    transactions: [...prevState.transaction.transactions, ...response.data.transactions]
                                }
                            }
                        })
                    }
                    else {
                        this.setState({ transaction: response.data, totalTransactionPage: response.data.total_pages })
                    }

                }
            })
        }
    }

    showUpcomingPoints() {
        this.setState({ showUpcomingPoints: !this.state.showUpcomingPoints });
    }
}

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    parentHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        color: 'black'
    },
    totalBalanceContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10
    },
    totalBalanceHeader: {
        fontSize: 14
    },
    totalBalance: {
        fontSize: 26,
        color: '#0eb6b6'
    },
    storeCreditsContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    storeCreditsHeader: {
        fontSize: 20,
        color: '#66666c',
    },
    storeCredits: {
        fontSize: 18,
        color: '#0eb6b6'
    },
    loyaltyPoints: {
        fontSize: 18
    },
    loyaltyPointsExpiry: {
        backgroundColor: 'yellow',
        color: 'black',
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 3,
        paddingBottom: 3,
        fontWeight: 'bold',
        margin: 10

    },
    leftRightMargin: {
        marginLeft: 10,
        marginRight: 10
    },
    redeemContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 15
    },
    redeemCouponHeading: {
        fontSize: 20,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 10,
        color: '#66666c'
    },
    upComingPointsContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    upComingPoints: {
        backgroundColor: 'yellow',
        color: 'black',
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 3,
        paddingBottom: 3,
        fontWeight: 'bold',
    },
    viewTransactionContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10

    },
    myTransactionText: {
        fontSize: 20,
        color: '#66666c'
    },
    viewAllTransactionText: {
        color: '#0eb6b6',
        fontSize: 16
    },

})

function mapStateToProps(state) {
    return {
        accountStore: state.accounts,
        configStore: state.configAPIReducer,
        featureMapStore: state.featureMapAPIReducer
    }

}


export default connect(mapStateToProps)(WalletPage)
