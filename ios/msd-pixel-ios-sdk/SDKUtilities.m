//
//  Utilities.m
//  FashionStreet
//
//  Created by Madhu on 12/08/15.
//  Copyright (c) 2015 FashionStreet. All rights reserved.
//

#import "SDKUtilities.h"
#import "AFNetworking.h"
#import "HTTPRequest.h"
#import "AppConstants.h"

static HTTPRequest *requestHandler;

@interface SDKUtilities ()

@property (nonatomic,strong) NSString *baseURL;
@property (nonatomic,strong) NSString *trackingBaseURL;
@property (nonatomic,strong) NSString *userName_ProductImageAuthontication;
@property (nonatomic,strong) NSString *password_ProductImageAuthontication;

@end

@implementation SDKUtilities

static SDKUtilities * sharedInstance = nil;

+(SDKUtilities *)sharedInstance
{

    if (sharedInstance != nil)
    {
        return sharedInstance;
    }
    
    static dispatch_once_t pred;    // Lock
    dispatch_once(&pred, ^{         // This code is called at most once per app
        sharedInstance = [[SDKUtilities alloc]init];
    });
    
    return sharedInstance;
}

#pragma mark - SDK Configuarartion


- (BOOL)configureSDKWithtrackingEventBaseURL:(NSString *)trackingEventBaseURL
{
    [[SDKUtilities sharedInstance] startNetworkAvailablityCheck];
    if (trackingEventBaseURL) {
        self.trackingBaseURL = trackingEventBaseURL;
    }
    return YES;
}
#pragma mark - Reachablitiy Check

- (void)startNetworkAvailablityCheck
{
    [[AFNetworkReachabilityManager sharedManager] startMonitoring];
    [[AFNetworkReachabilityManager sharedManager] setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status)
     {
         switch (status)
         {
             case AFNetworkReachabilityStatusReachableViaWiFi:
             case AFNetworkReachabilityStatusReachableViaWWAN:
             case AFNetworkReachabilityStatusUnknown:
             {
                 self.isNetworkReachable = YES;
             }
                 break;
             case AFNetworkReachabilityStatusNotReachable:
             {
                 self.isNetworkReachable = NO;
             }
                 break;
                 
         }
         
     }];
}


+ (BOOL)isDevice {
#if TARGET_IPHONE_SIMULATOR
    
    //Simulator
    return NO;
#else
    
    // Device
    return YES;
    
#endif

}

- (void)storeAppconfiginPreference:(NSString *)appID appSecret:(NSString *)appsecret {
    if (appID && appsecret) {
        NSUserDefaults *pref = [NSUserDefaults standardUserDefaults];
        [pref setObject:appID forKey:@"appID"];
        [pref setObject:appsecret forKey:@"appSecret"];
    }
    
}
- (NSString *)getTrackingEventBaseURL {
    return self.trackingBaseURL;
}


/*
 To convert RGB to UIColor
 */


+ (UIColor *)getColorFromRed:(float)red green:(float)green blue:(float)blue alpha:(double)value
{
    return [UIColor colorWithRed:(red/255.0f) green:(green/255.0f) blue:(blue/255.0f) alpha:value];
}

+ (DeviceType)getThisDeviceType
{
    CGSize sSize = [UIScreen mainScreen].bounds.size;
    
    if (sSize.width == 320 && sSize.height == 480)
    {
        return iPhone_4;
    }
    else if(sSize.width == 320 && sSize.height == 568)
    {
        return iPhone_5;
    }
    else if(sSize.width == 375 && sSize.height == 667)
    {
        return iPhone_6;
    }
    else if(sSize.width == 414 && sSize.height == 736)
    {
        return iPhone_6Plus;
    }
    else if(sSize.width == 768 && sSize.height == 1024)
    {
        return iPad;
    }
    
    return other_Device;
}

+ (void)storeImagesToPhotoAlbum:(UIImage *)imageToBeStored andOriginalImage:(UIImage *)originalImage {
    if (imageToBeStored) {
        dispatch_queue_t myQueue = dispatch_queue_create("queueToStoreImagesToLibrary", 0);
        dispatch_async(myQueue, ^{
            UIImageWriteToSavedPhotosAlbum(imageToBeStored, nil, nil, nil);
            UIImageWriteToSavedPhotosAlbum(originalImage, nil, nil, nil);
        });
    } else {
        return;
    }
}

