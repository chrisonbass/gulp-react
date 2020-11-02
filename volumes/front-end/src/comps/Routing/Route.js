import React from 'react';
import withRouter from './withRouter';

class Route extends React.Component {
  constructor(props){
    super(props);
    props.router.registerRoute(this);
  }

  render(){
    if ( this.props.router.canRender(this) ){
      if ( this.props.component ){
        let RouteComponent = this.props.component;
        let { router, ...compProps } = this.props;
        let { canRender, registerRoute, ...routerState } = router;
        return <RouteComponent {...routerState} {...compProps} />;
      }
      return (
        <div>
          <h1>Route</h1>
          <pre>Route {JSON.stringify(this.props, null, 2)}</pre>
        </div>
      );
    }
    return null;
  }
}

export default withRouter(Route);
