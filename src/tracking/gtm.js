'use strict';

import React from 'react';

import Actions from '../actions/actionTypes';
import store from 'Wadi/src/reducers/store';
import {selectors} from 'Wadi/src/reducers/reducers';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {isEmptyObject, isEmptyString} from "../utilities/utilities";

const productGtmKeys = {
    "id": "id",
    "name": "name",
    "price": "price",
    "brand": "brand",
    "category": "category",
    "variant": "variant",
    "list": "list",
    "position": "position",
    "quantity": "quantity",
    "coupon": "coupon",
    "dimension7": "dimension7",
    "dimension8": "dimension8",
    "dimension9": "dimension9",
    "dimension10": "dimension10",
    "dimension11": "dimension11",
    "dimension12": "dimension12",
    "metric1": "metric1",
    "metric2": "metric2"
};

const promotionGtmKeys = {
    "id": "id",
    "name": "name",
    "creative": "creative",
    "position": "position"
};

const actionFieldGtmKeys = {
    "list": "list",
    "step": "step",
    "option": "option",
    "id": "id",
    "affiliation": "affiliation",
    "tax": "tax",
    "revenue": "revenue",
    "cod_charges": "cod_charges",
    "shipping": "shipping",
    "coupon": "coupon",
    "currency": "currency",
    "action": "action",
    "gift_wrape_charges": "gift_wrape_charges",
};

function GTMTracker() {
    this.getTrackingObj = (trackingObj, actionType) => {
        let actionEventType = actionType;
        let gtmTrackingObj = {};
        if (actionEventType === Actions.DEEP_LINK && trackingObj.eventType) {
            actionEventType = trackingObj.eventType
        }
        switch (actionEventType) {

            // case Actions.PRODUCT_RECEIVED: {
            //     gtmTrackingObj = getProductImpressionGAObj(trackingObj);
            //     break;
            // }

            case Actions.GET_PRODUCT_DETAIL_SUCCESS: {
                gtmTrackingObj = getProductDetailGAObj(trackingObj);
                break;
            }

            case Actions.ADD_TO_CART_SUCCESS: {
                if (trackingObj.increase) {
                    gtmTrackingObj = getAddToCartGAObj(trackingObj);
                } else {
                    gtmTrackingObj = getRemoveFromCartGAObj(trackingObj, 1);
                }
                break;
            }

            case Actions.REMOVE_FROM_CART_SUCCESS: {
                gtmTrackingObj = getRemoveFromCartGAObj(trackingObj, 0);
                break;
            }

            case Actions.BEGIN_CHECKOUT: {
                gtmTrackingObj = getCheckoutStep1GAObj();
                break;
            }
            case Actions.CHECKOUT_STEP_2: {
                gtmTrackingObj = getCheckoutStep2GAObj();
                break;
            }
            case Actions.CHECKOUT_EVENTS : {
                switch (trackingObj.eventType) {
                    case GLOBAL.API_URL.CHECKOUT_OPTIONS: {
                        gtmTrackingObj = getCheckoutStep3_4GAObj(3);
                        break;
                    }
                    case GLOBAL.API_URL.CHECKOUT_TRACKORDER: {
                        gtmTrackingObj = getCheckoutStep3_4GAObj(4);
                        break;
                    }
                    case GLOBAL.API_URL.CHECKOUT_SUCCESS_PAYMENT: {
                        gtmTrackingObj = getCheckoutCompleteGAObj(trackingObj);
                        break;
                    }
                }
                break;
            }
            default: {

            }
        }

        return gtmTrackingObj
    }
}


//This can be for plp or any listing page.
const getProductImpressionGAObj = (trackingObj) => {
    let productImpressionGAObj = {};
    productImpressionGAObj.ecommerce = {};
    productImpressionGAObj.ecommerce.impressions = [];
    productImpressionGAObj.event = "productImpression";

    productImpressionGAObj.ecommerce.currencyCode = store.getState().featureMapAPIReducer.featureMapObj.currency.label; //Local currency may vary as per other countries.
    let count = 1;
    trackingObj.dataSource.forEach(product => {
        let productObj = {};
        productObj[productGtmKeys.id] = product.sku; // Product ID
        productObj[productGtmKeys.name] = product.name;
        productObj[productGtmKeys.price] = (product.specialPrice && product.specialPrice > 0) ? product.specialPrice : product.price;
        productObj[productGtmKeys.brand] = (product.brand) ? product.brand.name : null;
        productObj[productGtmKeys.category] = product.category && product.category.replace(/-/g, '/');
        productObj[productGtmKeys.variant] = product.sizes && product.sizes[0];
        productObj[productGtmKeys.list] = ""; // The list or collection to which the product belongs (e.g. Search Results, Recommendations, Category screen etc.)
        productObj[productGtmKeys.position] = count++;// Product Position in the list
        productImpressionGAObj.ecommerce.impressions.push(productObj)
    });
    return productImpressionGAObj
};

