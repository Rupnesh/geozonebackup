import React, { Component } from 'react';
import { api } from '../../../src/config/api';
import { GETAPIFlask, postApiFlask, AxiosPromise } from '../../services/fetchAPI';
import LoadingSpinner from '../../views/Components/LoadingSpinner';
import { socketConnect } from 'socket.io-react';

import { Redirect } from 'react-router-dom'

// iwconfig wlan0 | grep ESSID | cut -d\" -f2  op-Geozone AG
// iwgetid wlan0 --raw  op-Geozone AG
// iwlist wlan0 scan

// iw dev | grep ssid | awk '{print $2}'  op-


class LoggingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectbox1: '',
      selectbox2: '',
      filelog: '',
      file: '',
      numbers: [],
      logStatus: [],
      memoryStatus: { Free_Memory: 0, Used_Memory: 0, Total_memory: 0 },
      selectedLoggingType: '',
      selectedLoggingRate: '',
      loading: false,
      newFileName: '',
      logFileStatus: '',
      endButtonDisable: true,
      durationLog: 0,
      listData: [],
      displayMessage: false,
      durationStatus: '',
      selectedValue: '',
      ejectSDCardStatus: '',
      sdCardStatus: false
    };
    // this.handleTimer = this.handleTimer.bind(this);
  }

  componentDidMount() {
    this.callApi();
    this.props.getListApiCall(api.log_list);

    const { socket } = this.props;
    socket.socketConnect
    socket.on('data-subscibetimer', this.handleTimer);
  }

  handleTimer = (data) => {
    console.log('inlogging...',data)

    if(data.data === 15) {
      alert('time elapsing, go to Logging Page else it will be redirected abnormally.')
    }
    
    if(data.data === 0 ) {
      try {
        this.setState({disableInput:false});
        // <Redirect to='/upload' />
        this.props.history.push('/upload')
        //this.unsubscribeTimer();
      }
      catch(error) {
        console.log('Error', error)
      }
      
    }
  }

  callApi = () => {
    this.setState({ loading: true });
    AxiosPromise.get(api.logging_status)
      .then((response) => {
        if (response.data.status === 1) {
          this.callMemoryStatusApi();
          this.setState({ logStatus: response.data.data, loading: false });
        }
      })
      .catch((error) => {
        console.log('error', error);
        // this.setState({ loading: false });
      });
  };

  callMemoryStatusApi = () => {
    AxiosPromise.get(api.memory_status)
      .then((response) => {
        if (response && response.data && response.data.status === 1) {
          this.setState({ memoryStatus: response.data.data, displayMessage: false, sdCardStatus: true });
          this.getListData();
        } else {
          this.setState({ sdCardStatus: false });
        }
      })
      .catch((error) => {
        console.log('error', error);
        // this.setState({ loading: false });
      });
  };

  ejectSDCard = () => {
    AxiosPromise.get(api.sdCardEject)
      .then((response) => {
        if (response.data.status === 1) {
          setTimeout(() => {
            this.setState({ ejectSDCardStatus: '' });
          }, 20000);
          this.setState({ ejectSDCardStatus: 'Now you can easily eject SD card safely.' });
        }
        // console.log('EjectSDCard', response)
      })
      .catch((error) => {
        console.log('error', error);
        // this.setState({ loading: false });
      });
  };

  getListData = () => {
    this.props.getListApiCall(api.log_list);
    // AxiosPromise.get(api.log_list)
    // .then(response => {
    // if (response) {
    // this.setState({ listData: response.data });
    // }
    // })
    // .then(error => console.log("error", error));
  };

  onChange = (e) => {
    this.setState({ selectedLoggingType: e.target.value });

    if (e.target.value === 'NMEA') {
      this.setState({
        numbers: ['0.1', '0.5', '1', '2', '5']
      });
    } else if (e.target.value === 'NAVCOM') {
      this.setState({ numbers: ['0.1', '0.5', '1'] });
    } else {
      this.setState({ numbers: [] });
    }
  };

  onSelectedRate = (e) => {
    this.setState({ selectedLoggingRate: e.target.value });
  };

  onFocusOut(file) {
    this.setState({ displayMessage: true });
    let data = { logFile: `${this.state.newFileName}.txt` };
    AxiosPromise.post(api.log_file_exist, data)
      .then((response) => {
        if (response.data.status === 1) {
          this.setState({ logFileStatus: 'Ok' });
        } else {
          this.setState({ logFileStatus: 'This file already exists, Please type different name.' });
        }
      })
      .catch(error => console.log('error', error));
  }

  onSubmit(e) {
    e.preventDefault();
  }

  handleOptionsChange = (event) => {
    this.setState({
      selectedValue: event.target.value
    });
  };
  durationLog = (event) => {
    this.setState({
      durationLog: event.target.value
    });
  };

  downloadTxtFile = () => {
    let data = {
      logFile: this.state.selectedValue
    };
    AxiosPromise.post(api.log_download_log_file, data)
      .then((response) => {
        const element = document.createElement('a');
        const file = new Blob([response.data], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${this.state.selectedValue}`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      })
      .then(error => console.log('error', error));
  };

  onNewFileName = (event) => {
    try {
      let xyz = event.target.value.split('.');
      this.setState({
        newFileName: xyz[0]
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  deleteLogFile = () => {
    let data = {
      logFile: this.state.selectedValue
    };
    AxiosPromise.post(api.log_file_delete, data)
      .then((response) => {
        this.getListData(response);
        alert(response.data.message);
      })
      .catch(error => console.log('error', error));
  };

  startButton = () => {
    const { selectedLoggingRate, selectedLoggingType, durationLog, newFileName } = this.state;
    if (
      selectedLoggingRate &&
      selectedLoggingRate !== '0' &&
      selectedLoggingType &&
      selectedLoggingType !== '0' &&
      newFileName
    ) {
      this.setState({ endButtonDisable: false });
      // API Call
      let data = {
        LOG_RATE: this.state.selectedLoggingRate,
        TYPE: this.state.selectedLoggingType,
        LOG_DURATION: this.state.durationLog,
        LOG_FILE: `${this.state.newFileName}.txt\r\n`
      };

      AxiosPromise.post(api.start_api_call, data)
        .then((response) => {
          // this.getListData()
          console.log('response', response);
        })
        .catch(error => console.log('error', error));
    } else {
      alert('Something is missing. Please make sure you have filled all required fields.');
    }
  };

  endLogFile = () => {
    this.setState({ endButtonDisable: true });
    // API Call
    AxiosPromise.get(api.stop_api_call)
      .then((response) => {
        if (response) {
          this.callApi();
        }
      })
      .catch(error => console.log('error', error));
  };

  onEnterDuration = (data) => {
    let duration = parseInt(this.state.durationLog);
    if (Number.isInteger(+this.state.durationLog)) {
      if (duration >= 0 && duration <= 280) {
        this.setState({ durationStatus: '' });
      } else {
        this.setState({ durationStatus: 'Log duration must be a integer of minutes between 0 and 280' });
      }
    } else {
      this.setState({ durationStatus: 'Log duration must be a integer of minutes between 0 and 280' });
    }
  };

  render() {
    return (
      <div className='animated fadeIn'>
        <div className='row'>
          <div style={{ width: '100%' }}>
            <div className='card'>
              {!this.state.loading ? (
                <div className='card-block'>
                  <form action='' method='post'>
                    <div className='form-group row' style={{ marginLeft: '0px' }}>
                      <h3>Logging Status</h3>
                    </div>

                    <div
                      className='form-group row'
                      // style={{ marginLeft: "0px"}}
                    >
                      <div className={'col-md-4 not-login'}>
                        <i
                          className={
                            this.state.endButtonDisable ? 'fa fa-times-circle' : 'fa fa-check-circle'
                          }
                          style={{
                            color: this.state.endButtonDisable ? '#F31B10' : '#74CD58',
                            fontSize: '25px'
                          }}
                          aria-hidden='true'
                        />{' '}
                        <lable className='ml-3' style={{ fontSize: 14 }}>
                          {this.state.endButtonDisable ? 'Not logging' : 'Logging'}
                        </lable>
                      </div>
                      {this.state.sdCardStatus && (
                        <div className='col-md-1'>
                          <button
                            onClick={() => this.ejectSDCard()}
                            type='button'
                            className='btn btn-sm btn-success'
                          >
                            <i className='fa fa-dot-circle-o' /> Eject SD card
                          </button>
                        </div>
                      )}
                      <h6 style={{ marginTop: '5px', color: 'green', marginLeft: '15px' }}>
                        {this.state.ejectSDCardStatus}
                      </h6>
                    </div>

                    <div className='form-group row' style={{ marginLeft: '0px' }}>
                      <i
                        className={this.state.sdCardStatus ? 'fa fa-check-circle' : 'fa fa-times-circle'}
                        style={{ color: this.state.sdCardStatus ? '#74CD58' : '#F31B10', fontSize: '25px' }}
                        aria-hidden='true'
                      />{' '}
                      <lable className='ml-3'>
                        {this.state.sdCardStatus ? 'SD Card inserted' : 'SD Card not inserted'}
                      </lable>
                    </div>
                    <div className='form-group row' style={{ marginLeft: '0px' }}>
                      <i
                        className='fa fa-info-circle'
                        style={{ color: '#3790E8', fontSize: '25px' }}
                        aria-hidden='true'
                      />{' '}
                      <span className='ml-3'>
                        <lable>
                          Memory Free:{' '}
                          <label style={{ color: '#009900' }}>{this.state.memoryStatus.Free_Memory} </label>,
                          Used:{' '}
                          <label style={{ color: '#F31B10' }}>{this.state.memoryStatus.Used_Memory}</label>,
                          Total:{' '}
                          <label style={{ color: '#3790E8' }}>{this.state.memoryStatus.Total_memory}</label>
                        </lable>
                      </span>
                    </div>

                    <div className='form-group row'>
                      <label className='col-md-4 form-control-label' htmlFor='select'>
                        Logging Type <label style={{ color: '#F31B10' }}>*</label>
                      </label>
                      <div className='col-md-4'>
                        <select
                          className='form-control'
                          id='select'
                          name='selectbox1'
                          // value={this.state.selectbox1}
                          onChange={e => this.onChange(e)}
                        >
                          <option value='0'>Please select</option>
                          <option value='NMEA'>NMEA</option>
                          <option value='NAVCOM'>NAVCOM</option>
                        </select>
                      </div>
                    </div>

                    {this.state.numbers.length > 0 && (
                      <div className='form-group row'>
                        <label className='col-md-4 form-control-label' htmlFor='select'>
                          Logging Rate <label style={{ color: '#F31B10' }}>*</label>
                        </label>
                        <div className='col-md-4'>
                          <select
                            id='select'
                            name='selectbox2'
                            placeholder='Please select'
                            className='form-control'
                            onChange={e => this.onSelectedRate(e)}
                          >
                            <option value='0'>Please select</option>
                            {this.state.numbers.map((number, i) => (
                              <option key={i} value={number}>
                                {number} / sec
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className='form-group row'>
                      <label className='col-md-4 form-control-label' htmlFor='select'>
                        New Log File Name <label style={{ color: '#F31B10' }}>*</label>
                      </label>
                      <div className='col-md-4'>
                        <input
                          className='form-control'
                          type='text'
                          onBlur={e => this.onFocusOut(e)}
                          // value={this.state.file}
                          name='file'
                          onChange={this.onNewFileName}
                          placeholder='Enter Log File'
                        />
                      </div>
                      <div className='col-md-3'>
                        <h6
                          style={{
                            marginTop: '8px',
                            color: this.state.logFileStatus === 'Ok' ? 'green' : 'red'
                          }}
                        >
                          {' '}
                          {this.state.displayMessage && this.state.logFileStatus}
                        </h6>
                      </div>
                    </div>
                    <div className='form-group row align-items-center' style={{ marginBottom: '30px' }}>
                      <label className='col-md-4 form-control-label' htmlFor='select'>
                        Log Duration <label style={{ color: '#F31B10' }}>*</label>{' '}
                        <label style={{ color: 'gray' }}>(default 0 for no duration limit)</label>
                      </label>
                      <div className='col-md-4'>
                        <input
                          className='form-control'
                          type='text'
                          placeholder='Enter Log Duration'
                          onBlur={e => this.onEnterDuration(e)}
                          onChange={this.durationLog}
                          // value ={this.state.durationLog}
                        />
                      </div>
                      <div className='col-md-3'>
                        <h6 style={{ marginTop: '8px', color: 'red' }}>
                          {' '}
                          {this.state.durationStatus !== '' && this.state.durationStatus}
                        </h6>
                      </div>
                    </div>

                    <div className='form-group row' style={{ width: '68%', justifyContent: 'flex-end' }}>
                      <button
                        type='button'
                        disabled={!this.state.endButtonDisable}
                        className='col-md-3 btn btn-primary'
                        style={{ borderRadius: '5px', margin: '5px' }}
                        onClick={this.startButton}
                      >
                        Start Log
                      </button>
                      <button
                        type='button'
                        onClick={this.endLogFile}
                        disabled={this.state.endButtonDisable}
                        className='col-md-3 btn btn-primary'
                        style={{ borderRadius: '5px', margin: '5px' }}
                      >
                        Stop Log
                      </button>
                    </div>
                    <div
                      className='form-group row justify-content-between'
                      style={{ width: '67%', marginTop: 30 }}
                    >
                      <label className='col-md-4 form-control-label' htmlFor='select'>
                        Log Files
                      </label>

                      <div className='form-group' style={{ width: '47.5%' }}>
                        <select
                          multiple
                          name='select'
                          className='form-control'
                          style={{ padding: '5px' }}
                          onChange={this.handleOptionsChange}
                        >
                          {this.props.getList &&
                            this.props.getList.map((data, index) => (
                              <option key={data} className='opt' value={data}>
                                <h6>{data}</h6>
                              </option>
                              ))}
                        </select>
                      </div>
                    </div>

                    <div className='form-group row' style={{ width: '68%', justifyContent: 'flex-end' }}>
                      <button
                        type='button'
                        style={{ borderRadius: '5px', margin: '5px' }}
                        disabled={!this.state.selectedValue}
                        className='col-md-3 btn btn-primary'
                        onClick={this.downloadTxtFile}
                      >
                        Download Selected
                      </button>
                      <button
                        type='button'
                        style={{ borderRadius: '5px', margin: '5px' }}
                        disabled={!this.state.selectedValue}
                        className='col-md-3 btn btn-primary'
                        onClick={this.deleteLogFile}
                      >
                        Delete Selected
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default socketConnect(LoggingView);

// <div className="animated fadeIn container mt-5 shadow mb-4 bg-white">
// <h3>Login Status</h3>

// <div className="mt-5 mb-3">
// <i
// className="fa fa-times-circle"
// style={{ color: "red", fontSize: "28px" }}
// aria-hidden="true"
// />{" "}
// <span className="ml-3">Not logging</span>
// </div>
// <div className="mb-3">
// <i
// className="fa fa-check-circle"
// style={{ color: "green", fontSize: "28px" }}
// aria-hidden="true"
// />{" "}
// <span className="ml-3">SD Card inserted</span>
// </div>
// <div>
// <i
// className="fa fa-info-circle"
// style={{ color: "blue", fontSize: "28px" }}
// aria-hidden="true"
// />{" "}
// <span className="ml-3">
// Memory Free: 7640MB, used: 360MB, Total: 8000MB
// </span>
// </div>
// <form style={{ padding: "20px 0px" }} onSubmit={this.onSubmit}>
// <div className="form-group row">
// <div className="col-lg-4 pl-0 mb-3">
// <label className="col-md-6 form-control-label" htmlFor="select">
// Logging Type
// </label>
// <div className="col-md-9 ">
// <select
// id="select"
// name="selectbox1"
// value={this.state.selectbox1}
// onChange={this.onChange.bind(this)}
// className="form-control">
// <option value="" disabled>
// Logging Type
// </option>
// <option value="NMEA">NMEA</option>
// <option value="NAVCOM">NAVCOM</option>
// </select>
// </div>
// </div>
// <div className="col-lg-4 pl-0">
// <label className="col-md-6 form-control-label" htmlFor="select">
// Logging Rate
// </label>
// <div className="col-md-9 ">
// <select
// id="select"
// name="selectbox2"
// value={this.state.selectbox2}
// onChange={this.onChange.bind(this)}
// className="form-control">
// <option value="" disabled>
// Logging Rate
// </option>
// {this.state.numbers.map((number, i) => (
// <option key={i} value={number}>
// {number}
// </option>
// ))}
// </select>
// </div>
// </div>
// </div>

// <div className="mt-3 mb-3 row">
// <h6 className="col-lg-3">New LogFile Name</h6>
// <div className="col-lg-3">
// <div className="form-group">
// <input
// type="text"
// className="form-control"
// autoComplete="OFF"
// id="Logtxt"
// placeholder="Enter log file"
// value={this.state.filelog}
// name="filelog"
// onChange={this.onChange}
// />
// </div>
// </div>
// </div>
// <div className="mt-3 mb-3 row">
// <h6 className="col-lg-3">Log Duration (min)</h6>
// <div className="col-lg-3">
// <div className="form-group">
// <input
// type="text"
// className="form-control"
// autoComplete="OFF"
// id="Logtxt"
// placeholder="Enter Log Duration"
// value={this.state.file}
// name="file"
// onChange={this.onChange}
// />
// </div>
// </div>
// </div>

// <div className="mb-3 row text-center">
// <button
// type="submit"
// className="btn btn-primary mt-3 mb-3 col-lg-2">
// Start Log
// </button>
// <button
// type="button"
// className="btn btn-primary mt-3 mb-3 offset-lg-1 col-lg-2">
// Stop Log
// </button>
// </div>
// </form>
// <div className="col-lg-6">
// <h3>Log Files</h3>
// <form style={{ padding: "20px 0px" }}>
// <label
// className="col-md-6 pl-0 form-control-label"
// htmlFor="select">
// Log Files
// </label>
// <select multiple name="select" className="form-control">
// <option value="1">Option #1</option>
// <option value="2">Option #2</option>
// <option value="3">Option #3</option>
// <option value="4">Option #4</option>
// <option value="5">Option #5</option>
// <option value="6">Option #6</option>
// </select>
// <button type="button" className="btn btn-primary mt-4 mb-3">
// Download Selected
// </button>
// <br />
// <button type="button" className="btn btn-primary mt-3 mb-3">
// Delete Selected
// </button>
// </form>
// </div>
// </div>

// > ssh pi@10.8.1.170
// pi@001290:~/fgps/geozone_frontend $
// pi@001290:~/fgps/geozone_frontend $ less Dockerfile
// pi@001290:~/fgps/geozone_frontend $ history | grep build
// pi@001290:~/fgps/geozone_frontend $ docker images
// pi@001290:~/fgps/geozone_frontend $ docker build -t geozone/frontend-wifi:dev .








// if(data.time === -1) {
//   var refreshId = setInterval(() => {
    
//       socket.emit('data-subscibetimer', { data: -1 })
//       clearInterval(refreshId)        
//   }, 1000);
// }
// else {
// console.log("server", data)
// var seconds = 60;
// seconds = seconds * data.time;

// var refreshId = setInterval(() => {
//   seconds--;
  
//   if(seconds === 0) {
//     socket.emit('data-subscibetimer', { data: 0 })
//     clearInterval(refreshId)
//   }
//   else  {
//     socket.emit('data-subscibetimer', { data: seconds })
//   }
// }, 1000);
// }