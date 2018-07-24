import {NativeModules} from 'react-native';
import {isEmptyObject} from '../../utilities/utilities';
const { WDIPaymentBridge } = NativeModules;

export const didTapApplePayButton = (beginCheckoutObj) => {

    if(!isEmptyObject(beginCheckoutObj)) {

        WDIPaymentBridge.initiateApplePay(beginCheckoutObj);
    }

}

export const didFinishApplePayTransaction = (transactionObj) => {

    let transactionResult = {

        'success': true
    }
    WDIPaymentBridge.didCompleteProcessingOfApplePay(transactionResult);
}

export const didFailApplePayTransaction = (transactionObj) => {

    let transactionResult = {

        'success': false
    }
    WDIPaymentBridge.didCompleteProcessingOfApplePay(transactionResult);

}