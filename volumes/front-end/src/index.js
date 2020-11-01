import React from 'react';
import ReactDOM from 'react-dom'
import Store from './service/Store';

let AppStore = new Store({
  name: "Ted",
  field: ""
});

AppStore.registerReducer('name', (action, state = "N/A") => {
  console.log("Reducer");
  if ( action.type === "toggle-name" ){
    return action.name || "N/A";
  }
  return state;
} );

AppStore.registerReducer('field', (action, state = "N/A") => {
  if ( action.type === "update-field" ){
    return action.value;
  }
  return state;
} );

AppStore.registerMiddleware((store, action, next) => {
  console.log("Pre Reducer Middleware");
  let res = next();
  console.log("Post Reducer Middleware");
  return res;
} );

class MyApp extends React.Component {
  constructor(props){
    super(props);
    this.unregister = () => null;  
    this.state = AppStore.getState();
  }

  componentDidMount(){
    this.unregister = AppStore.register(this.setState.bind(this));
  }

  componentWillUnmount(){
    this.unregister();
  }

  noAction(){
    AppStore.dispatch({
      type: "no-action",
      data: { fake: "foo" }
    });
  }

  toggleName(){
    let name = this.state.name === "Ted" ? "Dale" : "Ted";
    AppStore.dispatch({
      type: "toggle-name",
      name
    });
  }

  updateField(e){
    AppStore.dispatch({
      type: "update-field",
      value: e.target.value
    });
  }

  render(){
    return (
      <div>
        <h2>{this.state.name}</h2>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <input type="text" value={this.state.field} onChange={this.updateField.bind(this)} />
              <button type="button" onClick={this.toggleName.bind(this)}>
                Toggle 
              </button>
              <br />
              <button type="button" onClick={this.noAction.bind(this)}>
                No Action 
              </button>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-4">
              <div className="bordered">
                Column 1
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-4">
              <div className="bordered">
                Column 2
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-4">
              <div className="bordered">
                Column 3
              </div>
            </div>
            <div className="clearfix" />
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-2 col-sm-offset-4">
              <div className="container-fluid bordered">
                Hello Friends
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
  <MyApp />,
  document.getElementById("app")
);
