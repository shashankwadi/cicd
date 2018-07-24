'use stricts';

import Types from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  errorInFetch: false,
  widgetData: [],
  data: null,
  searchBarHidden: false,
  carouselData: null,
}

export default function homePageReducers(state = initialState, action) {

  switch (action.type) {
    case Types.FETCHING_WIDGET:
      return {
        ...state,
        isFetching: true,
        errorInFetch: false
      }
    case Types.HIDE_SEARCH_BAR:

      return {
        ...state,
        searchBarHidden: action.searchBarHidden

      }
    case Types.WIDGET_RECEIVED: {
      return widgetsReceived(state, action.data);
    }
    case Types.WIDGET_RECEIVED_ERROR:
      return {
        ...state,
        isFetching: false,
        errorInFetch: true,
        widgetData: []
      }
    case Types.CLEAR_HOME_DATA:
      return clearDataOnUrl(state, action.url);
    case Types.CAROUSEL_PRODUCTS_SUCCESS:
    default:
      return state

  }
}

/**
 * 
 * @param {*} state is current state of homePageReducers 
 * @param {*} url is passed from deeplinkhandler
 */
export const getHomeOnUrl = (state, url) => {
  //url = (url)?url:"homePageData";
  let { data } = state;
  return data[url];
}

const widgetsReceived = (state, params) => {
  let { data } = state;
  let { url, data: newHomeData } = params;
  let currentData = [];
  if (url && !data.hasOwnProperty(url)) {
    data[url] = [];
  }
  // else {
  //   currentData = (data[url])?data[url]:[];
  // }
  //let newData = { ...data, [url]: [...currentData, ...newHomeData ] };
  let newData = { ...data, [url]: [...newHomeData] };
  return {
    ...state,
    data: newData,
    isFetching: false,
    errorInFetch: false,
  }
}

const updateCarouselData = (state, params) => {
  // let {carouselData}= state;
  // let {uid, url, data} = params;
  // if(!carouselData.hasOwnProperty(uid)){
  //   carouselData[uid] = {}
  // };
  // return carouselData = {...carouselData, [uid]:{uid:uid, url:url, data:data}}
  return state
}

/**
 * 
 * @param {*} state is the current reducer state
 * @param {*} url is the url for which we need to remove data
 */
const clearDataOnUrl =(state, url) =>{
  let {data} = state;
  let {[url]:currentData, ...updatedData} = data;
  return{
    ...state,
    data:updatedData
  }
}