/*const getProductClickGAObj = () => {
    let productClickGAObj = {}
    productClickGAObj.ecommerce.click = { "actionField": {}, "products": [] }

    productClickGAObj.event = "productClick"
    productClickGAObj.ecommerce.click.actionField[actionFieldGtmKeys.list] = "Apparel Gallery" //need to ask what is this?

    for (product in trackingObj.products) {
        if (trackingObj.products) {
            let productObj = {}
            productObj[productGtmKeys.id] = "data.product.sku" // Product ID
            productObj[productGtmKeys.name] = "data.product.name"
            productObj[productGtmKeys.price] = "data.product.specialPrice || data.product.price" // Product Price
            productObj[productGtmKeys.brand] = "(data.product.brand) ? data.product.brand.name : null" // Product Brand
            productObj[productGtmKeys.category] = "data.product.category && data.product.category.replace(/-/g, '/')" // Product Category/Product Subcategory1/Product Subcategory2 like Apparel/Men/T-shirt
            productObj[productGtmKeys.variant] = "data.product.sizes[0]" //Product Color
            productObj[productGtmKeys.quantity] = "data.cart.items[sku]" //Product Purchase quantity
            productObj[productGtmKeys.coupon] = "" //Product Coupon code
            productObj[productGtmKeys.dimension7] = "2.5" //Product Review score
            productObj[productGtmKeys.dimension8] = "3-4 working days" //Shipping duration available on Product activities. e.g.- delivery within 2-3 days (if available)
            productObj[productGtmKeys.dimension9] = "out of stock" //Stock Status(out of stock or in stock if available) 
            productObj[productGtmKeys.dimension10] = "Large" //Product Size(if available)
            productObj[productGtmKeys.dimension11] = "20%" //Product Discount(if available)
            productObj[productGtmKeys.dimension12] = "100" //Product available in stock(if available)
            productObj[productGtmKeys.metric1] = "76" //Product price
            productObj[productGtmKeys.metric2] = "20" //Product discount
            productClickGAObj.ecommerce.click.products.push(productObj)
        }
    }

    return productClickGAObj
}*/

const getProductDetailGAObj = (product) => {
    // console.log("PDP ", JSON.stringify(product));
    let productDetailGAObj = {};
    productDetailGAObj.ecommerce = {};
    productDetailGAObj.ecommerce.detail = {"actionField": {}, "products": []};

    productDetailGAObj.event = "productDetail";
    productDetailGAObj.ecommerce.currencyCode = store.getState().featureMapAPIReducer.featureMapObj.currency.label;
    // productDetailGAObj.ecommerce.detail.actionField[actionFieldGtmKeys.list] = "Apparel Gallery" //need to ask what is this?

    let productObj = generateProductGTMObj(product);
    productDetailGAObj.ecommerce.detail.products.push(productObj);

    // console.log("PDP ", JSON.stringify(productDetailGAObj));
    return productDetailGAObj
};

/*
If user clicks the item from cart screen to change quantity or size there will be three cases,
 whether user adds item quantity, user subtracts item quantity or user changes item size. If user
 increases item quantity then Add To Cart dataLayer should be pushed with updated item count and
 if user decreases item quantity then Remove From Cart dataLayer should be pushed with updated 
 item count. If user changes product size then first Remove From Cart dataLayer should be pushed 
 with  size of the product which was previously added and then Add To Cart data layer should fire 
 with new size of the product which user has selected.
*/

const getAddToCartGAObj = (product) => {
    // console.log("Add to cart " + JSON.stringify(product));
    let addToCartGAObj = {};
    addToCartGAObj.ecommerce = {};
    addToCartGAObj.ecommerce.add = {"products": []};

    addToCartGAObj.event = "addToCart";
    addToCartGAObj.ecommerce.currencyCode = store.getState().featureMapAPIReducer.featureMapObj.currency.label; //Local currency may vary as per other countries.

    if (product.sku) {
        let productObj = generateProductGTMObj(product);
        productObj[productGtmKeys.quantity] = product.changeInQuantity; //Change in quantity
        productObj[productGtmKeys.dimension10] = product.size; //Product Size(if available)
        addToCartGAObj.ecommerce.add.products.push(productObj)
    }

    // console.log("Add to cart " + JSON.stringify(addToCartGAObj));
    return addToCartGAObj
};

