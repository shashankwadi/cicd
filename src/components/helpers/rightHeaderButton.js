'use strict';
import React, {Component} from 'react';
import {View} from 'react-native';

export default class RightHeaderButton extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (

            /*Render blank right element just to place wadi nav icon in the center*/

            <View style={{marginRight: 5, width: 30, height: 30}}/>
        )
    }
}