'use strict';

/**
 * @Last Modified by Manjeet Singh 
 * @Last Modified Time: 2017-11-23 15:56:24
 * @Actions - refractored code a bit to use apisauce
 */

import Types from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  errorInFetch: false,
  error: null,
  dataSource: {},
  data: {}, //changed to object
  OOSData: {},
  itemsCount: 0,
  OOSCount:0,
  cartReview: null,
  message: "",
  orderPlaced: false,
  //OOSCount:0,

}

export default function cartReducer(state = initialState, action) {

  switch (action.type) {
    case Types.BEGIN_PRODUCT_REVIEW:
      return {
        ...state,
        isFetching: true,
        errorInFetch: false,
      }

    case Types.PRODUCT_REVIEW_SUCCESS:
      //return updatedProductsAfterReview(state, action.data);
      return {
        ...state,
        isFetching: false,
        errorInFetch: false,
        ...action.data,
      }
    case Types.PRODUCT_REVIEW_FAILURE: {
      return {
        ...state,
        isFetching: false,
        errorInFetch: true,
      }
    }
    case Types.ADD_TO_CART_SUCCESS:
      return addRequest(state, action.data);


    case Types.REMOVE_FROM_CART_SUCCESS:
      return removeRequest(state, action.data);

    case Types.REMOVE_PRODUCTS_FROM_CART:
      return removeProducts(state, action.data);

    case Types.FETCH_CART_SUCCESS:
      return fetchSuccess(state, action.data);

    case Types.ORDER_SUCCESS:
      return updateOrderStatusInCart(state, action.data);

    case Types.UPDATE_CART_ITEM_DATA:
      return updateCartItemData(state, action.data);

    case 'DID_GET_CART_OBJECT': {
      return {
        ...state,
        cartObj: action.data
      }
    }

    case 'DID_FAIL_TO_GET_CART_OBJECT': {
      return {
        ...state
      }
    }
    case Types.ADD_TO_CART:
    case Types.REMOVE_FROM_CART:
    case Types.FETCH_CART:
    case Types.UPDATE_PRODUCT_IN_CART:
    case Types.ORDER_FAILURE:
    case Types.UPDATE_CART_STATUS:
    case Types.REPLACE_PRODUCT_IN_CART:
    case Types.CHECKOUT_EVENTS:
    default:
      return state

  }
}

const updateCartItemData= (state, product)=>{
  let {data} = state;
  let currentData = data[product.sku];
  data = {...data, [product.sku]:{...currentData, ...product}}
  return {...state, data:data};
}

const updateData = ({ data, items, isError = false }) => {
  for (let sku in items) {
    let currentData = data[sku];    //current state of sku 
    let updatedData = items[sku];   //state returned by review call
    // if(isError){
    //   if(updateData.){

    //   }else{

    //   }
    // }
    let updates = { ...currentData, ...updatedData };
    if (currentData) {
      data = { ...data, [sku]: updates };
    }
  }
  return data;
}

export const updatedProductsAfterReview = (state, params) => {
  let { data, OOSCount } = state;
  let { items, errors } = params;
  if (items) {
    data = updateData({ data, items });
  }
  if (errors && errors.items) {
    data = updateData({ data, items: errors.items, isError: true });
  }
  return {
    ...state,
    isFetching: false,
    errorInFetch: false,
    cartReview: params,
    data: data
  }
}

export const addRequest = (state, params) => {
  let { data, itemsCount } = state;
  let { sku, product } = params;
  let currentProduct = {};
  if (!data.hasOwnProperty(sku)) {
    data[sku] = {};
    itemsCount = parseInt(itemsCount) + parseInt(product.quantity);
  } else {
    currentProduct = data[sku];
    itemsCount = parseInt(itemsCount) + parseInt(product.quantity) - parseInt(currentProduct.quantity);
  }
  let newData = { ...data, [sku]: { ...currentProduct, ...product } };
  return { ...state, data: newData, itemsCount: parseInt(itemsCount), message: "", orderPlaced: false }
}

export const removeRequest = (state, params) => {
  let { data, itemsCount } = state;
  let { sku, quantity } = params;
  if (data.hasOwnProperty(sku)) {
    let { [sku]: currentProduct, ...updatedCart } = data;
    return { ...state, data: { ...updatedCart }, itemsCount: parseInt(itemsCount) - parseInt(quantity), message: "", orderPlaced: false }
  } else {
    return state;
  }
}

/**
 * 
 * @param {*} state 
 * @param {*} params 
 * function to remove multiple products on the basis of array of skus;
 */
const removeProducts = (state, params) => {
  let { data, itemsCount, OOSCount } = state;
  for (let sku in params) {
    let { [sku]: currentProduct, ...updatedData } = data;
    data = updatedData;
    itemsCount = parseInt(itemsCount) - parseInt(currentProduct.quantity);
  }
  return { ...state, data: data, itemsCount: itemsCount, OOSCount:0 };
}

export const updateOrderStatusInCart = (state, params) => {
  return { ...state, message: "", ...params };
}

export const fetchSuccess = (state, params) => {
  let { itemsCount, data } = params;
  return { ...state, itemsCount: parseInt(itemsCount), data }
}