/*
If user clicks the item from cart screen to change quantity or size there will be three cases,
 whether user adds item quantity, user subtracts item quantity or user changes item size. If user
 increases item quantity then Add To Cart dataLayer should be pushed with updated item count and
 if user decreases item quantity then Remove From Cart dataLayer should be pushed with updated 
 item count. If user changes product size then first Remove From Cart dataLayer should be pushed 
 with  size of the product which was previously added and then Add To Cart data layer should fire 
 with new size of the product which user has selected.
*/

const getRemoveFromCartGAObj = (product, quantity = 0) => {
    let cartData = store.getState().cart.data;
    let removeFromCartGAObj = {};
    removeFromCartGAObj.ecommerce = {};
    removeFromCartGAObj.ecommerce.remove = {products: []};

    removeFromCartGAObj.event = "removeFromCart";

    removeFromCartGAObj.ecommerce.currencyCode = store.getState().featureMapAPIReducer.featureMapObj.currency.label; //Local currency may vary as per other countries.

    if (product.sku) {
        let productObj = generateProductGTMObj(cartData[product.sku]);
        if (quantity) {
            productObj[productGtmKeys.quantity] = quantity; //Change in quantity
        }
        productObj[productGtmKeys.dimension10] = cartData[product.sku].size;
        removeFromCartGAObj.ecommerce.remove.products.push(productObj)
    }
    return removeFromCartGAObj
};

//Checkout Step 1: On Click of " Proceed to Checkout "
const getCheckoutStep1GAObj = () => {
    const state = store.getState();
    let trackingObj = state.cart.data;
    let checkoutStep1GAObj = {};
    // console.log("Checkout 1" + JSON.stringify(trackingObj));
    checkoutStep1GAObj.ecommerce = {};
    checkoutStep1GAObj.ecommerce.checkout = {"actionField": {}, "products": []};

    checkoutStep1GAObj.event = "checkout";
    checkoutStep1GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.step] = 1;
    checkoutStep1GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.option] = "Order Now";
    checkoutStep1GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.action] = "checkout";

    for (let sku in trackingObj) {
        let productObj = generateProductGTMObj(trackingObj[sku]);
        productObj[productGtmKeys.quantity] = trackingObj[sku].quantity; //Change in quantity
        productObj[productGtmKeys.dimension10] = trackingObj[sku].size; //Product Size(if available)
        checkoutStep1GAObj.ecommerce.checkout.products.push(productObj)
    }
    return checkoutStep1GAObj
};


//Checkout Step 2 : On  " Log In" (on start loading of web view when user has logged in)
const getCheckoutStep2GAObj = () => {
    const state = store.getState();
    let trackingObj = state.cart.data;
    let checkoutStep2GAObj = {};
    checkoutStep2GAObj.ecommerce = {};
    checkoutStep2GAObj.ecommerce.checkout = {"actionField": {}, "products": []};

    checkoutStep2GAObj.event = "checkout";
    checkoutStep2GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.step] = 2;
    checkoutStep2GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.option] = "Login";
    checkoutStep2GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.action] = "checkout";

    for (let sku in trackingObj) {
        let productObj = generateProductGTMObj(trackingObj[sku]);
        productObj[productGtmKeys.quantity] = trackingObj[sku].quantity; //Change in quantity
        productObj[productGtmKeys.dimension10] = trackingObj[sku].size; //Product Size(if available)
        checkoutStep2GAObj.ecommerce.checkout.products.push(productObj)
    }
    return checkoutStep2GAObj
};

