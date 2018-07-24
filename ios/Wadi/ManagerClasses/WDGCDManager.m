//
//  WDGCDManager.m
//  Wadi
//
//  Created by Shashank Sharma on 12/04/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "WDGCDManager.h"

@implementation WDGCDManager

+ (id)sharedInstance {
  static WDGCDManager *sharedManager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedManager = [[self alloc] init];
  });
  return sharedManager;
}

- (void)addResponseHandlers {
  
  [self maintainSessionForAlreadyLoggedInUser];
  
  AppDelegate *appDel = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  
  __weak typeof(self) weakSelf = self;
  // Add a handler to respond to GET requests on any local URL
  [appDel.webServer addHandlerForMethod:@"GET" pathRegex:@"/api/" requestClass:[GCDWebServerRequest class] processBlock:^GCDWebServerResponse * _Nullable(__kindof GCDWebServerRequest * _Nonnull request) {
    GCDWebServerResponse *response = [weakSelf sendGetRequestToWadiServer:request];
    return response;
  }];
  
  // Add a handler to respond to POST requests on any local URL
  [appDel.webServer addHandlerForMethod:@"POST" pathRegex:@"/api/" requestClass:[GCDWebServerURLEncodedFormRequest class] processBlock:^GCDWebServerResponse * _Nullable(__kindof GCDWebServerRequest * _Nonnull request) {
    GCDWebServerResponse *response = [weakSelf sendPostRequestToWadiServer:request];
    return response;
  }];
  
  // Add a handler to respond to POST requests on any local URL
  [appDel.webServer addHandlerForMethod:@"PUT" pathRegex:@"/api/" requestClass:[GCDWebServerURLEncodedFormRequest class] processBlock:^GCDWebServerResponse * _Nullable(__kindof GCDWebServerRequest * _Nonnull request) {
    GCDWebServerResponse *response = [weakSelf sendPutRequestToWadiServer:request];
    return response;
  }];
  
  // Add a handler to respond to POST requests on any local URL
  [appDel.webServer addHandlerForMethod:@"DELETE" pathRegex:@"/api/" requestClass:[GCDWebServerURLEncodedFormRequest class] processBlock:^GCDWebServerResponse * _Nullable(__kindof GCDWebServerRequest * _Nonnull request) {
    GCDWebServerResponse *response = [weakSelf sendDeleteRequestToWadiServer:request];
    return response;
  }];
}

#pragma mark Different Request Types
- (GCDWebServerResponse *)sendGetRequestToWadiServer:(GCDWebServerRequest *)request {
  
  NSString *wadiUrl = [NSString stringWithString:[self getRequestURLStringForRequest:request]];
  
  __block GCDWebServerDataResponse *response = nil;
  AFHTTPSessionManager *manager = [self getRequestManagerForUrl:request];

  //This is  waiting  for block to complete
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __weak typeof(self) weakSelf = self;
  [manager GET:wadiUrl parameters:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    
    [weakSelf savaCookiesFromHeaders:responses.allHeaderFields forUrlRequest:task.originalRequest];
    //to avoid crash
    if (responseObject == nil) {
      responseObject = [[NSDictionary alloc] init];
    }
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
    response = [GCDWebServerDataResponse responseWithData:jsonData contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  } failure:^(NSURLSessionDataTask * _Nonnull task, NSError * _Nonnull error) {
    NSLog(@"Error: %@", error);
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    response = [GCDWebServerDataResponse responseWithData:error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey] contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
    
  }];
  
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  return response;
};

- (GCDWebServerResponse *)sendPostRequestToWadiServer:(GCDWebServerURLEncodedFormRequest *)request {
  
  NSString *wadiUrl = [NSString stringWithString:[self getRequestURLStringForRequest:request]];
  
  __block GCDWebServerDataResponse *response = nil;
  AFHTTPSessionManager *manager = [self getRequestManagerForUrl:request];
  
  //this is  waiting  for block to complete
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __weak typeof(self) weakSelf = self;
  [manager POST:wadiUrl parameters:[request jsonObject] success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    [weakSelf savaCookiesFromHeaders:responses.allHeaderFields forUrlRequest:task.originalRequest];
    //to avoid crash
    if (responseObject == nil) {
      responseObject = [[NSDictionary alloc] init];
    }
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
    response = [GCDWebServerDataResponse responseWithData:jsonData contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  } failure:^(NSURLSessionDataTask * _Nonnull task, NSError * _Nonnull error) {
    NSLog(@"Error: %@", error);
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    response = [GCDWebServerDataResponse responseWithData:error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey] contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  }];
  
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  return response;
};

