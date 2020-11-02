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

export default RouterContext;
