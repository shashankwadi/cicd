//
//  SDKUtilities.h
//  MadStreetDen
//
//  Created by Muthu on 23/10/15.
//  Copyright (c) 2015 MadStreetDen. All rights reserved.
//
#include <UIKit/UIKit.h>

@interface SDKUtilities : NSObject

typedef enum {
    
    iPhone_4,
    iPhone_5,
    iPhone_6,
    iPhone_6Plus,
    iPad,
    other_Device
    
} DeviceType;

@property (nonatomic,assign)BOOL isNetworkReachable;

+ (SDKUtilities *)sharedInstance;

+ (UIColor *)getColorFromRed:(float)red green:(float)green blue:(float)blue alpha:(double)value;

+ (DeviceType)getThisDeviceType;

+ (CGSize)changeWidthProportionatelySize:(CGSize)orgSize toWidth:(CGFloat)width;

+ (CGSize)changeHeightProportionatelySize:(CGSize)orgSize toHeight:(CGFloat)height;

+ (CGFloat)calculateChangeValue:(CGFloat)oldValue fromValue:(CGFloat)fromValue toValue:(CGFloat)toValue;

+ (UIImage *)cropImage:(UIImage *)img withRect:(CGRect)rect;

+ (CGRect)checkForOutSizeBoundOriginalSize:(CGSize)originalSize withCropRect:(CGRect)cropRect;

+ (void)showActivityIndicatorWithMessage:(NSString *)msg withSuperView:(UIView *)view;

+ (void)hideActivityIndicatorWithAnimation:(BOOL)flag;

+ (id)getViewControllerFromStoryBoard:(NSString *)identity;

+ (NSBundle *)getCurrentBundle;

+ (UIImage *)getCurrentBundleImage:(NSString *)name;

+ (void)storeImagesToPhotoAlbum:(UIImage *)imageToBeStored andOriginalImage:(UIImage *)originalImage;

+ (UITapGestureRecognizer *)EnableTapObject:(UIView *)view callBack:(SEL)callBack delegate:(id)delegate noOfTap:(int)tap;

+ (BOOL)isLocalStorageOn:(NSString *)keyForCheck;

+ (void)setLocalStorageBit:(BOOL)flag withKey:(NSString *)keyForSet;

+ (void)setValueForLocalStorageVar:(id)value withKey:(NSString *)key;
+ (id)getValueForLocalStorageVarKey:(NSString *)key;

+ (NSString *)uuid;

+ (void)showAlertMessage:(NSString *)message andTitle:(NSString *)title;

- (BOOL)configureSDKWithtrackingEventBaseURL:(NSString *)trackingEventBaseURL;


- (void)startNetworkAvailablityCheck;
- (NSString *)getAppSecret;
- (NSString *)getAppID;
- (NSString *)getBaseURL;
- (NSString *)getTrackingEventBaseURL;
- (NSString *)getProductImageDownloadingAuthonticationUserName;
- (NSString *)getProductImageDownloadingAuthonticationPassword;
- (BOOL)storeAppConfigDetailsToKeyChain:(NSString *)appSecret appID:(NSString *)appID;
+ (NSString *)getCurrentEpochTimeAsString;

// Tracking Events API Calls

- (void)trackEvents:(NSString *)event withParams:(NSDictionary *)params;
- (void)trackEvents:(NSString *)event withParams:(NSDictionary *)params numTimesCalled:(int)numTimesCalled;

@end
