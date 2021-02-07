import React, { useContext, useEffect } from 'react';
import { Context } from './Router';
import PropTypes from 'prop-types';

function Route(props){
  const {
    canRender,
    buildMatch,
    registerRoute,
    ...routerState
  } = useContext(Context);
  useEffect( () => registerRoute(props) );
  if ( canRender(props) ){
    let RouteComponent = props.component;
    let match = buildMatch(props);
    if ( RouteComponent ){
      return <RouteComponent {...routerState} match={match} {...props} />;
    }
    return (
      <div className="container">
        <h1>Route</h1>
        <div>
          <pre>Route {JSON.stringify({...props, match}, null, 2)}</pre>
        </div>     
      </div>
    );
  }
  return null;
}

Route.defaultProps = {
  exact: false,
  path: "/",
  component: null
};

Route.propTypes = {
  exact: PropTypes.bool,
  path: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ])
};

export default Route;