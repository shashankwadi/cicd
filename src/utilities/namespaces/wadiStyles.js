import * as GLOBAL from 'Wadi/src/utilities/constants';
import {Platform, StyleSheet} from 'react-native';

export default wadiStylesheet = StyleSheet.create({

    wadiBadgeTextStyle: {
        paddingTop: 4,
        paddingBottom: 2,
        paddingHorizontal: 8,
        fontSize: 10,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        borderWidth: 0.8,
        borderRadius: 10,
        backgroundColor: 'white',
        textAlign: 'center'
    },
    wadiDiscountTextStyle: {
        color: GLOBAL.COLORS.black,
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 10,
        paddingTop: 5,
        paddingBottom: Platform.OS === 'ios' ? 3 : 4,
        paddingHorizontal: 7,
        textAlign: 'center',
        borderRadius: 11,
        borderWidth: 1,
        borderColor: GLOBAL.COLORS.expressBackground,
        backgroundColor: GLOBAL.COLORS.expressBackground,
        overflow: 'hidden'
    },
    shadowStyle:{
        shadowOpacity: 0.5,
        shadowRadius: 2.5,
        shadowOffset: {width: 2, height: 2},
        elevation: (Platform.OS === 'ios') ? 0 : 5,
    }

});