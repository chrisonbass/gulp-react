import React from 'react';
import PropTypes from 'prop-types';
import RouterContext from './Context';
import Connect from '../../service/Connect';

class Router extends React.Component {
  constructor(props){
    super(props);
    this.routes = [];
    this.popStateListener = this.popStateListener.bind(this);
  }

  popStateListener(){
    this.props.routerChange(document.location.pathname, false);
  }

  componentDidMount(){
    this.checkMatches();
    window.addEventListener("popstate", this.popStateListener);
  }

  componentWillUnmount(){
    window.removeEventListener("popstate", this.popStateListener);
  }

  componentDidUpdate(){
    this.checkMatches();
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
          match.params[ pathPart.replace(/^:/,'') ] = currentPath[index];
          return;
        }
        else if ( pathPart === currentPath[index] ){
          return;
        }
      }
      match.isMatch = false;
    } );
    if ( match.exact === true && match.isMatch ){
      match.isMatch = currentPath.length === routePath.length;
    }
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
    if ( JSON.stringify(this.props.router.match) !== JSON.stringify(matchFound) ){
      this.props.routerUpdate({
        match: Object.assign({}, matchFound)
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
    this.props.routerChange(pathName);
  }

  getContext(){
    return {
      router: {
        registerRoute: this.registerRoute.bind(this),
        canRender: this.canRender.bind(this),
        pushState: this.pushState.bind(this),
        ...this.props.router,
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
  router: PropTypes.object.isRequired,
  routerChange: PropTypes.func.isRequired,
  routerUpdate: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ])
};

export default Connect({
  stateKeys: ["router"],
  actions: ["routerChange", "routerUpdate"]
})(Router);
