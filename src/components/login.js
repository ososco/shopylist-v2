import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="login-container">
        <div className="illustration-container">
          <div className="illustration" />
          <h1 draggable>Shopylist</h1>
        </div>
        <div className="login-form">
          <input
            name="emailInput"
            type="text"
            placeholder="Email"
            onChange={this.props.handleChange}
          />
          <input
            name="passwordInput"
            type="password"
            placeholder="Password"
            onChange={this.props.handleChange}
          />
          <button
            className="primary-btn btn-75 btn-high"
            onClick={this.props.login}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
