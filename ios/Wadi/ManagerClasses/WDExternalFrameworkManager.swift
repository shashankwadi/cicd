		//
//  WDExternalFrameworkManager.swift
//  Wadi
//
//  Created by Shashank Sharma on 12/07/17.
//  Copyright © 2017 Facebook. All rights reserved.
//
import UIKit
import Tune
import AdSupport
import CoreTelephony
import iAd
import MobileCoreServices
import Security
import StoreKit
import FBSDKLoginKit
import SystemConfiguration
import Google
import GoogleMaps
import GooglePlaces
import FBSDKCoreKit
import Appsee
import SmartWhere
import Fabric
import Crashlytics
import MoEngage

class WDExternalFrameworkManager: NSObject {
  
  static let shared = WDExternalFrameworkManager()

  private override init() {
    
  }
  
  var smartwhere:SmartWhere?
  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    
    Fabric.with([Crashlytics.self])
    self.setUpTuneSdk()
    self.setupMsd()
    Appsee.start(kTrackingAppseeKey as! String)
    Appsee.setUserID("grocery_user")
    FBSDKApplicationDelegate.sharedInstance().application(application, didFinishLaunchingWithOptions: launchOptions)
    self.setUpGooglePlacesSdk()
    self.setUpGoogleAnalyticsSdk()
    self.setUpBugsnag()
    
    //Setup Moengage
    #if DEBUG
      MoEngage.sharedInstance().initializeDev(withApiKey: kTrackingMoengageId as String, in: application, withLaunchOptions: launchOptions, openDeeplinkUrlAutomatically: true)
    #else
      MoEngage.sharedInstance().initializeProd(withApiKey: kTrackingMoengageId as String, in: application, withLaunchOptions: launchOptions, openDeeplinkUrlAutomatically: true)
    #endif
    
    //If key exists it means it is an existing user it key doesnt exist we set a key for is_firstlauch.
    if let keyExists = UserDefaults.standard.object(forKey: "Is_FirstLaunch") {
      Tune.setExistingUser(true)
      Tune.setCustomProfileStringValue("false", forVariable: TuneUserProfileAttributesType.kIsFreshInstall.rawValue)
    }else{
      UserDefaults.standard.set(true, forKey: "Is_FirstLaunch")
      UserDefaults.standard.synchronize()
      MoEngage.sharedInstance().appStatus(INSTALL) //We are using the same old key to identify existing or new
      
      //Adding Tune personalise attribute for creating fresh install segment.
     Tune.registerCustomProfileDateTime(TuneUserProfileAttributesType.kFreshInstallTime.rawValue, withDefault: NSDate() as Date!)
     Tune.registerCustomProfileString(TuneUserProfileAttributesType.kIsFreshInstall.rawValue, withDefault: "true")
      
      let tuneInstallEvent:TuneEvent = TuneEvent(name: "FreshInstall")
      Tune.measure(tuneInstallEvent)
      
    }
    
    self.sendAppStatusToMoEngage()
    
