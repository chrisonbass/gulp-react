import React, { useContext } from 'react';
import {Context} from './Router';

export default function(ChildComponent){
  return function RouterWrapper(props){
    let state = useContext(Context);
    return <ChildComponent {...state} {...props} />;
  };
}