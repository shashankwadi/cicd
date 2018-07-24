**Introduction**

Mad Street Den provides the tracking pixel to collect data to monitor and collect analytics from the recommendation engine.
This document provides the information on how to integrate tracking pixels for the events.

**Note:** Please refer **PixelSDKIntegration** branch as an example to see how you can implement the pixel into your code.

**Integration**

* Device and Orientation support: SDK supports iPhones starting from iOS 7

**Integrating SDK to an Existing Application (Without Cocoapods):**

1. Drag the framework into your project and Xcode populates below dialog
2. If you need to separate copy of framework within your Project directory, then make sure that you have selected “Copy items if needed” 
3. Make sure the framework appear in below places,
     * Clear the Search Path settings in Build Settings before adding the Framework, to avoid linker error
     * After successful integration of framework, We move on to Using the framework into existing application  
 
**Using Framework into Existing application:**

   Import the framework into your custom class as below, 

```
#!objective-C

	#import <MSDPixelSDK/MSDPixelSDK.h>

```

**Code Snippet for configure Tracking Event Base URL:**



```
#!objective-c

[[SDKUtilities sharedInstance] configuareSDKWithtrackingEventBaseURL:@"http://d3kbgael5gt9k5.cloudfront.net"];

```

**Running SDK for iOS 9.0:**

The app running on iOS 9 will no longer connect to a Meteor server without SSL. To connect to Meteor server without SSL, please use below instruction.


```
#!objective-c

In the app's info.plist, NSAppTransportSecurity [Dictionary] needs to have a keyNSAllowsArbitraryLoads [Boolean] to be set to YES

```

## **Pixels List** ##

Tracking pixels help us monitor the performance of visual recommendations and track customer behaviour. This data is used to build analytics reports for your store.

**Definition of variables for the below events:**

*      sourceProductID: slug of the source product
*      sourceCategoryID: Category Name of the source product
*      destProductID: slug of the recommendation clicked on
*      destCategoryID: Category ID of the recommendation clicked on
*      positionOfReco: Position of the recommendation in the carousel
*      productPrice: Price of the product

**Below are the list of events and the functions to call when the event occurs:**

* PageView
 

```
#!objective-c

NSDictionary *paramDict = [[NSDictionary alloc] initWithObjectsAndKeys: @"SourceProductID",@"sourceProdID",@"SourceCategoryID",@"sourceCatgID",@"product price", @"prodPrice",@"Home",@"pageType", nil];
[SDKUtilities trackEvents:EVENTview withParams:paramDict];
```


* Social Share Event
       

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name",@"sourceCatgID",@"Medium",@"socialMedium", nil];	
[SDKUtilities trackEvents:EVENTsocialShare withParams:paramDict];

```


* Add to Cart event
       

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys:@"sourceProductID",@"sourceProdID",@"price",@"prodPrice",@"category Name",@"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENTaddToCart withParams:paramDict];

```
* Remove from Cart Event


```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name",@"sourceCatgID",@"Price",@"prodPrice", nil];[SDKUtilities trackEvents:EVENTremoveFromCart withParams:paramDict]; 

```


* Add to Wishlist Event
     

```
#!objective-c

 NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"sourceProductID",@"sourceProdID",@"price",@"prodPrice", @"category Name", @"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENTaddToWishlist withParams:paramDict];

```


* Remove from WishList Event
       

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name",@"sourceCatgID",@"Price",@"prodPrice", nil];
[SDKUtilities trackEvents:EVENTremoveFromWishlist withParams:paramDict];

```
 

**Definition of variables for the below events:**

* sourceProductID : underscore separated string of product_id(s) in the cart
* sourceCategoryID : underscore separated string of the category_name(s) in the cart
* productPrice : underscore separated string of the product_price(s) in the cart
* productQuantity : underscore separated string of the each product's quantity in the cart



**Below are the list of events and the functions to call when the event occurs:**

* Place Order from list

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name”, @“sourceCatgID", @“price", @“prodPrice", @“Quantity", @"prodQty", nil;
[SDKUtilities trackEvents:EVENTplaceOrder withParams:paramDict];

```

* Buy products
        

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name”, @“sourceCatgID", @“price", @“prodPrice", @“Quantity", @“prodQty" , nil;
[SDKUtilities trackEvents:EVENTbuy withParams:paramDict];

```

##**Tracking Pixels for Visual Recommendation:**##

**Definition of variables for the below events:**

* sourceProductID : slug of the source product
* sourceCategoryID : Category Name of the source product
* destProductID : slug of the recommendation clicked on
* destCategoryID : Category ID of the recommendation clicked on
* positionOfReco : Position of the recommendation in the carousel
* productPrice : Price of the product


**Below are the list of events and the functions to call when the event occurs**

* Add to WishList from recommendation carousel

       

```
#!objective-c

 NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"sourceProductID",@"sourceProdID",@"price",@"prodPrice", @"catagory Name", @"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENTaddToWishlist withParams:paramDict];

```


* Social Share Event from recommendation carousel

       

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name",@"sourceCatgID",@"Medium",@"socialMedium", nil];	
[SDKUtilities trackEvents:EVENTsocialShare withParams:paramDict];

```

* Add to cart from recommendation carousel



```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys:@"sourceProductID",@"sourceProdID",@"price",@"prodPrice",@"catagory Name",@"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENTaddToCart withParams:paramDict];

```


* Remove from WishList through recommendation event

       

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys: @"productID",@"sourceProdID",@"catagory Name",@"sourceCatgID",@"Price",@"prodPrice", nil];
[SDKUtilities trackEvents:EVENTremoveFromWishlist withParams:paramDict];

```
 

* Click on product from recommendation carousel

        

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys:@"productID source”, @“sourceProdID", @"catagoryID",@"sourceCatgID", @"productId recommendation”, @“destProdID", @"CategoryId recommendation”, @“destCatgID", @"Position clicked integerValue", @"posOfReco",@"PDP",@"pageType",@"0",@"widgetID", nil];
[SDKUtilities trackEvents:EVENTresultClick withParams:paramDict];

```




* Swipe the recommendation carousel

       

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys:@"productID", @"sourceProdID", @"catagory Name", @"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENTresultsScroll withParams:paramDict]; 

```


* Show the recommendation carousel



```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys:@"productID", @"sourceProdID", @"catagory Name", @"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENTshowCarousel withParams:paramDict]; 

```


* Hide the recommendation carousel

        

```
#!objective-c

NSDictionary *paramDict = [NSDictionary dictionaryWithObjectsAndKeys:@"productID", @"sourceProdID", @"catagory Name", @"sourceCatgID", nil];
[SDKUtilities trackEvents:EVENThideCarousel withParams:paramDict]; 

```