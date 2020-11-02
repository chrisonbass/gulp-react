import React from 'react';
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
      onClick,
      to,
      children,
      ...addProps
    } = this.props;
    let handleClick = (e) => {
      self.dispatch(e);
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

export default Link;
