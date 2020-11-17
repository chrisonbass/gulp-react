import Store from './Store';
import * as Reducers from './Reducers';
import * as Middleware from './Middleware';

let AppStore = new Store({
  router: {
    path: window.location.pathname,
    search: window.location.search,
    match: {}
  },
  name: "Ted",
  field: "",
  navbar: {}
});

for ( let name in Reducers ){
  AppStore.registerReducer(name, Reducers[name]);
}

for ( let name in Middleware ){
  AppStore.registerMiddleware(Middleware[name]);
} 

window.store = AppStore;
export default AppStore;
