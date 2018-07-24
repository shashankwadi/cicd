/***
 * @Author: Simranjeet Singh Sawhney
 * @Date: 2017-12-08
 *
 */

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    //activity indicator
    activityIndicatorView: {
        position: 'absolute',
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        flex: 1
    },

});

export default styles;