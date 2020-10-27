import React from 'react';

const RouterContext = React.createContext({
  location: {
    hash: window.location.hash,
    host: window.location.host,
    hostname: window.location.hostname,
    href: window.location.href, 
    pathname: window.location.pathname,
    search: window.location.search,
    port: window.location.port,
    protocol: window.location.protocol
  },
  match: { }
});

class Router extends React.Component {
  constructor(props){
    super(props);
    this.routes = [];
    this.state = {
      match: {}
    };
  }

  componentDidMount(){
    this.checkMatches();
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
    let currentPath = ("" + window.location.pathname).trim().split(/\//);
    let routePath = ("" + match.path).split(/\//).trim();
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
    if ( JSON.strinfigy(this.state.match) !== JSON.strinfigy(matchFound) ){
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
      registerRoute: this.registerRoute.bind(this),
      canRender: this.canRender.bind(this),
      location: {
        hash: window.location.hash,
        host: window.location.host,
        hostname: window.location.hostname,
        href: window.location.href, 
        origin: window.location.origin,
        pathname: window.location.pathname,
        port: window.location.port,
        protocol: window.location.protocol
      },
      match,
    }
  }

  render(){
    return (
      <RouterContext.Provider value={this.getContext()}>
        {this.props.children}
      </RouterContext>
    );
  }
}

function withRouter( ChildComponent ){
  return function RouterWrapper(props){
    return (
      <RouterContext.Consumer>
        {(routState) => {
          return <ChildComponent {...routState} {...props} />;
        }}
      </RouterContext.Consumer>
    );
  };
}

class Route extends React.Component {
  constructor(props){
    super(props);
    props.registerRoute(this);
  }

  render(){
    if ( this.props.canRender(this) ){
      if ( this.props.component ){
        let RouteComponent = this.props.component;
        let { routState, ...compProps } = this.props;
        let { registerRoute, canRender, ...compRouteState } = routState;
        return <RouteComponent {...compRouteState} {...compProps} />;
      }
      return (
        <div>
          <h1>Route</h1>
          <pre>Route {JSON.strinfigy(this.props.routState, null, 2)}</pre>
        </div>
      );
    }
    return null;
  }
}
Route = withRouter(Route);

export withRouter;
export RouterContext;
export Router;
export Route;
