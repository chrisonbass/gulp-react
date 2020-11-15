import React from 'react';
import * as StoreActions from './Actions';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import AppStore from './AppStore';

export default ({
  store = AppStore, 
  stateKeys,
  actions
}) => {
  return (WrappedComponent) => {
    stateKeys = stateKeys || [];
    actions = actions || [];
    return class Connect extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          wrappedProps: this.processStore(store.getState(), false)
        };
        this.deleteCallback = store.register(this.processStore.bind(this));
      }

      componentWillUnmount(){
        this.deleteCallback();
      }

      processStore(state, update = true){
        let wrappedProps = {};
        stateKeys.forEach( (key) => {
          let propName = key.split(/\./).pop();
          wrappedProps[propName] = get(state, key);
        } );
        actions.forEach( (action) => {
          if ( action in StoreActions ){
            wrappedProps[action] = function(){
              store.dispatch(StoreActions[action].apply(null, arguments));
            };
          }
        } );
        if ( update ){
          if ( !isEqual(wrappedProps, this.state.wrappedProps) ){
            this.setState({
              wrappedProps
            });
          }
        } 
        else {
          return wrappedProps;
        }
      }

      render(){
        return <WrappedComponent {...this.state.wrappedProps} {...this.props} />;
      }
    };
  };
};
