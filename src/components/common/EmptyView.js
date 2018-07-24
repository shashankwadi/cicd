/**
 * Created by Manjeet Singh
 * Created on 2017-11-24 16:53:21
 * This component can be used as reusable vector icon solution
 * can save you from importing multiple icons in your view files
 */

'use strict';

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';


import * as GLOBAL from 'Wadi/src/utilities/constants';


const EmptyView = ({title, description, icon, background, containerStyles})=>{
    return(
        <View style={[{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#e6e6e6'}, containerStyles]}>
                {!!icon && <Image source={icon} resizeMode={"cover"}/>}
                <Text style={{fontFamily: GLOBAL.FONTS.default_font_bold, fontSize:18}}>{description}</Text>
        </View>
    );
}

//add proptypes here
EmptyView.propTypes = {
    title:PropTypes.string,
    description:PropTypes.string,
    icon:PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    background:PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    containerStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

EmptyView.defaultProps = {
    title:"",
    description:"Nothing to show",
    icon:undefined,
    background:undefined,
    containerStyles:undefined
};
export default EmptyView