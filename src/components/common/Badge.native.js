import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

import {isIos} from '../../utilities/utilities';

let size = (isIos()) ? 20 : 18;

export const styles = StyleSheet.create({
  badgeStyle: {
        width: size,
        height:size,
        margin:1,
      marginTop: (isIos()) ? -5 : 2,
        borderRadius:size/2,
        backgroundColor:'#e24252',
        justifyContent:'center',
        alignItems:'center',
    },
  badgeTextStyle: {
        color:'#FFFFFF',
        fontWeight:'500',
        fontSize:12,
        textAlign:'center',
    },
});

const Badge = (props) => {
  const {
    count,
    badgeStyle,
    badgeTextStyle,
  } = props;

  return (
    <View style={[styles.badgeStyle,badgeStyle]}>
         <Text style={[styles.badgeTextStyle,badgeTextStyle]}>{count}</Text>
    </View>
  );
};

Badge.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  badgeStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  badgeTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

Badge.defaultProps = {
  count: 0,
  badgeStyle: undefined,
  badgeTextStyle: undefined,
};

export default Badge;