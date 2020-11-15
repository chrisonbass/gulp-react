import React from 'react';
import PropTypes from 'prop-types';
import RouterContext from './Context';
import Connect from '../../service/Connect';

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
    this.props.routerChange(pathName);
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
        ...this.props.router,
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
  router: PropTypes.object,
  routerChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ])
};

export default Connect({
  stateKeys: ["router"],
  actions: ["routerChange"]
})(Router);