- (GCDWebServerResponse *)sendPutRequestToWadiServer:(GCDWebServerURLEncodedFormRequest *)request {
  
  NSString *wadiUrl = [NSString stringWithString:[self getRequestURLStringForRequest:request]];
  
  __block GCDWebServerDataResponse *response = nil;
  AFHTTPSessionManager *manager = [self getRequestManagerForUrl:request];
  
  //this is  waiting  for block to complete
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __weak typeof(self) weakSelf = self;
  [manager PUT:wadiUrl parameters:[request jsonObject] success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    [weakSelf savaCookiesFromHeaders:responses.allHeaderFields forUrlRequest:task.originalRequest];
    //to avoid crash
    if (responseObject == nil) {
      responseObject = [[NSDictionary alloc] init];
    }
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
    response = [GCDWebServerDataResponse responseWithData:jsonData contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  } failure:^(NSURLSessionDataTask * _Nonnull task, NSError * _Nonnull error) {
    NSLog(@"Error: %@", error);
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    response = [GCDWebServerDataResponse responseWithData:error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey] contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  }];
  
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  return response;
};

- (GCDWebServerResponse *)sendDeleteRequestToWadiServer:(GCDWebServerURLEncodedFormRequest *)request {
  
  NSString *wadiUrl = [NSString stringWithString:[self getRequestURLStringForRequest:request]];
  
  __block GCDWebServerDataResponse *response = nil;
  AFHTTPSessionManager *manager = [self getRequestManagerForUrl:request];
  
  //this is  waiting  for block to complete
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __weak typeof(self) weakSelf = self;
  
  [manager DELETE:wadiUrl parameters:[request jsonObject] success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    [weakSelf savaCookiesFromHeaders:responses.allHeaderFields forUrlRequest:task.originalRequest];
    //to avoid crash
    if (responseObject == nil) {
      responseObject = [[NSDictionary alloc] init];
    }
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject options:NSJSONWritingPrettyPrinted error:nil];
    response = [GCDWebServerDataResponse responseWithData:jsonData contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  } failure:^(NSURLSessionDataTask * _Nonnull task, NSError * _Nonnull error) {
    NSLog(@"Error: %@", error);
    NSHTTPURLResponse *responses = (NSHTTPURLResponse *)task.response;
    response = [GCDWebServerDataResponse responseWithData:error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey] contentType:[responses.allHeaderFields valueForKey:@"Content-Type"]];
    dispatch_semaphore_signal(semaphore);
  }];
  
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  return response;
};


#pragma mark -- Utility Methods
- (NSString*)getRequestURLStringForRequest:(GCDWebServerRequest *) request {
  
  AppDelegate *appDel = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  NSString *wadiUrl = [request.URL.absoluteString stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"http://127.0.0.1:%lu/api",(unsigned long)appDel.gcdPort] withString:@"https://api.wadi.com"];
  
  return wadiUrl;
}

