//
//  AppConstants.h
//  MadStreetDen
//
//  Created by Vijaya Rekha on 7/27/15.
//  Copyright (c) 2015 Home. All rights reserved.
//

#ifndef MadStreetDen_AppConstants_h
#define MadStreetDen_AppConstants_h

#define DEVICE_ID @"MSD_DEVICE_ID"

#define NUMBEROFPRODUCTS @"16"

#define MAX_COUNT_DISPLAY_OVERLAY 3
#define NO_OF_TIME_PRODUCT_OVERLAY @"msd_number_of_time_overlay_on_produce"
#define NO_OF_TIME_CAMERA_OVERLAY @"msd_number_of_time_overlay_on_camera"
#define NO_OF_TIME_PHOTO_ALBUM_OVERLAY @"msd_number_of_time_overlay_on_album"

#define IS_IPAD (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
#define IS_IPHONE (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone)
#define IS_RETINA ([[UIScreen mainScreen] scale] >= 2.0)

#define SCREEN_WIDTH ([[UIScreen mainScreen] bounds].size.width)
#define SCREEN_HEIGHT ([[UIScreen mainScreen] bounds].size.height)
#define SCREEN_MAX_LENGTH (MAX(SCREEN_WIDTH, SCREEN_HEIGHT))
#define SCREEN_MIN_LENGTH (MIN(SCREEN_WIDTH, SCREEN_HEIGHT))

#define IS_IPHONE_4_OR_LESS (IS_IPHONE && SCREEN_MAX_LENGTH < 568.0)
#define IS_IPHONE_5 (IS_IPHONE && SCREEN_MAX_LENGTH == 568.0)
#define IS_IPHONE_6 (IS_IPHONE && SCREEN_MAX_LENGTH == 667.0)
#define IS_IPHONE_6P (IS_IPHONE && SCREEN_MAX_LENGTH == 736.0)

#define SYSTEM_VERSION_EQUAL_TO(v)                  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedSame)
#define SYSTEM_VERSION_GREATER_THAN(v)              ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedDescending)
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN_OR_EQUAL_TO(v)     ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedDescending)

#define CROP_IMG_SIZE 360
#define FILTER_SCREEN_TITLE @"FILTER"

#define UIColorFromRGB(rgbValue) [UIColor \
colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 \
green:((float)((rgbValue & 0xFF00) >> 8))/255.0 \
blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0]

#define SUCCESS_STATE @"success"
#define FAILS_MESSAGE @"Fails to fetch data, please try again"

#define NO_INTERNET_MSG @"No Network Connection. Please check your network and try again."
#define ERROR_CODE_NO_INTERNET 11
#define ERROR_CODE_SERVER 1111
#define ALERT_TITLE @"MSDVisualSearchRecommendation"

// API related Common Items

#define SEARCH_BY_IMAGE @"search"
#define DISCOVER_URL @"discover"
#define MORE_URL @"more"
#define FILTER_URL @"filter"

// Tracking Events and related Items

#define EVENTimageSearch          @"/imageSearchResults"
#define EVENTfilterResults       @"/filterResults"
#define EVENTresultsScroll       @"/resultsScroll"
#define EVENTresultClick         @"/carouselClick"

#define EVENTview              @"/pageView"
#define EVENTvisualSearch        @"/visualSearch"
#define EVENTviewSimilar         @"/viewSimilar"
#define EVENTpreferences         @"/preferences"

#define EVENTsocialShare         @"/socialShare"
#define EVENTaddToCart          @"/addToCart"
#define EVENTbuy               @"/buy"
#define EVENTaddToWishlist      @"/addToWishlist"
#define EVENTremoveFromCart    @"/removeFromCart"
#define EVENTremoveFromWishlist @"/removeFromWishlist"
#define EVENTplaceOrder         @"/placeOrder"

#define EVENTshowCarousel        @"/carouselShow"
#define EVENThideCarousel        @"/carouselClose"
#define EVENTswipeCarousel       @"/carouselSwipe"
#define EVENTclickCarousel       @"/carouselClick"

#define Tracking_Param_URL @"https://tataunistore.com/"
#define Tracking_Param_referer @"com.wadi.wadi"


#define NO_OF_RESULT @"30"

#ifdef DEBUG_MODE
#define DLog( s, ... ) DLog( @"<%p %@:(%d)> %@", self, [[NSString stringWithUTF8String:__FILE__] lastPathComponent], __LINE__, [NSString stringWithFormat:(s), ##__VA_ARGS__] )
#else
#define DLog( s, ... )
#endif



#endif
