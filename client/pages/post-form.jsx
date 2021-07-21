import React from 'react';
import CancelButton from '../components/cancel-button';
import CreatePostButton from '../components/create-post-button';
import SideSelectButton from '../components/side-select-button';

export default class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      side: 'White',
      message: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSelect(event) {
    if (event.target.classList.contains('white')) {
      this.setState({ side: 'White' });
    } else if (event.target.classList.contains('black')) {
      this.setState({ side: 'Black' });
    }
  }

  handleMessage(event) {
    this.setState({ message: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // if (event.target.classList.contains('side-select')) {

    // }
  }

  render() {
    const { side, message } = this.state;
    const { handleSelect, handleMessage, handleSubmit } = this;
    return (
      <form className="post-form container page-height" onSubmit={handleSubmit}>
        <div className="row font-24">
          <div className="col d-flex align-items-center">
            Playing
            <SideSelectButton type="White" side={side} handleSelect={handleSelect} />
            <SideSelectButton type="Black" side={side} handleSelect={handleSelect} />
          </div>
        </div>

        <div className="row">
          <div className="col post-message-div">
            <label>
              <p className="post-message-title">message:</p>
              <textarea className="post-message" value={message} onChange={handleMessage} />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <CancelButton href="#join" />
            <CreatePostButton />
          </div>
        </div>
      </form>
    );
  }
}
