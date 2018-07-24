//
//  WDIUserDefaultsManager.h
//  Wadi
//
//  Created by Pulkit Sharma on 14/07/17.
//  Copyright © 2017 WADI. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WDIUserDefaultsManager : NSObject

+ (void)setObject:(id)object forKey:(NSString *)key;

+ (void)setBool:(bool)value forKey:(NSString *)key;

+ (void)removeObjectForKey:(NSString *)key;

+ (NSArray *)arrayForKey:(NSString *)key;

+ (NSString *)stringForKey:(NSString *)key;

+ (id)objectForKey:(NSString *)key;

+ (bool)boolForKey:(NSString *)key;

@end
