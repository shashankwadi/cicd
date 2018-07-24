/**
 * edited by Manjeet Singh on 7/11/2017, 4:46PM
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import { dimensions } from 'utilities/utilities';
import deeplinkHandler from '../../utilities/managers/deeplinkHandler';

const propTypes = {
  headerData:PropTypes.object,
  navigator:PropTypes.object,
  currentScreen:PropTypes.string,
};

const defaultProps ={
    headerData:null,

}

export default class Header extends Component {
  
    constructor(props) {
    super(props);
    this.headerData = this.props.headerData;
    }

    navigateToPlp(){
        this.props.viewAllTap(this.props.widgetData)

    }
    
    renderTitle(headerData) {
        return (
            <View style= {styles.titleView}>
                <Text style = {styles.heading}>
                    {headerData.headerTitle}
                    {this.headerData.subTitle &&
                    this.headerData.subTitle.length > 0 &&
                <Text style = {styles.subHeading}>{'\n'+this.headerData.subTitle}</Text>}
                </Text>
            </View>
        )
    }
    renderViewAll(viewAllTitle) {
        return (
            <TouchableOpacity activeOpacity ={1} 
            style = {styles.viewAllButton}
            onPress={this.navigateToPlp.bind(this)}>
                <Text style = {styles.viewAllTitle}>
                    {viewAllTitle}
                </Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.headerContainer}>
                {this.headerData.headerTitle.length > 0 &&
                this.renderTitle(this.headerData)}
                {this.headerData.viewAllTitle.length > 0 &&
                this.renderViewAll(this.headerData.viewAllTitle)}
            </View>
        )
}

}



var styles = StyleSheet.create({
    headerContainer: {
        paddingTop:10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'

    },
    heading: {
        fontSize: 16,
        fontFamily: GLOBAL.FONTS.default_font,
        marginLeft: 10,
        color: GLOBAL.COLORS.headerTitleColor,
        marginBottom: 5,
        textAlign: 'left'

    },  
    subHeading: {
        fontSize: 13,
        fontFamily: GLOBAL.FONTS.default_font,
        marginLeft: 10,
        color: GLOBAL.COLORS.headerTitleColor,
        marginBottom: 5,
        textAlign: 'left'

    },
    titleView: {
        flex: 0.7,
        alignItems: 'flex-end',
        flexDirection: 'row'

    },
    viewAllButton: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',

    },
    viewAllTitle: {
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font,
        color: GLOBAL.COLORS.wadiDarkGreen,
        marginBottom: 7.5,
        marginRight: 12.5

    }
});

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;