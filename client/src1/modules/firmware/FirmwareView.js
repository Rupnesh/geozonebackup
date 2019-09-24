import React, { Component } from 'react';
import LoadingSpinner from '../../views/Components/LoadingSpinner';
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import { strings } from "../../resources/strings/strings";
import { socketConnect } from 'socket.io-react';

var data = {
  statusCode: 200,
  success: true,
  result: true,
  message: 'software version fetched successfully.',
  updateData:'New Update here',
  data: {
    firmware_version: 1,
    firmware_update_available: false,
    uhf_version: '1234',
    gsm_version: 1.25,
    onyx_version: '2.0.5'
  }
};
class FirmwareView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdateAvailable: false,
      loading:true,
      updateData:'New update available',
      updateData2:'',
      updateData3:'',
      updateData4:'',
      updateData5:'',
      updateData6:'',
      updateData7:'',
      disableButton:true,
      startUpdating:false

    };
  }

  softwareUpdate = () => {
    this.softwareUpdateCall()
    setTimeout(() => {
      this.softwareUpdateCall()
    }, 2000);
  }
  softwareUpdateCall = () => {
 
     const { socket } = this.props;
     socket.socketConnect
           
       socket && socket.emit('updatesoftware', 'updatesoftware');
     
      socket.on('updatesoftware', this.displayStep);
    
  }

  displayStep = (data) =>{
    if(data){
    // this.setState({updateData: data.step })
      switch (data) {
        case 1:
          this.setState({updateData: " Downloading latest update", disableButton: false, startUpdating:true})
          break;
          case 2:
          this.setState({updateData2: " Stopping services"})
          break;
          case 3:
          this.setState({updateData3: "  Backing up old version"})
          break;
          case 4:
          this.setState({updateData4: " Extracting update"})
          break;
          case 5:
          this.setState({updateData5: " Installing update"})
          break;
          case 6:
          this.setState({updateData6: " Starting services"})
          break;
          case 7:
          this.setState({updateData7: "Update completed", startUpdating: false})
          break;
      
        default:
          break;
      }
    }
}


  handleUpdate = (data) => {
    if (data) {
      return (
        <div className='form-group row' style={{ marginLeft: '0px' }}>
          <i className='fa fa-download' style={{ color: '#74CD58', fontSize: '25px' }} aria-hidden='true' />{' '}
          <u className='ml-3' htmlFor='check3' style={{ cursor: 'pointer' }} onClick={() => alert('data')}>
            Download and install new version
          </u>
        </div>
      );
    }
    return (
      <div className='form-group row' style={{ marginLeft: '0px' }}>
        <i className='fa fa-check-circle' style={{ color: '#74CD58', fontSize: '25px' }} aria-hidden='true' />{' '}
        <lable className='ml-3'>Up to date</lable>
      </div>
    );
  };
 
  checkForUpdate = () =>  {

    AxiosPromise.get(api.checkUpdate, '', true)
      .then(data => {
          if(data.data.success){
            this.setState({
              firmwareVersion: data.data.data.firmware_version,
              firmwareUpdateAvailable:data.data.data.firmware_update_available,
              UHFVersion:data.data.data.uhf_version,
              gsmVersion:data.data.data.gsm_version,
              onyxVersion:data.data.data.onyx_version,
              isUpdateAvailable:true
            })
          }
      })
      .then(error => {
        console.log("error", error);
      });
   
  }

  // softwareUpdate = () =>{
    
  //   AxiosPromise.get(api.updateSoftware, '', true)
  //     .then(data => {
  //         console.log('Data', data)
  //     })
  //     .then(error => {
  //       console.log("error", error);
  //     });
   
  // }

  updateRender =(data) => {
    if(data){
        return(
        <div>
          <div className='form-group row' style={{ marginLeft: '0px' }}>
        <i
          className='fa fa-check-circle'
          style={{ color: '#74CD58', fontSize: '25px' }}
          aria-hidden='true'
        />{' '}
        <lable className='ml-3'>{data}</lable>
        </div>
        </div>
        )
      }

  }



  render() {
    return (
      <div className='animated fadeIn'>
        <div>
          <div style={{ width: '100%' }}>
            <div className='card'>
              {/* {/ {!this.state.loading ? ( /} */}
              <div className='card-block'>
                <div className='form-group ' style={{ marginLeft: '0px' }}>
                  <h3>Firmware</h3>
                </div>
                <button
                  type='button'
                  onClick={this.endLogFile}
                  disabled={this.state.endButtonDisable}
                  className='col-sm-4 col-md-4 col-lg-3 btn ripple'
                  style={{
                    borderRadius: '5px',
                    margin: '5px',
                    marginBottom: '20px',
                    backgroundColor: '#E7e7e7'
                  }}
                  onClick ={this.checkForUpdate}
                >
                  {/* Check For Updates... */}
                  {strings.CHECK_FOR_UPDATES}
                </button>
                {this.state.isUpdateAvailable &&  (
                  <form action='' method='post'>
                    <div className='form-group card-columns' style={{ marginBottom: '0px' }}>
                      <strong>Falcon Firmware</strong>
                    </div>
                    <label>Version {this.state.firmwareVersion}</label>
                    {this.state.firmwareUpdateAvailable ? 
                    <div>
                    
                  {this.updateRender(this.state.updateData)}
                  {this.updateRender(this.state.updateData2)}
                  {this.updateRender(this.state.updateData3)}
                  {this.updateRender(this.state.updateData4)}
                  {this.updateRender(this.state.updateData5)}
                  {this.updateRender(this.state.updateData6)}
                  {this.updateRender(this.state.updateData7)}
                  {this.state.startUpdating &&
                      <div> 
                     
                         <LoadingSpinner/> </div> }
                  
                 {this.state.disableButton && <div className='form-group row' style={{ marginLeft: '0px' }}>
                    <i
                      className='fa fa-download'
                      style={{ color: '#74CD58', fontSize: '25px' }}
                      aria-hidden='true'
                    />{' '}
                    <u
                      className='ml-3'
                      htmlFor='check3'
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.softwareUpdate()}
                    >
                      Download and install new version
                    </u>
                  </div>
                 }
                  </div>
                  
                    :
                    <div className='form-group row' style={{ marginLeft: '0px' }}>
                      <i
                        className='fa fa-check-circle'
                        style={{ color: '#74CD58', fontSize: '25px' }}
                        aria-hidden='true'
                      />{' '}
                      <lable className='ml-3'>Up to date</lable>
                    </div>
                    }
                    <div className='form-group' style={{ marginBottom: '0px' }}>
                      <strong>Onyx Firmware</strong>
                    </div>

                    <label>Version {this.state.onyxVersion}</label>
                    
                    {/* {this.state.loading ? 
                    <div className='form-group row' style={{ marginLeft: '0px' }}>
                      <i
                        className='fa fa-download'
                        style={{ color: '#74CD58', fontSize: '25px' }}
                        aria-hidden='true'
                      />{' '}
                      <u
                        className='ml-3'
                        htmlFor='check3'
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.setState({loading: false})}
                      >
                        Download and install new version
                      </u>
                    </div>: (
                     <LoadingSpinner />
                )} 
                    <div className='form-group row' style={{ marginLeft: '0px' }}>
                      <i
                        className='fa fa-check-circle'
                        style={{ color: '#74CD58', fontSize: '25px' }}
                        aria-hidden='true'
                      />{' '}
                      <lable className='ml-3'>Up to date</lable>
                    </div>
                    <div className='form-group' style={{ marginBottom: '0px' }}>
                      <strong>UHF Firmware</strong>
                    </div>
                    <label>version {this.state.UHFVersion}</label>
                    <div className='form-group' style={{ marginBottom: '0px' }}>
                      <strong>GSM Firmware</strong>
                    </div>
                    <label>version {this.state.gsmVersion}</label>
                    */}
                  </form>
                // ) : (
                //   <LoadingSpinner />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className=">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-block">
                                <form action="" method="post">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Map Type1</label>
                                        <div className="col-md-9">
                                            <select id="select" name="select" className="form-control">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Code Table</label>
                                        <div className="col-md-9">
                                            <select id="select" name="select" className="form-control">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">SRID</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" defaultValue="0"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label mw-75" htmlFor="recordata">AutoPath</label>
                                        <label className="switch switch-3d switch-primary">
                                            <input type="checkbox" className="switch-input"/>
                                            <span className="switch-label"></span>
                                            <span className="switch-handle"></span>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> */}
      </div>
    );
  }
}

export default socketConnect(FirmwareView)