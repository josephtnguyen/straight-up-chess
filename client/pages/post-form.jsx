import React from 'react';
import SideSelectButton from '../components/side-select-button';

export default class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      side: 'White',
      message: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    if (event.target.classList.contains('white')) {
      this.setState({ side: 'White' });
    } else if (event.target.classList.contains('black')) {
      this.setState({ side: 'Black' });
    }
  }

  render() {
    const { side } = this.state;
    const { handleSelect } = this;
    return (
      <div className="post-form container page-height">
        <div className="row font-24">
          <div className="col d-flex align-items-center">
            Playing
            <SideSelectButton type="White" side={side} handleSelect={handleSelect} />
            <SideSelectButton type="Black" side={side} handleSelect={handleSelect} />
          </div>
        </div>
      </div>
    );
  }
}
