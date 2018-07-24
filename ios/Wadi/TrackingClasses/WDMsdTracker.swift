//
//  WDMsdTracker.swift
//  Wadi
//
//  Created by Shashank Sharma on 16/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit

class WDMsdTracker: NSObject {

  /**
   Track Event for MSD.
   
   - parameter name: title for tracking.
   - parameter data: data dictionary for tracking.
   
   */
  
  class func trackMsdEvent(data:Dictionary<String, Any>) {
    var msdEventName = ""
    
    if  let eventName = data["name"] as? String {
      msdEventName = eventName
    }
    SDKUtilities.sharedInstance().trackEvents(msdEventName, withParams: data)
  }
}
