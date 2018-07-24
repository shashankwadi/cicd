/**
 * created by Manjeet Singh on 12-15-2017
 * Goal- to show loading indicator across the app
 * containerStyle - pass {flex:1} as containerStyle to centerilize loader wihin the screen;
 */

'use strict'
import React from 'react';
import {
    View,
    ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import Colors from '../../utilities/namespaces/colors';

const propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    loaderStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
    color: Colors.wadiDarkGreen,
    size: "large",
    containerStyle: undefined,
    loaderStyle: undefined,
};

const Loader = (props) => {
    const {
        color,
        size,
        containerStyle,
        loaderStyle,
    } = props;

    return (
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, containerStyle]}>
            <ActivityIndicator
                animating={true}
                style={[{ height: 100 }, loaderStyle]}
                size={size}
                color={color}
            />
        </View>
    );
};

Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;

export default Loader;