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
import Types from '../actions/actionTypes';


const INITIAL_STATE = {
  fetching:false,
  data:null,
  error:null,
  errorInFetch:false,
  categories:[],
  search:null
}

export default function filterReducer(state = INITIAL_STATE, actions){
  switch(actions.type){
    case Types.GET_FILTERS:
    return{
      ...state,
      fetching:true
    }
    case Types.GET_FILTERS_SUCCESS:
    return{
      ...state,
      fetching:false,
      //categories:actions.data
      ...actions.data
    }
    case Types.GET_FILTERS_ERROR:
    return{
      ...state,
      fetching:false,
      errorInFetch:true
    }
    default:
    return state;
  }
}