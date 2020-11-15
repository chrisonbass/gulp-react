import React from 'react';
import PropTypes from 'prop-types';
import RouterContext from './Context';

class Link extends React.Component {
  constructor(props){
    super(props);
    this.dispatch = null;
  }

  consume(state){
    if ( !this.dispatch ){
      let self = this;
      this.dispatch = (e) => {
        if ( e && e.preventDefault ){
          e.preventDefault();
        }
        state.router.pushState(self.props.to);
        if ( self.props.onClick ){
          self.props.onClick(e);
        }
      };
    }
    return null;
  }

  render(){
    let self = this;
    let {
      onClick = () => null,
      to,
      children,
      ...addProps
    } = this.props;
    let handleClick = (e) => {
      self.dispatch(e);
      onClick(e);
    };
    return (
      <React.Fragment>
        <RouterContext.Consumer>
          {this.consume.bind(this)}
        </RouterContext.Consumer>
        <a href={to} onClick={handleClick} {...addProps}>
          {children}
        </a>
      </React.Fragment>
    );
  }
}

Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ]),
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired
};

export default Link;
