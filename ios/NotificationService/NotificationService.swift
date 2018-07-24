//
//  NotificationService.swift
//  NotificationService
//
//  Created by Shashank Sharma on 09/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UserNotifications

class NotificationService: UNNotificationServiceExtension {
  
  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    
    var attachments: Array<UNNotificationAttachment> = Array()
    
    // create URLs from url strings in the request
    let tuneAttachments: NSArray = request.content.userInfo["tune_attachments"] as? NSArray ?? NSArray()
    let urls = tuneAttachments.map { URL(string:$0 as! String) }
    
    // UNNotificationAttachment requires attachments be local, download and cache them
    urls.forEach { url in
      if url != nil {
        if let data = URLSession.shared.synchronousDownload(request: URLRequest(url: url!)) {
          // the file extension is used to determine how to treat the file. taking it from the download url
          let fileName = (url?.lastPathComponent)!
          
          if let attachment = UNNotificationAttachment.cachedAttachment(fileName: fileName, data: data) {
            attachments.append(attachment)
          }
        }
      }
    }
    
    if let bestAttemptContent = bestAttemptContent {
      // Modify the notification content here...
      bestAttemptContent.title = "\(bestAttemptContent.title) [modified]"
      
      contentHandler(bestAttemptContent)
    }
  }
  
  override func serviceExtensionTimeWillExpire() {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }
  
}

extension URLSession {
  
  func synchronousDownload(request: URLRequest) -> Data? {
    let semaphore = DispatchSemaphore(value: 0)
    
    var aData: Data?
    var aError: Error?
    
    dataTask(with: request) { (data, response, error) in
      aData = data
      aError = error
      
      semaphore.signal()
      
      }.resume()
    
    _ = semaphore.wait(timeout: .distantFuture)
    
    if aError == nil {
      return aData
    } else {
      return nil
    }
  }
  
}

extension UNNotificationAttachment {
  
  static func cachedAttachment(fileName: String, data: Data) -> UNNotificationAttachment? {
    
    let fileManager = FileManager.default
    let tmpSubFolderName = ProcessInfo.processInfo.globallyUniqueString
    let tmpSubFolderURL = NSURL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(tmpSubFolderName, isDirectory: true)
    
    do {
      
      try fileManager.createDirectory(at: tmpSubFolderURL!, withIntermediateDirectories: true, attributes: nil)
      let fileURL = tmpSubFolderURL?.appendingPathComponent(fileName)
      try data.write(to: fileURL!)
      let attachment = try UNNotificationAttachment.init(identifier: fileName, url: fileURL!, options: nil)
      return attachment
      
    } catch _ {
      
    }
    
    return nil
  }
  
}


