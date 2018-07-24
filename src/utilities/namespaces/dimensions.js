import {isIos} from "../../utilities/utilities";
import {Dimensions, NativeModules} from "react-native";
const isIphoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;

/*
    all dimensions i.e. padding, margins, etc. will go here.
 */
export default {
    /*
        Text sizes
     */
    h1: 24,
    h2: 22,
    h3: 18,
    h4: 16,
    h5: 12,
    h6: 10,
    /*
        Default margins and paddings
    */
    defaultVerticalMargin: 0,
    defaultHorizontalMargin: 0,
    defaultVerticalPadding: 0,
    defaultHorizontalPadding: 0,


    statusBarHeight: isIos ? 24 : 20,
    navBarHeight: 64,
    pdpImageOffset: isIphoneX ? 245 : 220,

    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
};