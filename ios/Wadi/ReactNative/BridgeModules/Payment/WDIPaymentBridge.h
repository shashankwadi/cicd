//
//  WDIPaymentBridge.h
//  Wadi
//
//  Created by Wadi on 25/02/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <PassKit/PassKit.h>
#import "WDIApplePayVC.h"

@interface WDIPaymentBridge : RCTEventEmitter <RCTBridgeModule, WDIPaymentBridgeDelegate>


@end