+ (CGSize)changeWidthProportionatelySize:(CGSize)orgSize toWidth:(CGFloat)width
{
    CGFloat adjustedWidth = width;
    float widthRatio = width / orgSize.width ;
    CGFloat adjustedHeight =  orgSize.height * widthRatio;
    return CGSizeMake(ceilf(adjustedWidth), ceilf(adjustedHeight));
}

+ (CGSize)changeHeightProportionatelySize:(CGSize)orgSize toHeight:(CGFloat)height
{
    CGFloat adjustedHeight = height;
    float heightRatio = height / orgSize.height ;
    CGFloat adjustedWidth =  orgSize.width * heightRatio;
    return CGSizeMake(adjustedWidth, adjustedHeight);
}

+ (CGFloat)calculateChangeValue:(CGFloat)oldValue fromValue:(CGFloat)fromValue toValue:(CGFloat)toValue
{
    float increase;
    
    increase = ((toValue / fromValue - 1) * 100);
    
    
    float val = (oldValue + (oldValue/100 * increase));
    
    return val;
}

#pragma mark - UIImage methods

+(UIImage *)cropImage:(UIImage *)img withRect:(CGRect)rect
{
    
    img = [UIImage imageWithCGImage:img.CGImage scale:img.scale orientation:img.imageOrientation];
    
    CGImageRef cr = CGImageCreateWithImageInRect([img CGImage], rect);
    UIImage* cropped = [[UIImage alloc] initWithCGImage:cr];
    CGImageRelease(cr);
    return cropped;
}

#pragma mark - CGSize methods

+(CGRect)checkForOutSizeBoundOriginalSize:(CGSize)originalSize withCropRect:(CGRect)cropRect
{
    // check for out size bound
    
    if (cropRect.size.width > cropRect.size.height)
    {
        CGFloat value = cropRect.origin.y + cropRect.size.width;
        if (value > originalSize.height)
        {
            cropRect.origin.x = cropRect.origin.x + ((cropRect.size.width - cropRect.size.height) / 2);
            cropRect.size.width = cropRect.size.height;
        }
    }
    else
    {
        CGFloat value = cropRect.origin.x + cropRect.size.height;
        if (value > originalSize.width)
        {
            cropRect.origin.y = cropRect.origin.y + ((cropRect.size.height - cropRect.size.width) / 2);
            cropRect.size.height = cropRect.size.width;
            
        }
    }
    
    return cropRect;
}


#pragma mark - viewController methods

/*
 To Get viewcontroller nib file from StoryBoard
 */

+ (id)getViewControllerFromStoryBoard:(NSString *)identity
{
    UIStoryboard *myStoryboard = [UIStoryboard storyboardWithName:@"SFSample" bundle:[SDKUtilities getCurrentBundle]];
    UIViewController *vC = [myStoryboard instantiateViewControllerWithIdentifier:identity];
    return vC;
}

+(NSBundle *)getCurrentBundle
{
    return [NSBundle bundleWithIdentifier:@"com.MSDVisualSearchAndRecoSDK"];
}

+(UIImage *)getCurrentBundleImage:(NSString *)name
{
    UIImage *img;
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")) {
        img = [UIImage imageNamed:name inBundle:[SDKUtilities getCurrentBundle] compatibleWithTraitCollection:nil];
    } else {
        NSString *imageNameWithBundleName = [NSString stringWithFormat:@"com.MSDVisualSearchAndRecoSDK.bundle/%@.png",name];
        img = [UIImage imageWithContentsOfFile:imageNameWithBundleName];
        if (!img) {
            DLog(@"Image Path At iOS 7.0 : %@",[[[SDKUtilities getCurrentBundle] resourcePath] stringByAppendingPathComponent:name]);
            NSString *pathExtention = [name pathExtension];
            NSString *fileName;
            if (pathExtention.length > 1) {
                fileName = [[[SDKUtilities getCurrentBundle] resourcePath] stringByAppendingPathComponent:name];
            } else {
                fileName = [NSString stringWithFormat:@"%@.png",[[[SDKUtilities getCurrentBundle] resourcePath] stringByAppendingPathComponent:name]];
            }
            img = [UIImage imageWithContentsOfFile:fileName];
        }
    }
    
    return img;
}


