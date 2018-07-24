import Actions from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    errorInFetch: false,
    menu : [],
    promotions:[]
    
}

export default function menuReducer(state = initialState, action) {
    
    switch (action.type) {
        case Actions.FETCH_CATEGORIES_START:
            return {
                ...state,
                isFetching: true,
            }   
        case Actions.FETCH_CATEGORIES_RECEIVED:
            
            return {
                ...state,
                isFetching: false,
                ...action.data            //data have menu and promotion as keys
            }  
        case Actions.FETCH_CATEGORIES_FAILED:
            return {
                ...state,
                isFetching: false,
                errorInFetch: true,
                ...action.data
            }        
              
        default:
            return state

    }
}
