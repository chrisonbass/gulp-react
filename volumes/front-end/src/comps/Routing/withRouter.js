import React from 'react';
import RouterContext from './Context';

const withRouter = ( ChildComponent ) => {
  return function RouterWrapper(props){
    return (
      <RouterContext.Consumer>
        {(state) => {
          return <ChildComponent {...state} {...props} />;
        }}
      </RouterContext.Consumer>
    );
  };
}

export default withRouter;
