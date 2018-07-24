/*
 * @Author: shahsank sharma 
 * @Date: 2017-08-22 10:46:08 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2017-10-05 11:06:50
 */

'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity
} from 'react-native';

import * as Constants from 'Wadi/src/components/constants/constants';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';

let list1Width = 120
let list2Width = dimensions.width - 120

export default class productAttribute extends Component {

    constructor(props) {
        super(props);

        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        };
        
        this.state = {
            dataSource: new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            })
        };
    }

componentDidMount() {
    this.renderList()
}
    render() {

        return (
            <View style={styles.mainContainerView}>
                <ListView style={styles.list} 
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps="always"
                    renderRow={this.renderRow.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)} />
            </View>
        )
    }

    renderList() {
        let a = {}
        let x = {}
        let y = {}
        let b = {}
        let x1 = {}
        let y1 = {}
      a['label'] = "General Features"
      x['label'] = "Color"
      x['value'] = "Blue"
      y['label'] = "Size"
      y['value'] = "Large"
      a['attributes'] = [x, y]

     b['label'] = "Technical Features"
      x1['label'] = "Resolution"
      x1['value'] = "Retina"
      y1['label'] = "Ram"
      y1['value'] = "16gb"
      b['attributes'] = [x1, y1]

        let attributesMap = [a, b];


        var attributeList = attributesMap,
            dataBlob = {},
            rowIDs = [],
            attribute,
            rowsArr,
            row,
            rowIndex,
            sectionIDs = [];


        for (var attribIndex = 0; attribIndex < attributeList.length; attribIndex++) {

            attribute = attributeList[attribIndex];

            var rowsArr = attribute.attributes;
            sectionIDs.push(attribIndex); //This is id for section
            dataBlob[attribIndex] = attribute; //This is data against section id

            rowIDs[attribIndex] = [];

            for (rowIndex = 0; rowIndex < rowsArr.length; rowIndex++) {

                row = rowsArr[rowIndex];
                rowIDs[attribIndex].push(rowIndex); //This is id for row

                dataBlob[attribIndex + ':' + rowIndex] = row;  //This is data against row for current section
            }
        }
        

        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
        });
    }

renderSectionHeader(item) {
        return (
            <TouchableOpacity activeOpacity ={1} style={styles.sectionContainer}>
                {<Text style={styles.sectiontitle}>{item.label}</Text>}
            </TouchableOpacity>
        );
    }
    renderRow(item) {

        return (
            <TouchableOpacity activeOpacity ={1} style={styles.rowTitleContainer}>
                {<Text style={styles.rowTitle}>{item.label}</Text>}
                {<Text style={styles.rowSubTitle}>{item.value}</Text>}
            </TouchableOpacity>
        );
    }


    applyClicked() {

    }


    /**
     * Action on clicking any tab.
     *
     * @param  {obj} item  - Row object.
     */
    rowPressed = (item) => {

    }
}

const styles = StyleSheet.create({
    mainContainerView: {
        flex: 1,
        backgroundColor: 'white'
    },
    rowTitleContainer: {
    flex:1,
    flexDirection: 'row',
    backgroundColor:'green'
  },
    rowTitle: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 12,
        paddingLeft: 10,
        justifyContent: 'center',
        textAlign: 'left',
        width: 100,
        color:'black',
    },
    rowSubTitle: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 10,
        paddingLeft: 10,
        width: dimensions.width - 120,
        height: 10,
        textAlign: 'left'
    },
    list: {
        marginBottom: 50,
        backgroundColor:'green'
    },
    sectionContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#CED0CE',
        alignItems: 'center',
        backgroundColor:'blue'
    },
    sectiontitle: {
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        paddingLeft: 10,
        width: list2Width - 22,
        marginBottom: 5,
        marginTop: 10,
        color:'black',
        fontWeight:'bold'
    }
});