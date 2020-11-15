import React from 'react';
import ReactDOM from 'react-dom';
import Router from './comps/Routing/Router';
import Route from './comps/Routing/Route';
import Link from './comps/Routing/Link';
import App from './comps/App';

let BaseApp = (
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
      </ul>
    </div>
    <Route path="/about" />
    <Route path="/home" component={App} />
    <Route path="/contact" />
  </Router>
);

window.onpopstate = function(event) {
  console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

window.testPush = () => {
  history.pushState({page: "home"}, "Home Page", "/home");
};

window.testPush2 = () => {
  history.pushState({page: "about"}, "About Page", "/about");
};

ReactDOM.render(
  BaseApp,
  document.getElementById("app")
);
