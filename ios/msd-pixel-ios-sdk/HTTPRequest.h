//
//  Https.h
//  FashionStreet
//
//  Created by Madhu Balan on 07/08/15.
//  Copyright (c) 2015 FashionStreet. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

// API Response Class

@interface HTTPRequest : NSObject

typedef enum
{
    GET      =   0,
    POST
}HTTPMethodType;


- (void)sendRequestWithURL:(NSString *)requestURL Params:(NSDictionary *)params withMethod:(HTTPMethodType)method onSuccess:(void(^)(NSData  *data)) onSuccess onError: (void(^)(NSError * error)) onError;

//- (void)sendRequestWithURL:(NSString *)requestURL Params:(NSDictionary *)params withMethod:(HTTPMethodType)method onError: (void(^)(NSError * error)) onError;

@end