#pragma mark - Gestures
/*
 Enabling Tap Gesture on element
 */
+(UITapGestureRecognizer *)EnableTapObject:(UIView *)view callBack:(SEL)callBack delegate:(id)delegate noOfTap:(int)tap
{
    UITapGestureRecognizer *tapgesture=[[UITapGestureRecognizer alloc]initWithTarget:delegate action:callBack];
    tapgesture.numberOfTapsRequired = tap;
    //    tabgesture.delegate = delegate;
    [view setUserInteractionEnabled:YES];
    [view addGestureRecognizer:tapgesture];
    return tapgesture;
}

#pragma mark - Showing Alert Message

+ (void)showAlertMessage:(NSString *)message andTitle:(NSString *)title {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:message delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [alert show];
}

#pragma mark - set local storage (NSUserDefaults) methods

+ (BOOL)isLocalStorageOn:(NSString *)keyForCheck
{
    @try {
        NSUserDefaults *InsallationShown = [NSUserDefaults standardUserDefaults];
        return [InsallationShown boolForKey:keyForCheck];
        
    }
    @catch (NSException *exception) {
        return 0;
    }
}

+ (void)setLocalStorageBit:(BOOL)flag withKey:(NSString *)keyForSet
{
    NSUserDefaults *InsallationShown = [NSUserDefaults standardUserDefaults];
    [InsallationShown setBool:flag forKey:keyForSet];
    [InsallationShown synchronize];
    
}

+ (void)setValueForLocalStorageVar:(id)value withKey:(NSString *)key
{
    NSUserDefaults *Installation = [NSUserDefaults standardUserDefaults];
    [Installation setObject:value forKey:key];
    [Installation synchronize];
}

+(id)getValueForLocalStorageVarKey:(NSString *)key
{
    NSUserDefaults *Installation = [NSUserDefaults standardUserDefaults];
    return [Installation valueForKey:key];
}

+ (NSString *)uuid
{
    CFUUIDRef uuidRef = CFUUIDCreate(NULL);
    CFStringRef uuidStringRef = CFUUIDCreateString(NULL, uuidRef);
    CFRelease(uuidRef);
    return (__bridge_transfer NSString *)uuidStringRef;
}

+ (NSString *)getCurrentEpochTimeAsString
{
      return [NSString stringWithFormat:@"%lli",[@(floor([[NSDate date] timeIntervalSince1970])) longLongValue]];
}

#pragma mark - Track Events 

- (void)trackEvents:(NSString *)event withParams:(NSDictionary *)params numTimesCalled:(int)numTimesCalled {
    
    dispatch_queue_t sharedTrackingEventQueue = dispatch_queue_create("trackingEventQueue", 0);
    dispatch_async(sharedTrackingEventQueue, ^{
        __block int num_times = numTimesCalled;
        NSString *epochTime = [SDKUtilities getCurrentEpochTimeAsString];
        NSString *uuid = [SDKUtilities uuid];//[SDKUtilities getValueForLocalStorageVarKey:DEVICE_ID];
        
        NSMutableDictionary *preParams = [[NSMutableDictionary alloc]initWithObjects:[[NSArray alloc]initWithObjects:Tracking_Param_URL, Tracking_Param_referer, epochTime, uuid, nil] forKeys:[[NSArray alloc]initWithObjects:@"url", @"referrer", @"clicked", @"uuid",  nil]];
        [preParams addEntriesFromDictionary:params];
        
        NSString *url = [[[SDKUtilities sharedInstance] getTrackingEventBaseURL] stringByAppendingString:event];
        if (!requestHandler) {
            requestHandler = [[HTTPRequest alloc] init];
        }
        [requestHandler sendRequestWithURL:url Params:preParams withMethod:GET onSuccess:^(id data)
         {
             DLog(@"Track result !!!==> %@", data);
             
         } onError:^(NSError *error) {
             if(num_times>=0)
             {
                 num_times-=1;
                 [self trackEvents:event withParams:params numTimesCalled:num_times];
             }
             DLog(@"Track error %@", [error description]);
         }];
        
    });
}


- (void)trackEvents:(NSString *)event withParams:(NSDictionary *)params {
    [self trackEvents:event withParams:params numTimesCalled:3];
}

@end
