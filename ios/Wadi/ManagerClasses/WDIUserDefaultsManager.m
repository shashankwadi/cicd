//
//  WDIUserDefaultsManager.m
//  Wadi
//
//  Created by Pulkit Sharma on 14/07/17.
//  Copyright © 2017 WADI. All rights reserved.
//

#import "WDIUserDefaultsManager.h"

@implementation WDIUserDefaultsManager

+ (void)setObject:(id)object forKey:(NSString *)key {
    
    [[NSUserDefaults standardUserDefaults] setObject:object forKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (void)setBool:(bool)value forKey:(NSString *)key {
    
    [[NSUserDefaults standardUserDefaults] setBool:value forKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (void)removeObjectForKey:(NSString *)key {
    
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSArray *)arrayForKey:(NSString *)key {
    
    return [[NSUserDefaults standardUserDefaults] arrayForKey:key];

}

+ (NSString *)stringForKey:(NSString *)key {
    
    return [[NSUserDefaults standardUserDefaults] stringForKey:key];

}

+ (id)objectForKey:(NSString *)key {
    
    return [[NSUserDefaults standardUserDefaults] objectForKey:key];
}

+ (bool)boolForKey:(NSString *)key {
    
    return [[NSUserDefaults standardUserDefaults] boolForKey:key];
}

@end
