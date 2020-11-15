import React from 'react';
import PropTypes from 'prop-types';
import Connect from '../service/Connect';

const App = (props) => {
  return (
    <div>
      <h2>{props.name}</h2>
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <input type="text" value={props.field} onChange={props.updateField} />
            <button type="button" onClick={props.toggleName}>
              Toggle 
            </button>
            <br />
            <button type="button" onClick={props.noAction}>
              No Action Test
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
};

App.propTypes = {
  name: PropTypes.string,
  field: PropTypes.string,
  updateField: PropTypes.func,
  noAction: PropTypes.func,
  toggleName: PropTypes.func
};

export default Connect({
  stateKeys: [
    "name",
    "field"
  ],
  actions: [
    "updateField",
    "toggleName",
    "noAction"
  ]
})(App);
