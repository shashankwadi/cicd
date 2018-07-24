/*
 * @Author: shahsank sharma 
 * @Date: 2017-10-10 11:46:43 
 * @Last Modified by: shashank sharma
 * @Last Modified time: 2017-10-17 12:55:16
 * 
 * @Last Modified by :Manjeet Singh
 * @Last Modified time: 2017-11-23 2:51:30
 * @Last Action - referactored code a bit to use ES6 syntax and Promises over async function
 */

'use strict';

import React from 'react';
import {
    AsyncStorage
} from 'react-native';

let cartKey = 'tes_cart_key'
let reviewKey = 'wadi-ios-review'


function CartHandler() {

    /**
     * Add Product To Cart.
     *
     * @param   {string} sku  - The sku of Product.
     * @param   {Object} productDataObj - The data of Product.
     */
    this.addProductToCart = (sku, productDataObj) => {
        return new Promise((resolve, reject) => {
            let cartObj = { [sku]: productDataObj }
            AsyncStorage.mergeItem(cartKey, JSON.stringify(cartObj))
                .then(() => resolve(true))
                .catch((error) => reject({ success: false, error }));
        });
    }

    /**
     * Delete Product From Cart.
     *
     * @param   {string} sku  - The sku of Product.
     */

    this.deleteProductFromCart = (sku) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(cartKey)
                .then(cartObj => JSON.parse(cartObj))
                .then(parsedCart => {
                    delete parsedCart[sku];
                    AsyncStorage.setItem(cartKey, JSON.stringify(parsedCart))
                        .then(() => resolve(true))
                        .catch((error) => {
                            reject({ success: false, error })
                        });
                }).catch((error) => {
                    reject({ success: false, error });
                });
        });

    }
    

    /**
     * Delete Multiple Products From Cart.
     * @param   {string} items  - array of sku
     */

    this.deleteMultipleProducts = (items) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(cartKey)
                .then(cartObj => JSON.parse(cartObj))
                .then(parsedCart => {
                    //delete parsedCart[sku];
                    let cart = parsedCart;
                    for(let sku in items){
                        let { [sku]: currentProduct, ...updatedData } = cart;
                        cart = updatedData;
                      }
                    AsyncStorage.setItem(cartKey, JSON.stringify(cart))
                        .then(() => resolve(true))
                        .catch((error) => {
                            reject({ success: false, error })
                        });
                }).catch((error) => {
                    reject({ success: false, error });
                });
        });

    }

    /**
     * Add Delete Quantity of Product In Cart.
     *
     * @param   {string} sku  - The sku of Product.
     * @param   {Object} productDataObj - The data of Product with new quantity.
     * this method should be used to update qunatity of the product in cart
     * just pass sku and product with updated quantity and it will update the object in cart
     */

    this.updateProductInCart = (sku, productDataObj) => {
        return new Promise((resolve, reject) => {
            let cartObj = { [sku]: productDataObj }
            AsyncStorage.mergeItem(cartKey, JSON.stringify(cartObj))
                .then(() => resolve(true))
                .catch((error) => reject({ success: false, error }));
        });
    }


    /**
     * @param {*} sku is the old sku that needed to be replaced
     * @param {*} productDataObj is the updated product with new sku 
     */
    this.replaceProductInCart = (sku, productDataObj) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(cartKey)
                .then(cartObj => JSON.parse(cartObj))
                .then(parsedCart => {
                    let { [sku]: currentProduct, ...oldCart } = parsedCart;
                    let {sku : newSku} = productDataObj;
                    let updatedCart = {...oldCart, [newSku]:productDataObj};
                    AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart))
                        .then(() => resolve(true))
                        .catch((error) => {
                            reject({ success: false, error })
                        });
                }).catch((error) => {
                    reject({ success: false, error });
                });
        });
    }

    /**
     * Get Cart Object.
     *
     */

    this.getCart = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(cartKey)
                .then((value) => {
                    let data = null;
                    if (value !== null) {
                        data = JSON.parse(value);
                    }
                    resolve(data); //parse cart object to json before resolving
                })
                .catch(error => reject({ success: false, error }));
        });
    }

    /**
 * Get Cart Array.
 *
 */

    this.getCartArray = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(cartKey)
                .then((cartDic) => {
                    let cartArr = Object.values(JSON.parse(cartDic));
                    resolve(cartArr);
                })
                .catch((error) => reject({ success: false, error }));
        });
    }

    /**
     * Save Review response Object.
     *
     * @param   {Object} reviewdata - Review call response object.
     */

    this.saveReviewCallData = (reviewdata) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(reviewKey, JSON.stringify(reviewdata))
                .then(() => resolve(true))
                .catch((error) => reject({ success: false, error }));
        });
    }

    /**
     * Get Review response Object.
     *
     */

    this.getReviewCallData = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(reviewKey)
                .then((value) => {
                    let data = null;
                    if (value !== null) {
                        data = JSON.parse(value);
                    }
                    resolve(data); //parse cart object to json before resolving
                })
                .catch(error => reject({ success: false, error }));
        });
    },

    /**
     * need to clear cart after order success
     */
    this.clearCart = ()=>{
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(cartKey)
                .then(() => {
                    resolve(true); 
                })
                .catch(error => reject({ success: false, error }));
        });
    }
}

export default CartHandler;
//module.exports = CartHandler;