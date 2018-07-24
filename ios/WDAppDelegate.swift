//
//  WDAppDelegate.swift
//  Wadi
//
//  Created by Shashank Sharma on 03/05/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import HockeySDK
import CocoaLumberjack
import CoreLocation;
import UserNotifications
import GCDWebServer


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  
  var window: UIWindow?
  var fileLogger : DDFileLogger?;
  var locationManager: CLLocationManager?
  var webServer : GCDWebServer?
  var gcdPort : UInt = 0
  
  
  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    
    //print("\(kEnvironment)")
    //Location codeman
    locationManager = CLLocationManager.init()
    locationManager?.requestAlwaysAuthorization()
    locationManager?.startUpdatingLocation()
    
    UserDefaults.setSecret(kUserDefaultsSecret as String!)

     self.webServer = GCDWebServer()
    
     self.setupRemoteNotificationStyle()
    //setupApplication:launchOptions
    
    self.setupHockeyManager()
    
    var jsCodeLocation:URL
    #if DEBUG
      jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index",
                                                                         fallbackResource: nil) as URL;
    #else
      jsCodeLocation = CodePush.bundleURL()
    #endif
    
    
    //If key exists it means it is an existing user it key doesnt exist we set a key for kUniquieDeviceIdentifier.
    let uniqueDeviceAppId = UserDefaults.standard.secureObject(forKey: kUniquieDeviceIdentifier as String!, valid: nil)
   
    if  uniqueDeviceAppId != nil {
      //Unique key already set
    }else{
      let uuid = NSUUID.init().uuidString
      UserDefaults.standard.setSecureObject(uuid, forKey: kUniquieDeviceIdentifier as String!)
      UserDefaults.standard.synchronize()
    }
    
    let language = self.getLanguage();
    
    (RCTI18nUtil.sharedInstance() as AnyObject).allowRTL(false);
    if(language  == "ar") {
      (RCTI18nUtil.sharedInstance() as AnyObject).forceRTL(true);
    } else {
      (RCTI18nUtil.sharedInstance() as AnyObject).forceRTL(false);
    }
    
    self.window = UIWindow(frame: UIScreen.main.bounds);
    self.window?.backgroundColor =  UIColor.white;
    RCCManager.sharedIntance().initBridge(withBundleURL: jsCodeLocation, launchOptions: launchOptions)
    
    SplashScreen.show()
    return WDExternalFrameworkManager.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
    
  }
  
  func getLanguage() -> String {
    
    var language = ""
    if let selectedLanguage = (UserDefaults.standard.secureObject(forKey: "languageCode", valid: nil)) as? String {
      language = selectedLanguage
      
    }
    if (language == "") {
      language =  Bundle.main.preferredLocalizations[0];
      UserDefaults.standard.set(language, forKey: "systemLanguage");
      UserDefaults.standard.synchronize();
      
    }
    
    return language;
  }
  
  func setupHockeyManager() {
    
    self.setupFileLogger()
     BITHockeyManager.shared().configure(withBetaIdentifier: kHockeyIdentifier as String,
     liveIdentifier: kHockeyLiveIdentifier as String,
     delegate: self as? BITHockeyManagerDelegate)
     BITHockeyManager.shared().start();
     BITHockeyManager.shared().authenticator.authenticateInstallation();
     BITHockeyManager.shared().crashManager.crashManagerStatus = .autoSend;
    
  }
  
  
  func applicationLog(for crashManager: BITCrashManager!) -> String! {
    
    let description = self.getLogFilesContentWithMaxSize(maxSize: 5000);
    if (description.length == 0) {
      return nil;
    } else {
      return description as String!;
    }
  }
  
  func getLogFilesContentWithMaxSize(maxSize : Int) -> NSString {
    var description : NSMutableString = NSMutableString();
    
    let sortedLogFileInfos : Array = (fileLogger?.logFileManager.sortedLogFileInfos)!;
    
    
    for logFile in sortedLogFileInfos {
      
      let logFileInfo : DDLogFileInfo = logFile;
      let logData : Data? = FileManager.default.contents(atPath: logFileInfo.filePath)
      if(logData != nil && (logData?.count)! > 0) {
        
        let result = String(data: logData!, encoding: String.Encoding.utf8) as String!
        description.append(result!);
      }
    }
    
    if(description.length > maxSize) {
      
      description = description.substring(with: NSMakeRange(description.length - maxSize - 1, maxSize)) as! NSMutableString
    }
    
    
    return description;
  }
  
  
  func setupFileLogger() {
    fileLogger = DDFileLogger()
    fileLogger?.rollingFrequency = 60 * 60 * 24;
    fileLogger?.logFileManager.maximumNumberOfLogFiles = 3;
    DDLog.add(fileLogger!);
  }
  
  /*
   - (void)setupApplication:(NSDictionary *)launchOptions {
   if ([launchOptions isKindOfClass:[NSDictionary class]]) {
   NSDictionary *notificationKeyDict = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
   
   if ([notificationKeyDict isKindOfClass:[NSDictionary class]]) {
   NSString *deepLinkUrlPath = notificationKeyDict[@"u"];
   
   if ([deepLinkUrlPath isKindOfClass:[NSString class]]) {
   [ConfigManager sharedInstance].pushNotificationUrlPath = deepLinkUrlPath;
   }
   }
   }
   }
   */
  
  func setupRemoteNotificationStyle() {
    // iOS 10 support
    if #available(iOS 10, *) {
      let center:UNUserNotificationCenter = UNUserNotificationCenter.current()
      center.requestAuthorization(options: [.alert, .sound]) { (granted, error) in
        guard granted else {
          return
        }
        center.delegate = self
        UIApplication.shared.registerForRemoteNotifications()
      }
    }
      // iOS 9 support
    else if #available(iOS 9, *) {
      UIApplication.shared.registerUserNotificationSettings(UIUserNotificationSettings(types: [.badge, .sound, .alert], categories: nil))
      UIApplication.shared.registerForRemoteNotifications()
    }
      // iOS 8 support
    else if #available(iOS 8, *) {
      UIApplication.shared.registerUserNotificationSettings(UIUserNotificationSettings(types: [.badge, .sound, .alert], categories: nil))
      UIApplication.shared.registerForRemoteNotifications()
    }
    
  }
  
  func applicationDidBecomeActive(application: UIApplication!) {
    
    WDExternalFrameworkManager.shared.applicationDidBecomeActive(application: application)
  }
  
  func application(_ application: UIApplication,
                   didRegister notificationSettings: UIUserNotificationSettings) {
    UIApplication.shared.registerForRemoteNotifications()
  }
  
  ///ios <9
  func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
    
    return WDExternalFrameworkManager.shared.application(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
  }
  
  
  ///ios 9 above
  @available(iOS 9.0, *)
  func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
    
    return WDExternalFrameworkManager.shared.application(app, open:url, options:options)
  }
  
  func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Swift.Void) -> Bool {
    
    return WDExternalFrameworkManager.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
  
  
  func applicationWillResignActive(_ application: UIApplication) {
    
  }
  
  func applicationDidEnterBackground(_ application: UIApplication) {
    WDExternalFrameworkManager.shared.applicationDidEnterBackground(application)
  }
  
  func applicationWillEnterForeground(_ application: UIApplication) {
    if let server:GCDWebServer = self.webServer {
      if (!server.isRunning){
        self.webServer?.start(withPort: self.gcdPort, bonjourName: nil)
      }
    }

    WDExternalFrameworkManager.shared.applicationWillEnterForeground(application)
  }
  
  func applicationDidBecomeActive(_ application: UIApplication) {
    
    WDExternalFrameworkManager.shared.applicationDidBecomeActive(application: application)
  }
  
  func applicationWillTerminate(_ application: UIApplication) {
    
  }
  
  // NotificationDelegate
  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
   
    let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    UserDefaults.standard.set(token, forKey: "pushToken")
    UserDefaults.standard.synchronize()
  }
  
  func application(_ application: UIApplication,
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
    
  }
  
  func application(_ application: UIApplication,
                   didReceiveRemoteNotification userInfo: [AnyHashable : Any],
                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    if (application.applicationState == .active) {
      let alert = UIAlertController(title: nil, message: "Message", preferredStyle: .alert)
      alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))
      window?.rootViewController?.present(alert, animated: true, completion: nil)
    }

  }
  
  // UNUserNotificationCenter Delegate
  
  //Called when a notification is delivered to a foreground app.
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .sound, .badge])
  }
  
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    
    
    /* NSDictionary *anaDict = [[NSDictionary alloc] initWithDictionary:[response.notification.request.content.userInfo objectForKey:@"ANA"]];
     if (anaDict != nil) {
     NSString *urlStr = [anaDict objectForKey:@"URL"];
     if (urlStr != nil) {
     NSURL *deeplinkUrl = [NSURL URLWithString:urlStr];
     [ConfigManager sharedInstance].pushNotificationUrlPath = [deeplinkUrl extractStandardDeeplinkPath];
     }
     }*/
     completionHandler();
  }
  
}

