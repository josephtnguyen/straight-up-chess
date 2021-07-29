import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordType: 'password',
      usernameTooShort: false,
      usernameTooLong: false,
      passwordTooShort: false
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
    let usernameTooShort = false;
    let passwordTooShort = false;
    if (username.length < 4) {
      usernameTooShort = true;
    }
    if (password.length < 6) {
      passwordTooShort = true;
    }

    this.setState({ usernameTooShort, passwordTooShort });
  }

  togglePassword() {
    const { passwordType } = this.state;
    const nextType = passwordType === 'password' ? 'text' : 'password';
    this.setState({ passwordType: nextType });
  }

  render() {
    const { handleChange, handleSubmit, togglePassword } = this;
    const { username, password, passwordType, usernameTooShort, usernameTooLong, passwordTooShort } = this.state;
    const toggle = passwordType === 'password' ? 'images/eye-close.svg' : 'images/eye-open.svg';
    let errorClass = 'auth-error-box';
    let errorMessage = '';
    if (usernameTooShort || usernameTooLong || passwordTooShort) {
      errorClass += ' show';
      if (usernameTooShort || usernameTooLong) {
        errorMessage = 'Username must be 4-16 characters';
      } else if (passwordTooShort) {
        errorMessage = 'Password must be at least 6 characters';
      }
    }

    return (
      <form className="auth-form container page-height" onSubmit={handleSubmit}>
        <div className="row my-5">
          <div className="col text-center">
            <label htmlFor="username">
              <h1 className="auth-title">SIGN UP</h1>
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
              autoFocus
              type={passwordType}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              className="auth-input"
              onChange={handleChange} />
            <img src={toggle} className="p-1" onClick={togglePassword} />
          </div>
        </div>

        <div className="row my-4">
          <div className="col p-0">
            <button className="auth-submit-btn sign-up">Sign Up</button>
          </div>
        </div>
      </form>
    );
  }
}
