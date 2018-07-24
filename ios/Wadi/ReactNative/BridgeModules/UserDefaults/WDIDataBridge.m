//
//  WDIDataBridge.m
//  Wadi
//x
//  Created by Pulkit Sharma on 14/07/17.
//  Copyright © 2017 WADI. All rights reserved.
//

#import "WDIDataBridge.h"
#import "WDIUserDefaultsManager.h"
#import <sys/utsname.h>
#import <React/RCTI18nUtil.h>
#import "NSUserDefaults+MPSecureUserDefaults.h"
#import <React/RCTBridge.h>
#import <GCDWebServer/GCDWebServer.h>
#import <GCDWebServer/GCDWebServerDataResponse.h>
#import "Wadi-Swift.h"
#import "SplashScreen.h"
#import <CoreLocation/CoreLocation.h>
#import <GCDWebServer/GCDWebServerURLEncodedFormRequest.h>
#import "AFNetworking.h"
#import "WDGCDManager.h"
#import "SplashScreen.h"

@interface WDIDataBridge()<CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@property (strong, nonatomic) CLLocation *location;
@property (nonatomic) CLLocationDegrees latitude;
@property (nonatomic) CLLocationDegrees longitude;
@property (nonatomic) BOOL hasFetchedLocation;

@end

#define kExportMethodGetString                  @"getString"
#define kExportMethodPutString                  @"putString"
#define kExportMethodGetInt                     @"getInt"
#define kExportMethodPutInt                     @"putInt"
#define kExportMethodGetLong                    @"getLong"
#define kExportMethodPutLong                    @"putLong"
#define kExportMethodGetBoolean                 @"getBoolean"
#define kExportMethodPutBoolean                 @"putBoolean"
#define kExportMethodGetLoginToken              @"getLoginToken"
#define kExportMethodRemoveLoginToken           @"removeLoginToken"
#define kExportMethodSetLoginToken              @"setLoginToken"
#define kExportMethodRemoveObjectForKey         @"removeObjectForKey"
#define kExportMethodGetUserEmail               @"getUserEmail"
#define kExportMethodGetUserMobile              @"getUserMobile"
#define kExportMethodGetDeviceId                @"getDeviceId"
#define kExportMethodGetAppVersion              @"getAppVersion"
#define kExportMethodGetLatLong                 @"getLatLong"
#define kExportMethodSetLanguage                @"setLanguage"
#define kExportMethodGetLanguage                @"getLanguage"
#define kExportMethodGetDeviceInfo              @"getDeviceInfo"
#define kExportMethodInitiateServer             @"initiateServer"
#define kExportMethodResetApp                   @"resetApp"
#define kGetUserLocation                        @"getUserLocation"

@implementation WDIDataBridge

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

// kExportMethodGetString
RCT_REMAP_METHOD(getString,
                 keyForString:(NSString *)key
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  NSString *response = [WDIUserDefaultsManager stringForKey:key];
  if (response) {
    resolve(response);
  }
  else {
    NSError *error = nil;
    reject(@"doesnot exist", @"Error", error);
  }
}

// kExportMethodPutString
RCT_REMAP_METHOD(putString,
                 key:(NSString *)key
                 stringValue:(NSString *)value
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  
  [WDIUserDefaultsManager setObject:value forKey:key];
  
  resolve(@"success");
}

// kExportMethodGetInt
RCT_REMAP_METHOD(getInt,
                 keyForInt:(NSString *)key
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  
  NSNumber *response = [WDIUserDefaultsManager objectForKey:key];
  if (response) {
    resolve(response);
  }
  else {
    NSError *error = nil;
    reject(@"doesnot exist", @"Error", error);
  }
  
}

// kExportMethodPutInt
RCT_REMAP_METHOD(putInt,
                 key:(NSString *)key
                 integerValue:(NSUInteger)value
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  [WDIUserDefaultsManager setObject:[NSNumber numberWithInteger:value] forKey:key];
  resolve(@"success");
  
}

