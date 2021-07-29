import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordType: 'password'
    };
    this.handleChange = this.handleChange.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  togglePassword() {
    const { passwordType } = this.state;
    const nextType = passwordType === 'password' ? 'text' : 'password';
    this.setState({ passwordType: nextType });
  }

  render() {
    const { handleChange, togglePassword } = this;
    const { passwordType } = this.state;
    const toggle = passwordType === 'password' ? 'images/eye-close.svg' : 'images/eye-open.svg';

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
              id="username"
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
              type={passwordType}
              name="password"
              id="password"
              placeholder="Password"
              className="auth-input"
              onChange={handleChange} />
            <img src={toggle} className="p-1" onClick={togglePassword} />
          </div>
        </div>
      </form>
    );
  }
}
