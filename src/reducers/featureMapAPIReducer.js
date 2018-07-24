import Types from '../actions/actionTypes';


const INITIAL_STATE = {
    featureMapObj: {},
};

export default function featureMapAPIReducer(state = INITIAL_STATE, actions) {
    switch (actions.type) {
        case Types.GET_FEATURE_MAP:
            return {
                ...state
            };
        case Types.SET_FEATURE_MAP:
            return {
                ...state,
                featureMapObj: actions.featureMapObj
            };
        case Types.DELETE_FEATURE_MAP:
            return {
                ...state
            };
        default:
            return state;
    }
}