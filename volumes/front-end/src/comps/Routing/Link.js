import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {Context} from './Router';

function Link(props){
  const {push} = useContext(Context);
  let {
    to,
    href,
    onClick,
    ...addProps
  } = props;        
  const handleClick = (e) => {
    if ( to && e && e.preventDefault ){
      e.preventDefault();
      push(to);
    }
    if ( onClick ){
      onClick(e);
    }
  };
  to = to || href;
  if ( !to ){
    to = "#";
  }
  return (
    <a href={to} onClick={handleClick} {...addProps}>
      {props.children}
    </a>
  );
}

Link.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType
  ])
};

export default Link;