// kExportMethodGetLong
RCT_REMAP_METHOD(getLong,
                 keyForLong:(NSString *)key
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  
  NSNumber *response = [WDIUserDefaultsManager objectForKey:key];
  if (response) {
    resolve(response);
  }
  else {
    NSError *error = nil;
    reject(@"doesnot exist", @"Error", error);
  }
  
}

// kExportMethodPutLong
RCT_REMAP_METHOD(putLong,
                 keyForLong:(NSString *)key
                 longValue:(NSNumber *)value
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  [WDIUserDefaultsManager setObject:value forKey:key];
  resolve(@"success");
  
}

// kExportMethodGetBoolean
RCT_REMAP_METHOD(getBoolean,
                 keyForBoolean:(NSString *)key
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  
  bool response = [WDIUserDefaultsManager boolForKey:key];
  resolve([NSNumber numberWithBool:response]);
}

// kExportMethodPutBoolean
RCT_REMAP_METHOD(putBoolean,
                 keyForBoolean:(NSString *)key
                 boolValue:(BOOL)value
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  [WDIUserDefaultsManager setObject:[NSNumber numberWithBool:value] forKey:key];
  resolve(@"success");
  
}

//kExportMethodGetLoginToken
RCT_REMAP_METHOD(getLoginToken,
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  NSString *identifier = [prefs secureObjectForKey:@"kCookieIdentifier" valid:false];
  
  if (identifier) {
    resolve(identifier);
  } else {
    NSError *error = nil;
    reject(@"doesnot exist", @"Error", error);
  }
}

//kExportMethodRemoveLoginToken
RCT_REMAP_METHOD(removeLoginToken,
                 success:(RCTPromiseResolveBlock)resolve
                 failure:(RCTPromiseRejectBlock)reject) {
  
  //delete cookie used for server proxy
  [[WDGCDManager sharedInstance] deleteIdentityCookiesFromUD];
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults removeObjectForKey:@"kCookieIdentifier"];
  [defaults synchronize];
  resolve(@"success");
}

//kExportMethodSetLoginToken
RCT_REMAP_METHOD(setLoginToken,
                 :(NSString*)token
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  [prefs setSecureObject:token forKey:@"kCookieIdentifier"];
  [prefs synchronize];
  resolve(@"success");
}

#pragma mark-- user/api specific details

// kExportMethodGetUserEmail
RCT_REMAP_METHOD(getUserEmail,
                 suce:(RCTPromiseResolveBlock)resolve
                 failure:(RCTPromiseRejectBlock)reject)
{
  NSString *email; //TODO: Add email
  if (email) {
    resolve(email);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"There were no events", error);
  }
}

// kExportMethodGetUserMobile
RCT_REMAP_METHOD(getUserMobile,
                 pass:(RCTPromiseResolveBlock)resolve
                 fail:(RCTPromiseRejectBlock)reject)
{
  NSString *mobile;//TODO: Provide mobile number
  if (mobile) {
    resolve(mobile);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"There were no events", error);
  }
}


// kExportMethodGetDeviceId
RCT_REMAP_METHOD(getDeviceId,
                 succ:(RCTPromiseResolveBlock)resolve
                 fail:(RCTPromiseRejectBlock)reject)
{
  
  NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  NSString *devId = [prefs secureObjectForKey:@"kUniquieDeviceIdentifier" valid:false];
  
  if (!devId) {
    devId = @"";
  }
  if (devId) {
    resolve(devId);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"There were no events", error);
  }
}

// kExportMethodGetAppVersion
RCT_REMAP_METHOD(getAppVersion,
                 suces:(RCTPromiseResolveBlock)resolve
                 failure:(RCTPromiseRejectBlock)reject)
{
  NSString *appVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];

  if (appVersion) {
    resolve(appVersion);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"There were no events", error);
  }
}

