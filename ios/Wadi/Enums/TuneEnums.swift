//
//  TuneEnums.swift
//  Wadi
//
//  Created by Shashank Sharma on 09/01/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

enum TuneUserProfileAttributesType : String {
  case kName = "Name"
  case kEmail = "Email"
  case kPrepaid = "IsPrepaid?"
  case kGender = "Gender"
  case kLanguage = "WadiLanguage"
  case kCountry = "WadiCountry"
  case kCityOfLastOrder = "City of last order"
  case kAreaOfLastOrder = "Area of last order"
  case kPaymentModeOfLastPurchase = "Payment mode of last purchase"
  case kLastOrderStatus = "Last order status"
  case kOrderIDOfLastOrder = "Order ID of last order"
  
  case kLastPurchasedProductName = "LastPurchasedProductName"
  case kLastPurchasedProductURL = "LastPurchasedProductURL"
  case kLastPurchasedProductSKU = "LastPurchasedProductSKU"
  case kLastPurchasedProductImgURL = "LastPurchasedProductImgURL"
  case kLastPurchasedSubCatName = "LastPurchasedSubCatName"
  case kLastPurchasedSubCatURL = "LastPurchasedSubCatURL"
  case kLastPurchasedSupCatName = "LastPurchasedSupCatName"
  case kLastPurchasedSupCatURL = "LastPurchasedSupCatURL"
  case kLastPurchasedBrandName = "LastPurchasedBrandName"
  case kLastPurchasedBrandURL = "LastPurchasedBrandURL"
  case kLastViewedProductName = "LastViewedProductName"
  case kLastViewedProductURL = "LastViewedProductURL"
  case kLastViewedProductSKU = "LastViewedProductSKU"
  case kLastViewedProductImgURL = "LastViewedProductImgURL"
  case kLastViewedBrandName = "LastViewedBrandName"
  case kLastViewedBrandURL = "LastViewedBrandURL"
  case kLastViewedSubCatName = "LastViewedSubCatName"
  case kLastViewedSubCatURL = "LastViewedSubCatURL"
  case kLastViewedSupCatName = "LastViewedSupCatName"
  case kLastViewedSupCatURL = "LastViewedSupCatURL"
  
  case kLastAddedToCartProductName = "LastAddedToCartProductName"
  case kLastAddedToCartProductURL = "LastAddedToCartProductURL"
  case kLastAddedToCartProductImgURL = "LastAddedToCartProductImgURL"
  case kLastAddedToCartBrandName = "LastAddedToCartBrandName"
  case kLastAddedToCartProductSpecialPrice = "LastAddedToCartProductSpecialPrice"
  case kLastAddedToCartProductMRP = "LastAddedToCartProductMRP"
  
  case kFreshInstallTime = "FreshInstallTime"
  case kIsFreshInstall = "IsFreshInstall"
}
