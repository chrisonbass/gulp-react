import React from 'react';
import ReactDOM from 'react-dom';
import Router from './comps/Routing/Router';
import Route from './comps/Routing/Route';
import Link from './comps/Routing/Link';
import App from './comps/App';

let Main = (
  <Router>
    <div className="container">
      <ul>
        <li>
          <Link to="/home">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/contact/jim">
            Contact w/Name
          </Link>
        </li>
      </ul>
    </div>
    <Route path="/about" exact />
    <Route path="/home" component={App} />
    <Route path="/contact/:name" />
    <Route path="/contact" exact />
  </Router>
);

ReactDOM.render(
  Main,
  document.getElementById("app")
);
