import React from 'react';
import PropTypes from 'prop-types';
import withRouter from './withRouter';

class Route extends React.Component {
  constructor(props){
    super(props);
    props.router.registerRoute(this);
  }

  render(){
    let { router, component, ...compProps } = this.props;
    // eslint-disable-next-line no-unused-vars
    let { canRender = () => false, registerRoute, ...routerState } = router;
    if ( canRender(this) ){
      if ( component ){
        let RouteComponent = this.props.component;
        return <RouteComponent {...routerState} {...compProps} />;
      }
      return (
        <div className="container">
          <h1>Route</h1>
          <pre>Route {JSON.stringify(this.props, null, 2)}</pre>
        </div>
      );
    }
    return null;
  }
}

Route.propTypes = {
  router: PropTypes.object.isRequired,
  component: PropTypes.elementType,
};

export default withRouter(Route);