// kExportMethodGetLatLong
RCT_REMAP_METHOD(getLatLong,
                 locSuccess:(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  NSString* latitude;//TODO: Add lat long
  NSString* longitude;
  
  if (!latitude) {
    latitude = @"";
  }
  if (!longitude) {
    longitude = @"";
  }
  
  NSArray *response = @[latitude,longitude];
  
  
  if (response) {
    resolve(response);
  }
  else {
    NSError *error = nil;
    reject(@"location not found", @"Error", error);
  }
}

// kExportMethodgetDeviceInfo
RCT_REMAP_METHOD(getDeviceInfo,
                 sucess:(RCTPromiseResolveBlock)resolve
                 failure:(RCTPromiseRejectBlock)reject) {
  
  struct utsname systemInfo;
  uname(&systemInfo);
  NSString *device = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
  NSString *appVersion = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
  NSString *osVersion = [[UIDevice currentDevice] systemVersion];
  
  NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  NSString *devId = [prefs secureObjectForKey:@"kUniquieDeviceIdentifier" valid:false];
  
  NSDictionary *deviceDataDict = [[NSDictionary alloc] initWithObjectsAndKeys:
                                  devId,@"deviceID",
                                  device,@"model",
                                  osVersion,@"osVersion",
                                  @"",@"networkType",
                                  @"",@"operatorName",
                                  appVersion,@"appVersionName", nil];
  
  
  if (deviceDataDict) {
    resolve(deviceDataDict);
  }
  else {
    NSError *error = nil;
    reject(@"doesnot exist", @"Error", error);
  }
}

RCT_REMAP_METHOD(getSupportedMethods,
                 : (RCTResponseSenderBlock)callback) {
  
  callback(@[ @[kExportMethodGetInt,
                kExportMethodPutInt,
                kExportMethodGetLong,
                kExportMethodPutLong,
                kExportMethodGetBoolean,
                kExportMethodPutBoolean,
                kExportMethodGetLoginToken,
                kExportMethodRemoveLoginToken
                kExportMethodSetLoginToken,
                kExportMethodRemoveObjectForKey,
                kExportMethodGetUserEmail,
                kExportMethodGetUserMobile,
                kExportMethodGetDeviceId,
                kExportMethodGetAppVersion,
                kExportMethodGetLatLong,
                kExportMethodSetLanguage,
                kExportMethodGetLanguage,
                kExportMethodInitiateServer,
                kExportMethodResetApp,
                kGetUserLocation
                ]]);
}



// kExportMethodSetLanugage
RCT_REMAP_METHOD(setLanguage,
                 stringValue:(NSString *)value
                 isWeb:(BOOL)isWeb
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  
  [WDIUserDefaultsManager setObject:value forKey:@"appLanguage"];
  [[RCTI18nUtil sharedInstance] allowRTL:false];
  if([value isEqualToString:@"ar"]) {
    [[RCTI18nUtil sharedInstance] forceRTL:true];
  } else {
    [[RCTI18nUtil sharedInstance] forceRTL:false];
  }
  
  
  
  if (!isWeb) {
    [self.bridge reload];
  }
  
  resolve(@"success");
}

RCT_REMAP_METHOD(getLanguage,
                 sucesLanguage:(RCTPromiseResolveBlock)resolve
                 failure:(RCTPromiseRejectBlock)reject) {
  
  
  NSString *language = [WDIUserDefaultsManager objectForKey:@"appLanguage"];
  ; //TODO: get app version in v
  
  if (language == nil) {
    language = [[[NSBundle mainBundle] preferredLocalizations] objectAtIndex:0];
  }
  if (language) {
    resolve(language);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"There were no events", error);
  }
  
}

// kExportMethodResetApp
RCT_REMAP_METHOD(resetApp,
                 suc:(RCTPromiseResolveBlock)resolve
                 failure:(RCTPromiseRejectBlock)reject) {
  
  [self.bridge reload];
  resolve(@"success");
}

// kExportMethodRemoveObjectForKey
RCT_REMAP_METHOD(removeObjectForKey,
                 keyName:(NSString *)key
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  [WDIUserDefaultsManager removeObjectForKey: key];
  resolve(@"success");
}


