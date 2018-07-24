//
//  WDFbTracker.swift
//  Wadi
//
//  Created by Shashank Sharma on 12/07/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import FBSDKCoreKit

class WDFbTracker: NSObject {
  
  /**
   Track Event for Facebook.
   
   - parameter name: title for tracking.
   - parameter data: data dictionary for tracking.
   - parameter isPurchase: type of Tracking tracking.
   
   */
  
  class func trackFbEvent(data:Dictionary<String, Any>, isPurchase:Bool) {
    
    var paramDict = [String:String]()
    
    if  let val = data["FBSDKAppEventParameterNameCurrency"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameRegistrationMethod"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameContentType"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameContent"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameContentID"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameSearchString"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameSuccess"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameMaxRatingValue"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNamePaymentInfoAvailable"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameNumItems"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameLevel"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    if  let val = data["FBSDKAppEventParameterNameDescription"] as? String {
      paramDict[FBSDKAppEventParameterNameContentType] = val
    }
    
    
    if isPurchase {
      var purchaseVal:Double = 0
      var currencyVal = ""
      
      if  let val = data["purchase"] as? Double {
        purchaseVal = val
      }
      
      if  let val = data["currency"] as? String {
        currencyVal = val
      }
      
      FBSDKAppEvents.logPurchase(purchaseVal, currency: currencyVal, parameters: paramDict)
      
    }else{
      
      var valSum:Double = 0
      
      if  let val = data["valueToSum"] as? Double {
        valSum = val
      }
      
      var name = ""
      if  let nameVal = data["name"] as? String {
        name = nameVal
      }
      
      FBSDKAppEvents.logEvent(name, valueToSum: valSum, parameters: paramDict)
      
    }
  }
  
}