//Checkout Step 3: On Click of " Continue to Payment"
//Checkout Step 4: On click of "Place Order"
//These will be fired from web view we will need to capture "/checkoutOption?" event from web and this will give us step 3 or step 4 in the object
const getCheckoutStep3_4GAObj = (step) => {
    const state = store.getState();
    let trackingObj = state.cart.data;
    let checkoutStep3_4GAObj = {};
    checkoutStep3_4GAObj.ecommerce = {};
    checkoutStep3_4GAObj.ecommerce.checkout = {"actionField": {}, "products": []};

    checkoutStep3_4GAObj.event = "checkout";
    checkoutStep3_4GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.action] = "checkout";
    checkoutStep3_4GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.step] = step; //to fetch from tracking object"
    if (step === 3) {
        checkoutStep3_4GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.option] = "Address"
    } else {
        //step 4
        checkoutStep3_4GAObj.ecommerce.checkout.actionField[actionFieldGtmKeys.option] = "Payment"
    }

    for (let sku in trackingObj) {
        let productObj = generateProductGTMObj(trackingObj[sku]);
        productObj[productGtmKeys.quantity] = trackingObj[sku].quantity; //Change in quantity
        productObj[productGtmKeys.dimension10] = trackingObj[sku].size; //Product Size(if available)
        checkoutStep3_4GAObj.ecommerce.checkout.products.push(productObj)
    }

    return checkoutStep3_4GAObj
};

//These will be fired from web view after order is placed  we will need to capture "/trackOrder?" event from web
const getCheckoutCompleteGAObj = (trackingObj) => {
    const cartData = store.getState().cart.data;
    let checkoutCompleteGAObj = {};
    checkoutCompleteGAObj.ecommerce = {};
    checkoutCompleteGAObj.ecommerce.purchase = {"actionField": {}, "products": []};

    checkoutCompleteGAObj.event = "checkout-complete";

    checkoutCompleteGAObj.payment_method = (trackingObj.order && trackingObj.order.order && trackingObj.order.order.payment && !isEmptyString(trackingObj.order.order.payment.method)) ? trackingObj.order.order.payment.method : '';

    let shipping_obj = !isEmptyObject(trackingObj) && !isEmptyObject(trackingObj.order) && !isEmptyObject(trackingObj.order.order) && !isEmptyObject(trackingObj.order.order.addresses) && !isEmptyObject(trackingObj.order.order.addresses.shipping) ? trackingObj.order.order.addresses.shipping : {};
    let shipping_city = !isEmptyObject(shipping_obj) && !isEmptyString(shipping_obj.city) ? shipping_obj.city : '';
    let billing_obj = !isEmptyObject(trackingObj) && !isEmptyObject(trackingObj.order) && !isEmptyObject(trackingObj.order.order) && !isEmptyObject(trackingObj.order.order.addresses) && !isEmptyObject(trackingObj.order.order.addresses.billing) ? trackingObj.order.order.addresses.billing : {};
    let billing_city = !isEmptyObject(billing_obj) && !isEmptyString(billing_obj.city) ? billing_obj.city : '';

    checkoutCompleteGAObj.shipping_city = shipping_city;
    checkoutCompleteGAObj.billing_city = billing_city;
    // checkoutCompleteGAObj.order_type = "Repeat";
    // checkoutCompleteGAObj.user_type = "Guest User";
    // checkoutCompleteGAObj.coupon_discount = "40%"; // Coupon Discount

    checkoutCompleteGAObj.ecommerce.currencyCode = trackingObj.currency; //Local currency may vary as per other countries.
    let tax = 0;
    let cod_fee = 0;
    let discount = 0;
    let gift_wrap = 0;
    trackingObj.order.invoice.forEach(function (invoiceItem) {
        if (invoiceItem.type === 'tax') {
            tax = invoiceItem.value;
        }
        if (invoiceItem.type === 'discount') {
            discount = invoiceItem.value;
        }
        if (invoiceItem.type === 'cod_fee') {
            cod_fee = invoiceItem.value;
        }
        if (invoiceItem.type === 'gift_wrap') {
            gift_wrap = invoiceItem.value;
        }
    });
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.id] = trackingObj.transactionId;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.affiliation] = "Online Store";
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.tax] = tax / 100;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.revenue] = (trackingObj.revenue) / 100;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.cod_charges] = cod_fee / 100;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.shipping] = (trackingObj.shipping) / 100;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.coupon] = trackingObj.order.order.coupon;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.currency] = trackingObj.currency;
    checkoutCompleteGAObj.ecommerce.purchase.actionField[actionFieldGtmKeys.gift_wrape_charges] = gift_wrap / 100;

    for (let sku in trackingObj.order.items) {
        let productObj = generateProductGTMObj(cartData[sku]);
        productObj[productGtmKeys.quantity] = trackingObj.order.items[sku].quantity; //Change in quantity
        productObj[productGtmKeys.dimension10] = trackingObj.order.items[sku].size; //Product Size(if available)
        checkoutCompleteGAObj.ecommerce.purchase.products.push(productObj)
    }
    return checkoutCompleteGAObj
};

