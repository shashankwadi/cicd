//
//  WDTrackingManager.swift
//  Wadi
//
//  Created by Shashank Sharma on 12/07/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit

class WDTrackingManager: NSObject {
  
  /**
   Track Event for Facebook.
   
   - parameter name: title for tracking.
   - parameter info: data dictionary for tracking.
   - parameter trackType: enum for tracking ie. where all this events needs to be tracked.
   
   */
  
  class func trackEvent(title:String, info:Dictionary<String,Any>, trackType:WDTrackingEnum.TrackingType) {
    
    //FIXME: These values has to come from api config hardcoding until api is ready.
    let gtmFlag = true
    let fbFlag = true
    let tuneFlag = true
    
    
    switch trackType {
    case .all:
      
      if gtmFlag {
        WDGtmTracker.trackGtmEvent(data: info)
      }
      
      if fbFlag {
       // WDFbTracker.trackFbEvent(name: title, data: info)
      }
      
      if tuneFlag {
        WDTuneTracker.trackTuneEvent(data: info)
      }
      
      
    case .gtm:
      if gtmFlag {
        WDGtmTracker.trackGtmEvent(data: info)
      }
    case .tune:
      if tuneFlag {
        WDTuneTracker.trackTuneEvent(data: info)
      }
    case .fb:
      if fbFlag {
       // WDFbTracker.trackFbEvent(name: title, data: info)
      }
    }
    
  }
  
}
