import React, {Component} from 'react'

import {Text, View, StyleSheet} from 'react-native'


export default class TransactionRowInflator extends Component {

    render() {
        return (
            <View style={styles.parent}>
                <View style={styles.sourceAmountContainer}>
                    <View style={styles.sourceContainer}>
                        <View style={[styles.circle,{backgroundColor:this.props.transaction.wallet_type=="loyalty"?'#0eb6b6':'yellow'}]}></View>
                        <Text style={styles.source}>{this.props.transaction.source}</Text>
                    </View>
                    <Text
                        style={[styles.amount, {color: this.props.transaction.type == "debit" ? 'red' : '#0eb6b6'}]}>{this.props.transaction.amount}</Text>
                </View>
                <Text>{this.props.transaction.created_at}</Text>
                <Text>Order ID: {this.props.transaction.source_id}</Text>
                <Text style={{marginBottom: 10}}>Transaction ID: {this.props.transaction.transaction_no}</Text>
            </View>)
    }


}

const styles = StyleSheet.create({
        parent: {
            borderBottomWidth: 1,
            borderBottomColor: '#D3D3D3',
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10
        },
        sourceContainer: {
            display:'flex',
            flexDirection:'row',
            alignItems:'center'

        },
        sourceAmountContainer: {
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        source: {
            color: 'black',
            fontSize: 14
        },
        amount: {
            fontWeight: 'bold'
        },
        circle: {
            width: 14,
            height: 14,
            borderRadius: 7,
            marginRight:10

        }


    }
);
