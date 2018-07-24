import Types from 'Wadi/src/actions/actionTypes';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import { combineEpics }from 'redux-observable';

import { fetchSearchResult } from 'Wadi/src/actions/searchAction';
import { fetchAutocompleteResult } from 'Wadi/src/actions/searchAction';
import { deepLinkActions } from 'Wadi/src/actions/globalActions';

const epicSearchResultMiddleware = action$ =>
  action$.ofType(Types.FETCH_SEARCH_RESULT_START)
  .debounceTime(200)
  .map(action =>
      fetchSearchResult(action.searchText)
  )

const epicSearchAutocompleteMiddleware = action$ =>
  action$.ofType(Types.FETCH_SEARCH_RESULT_START)
  .debounceTime(200)
  .map(action =>
      fetchAutocompleteResult(action.searchText)
  )

//This is to add debounce to user action navigation (to prevent double push/pop)
// const epicDeeplinkMiddleware = action$ =>
//     action$.ofType(Types.DEEP_LINK)
//         .debounceTime(500)
//         .map(action =>
//             deepLinkActions(action.params)
//         )

export default epicSearchMiddleware = combineEpics(epicSearchResultMiddleware, epicSearchAutocompleteMiddleware)