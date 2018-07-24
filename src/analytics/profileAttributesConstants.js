
/*
Custom profiling attributes for Tune.
 */

export const customAttributes = {

    kName: "Name",
    kEmail: "Email",
    kPrepaid:"IsPrepaid",
    kGender: "WadiGender",
    kLanguage: "WadiLanguage",
    kCountry: "WadiCountry",
    kCityOfLastOrder: "lastOrderCity",
    kAreaOfLastOrder: "lastOrderArea",
    kPaymentModeOfLastPurchase: "Payment_mode_of_last_purchase",
    kLastOrderStatus: "Last_order_status",
    kOrderIDOfLastOrder: "lastOrderId",

    kLastPurchasedProductName: "LastPurchasedProductName",
    kLastPurchasedProductURL: "LastPurchasedProductURL",
    kLastPurchasedProductSKU: "LastPurchasedProductSKU",
    kLastPurchasedProductImgURL: "LastPurchasedProductImgURL",
    kLastPurchasedSubCatName: "LastPurchasedSubCatName",
    kLastPurchasedSubCatURL: "LastPurchasedSubCatURL",
    kLastPurchasedSupCatName: "LastPurchasedSupCatName",
    kLastPurchasedSupCatURL: "LastPurchasedSupCatURL",
    kLastPurchasedBrandName: "LastPurchasedBrandName",
    kLastPurchasedBrandURL: "LastPurchasedBrandURL",
    kLastViewedProductName: "LastViewedProductName",
    kLastViewedProductURL: "LastViewedProductURL",
    kLastViewedProductSKU: "LastViewedProductSKU",
    kLastViewedProductImgURL: "LastViewedProductImgURL",
    kLastViewedBrandName: "LastViewedBrandName",
    kLastViewedBrandURL: "LastViewedBrandURL",
    kLastViewedSubCatName: "LastViewedSubCatName",
    kLastViewedSubCatURL: "LastViewedSubCatURL",
    kLastViewedSupCatName: "LastViewedSupCatName",
    kLastViewedSupCatURL: "LastViewedSupCatURL",

    kLastAddedToCartProductName: "LastAddedToCartProductName",
    kLastAddedToCartProductURL: "LastAddedToCartProductURL",
    kLastAddedToCartProductImgURL: "LastAddedToCartProductImgURL",
    kLastAddedToCartBrandName: "LastAddedToCartBrandName",
    kLastAddedToCartProductSpecialPrice: "LastAddedToCartProductSpecialPrice",
    kLastAddedToCartProductMRP: "LastAddedToCartProductMRP",

};

export const getCustomTuneProfileAttributes = () => {
    
    return Object.values(customAttributes);
}
