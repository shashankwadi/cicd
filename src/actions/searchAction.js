import Actions from './actionTypes';

var algoliasearch = require('algoliasearch/reactnative');
var client = algoliasearch('L37UPDNI6H', '49fe34d51859d9c2367c36e25e253c6c');
var index = client.initIndex('wadi_test_sa_popularity_desc');
var indexAutocomplete = client.initIndex('query_suggestions');
import TrackingEnum from '../tracking/trackingEnum';

export function fetchSearchResult(searchText) {

    return dispatch => {

        //dispatch(fetchSearchResultStart())

        index.search({
            query: searchText,
            facets: ['*'],
        }).then(response => {
            dispatch(fetchSearchResultSucceed(response))
        }).catch(error => {
            dispatch(fetchSearchResultFailed(error))
        });
    }
}

export function fetchAutocompleteResult(searchText) {

    return dispatch => {
        indexAutocomplete.search({
            query: searchText,
            page: 1,
            hitsPerPage: 10
        }).then(response => {
            let result = response.hits.map(dict => {
                let highlightResultDict = dict['_highlightResult']
                if (!!highlightResultDict) {
                    let queryDict = highlightResultDict['query']
                    if (!!queryDict) {
                        let val = queryDict['value']
                        val = val.replace(/<\/em>/g,'')
                        val = val.replace(/<em>/g,'')
                        return val
                    }
                }
                return ''
            })
            dispatch(fetchAutocompleteResultSucceed(result))
        }).catch(error => {
            dispatch(fetchSearchResultFailed(error))
        });
    }
}

export function fetchSearchResultStart(searchText) {
    return {
        
        type: Actions.FETCH_SEARCH_RESULT_START,
        searchText
    }
}

export function fetchAutocompleteResultStart(searchText) {

    return {
        type: Actions.FETCH_SEARCH_RESULT_START,
        searchText
    }
}

export function fetchAutocompleteResultSucceed(data) {

    return {
        type: Actions.FETCH_SEARCH_AUTOCOMPLETE_RECEIVED,
        data
    }
}

export function fetchSearchResultSucceed(data) {
    
    let tracking = (data) ? Object.assign({}, {searchText: data.query}, {logType: TrackingEnum.TrackingType.ALL}) : {}
    return {
        type: Actions.FETCH_SEARCH_RESULT_RECEIVED,
        data,
        tracking
    }
}

export function fetchSearchResultFailed(error) {

    return {
        type: Actions.FETCH_SEARCH_RESULT_FAILED,
        error
    }
}