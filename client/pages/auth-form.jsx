import React from 'react';
import GlobalContext from '../lib/global-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordType: 'password',
      usernameTooShort: false,
      usernameTooLong: false,
      usernameTaken: false,
      passwordTooShort: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.clearError);
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
    const { route, handleSignIn } = this.context; // eslint-disable-line
    const { path } = route;

    let usernameTooShort = false;
    let passwordTooShort = false;
    if (username.length < 4) {
      usernameTooShort = true;
    }
    if (password.length < 6) {
      passwordTooShort = true;
    }
    if (usernameTooShort || passwordTooShort) {
      this.setState({ usernameTooShort, passwordTooShort });
      return;
    }

    if (path === 'sign-up') {
      const body = { username, password };
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      fetch('/api/auth/sign-up', req)
        .then(res => {
          if (res.status === 204) {
            this.setState({ usernameTooShort, usernameTaken: true, passwordTooShort });
            return;
          }
          return res.json();
        })
        .then(result => {
          if (!result) {
            return;
          }
          this.setState({ username: '', password: '', usernameTooShort, usernameTaken: false, passwordTooShort });
        });
    } else if (path === 'sign-in') {
      this.setState({ usernameTooShort, usernameTaken: false, passwordTooShort });
    }
  }

  togglePassword() {
    const { passwordType } = this.state;
    const nextType = passwordType === 'password' ? 'text' : 'password';
    this.setState({ passwordType: nextType });
  }

  clearError() {
    this.setState({
      usernameTooShort: false,
      usernameTooLong: false,
      usernameTaken: false,
      passwordTooShort: false
    });
  }

  render() {
    const { handleChange, handleSubmit, togglePassword } = this;
    const { username, password, passwordType, usernameTooShort, usernameTooLong, usernameTaken, passwordTooShort } = this.state;
    const { path } = this.context.route;
    const toggle = passwordType === 'password' ? 'images/eye-close.svg' : 'images/eye-open.svg';
    let headingText, submitText, submitButtonClass, switchText, anchorText, anchorClass, anchorHref;
    let errorClass = 'auth-error-box';
    let errorMessage = '';
    if (path === 'sign-up') {
      headingText = 'SIGN UP';
      submitText = 'Sign Up';
      submitButtonClass = 'auth-submit-btn sign-up';
      switchText = 'Already have an account?';
      anchorText = 'LOG IN';
      anchorClass = 'auth-switch-anchor sign-in';
      anchorHref = '#sign-in';
      if (usernameTooShort || usernameTooLong || usernameTaken || passwordTooShort) {
        errorClass += ' show';
        if (usernameTooShort || usernameTooLong) {
          errorMessage = 'Username must be 4-16 characters';
        } else if (passwordTooShort) {
          errorMessage = 'Password must be at least 6 characters';
        } else if (usernameTaken) {
          errorMessage = 'Username is already taken';
        }
      }
    } else if (path === 'sign-in') {
      headingText = 'LOGIN';
      submitText = 'Log In';
      submitButtonClass = 'auth-submit-btn sign-in';
      switchText = "Don't have an account?";
      anchorText = 'SIGN UP';
      anchorClass = 'auth-switch-anchor sign-up';
      anchorHref = '#sign-up';
      if (usernameTooShort || usernameTooLong || usernameTaken || passwordTooShort) {
        errorClass += ' show';
        errorMessage = 'Invalid login';
        if (usernameTooLong) {
          errorMessage = 'Username must be 4-16 characters';
        }
      }
    }

    return (
      <form className="auth-form container page-height" onSubmit={handleSubmit}>
        <div className="row my-5">
          <div className="col text-center">
            <label htmlFor="username">
              <h1 className="auth-title">{headingText}</h1>
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
            <button className={submitButtonClass}>{submitText}</button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="font-14 text-center">
              {switchText} <a href={anchorHref} className={anchorClass}>{anchorText}</a>
            </p>
          </div>
        </div>
      </form>
    );
  }
}

AuthForm.contextType = GlobalContext;
