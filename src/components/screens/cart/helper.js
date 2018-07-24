'use strict';
/**
 * All the useful helper functions related to cart functionality goes here
 */

import {getCurrency} from 'utilities/utilities';


export const currentTabIndex = (navigator) => {
    let { routes } = navigator;
    let index = 0;
    if (routes && routes.length > 0) {
        let tabs = routes.filter((item) => item.routeName === "Tabs");
        let lastTabs = tabs[tabs.length - 1];
        index = (lastTabs && lastTabs.index) ? lastTabs.index : 0
    }
    return index;
}

export const checkOutOfStcok =(data)=>{
    let isOutOfStock = false;
    for (let sku in data) {
        let { available_quantity, } = data[sku];
        isOutOfStock = (!!available_quantity && available_quantity === 0);
    }
    return isOutOfStock;
}


export const getTotal =({cartReview})=>{
    let total = 0;
    if (!!cartReview && !!cartReview.invoice_app && !!cartReview.invoice_app.length){
        let totalItem = cartReview.invoice_app.filter((item)=> item.type ==="total")[0];
        if(totalItem && totalItem.value){
            total = totalItem.value/100;
        }
    }
    return (total)?`${total} ${getCurrency()}`:'';
}

export {getCurrency};