//
//  WDIPaymentBridge.m
//  Wadi
//
//  Created by Wadi on 25/02/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "WDIPaymentBridge.h"
#import "Wadi-Swift.h"
#import <PassKit/PassKit.h>

@interface WDIPaymentBridge()

@property(nonatomic) BOOL hasListeners;
@end

@implementation WDIPaymentBridge
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
  
  return dispatch_get_main_queue();
}

RCT_REMAP_METHOD(initiateApplePay,
                 :(NSDictionary*)checkoutObj
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject){
  
  if (checkoutObj) {
    
    NSDictionary *checkoutData = [[NSDictionary alloc] init];
    checkoutData = [checkoutObj objectForKey:@"paymentData"];
    if (!checkoutData) {
      return;
    }
    
    WDIApplePayVC *applePayVC = [[WDIApplePayVC alloc] initWithPaymentData:checkoutData];
    applePayVC.delegate = self;
    [applePayVC setModalPresentationStyle:UIModalPresentationOverCurrentContext];
    [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController: applePayVC animated:NO completion:nil];
  }
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onUserAuthorize"];
}

- (void)didAuthorizeApplePayWithPaymentObject: (PKPayment *)payment {
  
  PKPaymentMethod *paymentMethod = payment.token.paymentMethod;
  NSString *paymentName = paymentMethod.displayName;
  NSString *transactionId = payment.token.transactionIdentifier;
  NSString *paymentNetwork = paymentMethod.network;
  //NSString *transactionId = payment.token.transactionIdentifier;
  PKPaymentMethodType methodType = paymentMethod.type;
  NSString *paymentData = [[NSString alloc] initWithData:payment.token.paymentData encoding:NSUTF8StringEncoding];
  NSMutableDictionary *paymentResponse = [[NSMutableDictionary alloc]initWithCapacity:3];
  [paymentResponse setObject:transactionId forKey:@"transactionIdentifier"];
  [paymentResponse setObject:paymentData forKey:@"paymentData"];
  [paymentResponse setObject:paymentName forKey:@"paymentName"];
  [paymentResponse setObject:paymentNetwork forKey:@"paymentNetwork"];
  [paymentResponse setObject:[NSNumber numberWithInteger:methodType] forKey:@"methodType"];
  
  if (_hasListeners) {
    
    [self sendEventWithName:@"onUserAuthorize" body:paymentResponse];
  }
}
// Will be called when this module's first listener is added.
-(void)startObserving {
  _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  _hasListeners = NO;
}



@end