//Measuring Banner Impressions
const getBannerImpressionGAObj = () => {
    let bannerImpressionGAObj = {};
    bannerImpressionGAObj.ecommerce.promoView = {"promotions": []};

    bannerImpressionGAObj.event = "promotionImpression";

    for (banner in trackingObj.banners) {
        if (trackingObj.banners) {
            let promotionObj = {};
            promotionObj[promotionGtmKeys.id] = "GET100";       // ID or Name is required.
            promotionObj[promotionGtmKeys.name] = "Crazy cashback sale";
            promotionObj[promotionGtmKeys.creative] = "100 Cashback";
            promotionObj[promotionGtmKeys.position] = "value"; // Value contains “screen type name | Verticle position | Horizontal position” e.g Home|1|0.
            bannerImpressionGAObj.ecommerce.promoView.promotions.push(promotionObj)
        }
    }

    return bannerImpressionGAObj
};

//Measuring Banner Click
const getBannerClickGAObj = () => {
    let bannerClickGAObj = {};
    bannerClickGAObj.ecommerce.promoClick = {"promotions": []};

    bannerClickGAObj.event = "promotionClick";

    for (banner in trackingObj.banners) {
        if (trackingObj.banners) {
            let promotionObj = {};
            promotionObj[promotionGtmKeys.id] = "GET100";       // ID or Name is required.
            promotionObj[promotionGtmKeys.name] = "Crazy cashback sale";
            promotionObj[promotionGtmKeys.creative] = "100 Cashback";
            promotionObj[promotionGtmKeys.position] = "value"; // Value contains “screen type name | Verticle position | Horizontal position” e.g Home|1|0.
            bannerClickGAObj.ecommerce.promoClick.promotions.push(promotionObj)
        }
    }

    return bannerClickGAObj
};


const generateProductGTMObj = (product) => {
    let productObj = {};
    if (product) {
        if (product.productSku) {
            productObj[productGtmKeys.id] = product.productSku;
        } else {
            if (product.sku.includes('-')) {
                productObj[productGtmKeys.id] = product.sku.split('-')[0]; // Product ID
            } else {
                productObj[productGtmKeys.id] = product.sku; // Product ID
            }
        }
        productObj[productGtmKeys.name] = product.name;
        productObj[productGtmKeys.price] = (product.specialPrice && product.specialPrice > 0) ? product.specialPrice : product.price; // Product Price
        productObj[productGtmKeys.brand] = (product.brand) ? product.brand.name : null; // Product Brand
        productObj[productGtmKeys.category] = product.category && product.category.replace(/-/g, '/'); // Product Category/Product Subcategory1/Product Subcategory2 like Apparel/Men/T-shirt
        productObj[productGtmKeys.variant] = product.sizes && product.sizes.size > 0 && product.sizes[0];
        productObj[productGtmKeys.quantity] = product.quantity;
        // productObj[productGtmKeys.coupon] = ""; //Product Coupon code
        // productObj[productGtmKeys.dimension7] = "2.5"; //Product Review score
        // productObj[productGtmKeys.dimension8] = "3-4 working days"; //Shipping duration available on Product activities. e.g.- delivery within 2-3 days (if available)
        productObj[productGtmKeys.dimension9] = selectors.isOutOfStock(product) ? "out_of_stock" : "in_stock"; //Stock Status(out of stock or in stock if available)
        if (product.sizes && product.sizes.size > 0) {
            productObj[productGtmKeys.dimension10] = product.sizes && product.sizes.size > 0 && product.sizes[0]; //Product Size(if available)
        } else {
            productObj[productGtmKeys.dimension10] = ''
        }
        productObj[productGtmKeys.dimension11] = product.discount; //Product Discount(if available)
        productObj[productGtmKeys.dimension12] = product.simples && product.simples[0] && parseInt(product.simples[0].quantity); //Product available in stock(if available)
        productObj[productGtmKeys.metric1] = (product.specialPrice && product.specialPrice > 0) ? product.specialPrice : product.price; //Product price
        productObj[productGtmKeys.metric2] = product.discount; //Product discount
        return productObj;
    }

};

const GTM = new GTMTracker();
export default GTM;
