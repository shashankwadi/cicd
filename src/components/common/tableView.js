import React, {Component} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
 
export default class TableView extends Component {
    constructor(props) {
        super(props);
        const {tableData} = this.props;
        this.state = {
            tableData: tableData,
        };
    }
    render() {
    
        return (
        <View>
            <Table>
            <Rows 
                data={this.state.tableData} 
                style={styles.row} 
                textStyle={styles.text}
                // flexArr={} 
                />
            </Table>
        </View>
        )
    }
}
 
const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: '#FFF' },
  text: { marginLeft: 5 },
  row: { height: 30 }
})
