/**
 * Created by Manjeet Singh
 * Created on 2017-11-24 16:53:21
 * This component can be used as reusable vector icon solution
 * can save you from importing multiple icons in your view files
 * browse all icons - https://oblador.github.io/react-native-vector-icons/
 */

'use strict';

import React from 'react';
import {
  View,StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import Zocial from 'react-native-vector-icons/Zocial'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const VectorIcons = {
  MaterialIcons,
  EvilIcons,
  Entypo,
  FontAwesome,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Octicons,
  SimpleLineIcons 
};

const VectorIcon = ({groupName, name, size, style, color})=>{
    let Icon = VectorIcons[groupName];
    return(
        <Icon name={name} size ={size} style={style} color={color}/>
    );
}
VectorIcon.propTypes = {
    groupName: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    color:PropTypes.string,
};

VectorIcon.defaultProps = {
    groupName: "",
    name: "",
    size: 24,
    style: undefined,
    color:'#333',
};
export default VectorIcon