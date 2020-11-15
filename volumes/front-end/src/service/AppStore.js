import Store from './Store';
import * as Reducers from './Reducers';
import * as Middleware from './Middleware';

let AppStore = new Store({
  router: {},
  name: "Ted",
  field: ""
});

for ( let name in Reducers ){
  AppStore.registerReducer(name, Reducers[name]);
}

for ( let name in Middleware ){
  AppStore.registerMiddleware(Middleware[name]);
} 

export default AppStore;
