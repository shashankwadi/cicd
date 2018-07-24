  //
  //  WDGtmTrackingManager.swift
  //  Wadi
  //
  //  Created by Shashank Sharma on 12/07/17.
  //  Copyright © 2017 Facebook. All rights reserved.
  //
  
  import UIKit
  import Google
  
  class WDGtmTracker: NSObject {
    
    /**
     Track Event for Google Tag Manager (GTM).
     
     - parameter name: title for tracking.
     - parameter data: data dictionary for tracking.
     
     */
    
    class func trackGtmEvent(data:Dictionary<String, Any>) {
      let dataLayer:TAGDataLayer = TAGManager.instance().dataLayer
      dataLayer.push(["ecommerce" : []])
      dataLayer.push(data)
    }
    
    class func trackGtmScreenVisitFor(screen:String, data:Dictionary<String, Any>) {
      let dataLayer:TAGDataLayer = TAGManager.instance().dataLayer
      
      var  clientId = ""
      if let tracker = GAI.sharedInstance().defaultTracker {
        tracker.allowIDFACollection = true
        clientId = tracker.get(kGAIClientId)    //get clientId from tracker
      }
     
      var dataToSend = data
      dataToSend["event"] = "openScreen"
      dataToSend["screenName"] = screen
      dataToSend["wadi_client_id"] = clientId
      dataLayer.push(dataToSend)
      
    }
    
    class func trackGtmCampaignFor(url:URL?) {
      let dataLayer: TAGDataLayer = TAGManager.instance().dataLayer
      
      if !isFirstLaunch(), let url = url {
        
        if let urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false) {
          if let queryItems = urlComponents.queryItems {
            // URL with UTM params
            
            var gclid: String? = nil
            var utm_source:String? = nil
            var utm_medium: String? = nil
            var utm_campaign: String? = nil
            
            for queryItem in queryItems {
              if queryItem.name == "gclid" {
                gclid = queryItem.value!
                dataLayer.push(["wadi_gclid": gclid!])
                dataLayer.push(["wadi_cp_present": "true"])
              }
              if queryItem.name == "utm_source" {
                utm_source = queryItem.value!
                dataLayer.push(["wadi_utm_source": utm_source!])
                dataLayer.push(["wadi_cp_present": "true"])
              }
              if queryItem.name == "utm_medium" {
                utm_medium = queryItem.value!
                dataLayer.push(["wadi_utm_medium": utm_medium!])
              }
              if queryItem.name == "utm_campaign" {
                utm_campaign = queryItem.value!
                dataLayer.push(["wadi_utm_campaign": utm_campaign!])
              }
            }
          } else {
            // URL without UTM params
            if let host = url.host {
              // Set medium to referrer as host exists but no query params
              
              dataLayer.push(["wadi_utm_source": host])
              dataLayer.push(["wadi_utm_medium": "referrer"])
              dataLayer.push(["wadi_utm_campaign": "(not set)"])
              dataLayer.push(["wadi_cp_present": "true"])
            } else {
              // No host, no query params
              
              dataLayer.push(["wadi_utm_source": "(not set)"])
              dataLayer.push(["wadi_utm_medium": "(not set)"])
              dataLayer.push(["wadi_utm_campaign": "(not set)"])
              dataLayer.push(["wadi_cp_present": "true"])
            }
          }
        } else {
          // No URL or unidentified URL
          
          dataLayer.push(["wadi_utm_source": "(not set)"])
          dataLayer.push(["wadi_utm_medium": "(not set)"])
          dataLayer.push(["wadi_utm_campaign": "(not set)"])
          dataLayer.push(["wadi_cp_present": "true"])
        }
      } else {
        // User is landing directly in the app
        // In this case, utm_source = (direct), utm_medium = (none), utm_campaign = (not set)
        
        clearDatalayer()
      }
      
      // Push screenView
      //dataLayer.push(["event": "open_screen", "screen_name": "screenName"])
      
      if String(describing: dataLayer.get("wadi_cp_present")) == "true" {
        clearDatalayer()
      }
      
    }
    
    // This method stores a boolean to identify if app is opened for first time
    class func isFirstLaunch() -> Bool {
      let launchedBefore = UserDefaults.standard.bool(forKey: "launchedBefore")
      if launchedBefore  {
        return false
      } else {
        UserDefaults.standard.set(true, forKey: "launchedBefore")
        return true
      }
    }
    
    class func clearDatalayer() {
      DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(2)) {
        let dataLayer: TAGDataLayer = TAGManager.instance().dataLayer
        dataLayer.push(["wadi_utm_source": "(direct)"])
        dataLayer.push(["wadi_utm_medium": "(none)"])
        dataLayer.push(["wadi_utm_campaign": "(not set)"])
        dataLayer.push(["wadi_cp_present": "false"])
      }
    }
  }
