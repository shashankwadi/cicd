//
//  WDIApplePayVC.m
//  Wadi
//
//  Created by Wadi on 27/02/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "WDIApplePayVC.h"

@interface WDIApplePayVC ()<PKPaymentAuthorizationViewControllerDelegate>
@property(nonatomic, strong) void (^completioniOS11)(PKPaymentAuthorizationResult*)NS_AVAILABLE_IOS(11);
@property (nonatomic, strong) void (^completion)(PKPaymentAuthorizationStatus);
@property (nonatomic, strong) NSDictionary *paymentData;
@end

@implementation WDIApplePayVC

- (instancetype)initWithPaymentData: (NSDictionary*)paymentData {
  
  if (self = [super init]) {
    _paymentData = paymentData;
  }
  return self;
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  
  if(_paymentData && [_paymentData objectForKey:@"paymentParams"]) {
 
    PKPaymentRequest *paymentRequest = [PKPaymentRequest new];
    paymentRequest.merchantIdentifier = @"merchant.com.wadi.wadi";
    paymentRequest.supportedNetworks = @[PKPaymentNetworkAmex, PKPaymentNetworkMasterCard, PKPaymentNetworkVisa];
    paymentRequest.merchantCapabilities = PKMerchantCapability3DS;
    
    //TODO: Change US to AE. US is set for testing on sandbox.
    paymentRequest.countryCode = [_paymentData objectForKey:@"countryCode"];
    paymentRequest.currencyCode = [_paymentData objectForKey:@"currencyCode"];
    paymentRequest.paymentSummaryItems = [self getPaymentSummaryItems];
    
    if ([PKPaymentAuthorizationViewController canMakePayments]) {
      PKPaymentAuthorizationViewController * applePayVc = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
      applePayVc.delegate = self;
      [self presentViewController:applePayVc animated:YES completion:nil];
    }
  }
}

- (NSArray*)getPaymentSummaryItems {
  
  NSMutableArray *paymentItems = [[NSMutableArray alloc] init];
  NSMutableArray *paymentData = [[_paymentData objectForKey:@"paymentParams"] isKindOfClass:[NSMutableArray class]] ? [_paymentData objectForKey:@"paymentParams"] : [[NSMutableArray alloc] init];
  for (NSDictionary *paymentItem in paymentData) {
    
    PKPaymentSummaryItem *paymentSummaryItem = [PKPaymentSummaryItem summaryItemWithLabel:[paymentItem objectForKey:@"key"] amount:[NSDecimalNumber decimalNumberWithString:[paymentItem objectForKey:@"value"]]];
    [paymentItems addObject:paymentSummaryItem];
  }
  return paymentItems;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)paymentAuthorizationViewControllerDidFinish:(nonnull PKPaymentAuthorizationViewController *)controller {
  
  [controller dismissViewControllerAnimated:YES completion:nil];
  [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                   handler:(void (^)(PKPaymentAuthorizationResult *result))completion API_AVAILABLE(ios(11.0), watchos(4.0)) {
  
  self.completioniOS11 = completion;
  if([self.delegate respondsToSelector:@selector(didAuthorizeApplePayWithPaymentObject:)]) {
    [self.delegate didAuthorizeApplePayWithPaymentObject:payment];
  }
  completion([[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusSuccess errors:nil]);
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus status))completion API_DEPRECATED("", ios(8.0, 11.0)) {
  
  self.completion = completion;
  if([self.delegate respondsToSelector:@selector(didAuthorizeApplePayWithPaymentObject:)]) {
    [self.delegate didAuthorizeApplePayWithPaymentObject:payment];
  }
  completion(PKPaymentAuthorizationStatusSuccess);
}

@end
