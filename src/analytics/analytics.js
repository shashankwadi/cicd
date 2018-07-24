/**
 * Track all actions and states after they are dispatched.
 * pass track object within your actions to invoke tracking
 * action.track have following format 
 * track = {data, evenType, logType, currentPage}
 */

 // action ={type, data, track:{}}
import TrackingBridge from '../tracking/trackingBridge';
    
const tracking = new TrackingBridge();

const analyticsLogger = store => next => action => {
  //console.warn('action tye is',action.type)
  //console.group(action.type)
  //console.info('dispatching', action)
  // if(action.tracking){             
  //   //do tracking
  if (!!action.tracking) {
    tracking.track(action.tracking, action.type);
  }
  // }
  //let result = next(action)
  //console.log('next state', store.getState())
  //console.groupEnd(action.type)
  return next(action);
}

export default analyticsLogger;