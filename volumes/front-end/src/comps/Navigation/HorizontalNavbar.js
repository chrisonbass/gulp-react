import React from 'react';
import PropTypes from 'prop-types';
import Link from 'comps/Routing/Link';

const HorizontalNavbar = (props) => {
  return (
    <nav className="navbar navbar-horizontal">
      <div>
        <span className="brand">
          <span className="logo" />
          <span className="text">
            {props.brand.text}
          </span>
        </span>
        <ul>
          {props.links.map( (link) => {
            let { label, ...linkProps } = link;
            return (
              <li key={`navbar-link-${link.to}`}>
                <Link {...linkProps}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

HorizontalNavbar.defaultProps = {
  brand: {
    text: "Company"
  },
  links: []
};

HorizontalNavbar.propTypes = {
  brand: PropTypes.shape({
    text: PropTypes.string
  }),
  links: PropTypes.arrayOf(
    PropTypes.oneOfType([
     PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.element
      ])
    }),
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.element
      ])
    })
   ])
  )
};

export default HorizontalNavbar;


