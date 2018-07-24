//
//  WDTuneTracker.swift
//  Wadi
//
//  Created by Shashank Sharma on 12/07/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import Tune
import SmartWhere

class WDTuneTracker: NSObject {
  
  class func trackTuneEvent(data:Dictionary<String, Any>) {
    
    var tuneEventName = ""
    
    if  let eventName = data["name"] as? String {
      tuneEventName = eventName
    }
    
    let tuneEvent:TuneEvent = TuneEvent(name: tuneEventName)
    
    
    if  let eventRevenue = data["revenue"] as? CGFloat {
      tuneEvent.revenue = eventRevenue
    }
    
    if  let eventCurrencyCode = data["currencyCode"] as? String {
      tuneEvent.currencyCode = eventCurrencyCode
    }
    
    if  let eventRefId = data["refId"] as? String {
      tuneEvent.refId = eventRefId
    }
    
    if  let eventContentType = data["contentType"] as? String {
      tuneEvent.contentType = eventContentType
    }
    
    if  let eventContentId = data["contentId"] as? String {
      tuneEvent.contentId = eventContentId
    }
    
    if  let eventSearchString = data["searchString"] as? String {
      tuneEvent.searchString = eventSearchString
    }
    
    if  let eventTransactionState = data["transactionState"] as? NSInteger {
      tuneEvent.transactionState = eventTransactionState
    }
    
    if  let eventRating = data["rating"] as? CGFloat {
      tuneEvent.rating = eventRating
    }
    
    if  let eventLevel = data["level"] as? NSInteger {
      tuneEvent.level = eventLevel
    }
    
    if  let eventQuantity = data["quantity"] as? UInt {
      tuneEvent.quantity = eventQuantity
    }
    
    if  let eventAttribute1 = data["attribute1"] as? String {
      tuneEvent.attribute1 = eventAttribute1
    }
    
    if  let eventAttribute2 = data["attribute2"] as? String {
      tuneEvent.attribute2 = eventAttribute2
    }
    
    if  let eventAttribute3 = data["attribute3"] as? String {
      tuneEvent.attribute3 = eventAttribute3
    }
    
    if  let eventAttribute4 = data["attribute4"] as? String {
      tuneEvent.attribute4 = eventAttribute4
    }
    
    if  let eventAttribute5 = data["attribute5"] as? String {
      tuneEvent.attribute5 = eventAttribute5
    }
    
    //Adding Tags
    if let tagsArray = data["tags"] as? [[String:Any]] {
      for dict:Dictionary in tagsArray as Array{
        if let key = dict["key"] as? String, let val = dict["value"] as? String {
          tuneEvent.addTag(key, withStringValue: val)

        }
      }
    }
    
    //Adding Items
    if let itemsArray = data["eventItems"] as? [[String:Any?]] {
      var tuneEventArray = [TuneEventItem]()
      
      for data:Dictionary in itemsArray{
        let tuneEventItem = TuneEventItem()
        
        if  let eventItem = data["item"] as? String {
          tuneEventItem.item = eventItem
        }
        
        if  let eventItemQuantity = data["quantity"] as? UInt {
          tuneEventItem.quantity = eventItemQuantity
        }
        
        if  let eventItemUnitPrice = data["unitPrice"] as? CGFloat {
          tuneEventItem.unitPrice = eventItemUnitPrice
        }
        
        if  let eventItemRevenue = data["revenue"] as? CGFloat {
          tuneEventItem.revenue = eventItemRevenue
        }
        
        if  let eventItemAttribute1 = data["attribute1"] as? String {
          tuneEventItem.attribute1 = eventItemAttribute1
        }
        
        if  let eventItemAttribute2 = data["attribute2"] as? String {
          tuneEventItem.attribute2 = eventItemAttribute2
        }
        
        if  let eventItemAttribute3 = data["attribute3"] as? String {
          tuneEventItem.attribute3 = eventItemAttribute3
        }
        
        if  let eventItemAttribute4 = data["attribute4"] as? String {
          tuneEventItem.attribute4 = eventItemAttribute4
        }
        
        if  let eventItemAttribute5 = data["attribute5"] as? String {
          tuneEventItem.attribute5 = eventItemAttribute5
        }
        
        tuneEventArray.append(tuneEventItem)
      }
      tuneEvent.eventItems = tuneEventArray
    }

    Tune.measure(tuneEvent)
  }
  
  class func registerTuneCustomProfileStringfrom(profileArray:Array<String>) {
    
    for profileAttrib:String in profileArray {
      Tune.registerCustomProfileString(profileAttrib)
    }
  }
  
  class func setCustomProfileStringForValues(personalizedDataArray:NSArray) {
    if let personalisedInfoArr = personalizedDataArray as? Array<[String:Any?]> {
      for dict:Dictionary in personalisedInfoArr{
        if let customKey = dict["key"] as? String, let customValue = dict["value"] as? String {
          Tune.setCustomProfileStringValue(customValue, forVariable: customKey)
        }
      }
    }
  }
  
  class func setSmartwhereStringForValues(smartwhereDataArray:NSArray) {
    
    if let smartwhereInfoArr = smartwhereDataArray as? Array<[String:Any?]> {
      for dict:Dictionary in smartwhereInfoArr{
        if let customKey = dict["key"] as? String, let customValue = dict["value"] as? String {
            SmartWhere.setUserTrackingString(customValue, forKey: customKey)
        }
      }
    }
  }
}
