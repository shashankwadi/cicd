import {I18nManager} from "react-native";

'use strict';

/* Add All Global Enums here  */

module.exports = {

    EnvironmentType: {
        Production: 0,
        DevMachine: 1,
        Staging: 2,
    },
    ScreenTypes: {},
    TAB_POSITION: {
        CART: I18nManager.isRTL ? 1 : 3,
    }
};
