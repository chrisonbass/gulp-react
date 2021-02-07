/* eslint-disable no-console */
import React from 'react';
import {render} from 'react-dom';
import Router from './comps/Routing/Router';
import Route from './comps/Routing/Route';
import HorizontalNavbar from 'comps/Navigation/HorizontalNavbar';
import createStore from './service/Store';

const store = createStore({
  name: "Test"
});

const removeReducer = store.addReducer("name", (action, state = "") => {
  if ( action.type === "set-name" ){
    return action.payload;
  }
  return state;
});

const updateName = (name) => ({
  type: "set-name",
  payload: name
});

console.log("Pre Action");
console.log(store.getState());
console.log("Post Action");
store.dispatch(updateName("Tom"));
console.log(store.getState());
console.log("Removing Reducer");
removeReducer();
console.log("Updating name to Bill");
store.dispatch(updateName("Bill"));
console.log("New State");
console.log(store.getState());

let Main = (
  <Router>
    <HorizontalNavbar
      brand={{text: "Hello"}}
      links={[
        {to: "/", label: "Home"},
        {to: "/contact/Dale Earnhart", label: "Dale"},
        {to: "/contact", label: "Contact"},
        {to: "/about", label: "About"}
      ]}
    />
    <Route path="/about" exact />
    <Route path="/contact/:name" />
    <Route path="/contact" exact />
    <Route path="/" exact />
  </Router>
);

render(
  Main,
  document.getElementById("app")
);
