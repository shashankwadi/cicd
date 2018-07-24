'use strict';

export const currentScreen = (state = { currentScreen: "" }, action) => {
    switch (actions.type) {
        case Types.UPDATE_SCREEN_NAME:
            return { ...state, currentScreen: action.currentScreen };
        default:
            return state;
    }
};