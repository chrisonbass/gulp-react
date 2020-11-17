import React from 'react';
import ReactDOM from 'react-dom';

import AppStore from 'service/AppStore';
import {appLoad} from 'service/Actions';

import Router from 'comps/Routing/Router';
import Route from 'comps/Routing/Route';
import App from 'comps/App';
import HorizontalNavbar from 'comps/Navigation/HorizontalNavbar';

AppStore.dispatch(appLoad());

let Main = (
  <Router>
    <HorizontalNavbar />
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