- (AFHTTPSessionManager*)getRequestManagerForUrl:(GCDWebServerRequest *) request {
  AFHTTPSessionManager *manager = [[AFHTTPSessionManager alloc] initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
  manager.requestSerializer = [AFJSONRequestSerializer serializer];
  
  NSMutableString *cokieMergedVal = [[NSMutableString alloc] init];
  //set headers in current request
  for (NSString *key in [request.headers allKeys]) {
    NSString *value = [request.headers valueForKey:key];
    [manager.requestSerializer setValue:value forHTTPHeaderField:key];
    if ([key caseInsensitiveCompare:@"cookie"] == NSOrderedSame) {
      [cokieMergedVal appendString:[request.headers valueForKey:key]];
    }
  }
  
  //set headers saved cookies
  NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
  NSDictionary *cokieDict = [[NSDictionary alloc] initWithDictionary:[ud objectForKey:@"wadiCookies"]];
  
  for (NSMutableString *key in [cokieDict allKeys]) {
    NSMutableString *value = [cokieDict valueForKey:key];
    if (cokieMergedVal.length > 0) {
      [cokieMergedVal appendString:[NSString stringWithFormat:@";%@=%@",key,value]];
    }else{
      [cokieMergedVal appendString:[NSString stringWithFormat:@"%@=%@",key,value]];
    }
  }
  
  //Since GCD sets localhost as a value of HOST we change it to our server
  if (cokieMergedVal.length > 0) {
    NSString *finalStr;
    finalStr = [cokieMergedVal stringByReplacingOccurrencesOfString:@"httponly," withString:@""];
    finalStr = [finalStr stringByReplacingOccurrencesOfString:@"httponly" withString:@""];
    finalStr = [finalStr stringByReplacingOccurrencesOfString:@"secure," withString:@""];
    finalStr = [finalStr stringByReplacingOccurrencesOfString:@"secure" withString:@""];
    [manager.requestSerializer setValue:finalStr forHTTPHeaderField:@"Cookie"];
  }
  [manager.requestSerializer setValue:@"api.wadi.com" forHTTPHeaderField:@"Host"];
  [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  
  return manager;
}

-(void)savaCookiesFromHeaders:(NSDictionary*)responseHeaders forUrlRequest:(NSURLRequest*)req {
  NSString *urlStr = @"";
  if (req != nil) {
    urlStr = [[NSString alloc] initWithString:[req.URL absoluteString]];
  }
  NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
  NSMutableDictionary *savedCookieDict;
  NSMutableDictionary *currentHeaderCookieDict = [[NSMutableDictionary alloc] init];
  
  
  if ([ud objectForKey:@"wadiCookies"] != nil) {
    savedCookieDict = [NSMutableDictionary dictionaryWithDictionary:[ud objectForKey:@"wadiCookies"]];
  }
  
  //Save cookies along with meta deta
  /*for (NSString *key in [responseHeaders allKeys]) {
    if([key caseInsensitiveCompare:@"set-cookie"] == NSOrderedSame) {
      NSString *cookieVal = [responseHeaders valueForKey:key];
      NSArray *parsedArray = [cookieVal componentsSeparatedByString:@";"];
      for (NSString *cokie in parsedArray) {
        NSArray *parsedArray = [cokie componentsSeparatedByString:@"="];
        if (parsedArray.count >1) {
          [currentHeaderCookieDict setValue:[parsedArray objectAtIndex:1] forKey:[parsedArray objectAtIndex:0]];
        }
      }
    }
  }*/
  
  //Save cookies without meta deta
  for (NSString *key in [responseHeaders allKeys]) {
    if([key caseInsensitiveCompare:@"set-cookie"] == NSOrderedSame) {
      if ([[responseHeaders valueForKey:key] isKindOfClass:[NSString class]]) {
        //Cookie value is in String
        NSString *cookieVal = [responseHeaders valueForKey:key];
        NSArray *parsedCookies = [cookieVal componentsSeparatedByString:@";"];
        if (parsedCookies.count) {
        NSArray *parsedArray = [[parsedCookies objectAtIndex:0] componentsSeparatedByString:@"="];
        if (parsedArray.count >1) {
          if ([[parsedArray objectAtIndex:1] caseInsensitiveCompare:@"deleted"] == NSOrderedSame) {
            
            //Dont add cookie with value "deleted"
          } else {
            
            [currentHeaderCookieDict setValue:[parsedArray objectAtIndex:1] forKey:[parsedArray objectAtIndex:0]];
          }
        }
        }
      } else {
        //Cookie value is in Array
        NSArray *cookieValArr = [responseHeaders valueForKey:key];
        for (NSString *cokie in cookieValArr) {
          NSArray *parsedCookies = [cokie componentsSeparatedByString:@";"];
          if (parsedCookies.count) {
            NSArray *parsedArray = [[parsedCookies objectAtIndex:0] componentsSeparatedByString:@"="];
            if (parsedArray.count >1) {
              
              if ([[parsedArray objectAtIndex:1] caseInsensitiveCompare:@"deleted"] == NSOrderedSame) {
                
                //Dont add cookie with value "deleted"
              } else {
                
                [currentHeaderCookieDict setValue:[parsedArray objectAtIndex:1] forKey:[parsedArray objectAtIndex:0]];
              }
            }
          }
        }
      }
      break;
    }
  }
  
  if (savedCookieDict != nil) {
    NSMutableDictionary *mergeDict = [NSMutableDictionary dictionaryWithDictionary:savedCookieDict];
    [mergeDict addEntriesFromDictionary:currentHeaderCookieDict];
    [ud setObject:mergeDict forKey:@"wadiCookies"];
  } else {
    [ud setObject:currentHeaderCookieDict forKey:@"wadiCookies"];
  }
  
 
  [ud synchronize];
}

-(void)maintainSessionForAlreadyLoggedInUser {
  // initially cehck if there is any value set for wadiCookies
  NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
  NSMutableDictionary *wadiCookiesDictionary = [ud objectForKey:@"wadiCookies"];
  
  if (wadiCookiesDictionary == nil || [[wadiCookiesDictionary allKeys] count] < 1) {
    NSString *identifier = [ud secureObjectForKey:@"kCookieIdentifier" valid:false];
    //local server code has never run before, hence 1st run of doodle so set up cookies for existing logged in user
    if (identifier != nil) {
      //already logged in user in the previous native app, value of identifier set is identity=tokenVal
      NSArray *parsedArray = [identifier componentsSeparatedByString:@"="];
      if (parsedArray.count >1) {
        [wadiCookiesDictionary setValue:[parsedArray objectAtIndex:1] forKey:[parsedArray objectAtIndex:0]];
        [ud setObject:wadiCookiesDictionary forKey:@"wadiCookies"];
        [ud synchronize];
      }
    }
  } else {
    [self removeDeletedCookies];
  }
}

- (void)removeDeletedCookies {
  
  NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
  NSDictionary *wadiCookiesDictionary = [ud objectForKey:@"wadiCookies"];
  NSMutableDictionary *cookieDict = [wadiCookiesDictionary mutableCopy];
  for (NSString *key in [wadiCookiesDictionary allKeys]) {
    
    if ([[wadiCookiesDictionary objectForKey:key] caseInsensitiveCompare:@"deleted"] == NSOrderedSame) {
      [cookieDict removeObjectForKey:key];
    }
  }
  [ud setObject:cookieDict forKey:@"wadiCookies"];
  [ud synchronize];
}

-(void)deleteIdentityCookiesFromUD {
  NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
  NSMutableDictionary *savedCookieDict = [NSMutableDictionary dictionaryWithDictionary:[ud objectForKey:@"wadiCookies"]];
  
  [savedCookieDict removeObjectForKey:@"identity"];
  [ud setObject:savedCookieDict forKey:@"wadiCookies"];
  [ud synchronize];
}





@end
