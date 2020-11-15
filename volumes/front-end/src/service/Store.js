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

class Store {
  constructor(defState = {}){
    let self = this;
    let _state = cloneDeep(defState);

    this.listeners = [];
    this.reducers = {};
    this.middleware = [];
    this.getState = () => {
      return _state;
    };

    this.dispatch = (action) => {
      let middlewareIndex = -1;
      let middleware = this.middleware.slice();
      let reducers = this.reducers;
      let state = cloneDeep(_state);
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
      middleware.push(reduce);
      const next = () => {
        middlewareIndex++;
        if ( middlewareIndex < middleware.length ){
          let res = middleware[middlewareIndex](self, action, next);
          if ( res !== next ){
            throw new Error("Middleware must return the result from the next middleware");
          }
        }
        return next;
      };
      next();
      if ( !isEqual(_state, state) ){
        _state = state;
        self.makeCallbacks();
      }
    };
  }

  register(callback){
    if ( this.listeners.indexOf(callback) < 0 ){
      this.listeners.push(callback);
    }
    return _buildDeleteListener(this.listeners, callback);
  }

  registerReducer(key, callback){
    if ( !( key in this.reducers ) ){
      this.reducers[key] = [];
    }
    this.reducers[key].push(callback);
    return _buildDeleteListener(this.reducers, callback);
  }

  registerMiddleware(callback){
    if ( this.middleware.indexOf(callback) < 0 ){
      this.middleware.push(callback);
    }
    return _buildDeleteListener(this.middleware, callback);
  }

  makeCallbacks(){
    let state = this.getState();
    this.listeners.forEach( (callback) => {
      callback(state);
    } );
  }
}

export default Store;
