import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';

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
          if ( reducers.hasOwnProperty(key) ){
            reducers[key].forEach( (reducer) => {
              state[key] = reducer(action, state[key]);
            } );
          }
        } );
        return dispatch();
      }
      middleware.push(reduce)
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
        console.log("Making Callbacks");
        self.makeCallbacks();
      }
    };
  }

  register(callback){
    if ( this.listeners.indexOf(callback) < 0 ){
      this.listeners.push(callback);
    }
    let self = this;
    return () => {
      let index = self.listeners.indexOf(callback);
      if ( index >= 0 ){
        self.listeners.splice(index, 1);
      }
    };
  }

  registerReducer(key, callback){
    if ( !this.reducers.hasOwnProperty(key) ){
      this.reducers[key] = [];
    }
    this.reducers[key].push(callback);
  }

  registerMiddleware(callback){
    if ( this.middleware.indexOf(callback) < 0 ){
      this.middleware.push(callback);
    }
    let self = this;
    return () => {
      let index = self.middleware.indexOf(callback);
      if ( index >= 0 ){
        self.middleware.splice(index, 1);
      }
    };
  }

  makeCallbacks(){
    let state = this.getState();
    this.listeners.forEach( (callback) => {
      callback(state);
    } );
  }
}

export default Store;
