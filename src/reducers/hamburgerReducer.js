import Actions from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    errorInFetch: false,
    menus : {},
    
}

export default function hamburgerReducer(state = initialState, action) {
    
    switch (action.type) {
        case Actions.FETCH_CATEGORIES_START:

            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
                menus : {}
                
            }   
        case Actions.FETCH_CATEGORIES_RECEIVED:
            
            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
                menus : {}
                
            }  
        case Actions.FETCH_CATEGORIES_FAILED:
                        
            return {
                ...state,
                isFetching: true,
                errorInFetch: false,
                menus : {}
                
            }        
              
        default:
            return state

    }
}