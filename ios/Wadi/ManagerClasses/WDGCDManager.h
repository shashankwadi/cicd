//
//  WDGCDManager.h
//  Wadi
//
//  Created by Shashank Sharma on 12/04/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "WDIUserDefaultsManager.h"
#import "NSUserDefaults+MPSecureUserDefaults.h"
#import <GCDWebServer/GCDWebServer.h>
#import <GCDWebServer/GCDWebServerDataResponse.h>
#import "Wadi-Swift.h"
#import <GCDWebServer/GCDWebServerURLEncodedFormRequest.h>
#import "AFNetworking.h"
#import "WDGCDManager.h"

@interface WDGCDManager : NSObject

+ (id)sharedInstance;
- (void)addResponseHandlers;
- (void)deleteIdentityCookiesFromUD;

@end
