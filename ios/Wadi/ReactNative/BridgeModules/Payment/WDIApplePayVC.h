//
//  WDIApplePayVC.h
//  Wadi
//
//  Created by Wadi on 27/02/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <PassKit/PassKit.h>

@protocol WDIPaymentBridgeDelegate<NSObject>

- (void)didAuthorizeApplePayWithPaymentObject: (PKPayment *)payment;
@end

@interface WDIApplePayVC : UIViewController

@property(nonatomic, weak) id<WDIPaymentBridgeDelegate> delegate;

- (instancetype)initWithPaymentData: (NSDictionary*)paymentData;

@end
