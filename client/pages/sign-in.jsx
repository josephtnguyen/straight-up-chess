import React from 'react';
import GlobalContext from '../lib/global-context';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordType: 'password',
      usernameTooLong: false,
      invalidLogin: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    let newValue = value;
    let usernameTooLong = false;
    if (name === 'username' && newValue.length > 16) {
      newValue = this.state.username;
      usernameTooLong = true;
    }
    this.setState({ [name]: newValue, usernameTooLong });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { handleSignIn } = this.context;
    const body = { username, password };
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    fetch('/api/auth/sign-in', req)
      .then(res => {
        if (res.status === 401) {
          this.setState({ invalidLogin: true });
          return;
        }
        return res.json();
      })
      .then(result => {
        if (!result) {
          return;
        }
        handleSignIn(result);
      });
  }

  togglePassword() {
    const { passwordType } = this.state;
    const nextType = passwordType === 'password' ? 'text' : 'password';
    this.setState({ passwordType: nextType });
  }

  render() {
    const { handleChange, handleSubmit, togglePassword } = this;
    const { username, password, passwordType, usernameTooLong, invalidLogin } = this.state;
    const toggle = passwordType === 'password' ? 'images/eye-close.svg' : 'images/eye-open.svg';
    let errorClass = 'auth-error-box';
    let errorMessage = '';
    if (usernameTooLong || invalidLogin) {
      errorClass += ' show';
      errorMessage = 'Invalid login';
      if (usernameTooLong) {
        errorMessage = 'Username must be 4-16 characters';
      }
    }

    return (
      <form className="auth-form container page-height" onSubmit={handleSubmit}>
        <div className="row my-5">
          <div className="col text-center">
            <label htmlFor="username">
              <h1 className="auth-title">LOGIN</h1>
            </label>
          </div>
        </div>

        <div className={errorClass}>
          <p className="auth-error-message">{errorMessage}</p>
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
              value={username}
              className="auth-input"
              onChange={handleChange} />
          </div>
        </div>
        <div className="row pt-1">
          <div className="col auth-field">
            <img src="images/password-icon.svg" className="p-1" />
            <input
              required
              type={passwordType}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              className="auth-input"
              onChange={handleChange} />
            <img src={toggle} className="p-1 cursor-pointer" onClick={togglePassword} />
          </div>
        </div>

        <div className="row my-4">
          <div className="col p-0">
            <button className="auth-submit-btn sign-in">Log In</button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="font-14 text-center">
              {"Don't have an account?"} <a href="#sign-up" className="auth-switch-anchor sign-up">SIGN UP</a>
            </p>
          </div>
        </div>
      </form>
    );
  }
}

SignIn.contextType = GlobalContext;
