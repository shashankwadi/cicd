'use strict';
/**
 * created by Manjeet Singh on 8/11/2017
 * see doc -https://github.com/infinitered/reduxsauce
 * 
 * how to reproduce -
 * 1.create actions creators and types at the top using createActions function from apisauce
 * 2.export them to use in another file
 * 3.create reducer using actionsTypes and initial state
 * 4.use reducer in combineReducer function of redux to make it available in app states
 */

import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    getProducts:['params'],
    getProductsSuccess:['dataSource'],
    getProductsError:['error'],

    getMenu:['params'],
    getMenuSuccess:['menus'],
    getMenuError:['error']
  })


  export const ProductsTypes = Types                  //type created by createActions function eg. FilterTypes.GET_FILTERS is "GET_FILTERS" and so on
  export const ProductsActions =  Creators           //i.e. getFilters =()=>{type:'GET_FILTERS', filter} and so on
  
  /* ------------- Initial State ------------- */
  
  export const INITIAL_STATE = {
    isFetching: false,
    errorInFetch: false,
    error:null,
    dataSource : {},
    search: {},
    menus:[]
  }
  
  /* ------------- Reducers ------------- */
  
  
  export const request = (state, {params}) => {
    return {...state, isFetching:true}
  }

  export const success = (state, {dataSource}) => {
    return {...state, isFetching:false, dataSource}
  }

  export const error = (state, {error}) => {
    return {...state, isFetching:false, errorInFetch:false, error}
  }

  export const menuSuccess = (state, {menus}) => {
    return {...state, isFetching:false, menus}
  }

  

  
  /* ------------- Hookup Reducers To Types ------------- */
  
  const productsReducer = createReducer(INITIAL_STATE, {
    [Types.GET_PRODUCTS]: request,
    [Types.GET_PRODUCTS_SUCCESS]: success,
    [Types.GET_PRODUCTS_ERROR]: error,
    //[Types.CHANGE_CATEGORY]:changeSelectedCategory

    //category menus
    [Types.GET_MENU]:request,
    [Types.GET_MENU_SUCCESS]:menuSuccess,
    [Types.GET_MENU_ERROR]:error,
  });

  export default productsReducer;
  
  //tableSendOrder