/**
 * Last edited by Manjeet Singh on 12-13-2017
 * Edited -
 * 1)replaced up down image with react-native-vctor-icon (up and down respectively);
 * 2)added way to pass custom container and title conatiner style
 * 3)added way to pass custom title (you can pass a function to render custom header) // check renderOfferView in /views/pdp/titleSection.js
 * 4)added props to handle initial collapsed state
 */

import React, {Component} from 'react';
import {Animated, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';
import {VectorIcon} from '../components/common';
import * as GLOBAL from '../utilities/constants';

/**
 * you can pass folowing props to this component
 */
const propTypes = {
    collapsed: PropTypes.bool,
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    titleContainerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    renderTitle: PropTypes.func
};

const defaultProps = {
    collapsed: false,
    containerStyle: undefined,
    bodyStyle:undefined,
    titleContainerStyle: undefined,
    renderTitle: undefined
};

class ExpandCollapse extends Component {
    constructor(props) {
        super(props);
        this.icons = {     //Step 2
            'up': require('Wadi/src/icons/general/listWitch.png'),
            'down': require('Wadi/src/icons/general/singleSwitch.png')
        };

        this.state = {       //Step 3
            title: props.title,
            expanded: !props.collapsed,
            animation: new Animated.Value(),
            collapsed: props.collapsed,
        };
    }

    renderTitle = () => {
        if (this.props.renderTitle) {
            return this.props.renderTitle();
        }
        return (
            <Text style={styles.title}>{this.state.title}</Text>
        )
    };

    render() {
        let {containerStyle, titleContainerStyle, bodyStyle} = this.props;
        // let icon = this.icons['down'];

        // if(this.state.expanded){
        //     icon = this.icons['up'];   //Step 4
        // }

        //let icon = (this.state.expanded) ? this.icons['up'] : this.icons['down']; //Step 4

        //Step 5
        return (
            <Animated.View
                style={[styles.container, {height: this.state.animation}, containerStyle]}>
                <View style={[titleContainerStyle]} onLayout={this._setMinHeight.bind(this)}>
                    <TouchableWithoutFeedback
                        style={styles.button}
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <View style={[styles.titleContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                            {this.renderTitle()}
                            <VectorIcon 
                                groupName={"SimpleLineIcons"}
                                name={(!this.state.expanded) ? "plus" : "minus"}
                                size={22} style={{color: GLOBAL.COLORS.black, marginRight: 10}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>


                {!this.state.collapsed &&
                <View style={[styles.body, bodyStyle]} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>}

            </Animated.View>
        );
    }

    _setMaxHeight(event) {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event) {
        this.setState({
            minHeight: event.nativeEvent.layout.height
        });
    }

    toggle() {
        if (this.props.collapsed && this.props.navigate) {
            this.props.navigate();
            return
        }
        //Step 1
        let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded ? this.state.minHeight : NaN
            //finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded: !this.state.expanded,  //Step 2,
            collapsed: false,
        });

        this.state.animation.setValue(initialValue);  //Step 3
        Animated.spring(     //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();  //Step 5
    }
}


var styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginVertical: 10,
        overflow: 'hidden'
    },
    titleContainer: {
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        padding: 10,
        color: GLOBAL.COLORS.darkGreyColor,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        textAlign: 'left',
        fontSize: 14
    },
    button: {},
    buttonImage: {
        width: 30,
        height: 25
    },
    body: {
        padding: 3,
        paddingTop: 10
    }
});

ExpandCollapse.propTypes = propTypes;
ExpandCollapse.defaultProps = defaultProps;
export default ExpandCollapse;