    return true
  }
  
  func applicationDidBecomeActive(application: UIApplication!) {
    FBSDKAppEvents.activateApp()
    Tune.measureSession()
  }
  
  func applicationDidEnterBackground(_ application: UIApplication) {
    
  }
  
  func applicationWillEnterForeground(_ application: UIApplication) {
    
  }
  
  //ios <9
  func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
    
    WDGtmTracker.trackGtmCampaignFor(url: url)
    var handled: Bool = false
    handled = FBSDKApplicationDelegate.sharedInstance().application(application, open: url, sourceApplication: sourceApplication, annotation: annotation) || RNGoogleSignin.application(application, open: url, sourceApplication: sourceApplication, annotation: annotation) || Tune.handleOpen(url, sourceApplication: sourceApplication) || RCTLinkingManager.application(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
    return handled;
    
  }
  
  //ios 9 & 9+
  @available(iOS 9.0, *)
  func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {

    WDGtmTracker.trackGtmCampaignFor(url: url)
    var fbhandled: Bool = false
    var ghandled: Bool = false
    var rcthandled: Bool = false
    var tunehandled: Bool = false
    
    if url.absoluteString.contains("fb\(kLoginFbKey)") {
      fbhandled = FBSDKApplicationDelegate.sharedInstance().application(app, open: url, options: options)
    }
    
    if url.absoluteString.contains("com.googleusercontent") {
      let sourceAppVal:String = options[UIApplicationOpenURLOptionsKey.sourceApplication] as! String
      let annotationVal = options[UIApplicationOpenURLOptionsKey.annotation]
      ghandled = RNGoogleSignin.application(app, open: url, sourceApplication: sourceAppVal , annotation: annotationVal)
    }
    
    rcthandled = RCTLinkingManager.application(app, open: url, options: options)
    
    var newOptions: [String: Any] = [:]
    for (key, value) in options {
      newOptions[String(describing:key)] = value
    }
    
    tunehandled = Tune.handleOpen(url, options:newOptions)
  
    return fbhandled || ghandled || rcthandled || tunehandled ;
  }
  
  func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Swift.Void) -> Bool {
    /*
     if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
     NSURL *url = userActivity.webpageURL;
     [ConfigManager sharedInstance].pushNotificationUrlPath = [url extractUniversalDeeplinkPath];
     [[WDIMarketingController sharedInstance] applicationOpenUniversalDeeplink:url];
     }
     */
    var handled: Bool = false
    handled = Tune.handleContinue(userActivity, restorationHandler: restorationHandler) || RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return handled;
  }
  
   func setUpGooglePlacesSdk() {
    GMSServices.provideAPIKey(kLocationGoogleGMSServicesKey as String!)
    GMSPlacesClient.provideAPIKey(kLocationGoogleGMSPlacesClientKey as String!)
  }

  func setupMsd() {
    
    SDKUtilities.sharedInstance().configureSDKWithtrackingEventBaseURL(kTrackingMsdUrl as String! )
    
  }
  
  func setUpGoogleAnalyticsSdk() {
      guard let GTM = TAGManager.instance() else {
        assert(false, "Google Tag Manager not configured correctly")
        return
    }
   
    GAI.sharedInstance().tracker(withTrackingId: kTrackingGaiTrackerKey as String!)
    
    TAGContainerOpener.openContainer(withId: kTrackingGtmContainerKey as String!,
                                     tagManager: GTM,
                                     openType: kTAGOpenTypePreferFresh,
                                     timeout: nil,
                                     notifier: self)
    
    #if DEBUG
      GTM.logger.setLogLevel(kTAGLoggerLogLevelVerbose) //enable verbose level logs
    #endif
  }
    
  func setUpTuneSdk() {
    let advancedConfig = ["echo_analytics":true]
    #if DEBUG
    Tune.initialize(withTuneAdvertiserId: kTrackingTuneAdvertiserId as String!, tuneConversionKey: kTrackingTuneConversionKey as String!, tunePackageName: kTrackingTunePackageName as String!, wearable: false, configuration: advancedConfig)
    #else
     Tune.initialize(withTuneAdvertiserId: kTrackingTuneAdvertiserId as String!, tuneConversionKey: kTrackingTuneConversionKey as String!, tunePackageName: kTrackingTunePackageName as String!, wearable: false)
    #endif

    Tune.setDelegate(self)
    Tune.registerDeeplinkListener(self)
    
    Tune.setAppleAdvertisingIdentifier(ASIdentifierManager.shared().advertisingIdentifier, advertisingTrackingEnabled: ASIdentifierManager.shared().isAdvertisingTrackingEnabled)
    
    Tune.enableSmartwhereIntegration()
    Tune.configureSmartwhereIntegration(withOptions: Int(TuneSmartwhereShareEventData.rawValue))
  }
  
  func setUpBugsnag(){
    //This has been commented as it is being initialised in RN itself
    //Bugsnag.start(withApiKey: Bugsnag_Dev_Key);
    //BugsnagReactNative.start(); //Commented because there were crashes because of bugsnag, email thread is going on to fix this issue.
  }
  
  func getAppVersion () -> String {
    return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String
  }
  
  func sendAppStatusToMoEngage () {
    if((UserDefaults.standard.value(forKey:"app version") == nil)){
      //No need to set fresh install here as it will already be set with this flag check 'Is_FirstLaunch'
      self.saveAppVersionToDefaults()
      return
    }
    
    if(self.getAppVersion() != (UserDefaults.standard.value(forKey:"app version") as! String)){
      MoEngage.sharedInstance().appStatus(UPDATE)
      self.saveAppVersionToDefaults()
    }
  }
  
  func saveAppVersionToDefaults () {
    UserDefaults.standard.set(self.getAppVersion(), forKey: "app version")
    UserDefaults.standard.synchronize()
  }
  
}

extension WDExternalFrameworkManager:TuneDelegate {
  func tuneDidSucceed(with data: Data!) {
    //let str = String(data: data, encoding: String.Encoding.utf8)
  }

  func tuneDidFailWithError(_ error: Error!) {

  }

  func tuneEnqueuedRequest(_ url: String!, postData post: String!) {

  }

  func tuneDidReceiveDeeplink(_ deeplink: String!) {
 
  }

  func tuneDidFailDeeplinkWithError(_ error: Error!) {

  }

}

// Delegate
extension WDExternalFrameworkManager:TAGContainerOpenerNotifier {
  func containerAvailable(_ container: TAGContainer!) {
    container.refresh()
  }
}

