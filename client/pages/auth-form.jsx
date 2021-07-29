import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { handleChange } = this;
    return (
      <form className="auth-form container page-height">
        <div className="row">
          <div className="col text-center">
            <label htmlFor="username">
              <h1 className="auth-title">SIGN UP</h1>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col auth-field">
            <img src="images/user-icon.svg" className="p-1" />
            <input
              required
              autoFocus
              type="text"
              name="username"
              placeholder="Username"
              className="auth-input"
              onChange={handleChange} />
          </div>
        </div>
        <div className="row pt-1">
          <div className="col auth-field">
            <img src="images/password-icon.svg" className="p-1" />
            <input
              required
              autoFocus
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              onChange={handleChange} />
          </div>
        </div>
      </form>
    );
  }
}
