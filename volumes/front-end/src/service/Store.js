import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const _buildDeleteListener = (list, item) => {
  return () => {
    let index = list.indexOf(item);
    if ( index >= 0 ){
      list.splice(index, 1);
    }
  };
};

export default function createStore(defState){
  let _state = cloneDeep(defState);
  let listeners = [];
  let reducers = {};
  let middleware = [];

  const getState = () => {
    return _state;
  };

  const subscribe = (callback) => {
    if ( listeners.indexOf(callback) < 0 ){
      listeners.push(callback);
    }
    return _buildDeleteListener(listeners, callback);
  };

  const addReducer = (key, callback) => {
    if ( !( key in reducers ) ){
      reducers[key] = [];
    }
    if ( Array.isArray(callback) ){
      reducers[key].concat(callback);
      return _buildDeleteListener(reducers[key], callback.slice().pop());
    } 
    reducers[key].push(callback);
    return _buildDeleteListener(reducers[key], callback);
  };

  const addMiddleware = (callback) => {
    if ( Array.isArray(callback) ){
      middleware.concat( callback.filter( c => middleware.indexOf(c) >= 0 ) );
      return _buildDeleteListener(middleware, callback.pop);
    }
    else if ( middleware.indexOf(callback) < 0 ){
      middleware.push(callback);
    }
    return _buildDeleteListener(middleware, callback);
  };

  const makeCallbacks = () => {
    let state = getState();
    listeners.forEach( (callback) => {
      callback(state);
    } );
  };

  const dispatch = (action) => {
    let middlewareIndex = -1;
    let middle = middleware.slice();
    let state = cloneDeep(getState());
    const reduce = (store, action, dispatch) => {
      Object.keys(state).forEach( (key) => {
        if ( key in reducers ){
          reducers[key].forEach( (reducer) => {
            state[key] = reducer(action, state[key]);
          } );
        }
      } );
      return dispatch();
    };
    middle.push(reduce);
    const next = () => {
      middlewareIndex++;
      if ( middlewareIndex < middle.length ){
        let res = middle[middlewareIndex]({getState, dispatch}, action, next);
        if ( res !== next ){
          throw new Error("Middleware must return the result from the next middleware");
        }
      }
      return next;
    };
    next();
    if ( !isEqual(_state, state) ){
      _state = state;
      makeCallbacks();
    }
  };

  return {
    getState,
    subscribe,
    addMiddleware,
    addReducer,
    dispatch
  };
}