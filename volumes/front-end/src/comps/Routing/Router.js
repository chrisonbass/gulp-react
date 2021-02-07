import React, { createContext, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

const initialRouterState = {
  path: window.location.pathname,
  search: window.location.search,
  match: {}
};

export const Context = createContext(initialRouterState);

const buildMatch = (route) => {
  let match = {
    isMatch: true,
    params: {},
  };
  let currentPath = ("" + window.location.pathname).trim().split(/\//).filter( str => str);
  let routePath = ("" + route.path).trim().split(/\//).filter( str => str );
  (routePath || []).forEach( (pathPart, index) => {
    if ( index < currentPath.length ){
      if ( pathPart.match(/^:/) ){
        match.params[ pathPart.replace(/^:/,'') ] = currentPath[index];
        return;
      }
      else if ( ("" + pathPart).toLowerCase() === ("" + currentPath[index]).toLowerCase() ){
        return;
      }
    }
    match.isMatch = false;
  } );
  if ( route.exact === true && match.isMatch ){
    match.isMatch = currentPath.length === routePath.length;
  }
  return match;
};

function Router(props){
  const [router, updateRouter] = useState({...initialRouterState});
  let mounted = false;
  const popStateListener = () => {
    updateRouter({
      ...router,
      path: window.location.pathname,
      search: window.location.search
    });
  };

  useEffect(() => {
    if ( !mounted ){
      window.addEventListener("popstate", popStateListener);
      mounted = true;
    }
    return () => {
      mounted = false;
      window.removeEventListener("popstate", popStateListener);
    };
  });

  const contextValue = {
    ...router,
    push: (pathName) => {
      if ( (window.history.state || {}).to !== pathName ){
        window.history.pushState({to: pathName}, "", pathName);
        let newState = {
          ...router,
          path: window.location.pathname,
          search: window.location.search
        };
        updateRouter(newState);
      }
    },
    canRender: (route) => {
      return (buildMatch(route) || {}).isMatch === true;
    },
    registerRoute: (route) => {
      let match = buildMatch(route);
      if ( match.isMatch && !isEqual(router.match, match) ){
        updateRouter({
          ...router,
          match
        });
      }
    },
    buildMatch
  };
  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
}

Router.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ])
};

export default Router;