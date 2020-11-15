import React from 'react';
import PropTypes from 'prop-types';
import RouterContext from './Context';
import Store from '../../service/Store';

class Router extends React.Component {
  constructor(props){
    super(props);
    this.routes = [];
    this.state = {
      router: {
        path: window.location.pathname,
        search: window.location.search
      },
      match: {}
    };
    this.unregister = [];
    if ( this.props.store && this.props.store instanceof Store ){
      let deleteCallback = this.props.store.registerReducer("router", (action, state = {}) => {
        if ( action.type === "@@router/change" ){
          let newState = {
            ...state,
            path: window.location.pathname,
            search: window.location.search
          };
          return newState;
        }
        return state;
      } );
      let stateUpdateCallback = this.props.store.register(this.storeListener.bind(this));
      let middleware = this.props.store.registerMiddleware( (store, action, next) => {
        if ( action.type === "@@router/change" ){
          window.history.pushState(action.state || {
            to: action.to || "/"
          }, action.title || "", action.to || "/");
        }
        return next();
      } );
      this.unregister.push(middleware);
      this.unregister.push(deleteCallback);
      this.unregister.push(stateUpdateCallback);
    }
  }

  componentDidMount(){
    this.checkMatches();
  }

  componentWillUnmount(){
    this.unregister.forEach( (callback) => {
      if ( typeof callback === "function" ){
        callback();
      }
    } );
  }

  componentDidUpdate(){
    this.checkMatches();
  }

  storeListener(state){
    if ( this.state.router !== state.router ){
      this.setState({
        router: state.router
      });
    }
  }

  registerRoute(route){
    let addNew = true;
    this.routes.forEach( (entry) => {
      if ( entry.route === route ){
        addNew = false;
      }
    } );
    if ( addNew === true ){
      this.routes.push({
        match: this.buildMatch(route),
        route
      });
    }
  }

  buildMatch(route){
    let match = {
      path: route.props.path,
      isMatch: true,
      exact: route.props.exact ? true : false,
      params: {}
    };
    let currentPath = ("" + window.location.pathname).trim().split(/\//).filter( str => str);
    let routePath = ("" + match.path).trim().split(/\//).filter( str => str );
    (routePath || []).forEach( (pathPart, index) => {
      if ( index < currentPath.length ){
        if ( pathPart.match(/^:/) ){
          match.params[ pathPart.replace(/^;/,'') ] = currentPath[index];
          return;
        }
        else if ( pathPart === currentPath[index] ){
          return;
        }
      }
      match.isMatch = false;
    } );
    return match;
  }

  checkMatches(){
    let self = this;
    let matchFound = false;
    this.routes = this.routes.map( (entry) => {
      let match = self.buildMatch(entry.route);
      if ( match.isMatch === true ){
        if ( matchFound !== false ){
          match.isMatch = false;
        }
        else {
          matchFound = match;
        }
      }
      return {
        route: entry.route,
        match
      };
    } );
    if ( JSON.stringify(this.state.match) !== JSON.stringify(matchFound) ){
      this.setState({
        match: matchFound
      });
    }
  }

  canRender(route){
    let can = false;
    this.routes.forEach( (entry) => {
      if ( can === true ){
        return;
      }
      if ( entry.match.isMatch && entry.route === route ){
        can = true;
      }
    } );
    return can;
  }

  pushState(pathName){
    if ( this.props.store ){
      this.props.store.dispatch({
        type: "@@router/change",
        to: pathName
      });
    }
  }

  getContext(){
    let match = false;
    this.routes.forEach( (entry) => {
      if ( match !== false ){
        return;
      }
      if ( entry.match.isMatch === true ){
        match = entry.match;
      }
    } );
    if ( match === false ){
      match = {};
    }
    return {
      router: {
        registerRoute: this.registerRoute.bind(this),
        canRender: this.canRender.bind(this),
        pushState: this.pushState.bind(this),
        ...this.state.router,
        match
      }
    };
  }

  render(){
    return (
      <RouterContext.Provider value={this.getContext()}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

Router.propTypes = {
  store: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ])
};

export default Router;
