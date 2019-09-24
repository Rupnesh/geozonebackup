import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

class UploadView extends Component {

  socketData;
  constructor(props) {
    super(props);

    this.state = {
      btnStatus: "Upload",
      completed: false,
      disableInput: false
    };
    this.handleUploadStatus = this.handleUploadStatus.bind(this)
    this.handleTimer = this.handleTimer.bind(this);
  }

  uploadStatus = () => {

    const { socket } = this.props;
    socket.socketConnect

    // this.setState({ btnStatus: "Uploading..." })
    // setTimeout(() => {
    // this.setState({ btnStatus: "Upload Completed...", completed: true })

    socket && socket.emit('subscribe-upload', 'data-uploadStatus');
    socket.on('data-uploadStatus', this.handleUploadStatus);
    // }, 5000);
  }

  handleUploadStatus(data) {

    const { socket } = this.props;
    socket.socketConnect

    this.setState({ btnStatus: data.message, durationLog: '' })
    if (data.status == 2) {
      this.setState({ completed: true })
      socket && socket.emit('unsubscribe-upload', 'data-uploadStatus');
    }
  }

  onInput = (data) => {
    // this.setState({ disableInput: true })
    const { socket } = this.props;
    socket.socketConnect
    if (this.state.durationLog != null) {
      this.setState({ disableInput: true })
      var data = { time: this.state.durationLog }
      socket && socket.emit('subscibetimer', data);
      socket.on('data-subscibetimer', this.handleTimer);
    }
  };

  handleTimer(data) {
    console.log(data)

    if (data.data === 0) {
      try {
        this.setState({ disableInput: false })
        this.unsubscribeTimer();
      }
      catch (error) {
        console.log('Error', error)
      }

    }
  }
  unsubscribeTimer() {
    const { socket } = this.props;
    socket.socketConnect
    socket && socket.emit('unsubscribe-timer', 'data-subscibetimer');
  }

  durationLog = (event) => {
    this.setState({
      durationLog: event.target.value
    });
  };

  // componentWillUnmount() {
  //     const { socket } = this.props;
  //     socket && socket.emit('unsubscribe-upload', 'data-uploadStatus');
  // }

  render() {
    return (
      <div className='animated fadeIn'>
        <div>
          <div style={{ width: '100%' }}>
            <div className='card'>
              <div className='card-block'>
                {/* <div className='form-group ' style={{ marginLeft: '0px' }}>
                  <h3>UPLOAD</h3>
                </div>
                <button
                  type='button'
                  onClick={this.uploadStatus}
                  disabled={this.state.completed}
                  className='col-md-2 btn ripple btn btn-primary'
                  style={{
                    borderRadius: '5px',
                    margin: '5px',
                    marginBottom: '20px',
                  }}
                >{this.state.btnStatus}
                </button> */}

                <input
                  className='form-control'
                  type='number'
                  disabled={this.state.disableInput}
                  placeholder='Enter Log Duration'
                  onBlur={e => this.onInput(e)}
                  onChange={this.durationLog} />

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default socketConnect(UploadView);