// kExportMethodInitiateServer
RCT_REMAP_METHOD(initiateServer,
                 isDocumentDirectory:(BOOL)isDocumentDirectory port: (NSUInteger)port
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject) {
  
  //Register for reload data bridge this is being fired from RCTWKWebView when nothing loads
  [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(forceReloadBridge) name:@"reloadBridge" object:nil];
  
  NSString *path = @"";
  
  AppDelegate *appDel = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  
  if (appDel.webServer.isRunning) {
    [appDel.webServer stop];
  }
  if (isDocumentDirectory) {
    
    path = [NSString stringWithFormat:@"%s",[[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject] fileSystemRepresentation]];
  } else {
    
    path = [[NSBundle mainBundle] bundlePath];
  }
  
  [appDel.webServer addGETHandlerForBasePath:@"/" directoryPath:path indexFilename:@"index.html" cacheAge:0 allowRangeRequests:YES];
  
  //Add handlers for Proxy
  [[WDGCDManager sharedInstance] addResponseHandlers];
  
  appDel.gcdPort = port;
  [appDel.webServer startWithPort:port bonjourName:nil];
  resolve(appDel.webServer.serverURL);
  
}

//Hide splash screen
RCT_REMAP_METHOD(hideSplash,
                 res:(RCTPromiseResolveBlock)resolve
                 rej:(RCTPromiseRejectBlock)reject) {
  
  [SplashScreen hide];
  resolve(@"success");
}

//Get User Location
RCT_REMAP_METHOD(getUserLocation,
                 result:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
  
  self.locationManager = [[CLLocationManager alloc] init];
  [self.locationManager setDesiredAccuracy:kCLLocationAccuracyBest];
  [self.locationManager setDelegate:self];
  self.hasFetchedLocation = NO;
   [self.locationManager startUpdatingLocation];
 
  
  [self shouldFetchUserLocation];
  
//  if([self shouldFetchUserLocation]) {
//
  
//    [self.locationManager startUpdatingLocation];
//  }
  resolve(@"success");
}

-(void)shouldFetchUserLocation{
  
  BOOL shouldFetchLocation= NO;
  
  switch ([CLLocationManager authorizationStatus]) {
//      case kCLAuthorizationStatusAuthorizedAlways:
//        shouldFetchLocation= YES;
//        break;
//      case kCLAuthorizationStatusAuthorizedWhenInUse:
//        shouldFetchLocation= YES;
//        break;
//
      case kCLAuthorizationStatusDenied:
      {
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"location_permission", nil) message:NSLocalizedString(@"", nil) preferredStyle:UIAlertControllerStyleAlert];
        
        [alertController addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"ok", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
          
        }]];
        [alertController addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"settings", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
          [[UIApplication sharedApplication] openURL:
           [NSURL URLWithString:UIApplicationOpenSettingsURLString]];
        }]];
        UIViewController *presentingController = RCTPresentedViewController();
        [presentingController presentViewController:alertController animated:YES completion:nil];
      }
        break;
      case kCLAuthorizationStatusNotDetermined:
      {
        if([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
          [self.locationManager requestWhenInUseAuthorization];
        }
      }
        break;
      case kCLAuthorizationStatusRestricted:
      {
        
      }
        break;
        
      default:
        break;
    }

  //return shouldFetchLocation;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"locationData"];
}

#pragma mark - CLLocationManagerDelegate methods

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray<CLLocation *> *)locations {
  
  if (locations) {
    self.location = locations.lastObject;
    self.latitude = self.location.coordinate.latitude;
    self.longitude = self.location.coordinate.longitude;
    if (self.latitude && self.longitude && self.hasFetchedLocation == NO) {
      [self.locationManager stopUpdatingLocation];
      NSMutableDictionary *regionDictionary = [NSMutableDictionary new];
      [regionDictionary setObject:[NSNumber numberWithDouble:self.latitude] forKey:@"latitude"];
      [regionDictionary setObject:[NSNumber numberWithDouble:self.longitude] forKey:@"longitude"];
      [self sendEventWithName:@"locationData" body:regionDictionary];
      self.hasFetchedLocation = YES;
      
    }
  }
}
 

- (void)locationManager:(CLLocationManager *)manager
       didFailWithError:(NSError *)error {
  
  
}

- (void)forceReloadBridge {
    [self.bridge reload];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}



@end
