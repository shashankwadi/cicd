import { NavigationActions } from 'react-navigation';
import TrackingBridge from '../tracking/trackingBridge';
import * as Constants from 'Wadi/src/components/constants/constants';
const tracking = new TrackingBridge();

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

const screenTracking = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().navigation);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().navigation);
  if (nextScreen !== currentScreen) {
    let screenName = nextScreen
    if (nextScreen.toLowerCase().indexOf("topdp") > -1) {
      screenName = Constants.screens.ProductDetail
    } else if (nextScreen.toLowerCase().indexOf("toplp") > -1){
      screenName = Constants.screens.ProductList
    }
    let screenDataObj = {};
    let state = getState();
    screenDataObj.country_name = state.configAPIReducer.selectedCountry.name;
    tracking.trackScreenVisit(screenName, screenDataObj);
  }
  return result;
};

export default screenTracking;
