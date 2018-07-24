//
//  Https.m
//  FashionStreet
//
//  Created by Madhu Balan on 07/08/15.
//  Copyright (c) 2015 FashionStreet. All rights reserved.
//

#import "HTTPRequest.h"
#import "AFNetworking.h"
#import "AFURLSessionManager.h"

AFHTTPRequestOperationManager *manager;

@implementation HTTPRequest

+ (void)initialize
{
    manager = [AFHTTPRequestOperationManager manager];
}

-(void)sendRequestWithURL:(NSString *)requestURL Params:(NSDictionary *)params withMethod:(HTTPMethodType)method onSuccess:(void (^)(NSData *))onSuccess onError:(void (^)(NSError *))onError
{
    if (requestURL) {
        NSString *strMethod = (method == GET) ? @"GET" : @"POST";
        
        [self printParamsToLog:params andMethod:strMethod andUrl:requestURL];
        
        if(method == GET)
        {
            [self sendGETRequest:requestURL withMethod:GET withParams:params onSuccess:^(id data) {
                
                data = [self validateDictionaryObject:data];
//                NSLog(@"Raw Data %@",data);
                if (data) {
                    NSLog(@" Dict Raw Data %@",data);
//                    ProductsResult *result = [[ProductsResult alloc]initWithDictionary:data error:nil];
                    onSuccess(data);
                } else {
                    NSError *err = [NSError errorWithDomain:@"Dictionary Validation Failure..." code:0 userInfo:nil];
//                    NSLog(@"Error While Validating Received Dictionary Object from API...");
                    onError(err);
                }
            } onError:^(NSError *error) {
                onError(error);
            }];
        } else {
            
            [self sendPOSTRequest:requestURL Params:params onSuccess:^(id data) {
                
                data = [self validateDictionaryObject:data];
                NSLog(@"Raw Data %@",data);
                if (data) {
                    NSLog(@" Dict Raw Data %@",data);
//                    ProductsResult *result = [[ProductsResult alloc]initWithDictionary:data error:nil];
                    onSuccess(data);
                } else {
                    NSError *err = [NSError errorWithDomain:@"Dictionary Validation Failure..." code:0 userInfo:nil];
                    NSLog(@"Error While Validating Received Dictionary Object from API...");
                    onError(err);
                }        } onError:^(NSError *error) {
                    onError(error);
                }];
        }

    }
}


- (void)sendPOSTRequest:(NSString *)url Params:(NSDictionary *)params onSuccess:(void(^)(id data)) onSuccess onError: (void(^)(NSError * error)) onError
{
    [self printParamsToLog:params andMethod:@"POST" andUrl:url];
    
    [manager POST:url parameters:params
          success:^(AFHTTPRequestOperation *operation, id responseObject)
     {
         //         NSLog(@"%@", responseObject);
         onSuccess(responseObject);
     }
          failure:
     ^(AFHTTPRequestOperation *operation, NSError *error) {
         onError(error);
     }];
}

-(void)sendGETRequest:(NSString *)requestURL withMethod:(HTTPMethodType)method withParams:(NSDictionary *)params onSuccess:(void(^)(id data)) onSuccess onError: (void(^)(NSError * error)) onError
{
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    
    [manager GET:requestURL parameters:params success:^(AFHTTPRequestOperation *operation, id responseObject) {
        onSuccess(responseObject);
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        onError(error);
    }];
}



- (NSDictionary *)validateDictionaryObject:(NSDictionary *)dict
{
    if (dict) {
        if ([dict isKindOfClass:[NSDictionary class]]) {
            return dict;
        } else if([dict isKindOfClass:[NSData class]]){
            // Try to Serialize the Wild Data Object with  NSJSONSerialization.
            // If Succedds return valid Dict object else return Nil.
            NSError *error = nil;
            //NSLog(@"Incoming Data in Wildcard Data Format %@",[NSJSONSerialization JSONObjectWithData:dict options:NSJSONReadingAllowFragments error:&error]);
            if (error) {
                NSLog(@"Error While Json Serialization %@",error.localizedDescription);
                return nil;
            } else {
                dict = [NSJSONSerialization JSONObjectWithData:(NSData *)dict options:NSJSONReadingAllowFragments error:&error];
                return dict;
            }
        } else {
            return nil;
        }
    }
    
    return nil;
}

/*
 Preparing and Storing request in Database
 */

- (void) printParamsToLog: (NSDictionary *) parameters andMethod: (NSString *) method andUrl: (NSString *) url{
    NSLog(@"========= POSTING PARAMS STARTS ===========");
    NSMutableString *finalURL = [NSMutableString stringWithFormat:@"%@?",url];
    for(NSString *key in [parameters allKeys]){
        NSLog(@"%@ = %@", key, [parameters objectForKey:key]);
        [finalURL appendString:[NSString stringWithFormat:@"%@=%@&",key,[parameters objectForKey:key]]];
    }
        [finalURL deleteCharactersInRange:NSMakeRange([finalURL length]-1, 1)];

    if ([method isEqualToString:@"GET"]) {
        NSLog(@"Final encoded GET URL : %@",finalURL);
    }
    NSLog(@"-- %@ -- %@", method, url);
    NSLog(@"========= POSTING PARAMS ENDS ===========");
}



@end
