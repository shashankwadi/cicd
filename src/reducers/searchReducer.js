import Actions from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    errorInFetch: false,
    searchResult: [],
    searchFacets:{},
    searchAutocompleteResult : [],
}

export default function searchReducer(state = initialState, action) {
    
    switch (action.type) {
        case Actions.FETCH_SEARCH_RESULT_START:
            
            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
            }
       
            
        case Actions.FETCH_SEARCH_RESULT_RECEIVED: {
            
           return {
                ...state,
                isFetching: false,
                errorInFetch: false,
                searchResult : action.data.hits,
                searchFacets :action.data.facets
            }
        }

        case Actions.FETCH_SEARCH_RESULT_FAILED: {

           return {
                ...state,
                isFetching: false,
                errorInFetch: true,
                searchResult : {},
                searchFacets :{}
            }
        }

        case Actions.FETCH_SEARCH_AUTOCOMPLETE_START:
            
            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
                searchAutocompleteResult : [],
            }

        
        case Actions.FETCH_SEARCH_AUTOCOMPLETE_RECEIVED: {
            
           return {
                ...state,
                isFetching: false,
                errorInFetch: false,
                searchAutocompleteResult : action.data,
            }
        }

        default:
            return state

    }
}