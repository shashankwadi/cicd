//
//  WDIModuleExport.m
//  Wadi
//
//  Created by Shashank Sharma on 17/07/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "WDITrackingBridge.h"
#import "Wadi-Swift.h"

@implementation WDITrackingBridge

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(trackEvent,
								 trackData:(NSDictionary*)data
								 :(RCTPromiseResolveBlock)resolve
								 :(RCTPromiseRejectBlock)reject){

  if([data objectForKey:@"tune"] != nil){
    [WDTuneTracker trackTuneEventWithData:[data objectForKey:@"tune"]];
    if ([[data objectForKey:@"tune"] objectForKey:@"smartwhere"] != nil){
      //This will be an array of all the smartwhere events
      [WDTuneTracker setSmartwhereStringForValuesWithSmartwhereDataArray:[[data objectForKey:@"tune"] objectForKey:@"smartwhere"]];
    }
    if ([[data objectForKey:@"tune"] objectForKey:@"personalised_attributes"] != nil){
      //This will be an array of all the attributes
      [WDTuneTracker setCustomProfileStringForValuesWithPersonalizedDataArray:[[data objectForKey:@"tune"] objectForKey:@"personalised_attributes"]];
    }
  }
  if ([data objectForKey:@"gtm"] != nil){
    [WDGtmTracker trackGtmEventWithData:[data objectForKey:@"gtm"]];
  }
  if ([data objectForKey:@"fb"] != nil){
    #warning set purchase dynamic value
    [WDFbTracker trackFbEventWithData:[data objectForKey:@"fb"] isPurchase:false];
  }
  if ([data objectForKey:@"msd"] != nil){
    [WDMsdTracker trackMsdEventWithData:[data objectForKey:@"msd"]];
  }
  resolve(@"success");
}

RCT_REMAP_METHOD(trackScreenVisit,
                 screen:(NSString *)screenName
                 trackData:(NSDictionary*)data
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject){
  [WDGtmTracker trackGtmScreenVisitForScreen:screenName data:data];
  resolve(@"success");
}

RCT_REMAP_METHOD(trackApiFailure,
								 apiurl:(NSString *)api
								 :(RCTPromiseResolveBlock)resolve
								 :(RCTPromiseRejectBlock)reject){
	
	resolve(@"success");
}

//Tune Specific Analytics
RCT_REMAP_METHOD(registerTunePersonalizedData,
                 profileArray:(NSArray *)profileArray
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject){
  if (profileArray && [profileArray count] > 0) {
    [WDTuneTracker registerTuneCustomProfileStringfromWithProfileArray:profileArray];
  }
  resolve(@"success");
}

/*RCT_REMAP_METHOD(setTunePersonalizedData,
                 personalizedUserDataArray:(NSArray *)personalizedUserDataArray
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject){
  
  resolve(@"success");
}

RCT_REMAP_METHOD(setTuneSmartwhereData,
                 smartwhereDataArray:(NSArray *)smartwhereDataArray
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject){
  
  resolve(@"success");
}*/

@end
