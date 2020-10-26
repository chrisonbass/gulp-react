import React from 'react';
import ReactDOM from 'react-dom'

class MyApp extends React.Component {
  render(){
    return (
      <div>
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

ReactDOM.render(
  <MyApp />,
  document.getElementById("app")
);
